import { AccountPermission, ContainerPermission, UserPermission } from './userPermissions.types'

export const userPermissionMock: UserPermission = {
	path: 'accounts/123456789/user_permissions/user@example.com',
	accountId: '123456789',
	emailAddress: 'user@example.com',
	accountAccess: {
		permission: AccountPermission.USER,
	},
	containerAccess: [
		{
			containerId: '987654321',
			permission: ContainerPermission.EDIT,
		},
		{
			containerId: '123123123',
			permission: ContainerPermission.READ,
		},
	],
}

export const adminUserPermissionMock: UserPermission = {
	path: 'accounts/123456789/user_permissions/admin@example.com',
	accountId: '123456789',
	emailAddress: 'admin@example.com',
	accountAccess: {
		permission: AccountPermission.ADMIN,
	},
	containerAccess: [
		{
			containerId: '987654321',
			permission: ContainerPermission.PUBLISH,
		},
		{
			containerId: '123123123',
			permission: ContainerPermission.PUBLISH,
		},
	],
}
