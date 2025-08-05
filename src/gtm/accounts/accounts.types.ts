export type GTMAccount = {
	path: string
	accountId: string
	name: string
	shareData: boolean
	fingerprint: string
	tagManagerUrl: string
	features: {
		supportUserPermissions?: boolean
		supportMultipleContainers?: boolean
		supportWorkspaces?: boolean
		supportGtagConfigs?: boolean
		supportBuiltInVariables?: boolean
		supportClients?: boolean
		supportFolders?: boolean
		supportTags?: boolean
		supportTemplates?: boolean
		supportTriggers?: boolean
		supportVariables?: boolean
		supportVersions?: boolean
		supportZones?: boolean
		supportTransformations?: boolean
	}
}
