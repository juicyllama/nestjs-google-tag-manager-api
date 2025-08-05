import { ConfigValidationModule } from '../config.module'
import { REDIS_CACHE_TOKEN } from './cache.constants'
import { CacheConfigDto } from './cache.dto'
import { LocalCacheService } from './local.cache.service'
import { Module } from '@nestjs/common'
import Redis from 'ioredis'

function createRedisCache() {
	if (process.env.REDIS_PORT && process.env.REDIS_HOST) {
		return new Redis(+process.env.REDIS_PORT, process.env.REDIS_HOST, {
			username: process.env.REDIS_USER ?? undefined,
			password: process.env.REDIS_PASS ?? undefined,
			db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 0,
		})
	}
}

@Module({
	imports: [ConfigValidationModule.register(CacheConfigDto)],
	providers: [
		LocalCacheService,
		{
			provide: REDIS_CACHE_TOKEN,
			useFactory: createRedisCache,
		},
	],
	exports: [LocalCacheService],
})
export class LocalCacheModule {}
