import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import '@/globals.scss';
import { cn } from '@/lib/utils';
import ThemeProvider from '@/components/providers/ThemeProvider';
import ModalProvider from '@/components/providers/ModalProvider';
import SocketProvider from '@/components/providers/SocketProvider';
import QueryProvider from '@/components/providers/QueryProvider';

const sans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Discord Clone',
	description: 'Discord Clone built with Next.js'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html
				lang='en'
				suppressHydrationWarning
			>
				<body className={cn(sans.className, 'bg-white dark:bg-[#313338]')}>
					<ThemeProvider
						attribute={'class'}
						defaultTheme={'dark'}
						enableSystem={false}
						storageKey={'discord-theme'}
					>
						<SocketProvider>
							<ModalProvider />
							<QueryProvider>{children}</QueryProvider>
						</SocketProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
