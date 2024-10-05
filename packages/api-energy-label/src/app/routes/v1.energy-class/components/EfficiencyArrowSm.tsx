import { type TEnergyClass } from 'eprel-client';
import { type FC } from 'hono/jsx';

const energyClassVariants = {
	A: {
		color: '#009640',
		letterPath:
			'M23.714 23h-4.12l6.277-18.182h4.954L37.093 23h-4.12L28.42 8.973h-.142L23.714 23zm-.257-7.147h9.73v3.001h-9.73v-3zM1 0h12v28H1z'
	},
	B: {
		color: '#52AE32',
		letterPath:
			'M20.58 23V4.818h7.28c1.338 0 2.453.198 3.347.595.894.397 1.566.947 2.015 1.651.45.699.675 1.504.675 2.415 0 .71-.142 1.335-.426 1.873-.284.533-.675.97-1.172 1.314a4.802 4.802 0 01-1.687.72v.177c.693.03 1.34.225 1.945.586a4.15 4.15 0 011.482 1.518c.379.645.568 1.414.568 2.308 0 .965-.24 1.826-.719 2.584-.473.751-1.175 1.346-2.104 1.784-.93.438-2.074.657-3.436.657H20.58zm3.844-3.143h3.134c1.072 0 1.853-.204 2.344-.612.491-.415.737-.965.737-1.652 0-.503-.122-.947-.364-1.331a2.473 2.473 0 00-1.039-.906c-.444-.219-.974-.328-1.589-.328h-3.223v4.83zm0-7.43h2.85c.527 0 .994-.092 1.403-.276.414-.19.74-.456.976-.799.243-.343.364-.754.364-1.234 0-.657-.233-1.186-.7-1.589-.463-.402-1.12-.604-1.972-.604h-2.92v4.502zM1 0h12v28H1z'
	},
	C: {
		color: '#C8D400',
		letterPath:
			'M36.623 11.184h-3.889a3.802 3.802 0 00-.435-1.341 3.41 3.41 0 00-.843-1.012 3.711 3.711 0 00-1.19-.64 4.55 4.55 0 00-1.447-.221c-.941 0-1.76.234-2.46.701-.698.462-1.24 1.137-1.624 2.024-.385.882-.577 1.953-.577 3.214 0 1.296.192 2.385.577 3.267.39.882.935 1.548 1.634 1.998.698.45 1.506.674 2.423.674.515 0 .992-.068 1.43-.204a3.757 3.757 0 001.18-.595c.344-.266.628-.588.853-.967.23-.38.39-.811.479-1.297l3.889.018a7.255 7.255 0 01-2.361 4.483c-.67.604-1.469 1.084-2.398 1.439-.923.349-1.968.524-3.134.524-1.622 0-3.072-.367-4.35-1.101-1.272-.734-2.279-1.797-3.018-3.187-.734-1.391-1.101-3.075-1.101-5.052 0-1.983.373-3.67 1.118-5.06.746-1.391 1.758-2.45 3.037-3.179 1.278-.733 2.716-1.1 4.314-1.1 1.054 0 2.03.148 2.93.443a7.43 7.43 0 012.406 1.297 6.667 6.667 0 011.704 2.068c.444.817.728 1.752.852 2.806zM1 0h12v28H1z'
	},
	D: {
		color: '#FFED00',
		letterPath:
			'M27.026 23H20.58V4.818h6.499c1.829 0 3.403.364 4.723 1.092 1.32.722 2.335 1.76 3.045 3.116.716 1.356 1.074 2.977 1.074 4.865 0 1.894-.358 3.522-1.074 4.883a7.381 7.381 0 01-3.063 3.134C30.458 22.636 28.872 23 27.026 23zm-2.602-3.294h2.442c1.136 0 2.092-.2 2.867-.603.782-.409 1.367-1.04 1.758-1.891.397-.858.595-1.965.595-3.32 0-1.344-.198-2.442-.595-3.294-.39-.853-.974-1.48-1.749-1.882-.775-.403-1.731-.604-2.867-.604h-2.45v11.594zM1 0h12v28H1z'
	},
	E: {
		color: '#FBBA00',
		letterPath:
			'M20.58 23V4.818h12.252v3.17h-8.408v4.332h7.777v3.17h-7.777v4.34h8.443V23H20.58zM1 0h12v28H1z'
	},
	F: {
		color: '#EC6608',
		letterPath: 'M20.58 23V4.818H32.62v3.17h-8.195v4.332h7.396v3.17h-7.396V23H20.58zM1 0h12v28H1z'
	},
	G: {
		color: '#E30613',
		letterPath:
			'M32.636 10.695a3.987 3.987 0 00-.523-1.145 3.232 3.232 0 00-.826-.852 3.54 3.54 0 00-1.1-.542 4.653 4.653 0 00-1.36-.186c-.928 0-1.745.23-2.45.692-.698.462-1.242 1.134-1.633 2.016-.39.875-.586 1.947-.586 3.213 0 1.267.192 2.344.577 3.232.385.888.93 1.565 1.634 2.033.704.462 1.535.692 2.494.692.87 0 1.613-.153 2.229-.461a3.309 3.309 0 001.42-1.323c.331-.568.497-1.24.497-2.015l.782.115h-4.688V13.27h7.608v2.29c0 1.598-.337 2.972-1.012 4.12a6.898 6.898 0 01-2.787 2.645c-1.184.616-2.54.924-4.066.924-1.705 0-3.202-.376-4.493-1.128-1.29-.758-2.296-1.832-3.018-3.223-.716-1.396-1.074-3.053-1.074-4.971 0-1.474.213-2.788.639-3.942.432-1.16 1.036-2.142 1.81-2.947A7.826 7.826 0 0125.42 5.2c1.03-.42 2.145-.63 3.347-.63 1.03 0 1.988.15 2.876.452a7.663 7.663 0 012.362 1.261 6.827 6.827 0 011.695 1.944c.438.746.72 1.569.844 2.468h-3.907zM1 0h12v28H1z'
	}
} as const;

export const EfficiencyArrowSm: FC<TProps> = (props) => {
	const { size = 56, energyClass } = props;
	const { color, letterPath } = energyClassVariants[energyClass];
	const width = size * (53 / 28);
	const height = size;

	return (
		<svg
			viewBox="0 0 53 28"
			width={width}
			height={height}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<mask
				id="prefix__a"
				style="mask-type:alpha"
				maskUnits="userSpaceOnUse"
				x="0"
				y="0"
				width="53"
				height="28"
			>
				<path
					d="M38.725 0H3a3 3 0 00-3 3v22a3 3 0 003 3h35.725a3 3 0 002.16-.918l10.607-11a3 3 0 000-4.164l-10.607-11A3 3 0 0038.725 0z"
					fill="#D9D9D9"
				/>
			</mask>
			<g mask="url(#prefix__a)">
				<path fill={color} d="M13 0h39v28H13z" />
				<path d={letterPath} fill="#fff" />
				<path
					d="M5.509 9H4.19L6.2 3.182h1.585L9.79 9H8.472L7.014 4.511H6.97L5.509 9zm-.083-2.287H8.54v.96H5.426v-.96zM8.364 20.063a1.276 1.276 0 00-.168-.367 1.133 1.133 0 00-.616-.446c-.131-.04-.276-.06-.435-.06-.297 0-.559.074-.784.222a1.454 1.454 0 00-.523.645c-.125.28-.187.623-.187 1.028s.061.75.184 1.034c.123.284.298.501.523.65.225.149.491.223.798.223.279 0 .516-.05.713-.148.2-.1.35-.242.455-.424.106-.181.159-.396.159-.644l.25.037h-1.5v-.927h2.435v.733c0 .512-.108.951-.324 1.319a2.208 2.208 0 01-.892.846 2.779 2.779 0 01-1.301.296c-.546 0-1.025-.12-1.438-.361a2.504 2.504 0 01-.966-1.032c-.229-.447-.344-.977-.344-1.59 0-.472.069-.893.205-1.262.138-.371.331-.685.58-.943.248-.258.536-.454.866-.588.33-.134.687-.202 1.071-.202.33 0 .636.049.92.145.285.095.536.23.756.404.222.174.403.381.543.622.14.238.23.502.27.79h-1.25zM9.5 13.49L7.003 11 4.5 13.497l.69.688 1.326-1.323V16.5h.975v-3.638l1.32 1.316.689-.688z"
					fill="#000"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M38.725 1H3a2 2 0 00-2 2v22a2 2 0 002 2h35.725a2 2 0 001.44-.612l10.607-11a2 2 0 000-2.776l-10.607-11A2 2 0 0038.725 1zM3 0h35.725a3 3 0 012.16.918l10.607 11a3 3 0 010 4.164l-10.607 11a3 3 0 01-2.16.918H3a3 3 0 01-3-3V3a3 3 0 013-3z"
					fill="#000"
				/>
			</g>
		</svg>
	);
};

interface TProps {
	size: number;
	energyClass: TEnergyClass;
}
