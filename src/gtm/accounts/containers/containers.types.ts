export enum UsageContext {
	USAGE_CONTEXT_UNSPECIFIED = 'usageContextUnspecified',
	WEB = 'web',
	ANDROID = 'android',
	IOS = 'ios',
	ANDROID_SDK5 = 'androidSdk5',
	IOS_SDK5 = 'iosSdk5',
	AMP = 'amp',
	SERVER = 'server',
}

export type ContainerFeatures = {
	supportUserPermissions: boolean
	supportEnvironments: boolean
	supportWorkspaces: boolean
	supportGtagConfigs: boolean
	supportBuiltInVariables: boolean
	supportClients: boolean
	supportFolders: boolean
	supportTags: boolean
	supportTemplates: boolean
	supportTriggers: boolean
	supportVariables: boolean
	supportVersions: boolean
	supportZones: boolean
	supportTransformations: boolean
}

export type Container = {
	path: string
	accountId: string
	containerId: string
	name: string
	domainName?: string[]
	publicId: string
	tagIds?: string[]
	features?: ContainerFeatures
	notes?: string
	usageContext: UsageContext[]
	fingerprint: string
	tagManagerUrl: string
	taggingServerUrls?: string[]
}
