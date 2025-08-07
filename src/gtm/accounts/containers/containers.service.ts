import { GTM_API_BASE_URL } from '../../auth/auth.constants'
import { AuthService } from '../../auth/auth.service'
import {
	CombineContainersDto,
	ContainersListQuery,
	ContainersListResponse,
	CreateContainerDto,
	LookupContainerQuery,
	MoveTagIdDto,
	UpdateContainerDto,
} from './containers.dto'
import { containerMock, mobileContainerMock, serverContainerMock } from './containers.mocks'
import { Container } from './containers.types'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class ContainersService {
	private readonly logger = new Logger(ContainersService.name)

	constructor(private readonly authService: AuthService) {}

	async listContainers(accountId: string, params?: ContainersListQuery): Promise<ContainersListResponse> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return mock containers
			return {
				container: [containerMock, mobileContainerMock, serverContainerMock],
			}
		}

		const accessToken = await this.authService.accessToken()

		let url = `${GTM_API_BASE_URL}/accounts/${accountId}/containers`
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
			this.logger.error(`List Containers API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`List Containers API Call failed: ${response.status}`)
		}

		return (await response.json()) as ContainersListResponse
	}

	async getContainer(accountId: string, containerId: string): Promise<Container> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock container
			if (containerId === '987654321') return containerMock
			if (containerId === '123123123') return mobileContainerMock
			if (containerId === '456456456') return serverContainerMock
			return containerMock
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/containers/${containerId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Get Container ${containerId} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Get Container ${containerId} API Call failed: ${response.status}`)
		}

		return (await response.json()) as Container
	}

	async createContainer(accountId: string, data: CreateContainerDto): Promise<Container> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock container
			return {
				...containerMock,
				name: data.name,
				domainName: data.domainName || containerMock.domainName,
				notes: data.notes || containerMock.notes,
				usageContext: data.usageContext,
				taggingServerUrls: data.taggingServerUrls || containerMock.taggingServerUrls,
			}
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/containers`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Create Container API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Create Container API Call failed: ${response.status}`)
		}

		return (await response.json()) as Container
	}

	async updateContainer(accountId: string, containerId: string, data: UpdateContainerDto): Promise<Container> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock container
			const baseMock =
				containerId === '123123123'
					? mobileContainerMock
					: containerId === '456456456'
						? serverContainerMock
						: containerMock
			return {
				...baseMock,
				name: data.name || baseMock.name,
				domainName: data.domainName || baseMock.domainName,
				notes: data.notes !== undefined ? data.notes : baseMock.notes,
				usageContext: data.usageContext || baseMock.usageContext,
				taggingServerUrls: data.taggingServerUrls || baseMock.taggingServerUrls,
			}
		}

		const accessToken = await this.authService.accessToken()

		let url = `${GTM_API_BASE_URL}/accounts/${accountId}/containers/${containerId}`
		if (data.fingerprint) {
			url += `?fingerprint=${encodeURIComponent(data.fingerprint)}`
			// Remove fingerprint from body as it goes in query params
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { fingerprint, ...bodyData } = data
			data = bodyData
		}

		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Update Container ${containerId} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Update Container ${containerId} API Call failed: ${response.status}`)
		}

		return (await response.json()) as Container
	}

	async deleteContainer(accountId: string, containerId: string): Promise<void> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, just return without error
			return
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/containers/${containerId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Delete Container ${containerId} API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Delete Container ${containerId} API Call failed: ${response.status}`)
		}
	}

	async combineContainers(accountId: string, data: CombineContainersDto): Promise<Container> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock container
			return containerMock
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/containers:combine`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Combine Containers API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Combine Containers API Call failed: ${response.status}`)
		}

		return (await response.json()) as Container
	}

	async lookupContainer(params: LookupContainerQuery): Promise<Container> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock container
			return containerMock
		}

		const accessToken = await this.authService.accessToken()

		const url =
			`${GTM_API_BASE_URL}/accounts/containers:lookup?` +
			new URLSearchParams(params as Record<string, string>).toString()

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Lookup Container API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Lookup Container API Call failed: ${response.status}`)
		}

		return (await response.json()) as Container
	}

	async moveTagId(accountId: string, containerId: string, data: MoveTagIdDto): Promise<Container> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock container
			return containerMock
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(
			`${GTM_API_BASE_URL}/accounts/${accountId}/containers/${containerId}:move_tag_id`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			},
		)

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Move Tag ID API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Move Tag ID API Call failed: ${response.status}`)
		}

		return (await response.json()) as Container
	}

	async getSnippet(accountId: string, containerId: string): Promise<string> {
		if (process.env.NODE_ENV === 'test') {
			// In test mode, return a mock snippet
			return `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXX');</script>
<!-- End Google Tag Manager -->`
		}

		const accessToken = await this.authService.accessToken()

		const response = await fetch(`${GTM_API_BASE_URL}/accounts/${accountId}/containers/${containerId}/snippet`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			this.logger.error(`Get Container Snippet API Call failed: ${response.status} - ${errorText}`)
			throw new Error(`Get Container Snippet API Call failed: ${response.status}`)
		}

		return await response.text()
	}
}
