import { AuthModule } from '../gtm/auth/auth.module'
import { GTMModule } from '../gtm/gtm.module'
//import { GTMModule } from '../index'
import { SandboxController } from './sandbox.controller'
import { SandboxService } from './sandbox.service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, GTMModule],
	controllers: [SandboxController],
	providers: [SandboxService],
	exports: [SandboxService],
})
export class SandboxModule {}
