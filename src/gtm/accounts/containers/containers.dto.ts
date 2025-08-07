import { Container, UsageContext } from './containers.types'
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

export class ContainersListQuery {
	@IsOptional()
	@IsString()
	pageToken?: string
}

export class ContainersListResponse {
	@IsArray()
	container!: Container[]

	@IsOptional()
	@IsString()
	nextPageToken?: string
}

export class ContainerFeaturesDto {
	@IsBoolean()
	supportUserPermissions!: boolean

	@IsBoolean()
	supportEnvironments!: boolean

	@IsBoolean()
	supportWorkspaces!: boolean

	@IsBoolean()
	supportGtagConfigs!: boolean

	@IsBoolean()
	supportBuiltInVariables!: boolean

	@IsBoolean()
	supportClients!: boolean

	@IsBoolean()
	supportFolders!: boolean

	@IsBoolean()
	supportTags!: boolean

	@IsBoolean()
	supportTemplates!: boolean

	@IsBoolean()
	supportTriggers!: boolean

	@IsBoolean()
	supportVariables!: boolean

	@IsBoolean()
	supportVersions!: boolean

	@IsBoolean()
	supportZones!: boolean

	@IsBoolean()
	supportTransformations!: boolean
}

export class CreateContainerDto {
	@IsString()
	name!: string

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	domainName?: string[]

	@IsOptional()
	@IsString()
	notes?: string

	@IsArray()
	@IsEnum(UsageContext, { each: true })
	usageContext!: UsageContext[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	taggingServerUrls?: string[]
}

export class UpdateContainerDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	domainName?: string[]

	@IsOptional()
	@IsString()
	notes?: string

	@IsOptional()
	@IsArray()
	@IsEnum(UsageContext, { each: true })
	usageContext?: UsageContext[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	taggingServerUrls?: string[]

	@IsOptional()
	@IsString()
	fingerprint?: string
}

export class CombineContainersDto {
	@IsString()
	containerId!: string

	@IsString()
	settingSource!: string
}

export class MoveTagIdDto {
	@IsString()
	tagId!: string

	@IsString()
	destinationContainerId!: string

	@IsOptional()
	@IsString()
	copySettings?: string

	@IsOptional()
	@IsBoolean()
	copyTermsOfService?: boolean

	@IsOptional()
	@IsBoolean()
	copyUsers?: boolean

	@IsOptional()
	@IsBoolean()
	allowUserPermissionFeatureUpdate?: boolean
}

export class LookupContainerQuery {
	@IsOptional()
	@IsString()
	destinationId?: string

	@IsOptional()
	@IsString()
	tagId?: string
}
