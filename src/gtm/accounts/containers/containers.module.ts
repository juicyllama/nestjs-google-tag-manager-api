import { AuthModule } from '../../auth/auth.module'
import { ContainersService } from './containers.service'
import { Module } from '@nestjs/common'

@Module({
	imports: [AuthModule],
	providers: [ContainersService],
	exports: [ContainersService],
})
export class ContainersModule {}
