//Module
export { GTMModule } from './gtm/gtm.module'

//Service
export { AuthService } from './gtm/auth/auth.service'
export { AccountsService } from './gtm/accounts/accounts.service'
export { UserPermissionsService } from './gtm/accounts/userPermissions/userPermissions.service'

//Config
export { GTMConfigDto } from './config/config.dto'

//Interfaces
export { GTMOAuthInterface } from './gtm/auth/auth.interface'

//Types
export { GTMAccount } from './gtm/accounts/accounts.types'
export {
	UserPermission,
	AccountAccess,
	ContainerAccess,
	AccountPermission,
	ContainerPermission,
} from './gtm/accounts/userPermissions/userPermissions.types'

//DTOs
export { GTMAccountQuery, GTMAccountsResponse } from './gtm/accounts/accounts.dto'
export {
	UserPermissionsListQuery,
	UserPermissionsListResponse,
	AccountAccessDto,
	ContainerAccessDto,
	CreateUserPermissionDto,
	UpdateUserPermissionDto,
} from './gtm/accounts/userPermissions/userPermissions.dto'
