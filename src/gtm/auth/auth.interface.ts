export interface GTMOAuthInterface {
	access_token: string
	refresh_token: string
	token_type: string
	expires_at: Date
	scope: string[]
}
