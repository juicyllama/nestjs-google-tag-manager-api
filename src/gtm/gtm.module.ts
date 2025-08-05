import { LocalCacheModule } from '../config/cache/local.cache.module'
import { GTMConfigDto } from '../config/config.dto'
import { ConfigValidationModule } from '../config/config.module'
import { AuthModule } from './auth/auth.module'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'

@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
		}),
		ConfigValidationModule.register(GTMConfigDto),
		AuthModule,
		LocalCacheModule,
	],
})
export class GTMModule {}
