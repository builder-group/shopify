import { customElement, noShadowDOM } from 'solid-element';
import { createEffect, createSignal } from 'solid-js';

import '../app.css';

export const StarRatingElement = customElement(
	'star-rating-element',
	{ customCss: '' },
	(props) => {
		noShadowDOM();

		const [rating, setRating] = createSignal(2);

		const handleChange = (value: number) => {
			console.log('[star-rating-element] handleChange', { value });
			setRating(value);
		};

		// TODO: Figure out how to add global style
		createEffect(() => {
			console.log('[star-rating-element] createEffect', { props });
			const styleTag = document.createElement('style');
			styleTag.textContent = `${props.customCss} this-is-test`;
			document.head.appendChild(styleTag);
		});

		return (
			<div class="star-rating-element_container rating gap-1">
				<input
					type="radio"
					name="rating-3"
					class="star-rating-element_star-1 mask mask-heart bg-red-400"
					checked={rating() === 1}
					onChange={() => handleChange(1)}
				/>
				<input
					type="radio"
					name="rating-3"
					class="star-rating-element_star-2 mask mask-heart bg-orange-400"
					checked={rating() === 2}
					onChange={() => handleChange(2)}
				/>
				<input
					type="radio"
					name="rating-3"
					class="star-rating-element_star-3 mask mask-heart bg-yellow-400"
					checked={rating() === 3}
					onChange={() => handleChange(3)}
				/>
				<input
					type="radio"
					name="rating-3"
					class="star-rating-element_star-4 mask mask-heart bg-lime-400"
					checked={rating() === 4}
					onChange={() => handleChange(4)}
				/>
				<input
					type="radio"
					name="rating-3"
					class="star-rating-element_star-5 mask mask-heart bg-green-400"
					checked={rating() === 5}
					onChange={() => handleChange(5)}
				/>
			</div>
		);
	}
);
