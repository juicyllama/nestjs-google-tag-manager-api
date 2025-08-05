import { GTM_API_BASE_URL } from '../auth/auth.constants'
import { AuthService } from '../auth/auth.service'
import { GTMAccountQuery, GTMAccountsResponse } from './accounts.dto'
import { accountMock } from './accounts.mocks'
import { GTMAccount } from './accounts.types'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AccountsService {
	private readonly logger = new Logger(AccountsService.name)

	constructor(private readonly authService: AuthService) {}

	async getAccounts(params?: GTMAccountQuery): Promise<GTMAccountsResponse> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock account
			return {
				account: [accountMock],
			}
		}

		const accessToken = await this.authService.accessToken()

		let url = GTM_API_BASE_URL + '/accounts'
		if (params && Object.keys(params).length > 0) {
			url += '?' + new URLSearchParams(params as Record<string, string>).toString()
		}

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Get Accounts API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Get Accounts API Call failed: ${response.status}`)
		}

		return (await response.json()) as GTMAccountsResponse
	}

	async getAccount(accountId: number): Promise<GTMAccount> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock account
			return accountMock
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(GTM_API_BASE_URL + '/accounts/' + accountId, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Get Account #${accountId} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Get Account #${accountId} API Call failed: ${response.status}`)
		}

		return (await response.json()) as GTMAccount
	}

	async updateAccount(accountId: number, data: Partial<GTMAccount>): Promise<GTMAccount> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock account
			return {
				...accountMock,
				...data,
			}
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(GTM_API_BASE_URL + '/accounts/' + accountId, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Update Account #${accountId} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Update Account #${accountId} API Call failed: ${response.status}`)
		}

		return (await response.json()) as GTMAccount
	}
}
