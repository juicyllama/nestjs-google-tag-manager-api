//Module
export { GTMModule } from './gtm/gtm.module'
export { ContainersModule } from './gtm/accounts/containers/containers.module'
//Service
export { AuthService } from './gtm/auth/auth.service'
export { AccountsService } from './gtm/accounts/accounts.service'
export { UserPermissionsService } from './gtm/accounts/userPermissions/userPermissions.service'
export { ContainersService } from './gtm/accounts/containers/containers.service'

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
export { Container, ContainerFeatures, UsageContext } from './gtm/accounts/containers/containers.types'

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
export {
	ContainersListQuery,
	ContainersListResponse,
	ContainerFeaturesDto,
	CreateContainerDto,
	UpdateContainerDto,
	CombineContainersDto,
	MoveTagIdDto,
	LookupContainerQuery,
} from './gtm/accounts/containers/containers.dto'
