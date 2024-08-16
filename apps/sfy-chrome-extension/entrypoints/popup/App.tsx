import { Button } from '@repo/ui';
import React, { useState } from 'react';

function App() {
	const [count, setCount] = useState(0);

	const onClick = React.useCallback(async () => {
		const res = await browser.runtime.sendMessage('ping');

		console.log(res); // "pong"
	}, []);

	return (
		<div className="h-20 w-24 bg-red-100">
			<Button onClick={onClick}>Hello</Button>
		</div>
	);
}

export default App;
