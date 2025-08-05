import { IsString } from 'class-validator'

export class GTMConfigDto {
	@IsString()
	GTM_CONSOLE_CLIENT_ID!: string

	@IsString()
	GTM_CONSOLE_CLIENT_SECRET!: string
}
