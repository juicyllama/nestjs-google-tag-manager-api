import { LocalCacheService } from '../../config/cache/local.cache.service'
import { AUTH_REDIRECT_URI, OAUTH_CACHE_KEY } from './auth.constants'
import { AuthService } from './auth.service'
import { Controller, Get, Req, Res, Logger, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'

@Controller('/app/gtm/auth')
export class AuthController {
	private readonly logger = new Logger()

	constructor(
		private readonly localConfigService: LocalCacheService,
		private readonly authService: AuthService,
	) {}

	@Get()
	async getAuthUrl(@Req() req: Request, @Res() res: Response): Promise<void> {
		//Only allow this endpoint to be called if !token exists in cache
		if (!(await this.localConfigService.read(OAUTH_CACHE_KEY))) {
			return res.redirect(
				this.authService.getAuthorizationUrl(`${req.protocol}://${req.get('Host')}/${AUTH_REDIRECT_URI}`),
			)
		}

		throw new UnauthorizedException(
			'Google Tag Manager OAuth access token already exists. Please clear tokens before requests a new authorization URL.',
		)
	}

	@Get('/callback')
	async callback(@Req() req: Request, @Res() res: Response): Promise<void> {
		this.logger.log('GTM OAuth callback received:', req.query)

		const { refresh_token, code, error } = req.query as { refresh_token?: string; code?: string; error?: string }

		if (error) {
			this.logger.error('OAuth error:', error)
			throw new UnauthorizedException(`OAuth error: ${error}`)
		}

		//if refresh_token is present, we can skip the authorization code step
		if (refresh_token) {
			this.logger.log('Using refresh token to obtain access token')
			const access_token = await this.authService.refreshToken(refresh_token)
			return res.status(200).json({
				message: 'Authorization successful',
				access_token: access_token,
			})
		}

		if (!code) {
			throw new UnauthorizedException('Authorization code is required')
		}

		// Exchange the authorization code for an access token
		const tokenResponse = await this.authService.exchangeCodeForToken(req.protocol, req.get('Host'), code)
		if (!tokenResponse) {
			throw new UnauthorizedException('Failed to obtain access token')
		}

		res.status(200).json({
			message: 'Authorization successful',
			access_token: tokenResponse,
		})
	}
}
