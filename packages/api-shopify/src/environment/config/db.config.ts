import { assertValue } from '@blgc/utils';

export const dbConfig = {
	url: assertValue(process.env.DB_URL, 'Environment variable "DB_URL" not set!')
};
