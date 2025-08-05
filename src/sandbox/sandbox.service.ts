import { AuthService } from '../gtm/auth/auth.service'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class SandboxService {
	private readonly logger = new Logger(SandboxService.name)

	constructor(private readonly authService: AuthService) {}

	async run(): Promise<any> {
		this.logger.log('Running sandbox service...')
		const accessToken = await this.authService.accessToken()
		this.logger.log('Access Token:', accessToken)

		return { message: 'Sandbox service is running' }
	}
}
