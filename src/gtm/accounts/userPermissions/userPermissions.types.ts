export enum AccountPermission {
	ACCOUNT_PERMISSION_UNSPECIFIED = 'accountPermissionUnspecified',
	NO_ACCESS = 'noAccess',
	USER = 'user',
	ADMIN = 'admin',
}

export enum ContainerPermission {
	CONTAINER_PERMISSION_UNSPECIFIED = 'containerPermissionUnspecified',
	NO_ACCESS = 'noAccess',
	READ = 'read',
	EDIT = 'edit',
	APPROVE = 'approve',
	PUBLISH = 'publish',
}

export type AccountAccess = {
	permission: AccountPermission
}

export type ContainerAccess = {
	containerId: string
	permission: ContainerPermission
}

export type UserPermission = {
	path: string
	accountId: string
	emailAddress: string
	accountAccess: AccountAccess
	containerAccess: ContainerAccess[]
}
