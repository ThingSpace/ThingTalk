import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '@server/db/client';
import { OpenAIService, type ChatMessage } from '@server/services/openai';

export const chatRouter = router({
  createSession: protectedProcedure
    .input(
      z.object({
        mood: z.string(),
        duration: z.number().min(1).max(60),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await prisma.chatSession.create({
        data: {
          userId: ctx.user,
          mood: input.mood,
          duration: input.duration,
        },
      });

      // Create initial AI greeting using OpenAI
      const greeting = await OpenAIService.generateGreeting(input.mood, input.duration);
      await prisma.message.create({
        data: {
          chatSession: session.id,
          text: greeting,
          isUser: false,
        },
      });

      return session;
    }),

  getSession: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: sessionId }) => {
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
          feedback: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chat session not found',
        });
      }

      return session;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        text: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the session and all previous messages
      const session = await prisma.chatSession.findUnique({
        where: { id: input.sessionId },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chat session not found',
        });
      }

      // Save user message
      const userMessage = await prisma.message.create({
        data: {
          chatSession: input.sessionId,
          text: input.text,
          isUser: true,
        },
      });

      // Build conversation history for OpenAI
      const conversationHistory: ChatMessage[] = session.messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Generate AI response using OpenAI
      const aiResponseText = await OpenAIService.generateResponse(
        input.text,
        session.mood,
        session.duration || 30,
        conversationHistory
        // webSearchResults will be added here in the future
      );

      const aiMessage = await prisma.message.create({
        data: {
          chatSession: input.sessionId,
          text: aiResponseText,
          isUser: false,
        },
      });

      return {
        userMessage,
        aiResponse: aiMessage,
      };
    }),

  submitFeedback: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const feedback = await prisma.chatFeedback.create({
        data: {
          chatSession: input.sessionId,
          rating: input.rating,
          comment: input.comment,
        },
      });

      return feedback;
    }),
});
