import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
	SpinnerIcon,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@repo/ui';
import React from 'react';

import { TShopifyAppListingItem } from '../../types';
import { Launcher } from './components';
import { contentBridge, SHADOW_ROOT_NAME } from './index';

export const App: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [keywordValue, setKeywordValue] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const [apps, setApps] = React.useState<TShopifyAppListingItem[]>([]);

	const onSearchKeyword = React.useCallback(async () => {
		setIsLoading(true);

		const res = await contentBridge.sendMessageToBackground('fetch-shopify-apps', {
			keyword: keywordValue
		});

		console.log(res);

		setApps(
			res.pages.reduce<TShopifyAppListingItem[]>((prev, curr) => {
				prev.push(...curr.apps);
				return prev;
			}, [])
		);

		setIsLoading(false);

		return () => {
			setIsLoading(false);
		};
	}, [keywordValue]);

	React.useEffect(() => {
		contentBridge.listen('actionClicked', async () => {
			setOpen(true);
		});
	}, []);

	return (
		<div className="z-[9999]">
			<Dialog open={open} onOpenChange={setOpen}>
				<Launcher />
				<DialogContent
					portalProps={{
						container:
							document.querySelector(SHADOW_ROOT_NAME)?.shadowRoot?.querySelector('body') ??
							undefined
					}}
					overlayProps={{ className: 'z-[9998]' }}
					className="z-[9999] h-[80vh] w-[80vw] max-w-[1200px]"
				>
					<DialogHeader>
						<DialogTitle>Keyword Search</DialogTitle>
						<DialogDescription>Search Shopify App by Keyword</DialogDescription>
					</DialogHeader>

					<div className="flex h-full flex-col">
						<div className="flex-1">
							<Table className="relative h-fit max-h-80 overflow-y-auto">
								<TableCaption>A list of found Shopify Apps</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Handle</TableHead>
										<TableHead>Name</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{apps.map((invoice) => (
										<TableRow key={invoice.handle}>
											<TableCell className="font-medium">{invoice.handle}</TableCell>
											<TableCell>{invoice.name}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						<div className="mt-4 flex items-center space-x-4">
							<Input
								type="text"
								placeholder="Review App"
								onChange={(e) => setKeywordValue(e.target.value)}
								value={keywordValue}
							/>
							<Button type="submit" onClick={onSearchKeyword}>
								{isLoading ? <SpinnerIcon className="h-6 w-6 animate-spin" /> : 'Search'}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default App;
