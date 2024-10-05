export const appConfig = {
	environment: process.env.NODE_ENV ?? 'local',
	port: process.env.APP_PORT ?? 8787,
	packageVersion: process.env.npm_package_version
};
