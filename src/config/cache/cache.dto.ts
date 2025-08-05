import { IsOptional, IsString } from 'class-validator'

export class CacheConfigDto {
	@IsString()
	@IsOptional()
	REDIS_PORT?: string

	@IsString()
	@IsOptional()
	REDIS_HOST?: string

	@IsString()
	@IsOptional()
	REDIS_USERNAME?: string

	@IsString()
	@IsOptional()
	REDIS_PASSWORD?: string

	@IsString()
	@IsOptional()
	REDIS_DB?: string
}
