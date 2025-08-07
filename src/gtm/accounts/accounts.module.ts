import { AuthModule } from '../auth/auth.module'
import { AccountsService } from './accounts.service'
import { ContainersModule } from './containers/containers.module'
import { UserPermissionsModule } from './userPermissions/userPermissions.module'
import { Module } from '@nestjs/common'

@Module({
	imports: [AuthModule, UserPermissionsModule, ContainersModule],
	controllers: [],
	providers: [AccountsService],
	exports: [AccountsService, UserPermissionsModule, ContainersModule],
})
export class AccountsModule {}
