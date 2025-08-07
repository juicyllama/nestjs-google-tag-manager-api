import { AuthModule } from '../../auth/auth.module'
import { GTMModule } from '../../gtm.module'
import { ContainersModule } from './containers.module'
import { ContainersService } from './containers.service'
import { UsageContext } from './containers.types'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('Containers', () => {
	let app: INestApplication
	let containersService: ContainersService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [ConfigModule.forRoot(), GTMModule, AuthModule, ContainersModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()

		containersService = moduleRef.get<ContainersService>(ContainersService)
	})

	afterAll(async () => {
		await app.close()
	})

	describe('List', () => {
		it('List Containers', async () => {
			const result = await containersService.listContainers('123456789')
			expect(result.container).toBeDefined()
			expect(result.container.length).toBeGreaterThan(0)
			expect(result.container[0].accountId).toBeDefined()
			expect(result.container[0].containerId).toBeDefined()
			expect(result.container[0].name).toBeDefined()
			expect(result.container[0].usageContext).toBeDefined()
		})

		it('List Containers with pagination', async () => {
			const result = await containersService.listContainers('123456789', {
				pageToken: 'next-page-token',
			})
			expect(result.container).toBeDefined()
			expect(result.container.length).toBeGreaterThan(0)
		})
	})

	describe('Get', () => {
		it('Get Container by ID', async () => {
			const container = await containersService.getContainer('123456789', '987654321')
			expect(container).toBeDefined()
			expect(container.accountId).toBe('123456789')
			expect(container.containerId).toBe('987654321')
			expect(container.name).toBe('Test Container')
			expect(container.publicId).toBe('GTM-XXXXX')
			expect(container.usageContext).toContain(UsageContext.WEB)
			expect(container.features).toBeDefined()
			expect(container.features?.supportTags).toBe(true)
		})

		it('Get Mobile Container by ID', async () => {
			const container = await containersService.getContainer('123456789', '123123123')
			expect(container).toBeDefined()
			expect(container.accountId).toBe('123456789')
			expect(container.containerId).toBe('123123123')
			expect(container.name).toBe('Mobile App Container')
			expect(container.usageContext).toContain(UsageContext.ANDROID)
			expect(container.usageContext).toContain(UsageContext.IOS)
		})

		it('Get Server Container by ID', async () => {
			const container = await containersService.getContainer('123456789', '456456456')
			expect(container).toBeDefined()
			expect(container.accountId).toBe('123456789')
			expect(container.containerId).toBe('456456456')
			expect(container.name).toBe('Server-side Container')
			expect(container.usageContext).toContain(UsageContext.SERVER)
			expect(container.taggingServerUrls).toBeDefined()
			expect(container.taggingServerUrls?.length).toBeGreaterThan(0)
		})
	})

	describe('Create', () => {
		it('Create Container', async () => {
			const newContainer = await containersService.createContainer('123456789', {
				name: 'New Test Container',
				domainName: ['newtest.com'],
				notes: 'Created via API',
				usageContext: [UsageContext.WEB],
				taggingServerUrls: ['https://newtest.com/gtm'],
			})
			expect(newContainer).toBeDefined()
			expect(newContainer.name).toBe('New Test Container')
			expect(newContainer.domainName).toContain('newtest.com')
			expect(newContainer.notes).toBe('Created via API')
			expect(newContainer.usageContext).toContain(UsageContext.WEB)
		})

		it('Create Container with minimal data', async () => {
			const newContainer = await containersService.createContainer('123456789', {
				name: 'Minimal Container',
				usageContext: [UsageContext.AMP],
			})
			expect(newContainer).toBeDefined()
			expect(newContainer.name).toBe('Minimal Container')
			expect(newContainer.usageContext).toContain(UsageContext.AMP)
		})
	})

	describe('Update', () => {
		it('Update Container', async () => {
			const updatedContainer = await containersService.updateContainer('123456789', '987654321', {
				name: 'Updated Test Container',
				notes: 'Updated via API',
				domainName: ['updated.com', 'www.updated.com'],
			})
			expect(updatedContainer).toBeDefined()
			expect(updatedContainer.name).toBe('Updated Test Container')
			expect(updatedContainer.notes).toBe('Updated via API')
			expect(updatedContainer.domainName).toContain('updated.com')
		})

		it('Update Container with fingerprint', async () => {
			const updatedContainer = await containersService.updateContainer('123456789', '987654321', {
				name: 'Fingerprint Update',
				fingerprint: '1234567890',
			})
			expect(updatedContainer).toBeDefined()
			expect(updatedContainer.name).toBe('Fingerprint Update')
		})

		it('Update Container usage context', async () => {
			const updatedContainer = await containersService.updateContainer('123456789', '987654321', {
				usageContext: [UsageContext.WEB, UsageContext.AMP],
			})
			expect(updatedContainer).toBeDefined()
			expect(updatedContainer.usageContext).toContain(UsageContext.WEB)
			expect(updatedContainer.usageContext).toContain(UsageContext.AMP)
		})
	})

	describe('Delete', () => {
		it('Delete Container', async () => {
			await expect(containersService.deleteContainer('123456789', '987654321')).resolves.not.toThrow()
		})
	})

	describe('Special Operations', () => {
		it('Combine Containers', async () => {
			const combinedContainer = await containersService.combineContainers('123456789', {
				containerId: '987654321',
				settingSource: 'sourceContainer',
			})
			expect(combinedContainer).toBeDefined()
			expect(combinedContainer.containerId).toBeDefined()
		})

		it('Lookup Container by destination ID', async () => {
			const container = await containersService.lookupContainer({
				destinationId: 'AW-123456789',
			})
			expect(container).toBeDefined()
			expect(container.containerId).toBeDefined()
		})

		it('Lookup Container by tag ID', async () => {
			const container = await containersService.lookupContainer({
				tagId: 'GTM-XXXXX',
			})
			expect(container).toBeDefined()
			expect(container.containerId).toBeDefined()
		})

		it('Move Tag ID', async () => {
			const container = await containersService.moveTagId('123456789', '987654321', {
				tagId: 'GTM-XXXXX',
				destinationContainerId: '123123123',
				copySettings: 'all',
				copyTermsOfService: true,
				copyUsers: true,
				allowUserPermissionFeatureUpdate: true,
			})
			expect(container).toBeDefined()
			expect(container.containerId).toBeDefined()
		})

		it('Get Container Snippet', async () => {
			const snippet = await containersService.getSnippet('123456789', '987654321')
			expect(snippet).toBeDefined()
			expect(snippet).toContain('GTM-')
			expect(snippet).toContain('googletagmanager.com')
			expect(snippet).toContain('dataLayer')
		})
	})
})
