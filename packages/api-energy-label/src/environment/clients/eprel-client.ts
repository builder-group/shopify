import { createEPRELClient } from 'eprel-client';

import { eprelApiConfig } from '../config';

export const eprelClient = createEPRELClient({ apiKey: eprelApiConfig.apiKey });
