export const ESheetLanguage = {
	BG: 'BG',
	CS: 'CS',
	DA: 'DA',
	DE: 'DE',
	ET: 'ET',
	EL: 'EL',
	EN: 'EN',
	ES: 'ES',
	FR: 'FR',
	GA: 'GA',
	HR: 'HR',
	IT: 'IT',
	LV: 'LV',
	LT: 'LT',
	HU: 'HU',
	MT: 'MT',
	NL: 'NL',
	PL: 'PL',
	PT: 'PT',
	RO: 'RO',
	SK: 'SK',
	SL: 'SL',
	FI: 'FI',
	SV: 'SV'
} as const;

export type TSheetLanguageCode = keyof typeof ESheetLanguage;

export const countryToSheetLang: Record<string, TSheetLanguageCode[]> = {
	// EU Member States
	AT: ['DE'],
	BE: ['NL', 'FR', 'DE'],
	BG: ['BG'],
	HR: ['HR'],
	CY: ['EL', 'EN'],
	CZ: ['CS'],
	DK: ['DA'],
	EE: ['ET'],
	FI: ['FI', 'SV'],
	FR: ['FR'],
	DE: ['DE'],
	EL: ['EL'],
	HU: ['HU'],
	IE: ['EN', 'GA'],
	IT: ['IT'],
	LV: ['LV'],
	LT: ['LT'],
	LU: ['DE', 'FR'],
	MT: ['MT', 'EN'],
	NL: ['NL'],
	PL: ['PL'],
	PT: ['PT'],
	RO: ['RO'],
	SK: ['SK'],
	SI: ['SL'],
	ES: ['ES'],
	SE: ['SV'],
	// EEA countries
	IS: ['EN'],
	LI: ['DE'],
	NO: ['EN'],
	// Other relevant territories
	XI: ['EN'], // Northern Ireland
	// Additional countries that might be relevant
	CH: ['DE', 'FR', 'IT'], // Switzerland
	MC: ['FR'], // Monaco
	SM: ['IT'], // San Marino
	VA: ['IT'], // Vatican City
	AD: ['ES'] // Andorra
};
