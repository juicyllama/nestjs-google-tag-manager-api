import { GTM_API_BASE_URL } from '../../auth/auth.constants'
import { AuthService } from '../../auth/auth.service'
import {
	CreateUserPermissionDto,
	UpdateUserPermissionDto,
	UserPermissionsListQuery,
	UserPermissionsListResponse,
} from './userPermissions.dto'
import { adminUserPermissionMock, userPermissionMock } from './userPermissions.mocks'
import { UserPermission } from './userPermissions.types'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class UserPermissionsService {
	private readonly logger = new Logger(UserPermissionsService.name)

	constructor(private readonly authService: AuthService) {}

	async getUserPermissions(
		accountId: string,
		params?: UserPermissionsListQuery,
	): Promise<UserPermissionsListResponse> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return mock user permissions
			return {
				userPermission: [userPermissionMock, adminUserPermissionMock],
			}
		}

		const accessToken = await this.authService.accessToken()

		let url = `${GTM_API_BASE_URL}/accounts/${accountId}/user_permissions`
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
			this.logger.error(`Get User Permissions API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Get User Permissions API Call failed: ${response.status}`)
		}

		return (await response.json()) as UserPermissionsListResponse
	}

	async getUserPermission(accountId: string, email: string): Promise<UserPermission> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock user permission
			return email === 'admin@example.com' ? adminUserPermissionMock : userPermissionMock
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/user_permissions/${email}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Get User Permission for ${email} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Get User Permission for ${email} API Call failed: ${response.status}`)
		}

		return (await response.json()) as UserPermission
	}

	async createUserPermission(accountId: string, data: CreateUserPermissionDto): Promise<UserPermission> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock user permission
			return {
				...userPermissionMock,
				emailAddress: data.emailAddress,
				accountAccess: data.accountAccess || userPermissionMock.accountAccess,
				containerAccess: data.containerAccess || userPermissionMock.containerAccess,
			}
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/user_permissions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Create User Permission API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Create User Permission API Call failed: ${response.status}`)
		}

		return (await response.json()) as UserPermission
	}

	async updateUserPermission(
		accountId: string,
		email: string,
		data: UpdateUserPermissionDto,
	): Promise<UserPermission> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock user permission
			const baseMock = email === 'admin@example.com' ? adminUserPermissionMock : userPermissionMock
			return {
				...baseMock,
				accountAccess: data.accountAccess || baseMock.accountAccess,
				containerAccess: data.containerAccess || baseMock.containerAccess,
			}
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/user_permissions/${email}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Update User Permission for ${email} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Update User Permission for ${email} API Call failed: ${response.status}`)
		}

		return (await response.json()) as UserPermission
	}

	async deleteUserPermission(accountId: string, email: string): Promise<void> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, just return without error
			return
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/user_permissions/${email}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Delete User Permission for ${email} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Delete User Permission for ${email} API Call failed: ${response.status}`)
		}
	}
}
