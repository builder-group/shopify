import { cva, VariantProps } from 'class-variance-authority';
import { customElement, noShadowDOM } from 'solid-element';

import '../app.css';

export const EnergyLabelElement = customElement<TEnergyLabelProps>(
	'energy-label-element',
	{ size: 'md', rating: 'A' },
	(props) => {
		noShadowDOM();

		// return (
		// 	<button
		// 		type="button"
		// 		class="flex h-6 flex-row items-center justify-center bg-white text-sm font-bold"
		// 		aria-label="Energy efficiency rating: E"
		// 	>
		// 		<div class="flex h-6 w-2 flex-col items-center justify-around border-[0.5px] border-r-0 border-solid border-black bg-white p-[1px]">
		// 			<span class="text-[6px] font-semibold leading-[1px] text-black">A</span>
		// 			<svg viewBox="0 0 23 32" role="presentation" class="h-1 w-1">
		// 				<path
		// 					fill-rule="evenodd"
		// 					d="M10.397 32a.8.8 0 0 1-.8-.8V5.328l-7.104 7.12a.8.8 0 0 1-1.136 0l-1.12-1.136a.8.8 0 0 1 0-1.136L10.045.352c.224-.225.53-.352.848-.352h.608c.317.004.62.13.848.352l9.808 9.824a.8.8 0 0 1 0 1.136l-1.136 1.136a.784.784 0 0 1-1.12 0l-7.104-7.12V31.2a.8.8 0 0 1-.8.8z"
		// 				></path>
		// 			</svg>
		// 			<span class="text-[6px] font-semibold leading-[1px] text-black">G</span>
		// 		</div>

		// 		<div class="flex h-6 w-[22px] items-center justify-center border-b-[0.5px] border-t-[0.5px] border-b-black border-t-black bg-[#fbba00] text-white">
		// 			<div
		// 				class="text-[26px] leading-[21px]"
		// 				style={{ '-webkit-text-stroke': '0.5px #000', 'font-family': 'Calibri, sans-serif' }}
		// 			>
		// 				A
		// 			</div>
		// 		</div>
		// 		<div class="h-0 w-0 border-b-[12px] border-l-[10px] border-t-[12px] border-b-transparent border-l-black border-t-transparent">
		// 			<div class="relative left-[-10px] top-[-11.5px] h-0 w-0 border-b-[11.5px] border-l-[9.5px] border-t-[11.5px] border-b-transparent border-l-[#fbba00] border-t-transparent"></div>
		// 		</div>
		// 	</button>
		// );

		return (
			<button
				type="button"
				class={`energy-label__button ${energyLabelVariants({ size: props.size })}`}
				aria-label={`Energy efficiency rating: ${props.rating}`}
			>
				<div class={`energy-label__scale ${scaleVariants({ size: props.size })}`}>
					<span class={`energy-label__scale-letter ${scaleLetterVariants({ size: props.size })}`}>
						{props.rating}
					</span>
					<div class={`energy-label__scale-arrow ${scaleArrowVariants({ size: props.size })}`}>
						<svg viewBox="0 0 23 32" role="presentation">
							<path
								fill-rule="evenodd"
								d="M10.397 32a.8.8 0 0 1-.8-.8V5.328l-7.104 7.12a.8.8 0 0 1-1.136 0l-1.12-1.136a.8.8 0 0 1 0-1.136L10.045.352c.224-.225.53-.352.848-.352h.608c.317.004.62.13.848.352l9.808 9.824a.8.8 0 0 1 0 1.136l-1.136 1.136a.784.784 0 0 1-1.12 0l-7.104-7.12V31.2a.8.8 0 0 1-.8.8z"
							></path>
						</svg>
					</div>
					<span class={`energy-label__scale-letter ${scaleLetterVariants({ size: props.size })}`}>
						G
					</span>
				</div>
				<div class={`energy-label__rating ${ratingVariants({ size: props.size })}`}>
					<div
						class={`energy-label__rating-letter ${ratingLetterVariants({ size: props.size })}`}
						style={{
							'-webkit-text-stroke': '0.5px #000',
							'font-family': 'Calibri, sans-serif'
						}}
					>
						{props.rating}
					</div>
				</div>
				<div class={`energy-label__arrow ${arrowVariants({ size: props.size })}`}>
					<div
						class={`energy-label__arrow-inner ${arrowInnerVariants({ size: props.size })}`}
					></div>
				</div>
			</button>
		);
	}
);

type TEnergyLabelProps = VariantProps<typeof energyLabelVariants> & {
	rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
};

const energyLabelVariants = cva('flex items-center justify-center bg-white text-sm font-bold', {
	variants: {
		size: {
			sm: 'h-4',
			md: 'h-6',
			lg: 'h-8'
		}
	}
});

const scaleVariants = cva(
	'flex flex-col items-center justify-around border-[0.5px] border-r-0 border-solid border-black bg-white p-[1px]',
	{
		variants: {
			size: {
				sm: 'h-4 w-1.5',
				md: 'h-6 w-2',
				lg: 'h-8 w-3'
			}
		}
	}
);

const scaleLetterVariants = cva('font-semibold text-black', {
	variants: {
		size: {
			sm: 'text-[4px] leading-[1px]',
			md: 'text-[6px] leading-[1px]',
			lg: 'text-[8px] leading-[1px]'
		}
	}
});

const scaleArrowVariants = cva('', {
	variants: {
		size: {
			sm: 'h-0.5 w-0.5',
			md: 'h-1 w-1',
			lg: 'h-1.5 w-1.5'
		}
	}
});

const ratingVariants = cva(
	'flex items-center justify-center border-b-[0.5px] border-t-[0.5px] border-b-black border-t-black bg-[#fbba00] text-white',
	{
		variants: {
			size: {
				sm: 'h-4 w-[15px]',
				md: 'h-6 w-[22px]',
				lg: 'h-8 w-[30px]'
			}
		}
	}
);

const ratingLetterVariants = cva('', {
	variants: {
		size: {
			sm: 'text-[18px] leading-[15px]',
			md: 'text-[26px] leading-[21px]',
			lg: 'text-[36px] leading-[29px]'
		}
	}
});

const arrowVariants = cva('h-0 w-0 border-b-transparent border-l-black border-t-transparent', {
	variants: {
		size: {
			sm: 'border-b-[8px] border-l-[7px] border-t-[8px]',
			md: 'border-b-[12px] border-l-[10px] border-t-[12px]',
			lg: 'border-b-[16px] border-l-[14px] border-t-[16px]'
		}
	}
});

const arrowInnerVariants = cva(
	'relative h-0 w-0 border-b-transparent border-l-[#fbba00] border-t-transparent',
	{
		variants: {
			size: {
				sm: 'left-[-7px] top-[-7.5px] border-b-[7.5px] border-l-[6.5px] border-t-[7.5px]',
				md: 'left-[-10px] top-[-11.5px] border-b-[11.5px] border-l-[9.5px] border-t-[11.5px]',
				lg: 'left-[-14px] top-[-15.5px] border-b-[15.5px] border-l-[13.5px] border-t-[15.5px]'
			}
		}
	}
);
