import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/ui';

import { Launcher } from './components';
import { SHADOW_ROOT_NAME } from './index';

export const App: React.FC = () => {
	return (
		<div className="z-[9999]">
			<Dialog>
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
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default App;
