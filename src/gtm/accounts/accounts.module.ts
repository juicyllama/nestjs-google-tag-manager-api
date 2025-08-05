import { AuthModule } from '../auth/auth.module'
import { AccountsService } from './accounts.service'
import { Module } from '@nestjs/common'

@Module({
	imports: [AuthModule],
	controllers: [],
	providers: [AccountsService],
	exports: [AccountsService],
})
export class AccountsModule {}
