import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@repo/ui';
import React from 'react';

import { Launcher } from './components';
import { contentBridge, SHADOW_ROOT_NAME } from './index';

export const App: React.FC = () => {
	const [open, setOpen] = useState(false);

	const onClick = React.useCallback(async () => {
		const res = await contentBridge.sendMessage('ping', { ping: 'Hello' });
		console.log(res); // "pong"
	}, []);

	React.useEffect(() => {
		contentBridge.listen('actionClicked', async () => {
			setOpen(true);
		});
	}, []);

	return (
		<div className="z-[9999]">
			<div className="h-10 w-10 bg-red-100">Hello anyone here</div>
			<Dialog open={open} onOpenChange={setOpen}>
				<Launcher />
				<DialogContent
					portalProps={{
						container:
							document.querySelector(SHADOW_ROOT_NAME)?.shadowRoot?.querySelector('body') ??
							undefined
					}}
					overlayProps={{ className: 'z-[9998]' }}
					className="z-[9999]"
				>
					<DialogHeader>
						<DialogTitle>Hello world</DialogTitle>
						<DialogDescription>This is a test</DialogDescription>
						<Button onClick={onClick}>Submit</Button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default App;
