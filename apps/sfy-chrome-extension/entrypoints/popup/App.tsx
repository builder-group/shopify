import { Button } from '@repo/ui';
import { useState } from 'react';

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="h-20 w-24 bg-red-100">
			<Button>Hello</Button>
		</div>
	);
}

export default App;
