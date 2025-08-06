import { AccountPermission, ContainerPermission, UserPermission } from './userPermissions.types'
import { IsArray, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'

export class UserPermissionsListQuery {
	@IsOptional()
	@IsString()
	pageToken?: string
}

export class UserPermissionsListResponse {
	@IsArray()
	userPermission!: UserPermission[]

	@IsOptional()
	@IsString()
	nextPageToken?: string
}

export class AccountAccessDto {
	@IsEnum(AccountPermission)
	permission!: AccountPermission
}

export class ContainerAccessDto {
	@IsString()
	containerId!: string

	@IsEnum(ContainerPermission)
	permission!: ContainerPermission
}

export class CreateUserPermissionDto {
	@IsEmail()
	emailAddress!: string

	@IsOptional()
	accountAccess?: AccountAccessDto

	@IsOptional()
	@IsArray()
	containerAccess?: ContainerAccessDto[]
}

export class UpdateUserPermissionDto {
	@IsOptional()
	accountAccess?: AccountAccessDto

	@IsOptional()
	@IsArray()
	containerAccess?: ContainerAccessDto[]
}
