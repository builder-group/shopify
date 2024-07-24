import { customElement, noShadowDOM } from 'solid-element';
import { createSignal } from 'solid-js';

import '../app.css';

export const CounterExtension = customElement(
	'solid-counter',
	{ backgroundColor: 'white', color: 'black', rounded: 'false' },
	(props) => {
		noShadowDOM();

		const { backgroundColor, color, rounded } = props;
		const [count, setCount] = createSignal(0);

		return (
			<div
				style={{
					'background-color': backgroundColor,
					'color': color,
					'border-radius': rounded === 'true' ? '1rem' : '0'
				}}
				class="p-4 shadow-md"
				role="banner"
			>
				<h2 class="bg-green-500">Shopify Theme App Extension with SolidJs</h2>
				<p>This is a simple counter component that is rendered as a custom element.</p>

				<div class="h-10 w-32">
					<div class="relative mt-1 flex h-10 w-full flex-row rounded-lg bg-transparent">
						<button
							onClick={() => setCount((prev) => prev - 1)}
							class="h-full w-20 cursor-pointer rounded-l bg-gray-300 text-gray-600 outline-none hover:bg-gray-400 hover:text-gray-700"
						>
							<span class="m-auto text-2xl font-thin">−</span>
						</button>
						<span class="text-md md:text-basecursor-default flex w-full flex-1 items-center bg-gray-300 text-center font-semibold text-gray-700 outline-none hover:text-black focus:text-black focus:outline-none">
							{count()}
						</span>
						<button
							onClick={() => setCount((prev) => prev + 1)}
							class="h-full w-20 cursor-pointer rounded-r bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700"
						>
							<span class="m-auto text-2xl font-thin">+</span>
						</button>
					</div>
				</div>
			</div>
		);
	}
);
