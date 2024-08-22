export const appConfig = {
	name: 'playground',
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- No guarantee that NODE_ENV is set
	environment: process.env.NODE_ENV ?? 'local',
	packageVersion: process.env.npm_package_version
};
