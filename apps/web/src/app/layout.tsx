import { cn, ScreenSize } from '@repo/ui';
import type { Metadata } from 'next';
import { Alegreya_Sans, Lato } from 'next/font/google';
import React from 'react';
import { appConfig } from '@/environment';

import './globals.css';

export const fontSans = Lato({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: '400'
});

export const fontBody = Lato({
	subsets: ['latin'],
	variable: '--font-body',
	weight: '400'
});

export const fontDisplay = Alegreya_Sans({
	subsets: ['latin'],
	variable: '--font-display',
	weight: '400'
});

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const metadata: Metadata = {
	metadataBase: new URL(appConfig.url),
	title: {
		default: appConfig.meta.title.default,
		template: appConfig.meta.title.template('%s')
	},
	description: appConfig.meta.description
};

const Layout: React.FC<TProps> = (props) => {
	const { children } = props;

	return (
		<html lang="en">
			<body
				className={cn(
					'bg-background min-h-screen font-sans antialiased',
					fontSans.variable,
					fontBody.variable,
					fontDisplay.variable
				)}
			>
				{children}
				{appConfig.url.includes('localhost') && <ScreenSize />}
			</body>
		</html>
	);
};

export default Layout;

interface TProps {
	children: React.ReactNode;
}
