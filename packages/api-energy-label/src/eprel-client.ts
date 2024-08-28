import { createEPRELClient } from 'eprel-client';

import { eprelApiConfig } from './environment';

export const eprelClient = createEPRELClient({ apiKey: eprelApiConfig.apiKey });
