import { assertValue } from '@blgc/utils';

export const eprelApiConfig = {
	apiKey: assertValue(process.env.EPREL_API_KEY, 'Environment variable "EPREL_API_KEY" not set!')
};
