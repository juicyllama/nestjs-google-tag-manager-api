import { AuthModule } from '../auth/auth.module'
import { AccountsService } from './accounts.service'
import { UserPermissionsModule } from './userPermissions/userPermissions.module'
import { Module } from '@nestjs/common'

@Module({
	imports: [AuthModule, UserPermissionsModule],
	controllers: [],
	providers: [AccountsService],
	exports: [AccountsService, UserPermissionsModule],
})
export class AccountsModule {}
