import { AuthModule } from '../../auth/auth.module'
import { UserPermissionsService } from './userPermissions.service'
import { Module } from '@nestjs/common'

@Module({
	imports: [AuthModule],
	providers: [UserPermissionsService],
	exports: [UserPermissionsService],
})
export class UserPermissionsModule {}
