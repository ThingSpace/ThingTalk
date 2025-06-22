import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@components/Providers';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://athing.space',
		siteName: 'A Thing',
		images: ['/banner.png'],
	},
	twitter: {
		site: '@theathingapp',
	},
	description:
		'A Thing is a safe, anonymous space for self-expression where you can share your thoughts, keep private journals, and connect with others who understand. No judgments. No traces. Just you being you.',
	title: {
		default: "ThingTalk - AI Mental Health Support",
		template: '%s | ThingTalk',
	},
	themeColor: '#000000',
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					<div className="min-h-screen flex flex-col">
						<main className="flex-1">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
