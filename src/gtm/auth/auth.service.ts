import { LocalCacheService } from '../../config/cache/local.cache.service'
import { GTMConfigDto } from '../../config/config.dto'
import { InjectConfig } from '../../config/config.provider'
import { AUTH_REDIRECT_URI, GTM_OAUTH_URL, GTM_TOKEN_URL, OAUTH_CACHE_KEY } from './auth.constants'
import { GTMOAuthInterface } from './auth.interface'
import { Injectable, Logger } from '@nestjs/common'

interface TokenResponse {
	access_token: string
	refresh_token: string
	token_type: string
	expires_in: number
	refresh_token_expires_in?: number
	scope?: string
}

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)

	constructor(
		@InjectConfig(GTMConfigDto) private readonly config: GTMConfigDto,
		private readonly localConfigService: LocalCacheService,
	) {}

	async accessToken(): Promise<string> {
		const cachedOAuth = (await this.localConfigService.read(OAUTH_CACHE_KEY)) as GTMOAuthInterface

		// Check if we have valid cached tokens
		if (cachedOAuth && cachedOAuth.refresh_token) {
			// Check if token is still valid (with 5 minute buffer)
			const expiresAt = new Date(cachedOAuth.expires_at)
			const now = new Date()
			const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds

			if (expiresAt.getTime() > now.getTime() + bufferTime) {
				this.logger.debug('Using cached access token')
				return cachedOAuth.access_token
			}

			// Token is expired, refresh it
			this.logger.debug('Access token expired, refreshing...')
			try {
				const tokenResponse = await this.refreshAccessToken(cachedOAuth.refresh_token)
				const newOAuth = await this.saveTokenResponse(tokenResponse)
				return newOAuth.access_token
			} catch (error) {
				this.logger.error('Failed to refresh token:', error)
				throw new Error('Failed to refresh GTM access token')
			}
		}

		throw new Error('No valid GTM tokens found. Please authorize the application first.')
	}

	/**
	 * Get the authorization URL for OAuth2 flow
	 * This would typically be used in a controller to redirect users for authorization
	 */
	getAuthorizationUrl(redirectUri: string, state?: string): string {
		const scopes = [
			'https://www.googleapis.com/auth/tagmanager.readonly',
			'https://www.googleapis.com/auth/tagmanager.edit.containers',
			'https://www.googleapis.com/auth/tagmanager.delete.containers',
			'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
			'https://www.googleapis.com/auth/tagmanager.publish',
			'https://www.googleapis.com/auth/tagmanager.manage.users',
			'https://www.googleapis.com/auth/tagmanager.manage.accounts',
		]

		const params = new URLSearchParams({
			response_type: 'code',
			client_id: this.config.GTM_CONSOLE_CLIENT_ID,
			redirect_uri: redirectUri,
			scope: scopes.join(' '),
			state: state || Date.now().toString(),
			access_type: 'offline',
			prompt: 'consent',
		})

		return `${GTM_OAUTH_URL}/authorize?${params.toString()}`
	}

	/**
	 * Exchange authorization code for access token
	 * This would typically be called from a callback controller
	 */
	async exchangeCodeForToken(protocol: string, host: string, code: string): Promise<string> {
		try {
			const request = {
				client_id: this.config.GTM_CONSOLE_CLIENT_ID,
				client_secret: this.config.GTM_CONSOLE_CLIENT_SECRET,
				grant_type: 'authorization_code',
				code,
				redirect_uri: `${protocol}://${host}/${AUTH_REDIRECT_URI}`,
			}

			this.logger.debug('Exchanging authorization code for access token', request)

			const tokenResponse = await this.requestAccessToken(request)
			const oauth = await this.saveTokenResponse(tokenResponse)

			// If refresh_token is not present, we cannot refresh the token later - get refresh token from Google
			if (!tokenResponse.refresh_token) {
				this.logger.warn('No refresh token obtained')
			}

			this.logger.debug('Successfully exchanged authorization code for tokens', oauth)
			return oauth.access_token
		} catch (error) {
			this.logger.error('Failed to exchange authorization code:', error)
			throw new Error('Failed to exchange authorization code for GTM access token')
		}
	}

	/**
	 * Use a refresh token to get a new access token
	 */

	async refreshToken(refreshToken: string): Promise<string> {
		try {
			const tokenResponse = await this.refreshAccessToken(refreshToken)
			const oauth = await this.saveTokenResponse(tokenResponse)
			this.logger.debug('Successfully refreshed access token', oauth)
			return oauth.access_token
		} catch (error) {
			this.logger.error('Failed to refresh access token:', error)
			throw new Error('Failed to refresh GTM access token')
		}
	}

	/**
	 * Refresh an access token using the refresh token
	 */
	private async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
		return this.requestAccessToken({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: this.config.GTM_CONSOLE_CLIENT_ID,
			client_secret: this.config.GTM_CONSOLE_CLIENT_SECRET,
		})
	}

	/**
	 * Make a token request to GTM's OAuth2 endpoint
	 */
	private async requestAccessToken(params: Record<string, string>): Promise<TokenResponse> {
		try {
			const url = `${GTM_TOKEN_URL}?${new URLSearchParams(params).toString()}`

			this.logger.debug('Requesting access token with params:', url)

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})

			if (!response.ok) {
				const errorText = await response.text()
				this.logger.error(`Token request failed: ${response.status} - ${errorText}`)
				throw new Error(`Token request failed: ${response.status}`)
			}

			const tokenResponse = (await response.json()) as TokenResponse
			this.logger.debug('Access token request successful', tokenResponse)
			return tokenResponse
		} catch (error) {
			this.logger.error('Error requesting access token:', error)
			throw new Error('Failed to request GTM access token')
		}
	}

	/**
	 * Save token response to cache
	 */
	private async saveTokenResponse(tokenResponse: TokenResponse): Promise<GTMOAuthInterface> {
		const expiresAt = new Date()
		expiresAt.setSeconds(expiresAt.getSeconds() + tokenResponse.expires_in)

		const oauth: GTMOAuthInterface = {
			access_token: tokenResponse.access_token,
			refresh_token: tokenResponse.refresh_token,
			token_type: tokenResponse.token_type,
			expires_at: expiresAt,
			scope: tokenResponse.scope ? tokenResponse.scope.split(' ') : [],
		}

		// Cache for the token lifetime
		await this.localConfigService.write(OAUTH_CACHE_KEY, oauth)
		return oauth
	}

	/**
	 * Clear cached tokens (useful for logout)
	 */
	async clearTokens(): Promise<void> {
		await this.localConfigService.del(OAUTH_CACHE_KEY)
		this.logger.debug('Cleared cached GTM tokens')
	}
}
