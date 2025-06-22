import { router } from '../trpc';
import { entryRouter } from './entry.router';
import { journalRouter } from './jounrals.router';
import { postRouter } from './post.router';
import { userRouter } from './user.router';
import { chatRouter } from './chat.router';

export const appRouter = router({
	user: userRouter,
	post: postRouter,
	journals: journalRouter,
	entry: entryRouter,
	chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
