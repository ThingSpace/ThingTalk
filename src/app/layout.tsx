import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@components/ui/Static/Navigation';
import '../styles/globals.css';
import Providers from '@components/Providers';

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
		default: '<3 You got this',
		template: '%s | A Thing',
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
					<Navigation />
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	);
}
