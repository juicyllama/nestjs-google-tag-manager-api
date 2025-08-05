import { GTMAccount } from './accounts.types'
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

export class GTMAccountQuery {
	@IsOptional()
	@IsBoolean()
	includeGoogleTags?: boolean

	@IsOptional()
	@IsString()
	pageToken?: string
}

export class GTMAccountsResponse {
	@IsArray()
	account!: GTMAccount[]

	@IsOptional()
	@IsString()
	nextPageToken?: string
}
