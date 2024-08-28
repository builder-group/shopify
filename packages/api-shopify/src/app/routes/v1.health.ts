import { openApiRouter } from '../router';

openApiRouter.get('/health', {
	handler: (c) => {
		return c.json({
			message: 'App is up and running',
			status: 'Up'
		});
	}
});
