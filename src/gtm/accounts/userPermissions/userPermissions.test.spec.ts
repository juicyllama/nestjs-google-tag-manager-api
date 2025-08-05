import { AuthModule } from '../../auth/auth.module'
import { GTMModule } from '../../gtm.module'
import { UserPermissionsModule } from './userPermissions.module'
import { UserPermissionsService } from './userPermissions.service'
import { AccountPermission, ContainerPermission } from './userPermissions.types'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('UserPermissions', () => {
	let app: INestApplication
	let userPermissionsService: UserPermissionsService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [ConfigModule.forRoot(), GTMModule, AuthModule, UserPermissionsModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()

		userPermissionsService = moduleRef.get<UserPermissionsService>(UserPermissionsService)
	})

	describe('List', () => {
		it('Get User Permissions', async () => {
			const result = await userPermissionsService.getUserPermissions('123456789')
			expect(result.userPermission).toBeDefined()
			expect(result.userPermission.length).toBeGreaterThan(0)
			expect(result.userPermission[0].accountId).toBeDefined()
			expect(result.userPermission[0].emailAddress).toBeDefined()
			expect(result.userPermission[0].accountAccess).toBeDefined()
		})

		it('Get User Permissions with pagination', async () => {
			const result = await userPermissionsService.getUserPermissions('123456789', {
				pageToken: 'next-page-token',
			})
			expect(result.userPermission).toBeDefined()
			expect(result.userPermission.length).toBeGreaterThan(0)
		})
	})

	describe('Get', () => {
		it('Get User Permission by email', async () => {
			const userPermission = await userPermissionsService.getUserPermission('123456789', 'user@example.com')
			expect(userPermission).toBeDefined()
			expect(userPermission.accountId).toBe('123456789')
			expect(userPermission.emailAddress).toBe('user@example.com')
			expect(userPermission.accountAccess.permission).toBe(AccountPermission.USER)
			expect(userPermission.containerAccess).toBeDefined()
			expect(userPermission.containerAccess.length).toBeGreaterThan(0)
		})

		it('Get Admin User Permission by email', async () => {
			const userPermission = await userPermissionsService.getUserPermission('123456789', 'admin@example.com')
			expect(userPermission).toBeDefined()
			expect(userPermission.accountId).toBe('123456789')
			expect(userPermission.emailAddress).toBe('admin@example.com')
			expect(userPermission.accountAccess.permission).toBe(AccountPermission.ADMIN)
			expect(userPermission.containerAccess).toBeDefined()
			expect(userPermission.containerAccess.length).toBeGreaterThan(0)
		})
	})

	describe('Create', () => {
		it('Create User Permission', async () => {
			const newUserPermission = await userPermissionsService.createUserPermission('123456789', {
				emailAddress: 'newuser@example.com',
				accountAccess: {
					permission: AccountPermission.USER,
				},
				containerAccess: [
					{
						containerId: '987654321',
						permission: ContainerPermission.READ,
					},
				],
			})
			expect(newUserPermission).toBeDefined()
			expect(newUserPermission.emailAddress).toBe('newuser@example.com')
			expect(newUserPermission.accountAccess.permission).toBe(AccountPermission.USER)
			expect(newUserPermission.containerAccess.length).toBeGreaterThan(0)
		})

		it('Create User Permission with minimal data', async () => {
			const newUserPermission = await userPermissionsService.createUserPermission('123456789', {
				emailAddress: 'minimal@example.com',
			})
			expect(newUserPermission).toBeDefined()
			expect(newUserPermission.emailAddress).toBe('minimal@example.com')
			expect(newUserPermission.accountAccess).toBeDefined()
			expect(newUserPermission.containerAccess).toBeDefined()
		})
	})

	describe('Update', () => {
		it('Update User Permission', async () => {
			const updatedUserPermission = await userPermissionsService.updateUserPermission(
				'123456789',
				'user@example.com',
				{
					accountAccess: {
						permission: AccountPermission.ADMIN,
					},
					containerAccess: [
						{
							containerId: '987654321',
							permission: ContainerPermission.PUBLISH,
						},
					],
				},
			)
			expect(updatedUserPermission).toBeDefined()
			expect(updatedUserPermission.accountAccess.permission).toBe(AccountPermission.ADMIN)
			expect(updatedUserPermission.containerAccess[0].permission).toBe(ContainerPermission.PUBLISH)
		})

		it('Update User Permission with partial data', async () => {
			const updatedUserPermission = await userPermissionsService.updateUserPermission(
				'123456789',
				'user@example.com',
				{
					accountAccess: {
						permission: AccountPermission.USER,
					},
				},
			)
			expect(updatedUserPermission).toBeDefined()
			expect(updatedUserPermission.accountAccess.permission).toBe(AccountPermission.USER)
		})
	})

	describe('Delete', () => {
		it('Delete User Permission', async () => {
			await expect(
				userPermissionsService.deleteUserPermission('123456789', 'user@example.com'),
			).resolves.not.toThrow()
		})
	})

	afterAll(async () => {
		await app.close()
	})
})
