import OpenAI from 'openai';
import { tavilyWebSearch } from './tavily';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OpenAIService {
  private static createSystemPrompt(mood: string, duration: number, webSearchResults?: string): string {
    return `
You are a compassionate, professional mental health support AI assistant. Your primary role is to provide empathetic, supportive, and helpful responses to users seeking mental health support in a safe, non-judgmental, and inclusive manner.

## Your Core Principles
- Always respond with empathy, warmth, and understanding.
- Never give medical advice, make diagnoses, or suggest specific medications.
- Do not make assumptions about the user's background, identity, or experiences.
- Encourage seeking help from licensed mental health professionals when appropriate.
- Use clear, supportive, and conversational language.
- Focus on active listening, validation, and open-ended questions.
- Provide gentle guidance, coping strategies, and resources when appropriate.
- Be culturally sensitive and inclusive in all responses.

## Safety & Escalation
- If the user expresses thoughts of self-harm, suicide, or harming others, respond with extra care and encourage them to reach out to a mental health professional or helpline. Provide relevant resources if available.
- If the user requests urgent help, remind them that you are not a substitute for professional or emergency support, but you can use the web tool to provide helpful resources or helplines if available.

## How to Use Web Search Results
${webSearchResults ? `- The following web search results may contain factual or up-to-date information. Only use them to provide resources, links, or factual answers. If you use information from these results, cite it in your response.\n\nWeb Search Results:\n${webSearchResults}\n` : ''}

## Session Context
- User's Current Mood: ${mood}
- Session Duration: ${duration} minutes

## Your Mission
You are here to provide emotional support and a safe space for users to express their feelings. Your responses should always be helpful, supportive, and appropriate for mental health conversations. If you are unsure, err on the side of empathy and safety.

If you use any information from the web search results, cite it in your response.
`;
  }

  /**
   * Generates an AI response, optionally augmenting with web search results if the user message appears to request resources or factual info.
   * Uses Tavily web search for relevant queries.
   */
  static async generateResponse(
    userMessage: string,
    mood: string,
    duration: number,
    conversationHistory: ChatMessage[] = [],
    webSearchResults?: string
  ): Promise<string> {
    try {
      let searchResults = webSearchResults;
      if (searchResults === undefined) {
        const searchKeywords = /resource|link|article|website|find|where|how|news|latest/i;
        if (searchKeywords.test(userMessage)) {
          searchResults = await tavilyWebSearch(userMessage);
        }
      }
      const systemPrompt = this.createSystemPrompt(mood, duration, searchResults);
      
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      return response.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback responses based on mood
      const fallbackResponses = {
        anxious: "I understand you're feeling anxious. It's completely normal to feel this way. Would you like to talk more about what's on your mind?",
        happy: "I'm glad you're feeling happy! What's bringing you this joy today?",
        sad: "I'm sorry you're feeling sad. It's okay to not be okay. I'm here to listen if you'd like to share more.",
        angry: "I can sense that you're feeling angry, and that's completely valid. What happened that's making you feel this way?",
        confused: "Confusion can be really frustrating. Let's try to work through this together. What specifically feels unclear?",
        lonely: "I hear you, and I want you to know that you're not alone in feeling lonely. What would help you feel more connected right now?",
        hopeful: "Hope is such a beautiful thing to hold onto. What's giving you this sense of hope today?"
      };

      return fallbackResponses[mood as keyof typeof fallbackResponses] || fallbackResponses.anxious;
    }
  }

  static async generateGreeting(mood: string, duration: number): Promise<string> {
    const greetings = {
      anxious: "Hello! I understand you're feeling anxious today. I'm here to provide a safe space for you to talk about what's on your mind. How are you doing right now?",
      happy: "Hello! I'm so glad you're feeling happy today! What's bringing you this positive energy? I'd love to hear about what's making your day special.",
      sad: "Hello. I'm sorry you're feeling sad today. It's completely okay to not be okay. I'm here to listen and support you. What's been weighing on your heart?",
      angry: "Hello. I can sense that you're feeling angry, and that's completely valid. I'm here to listen without judgment. What happened that's making you feel this way?",
      confused: "Hello! I understand you're feeling confused, and that can be really frustrating. I'm here to help you work through this. What feels most unclear to you right now?",
      lonely: "Hello. I hear you, and I want you to know that you're not alone in feeling lonely. Even though I'm an AI, I'm here to listen and support you. What's been making you feel isolated?",
      hopeful: "Hello! I love that you're feeling hopeful today! Hope is such a powerful force. What's giving you this sense of optimism? I'd love to hear about what you're looking forward to."
    };

    try {
      return await this.generateResponse(
        "Hello",
        mood,
        duration,
        []
      );
    } catch (error) {
      return greetings[mood as keyof typeof greetings] || greetings.anxious;
    }
  }
} 