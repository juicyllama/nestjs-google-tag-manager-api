import { AuthModule } from '../auth/auth.module'
import { GTMModule } from '../gtm.module'
import { AccountsModule } from './accounts.module'
import { AccountsService } from './accounts.service'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('Accounts', () => {
	let app: INestApplication
	let accountsService: AccountsService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [ConfigModule.forRoot(), GTMModule, AuthModule, AccountsModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()

		accountsService = moduleRef.get<AccountsService>(AccountsService)
	})

	describe('Get', () => {
		it('Get Accounts', async () => {
			const result = await accountsService.getAccounts()
			expect(result.account).toBeDefined()
			expect(result.account.length).toBeGreaterThan(0)
			expect(result.account[0].accountId).toBeDefined()
			expect(result.account[0].name).toBeDefined()
			expect(result.account[0].fingerprint).toBeDefined()
		})

		it('Get Account by ID', async () => {
			const account = await accountsService.getAccount(123456789)
			expect(account).toBeDefined()
			expect(account.accountId).toBe('123456789')
			expect(account.name).toBe('Example Company GTM Account')
			expect(account.fingerprint).toBe('1234567890abcdef')
		})

		it('Update Account', async () => {
			const updatedAccount = await accountsService.updateAccount(123456789, {
				name: 'Updated Company GTM Account',
				shareData: false,
			})
			expect(updatedAccount).toBeDefined()
			expect(updatedAccount.name).toBe('Updated Company GTM Account')
			expect(updatedAccount.shareData).toBe(false)
		})
	})

	afterAll(async () => {
		await app.close()
	})
})
