import { GTMAccount } from './accounts.types'

export const accountMock: GTMAccount = {
	path: 'accounts/123456789',
	accountId: '123456789',
	name: 'Example Company GTM Account',
	shareData: true,
	fingerprint: '1234567890abcdef',
	tagManagerUrl: 'https://tagmanager.google.com/#/account/123456789',
	features: {
		supportUserPermissions: true,
		supportMultipleContainers: true,
		supportWorkspaces: true,
		supportGtagConfigs: true,
		supportBuiltInVariables: true,
		supportClients: true,
		supportFolders: true,
		supportTags: true,
		supportTemplates: true,
		supportTriggers: true,
		supportVariables: true,
		supportVersions: true,
		supportZones: true,
		supportTransformations: true,
	},
}
