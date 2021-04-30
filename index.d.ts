import { EventEmitter } from "events";

interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null | undefined;
	mfa_enabled?: true;
	locale?: string;
	verified?: boolean;
	email?: string | null | undefined;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
}

interface Member {
	user?: User;
	nick?: string | null;
	roles: string[];
	joined_at: number;
	premium_since?: number | null | undefined;
	deaf: boolean;
	mute: boolean;
	pending?: boolean;
	permissions?: string;
}

// This is not accurate as discord sends a partial object
interface Integration {
	id: string;
	name: string;
	type: string;
	enabled: boolean;
	syncing: boolean;
	role_id: string;
	enable_emoticons?: boolean;
	expire_behavior: 0 | 1;
	expire_grace_period: number;
	user?: User;
	account: {
		id: string;
		name: string;
	};
	synced_at: number;
	subscriber_count: number;	
	revoked: boolean;
	application?: Application;
}

interface Connection {
	id: string;
	name: string;
	type: string;
	revoked?: string;
	integrations?: Integration[];
	verified: boolean;
	friend_sync: boolean;
	show_activity: boolean;
	visibility: 0 | 1;
}

interface Application {
	id: string;
	name: string;
	icon: string | null | undefined;
	description: string;
	summary: string;
	bot?: User;
}

interface TokenRequestResult {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: string;
	features: string[];
	permissions_new?: string;
}

interface Guild {
	id: string;
	name: string;
	icon: string | null | undefined;
	splash?: string | null;
	discovery_splash: string | null;
	owner_id: string;
	region: string;
	afk_channel_id: string | null;
	afk_timeout: number;
	widget_enabled: boolean;
	widget_channel_id?: string | null;
	verification_level: number;
	default_message_notifications: number;
	explicit_content_filter: number;
	roles: Role[];
	emojis: Emoji[];
	features: string[];
	mfa_level: number;
	application_id: string | null;
	system_channel_id: string | null;
	system_channel_flags: number;
	rules_channel_id: string | null;
	max_presences?: number | null;
	max_members?: number;
	vanity_url_code: string | null;
	description: string | null;
	banner: string | null;
	premium_tier: number;
	premium_subscription_count?: number;
	preferred_locale: string;
	public_updates_channel_id: string | null;
	max_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	welcome_screen?: {
		description: string | null;
		welcome_channels: {
			channel_id: string;
			description: string;
			emoji_id: string | null;
			emoji_name: string | null;
		}[]
	}
}

interface Emoji {
	id: string | null;
	name: string | null;
	roles?: string[];
	user?: User;
	require_colons?: boolean;
	managed?: boolean;
	animated?: boolean;
	available?: boolean;
}

interface RoleTags {
	bot_id?: string;
	integration_id?: string;
	premium_subscriber?: null;
}

interface Role {
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	permissions: string;
	managed: boolean;
	mentionable: boolean;
	tags?: RoleTags[];
}

interface RoleInput {
	name?: string;
	permissions?: string;
	color?: number;
	hoist?: boolean;
	mentionable?: boolean;
}

declare class OAuth extends EventEmitter {
	constructor(opts?: {
		version?: string,
		clientId?: string,
		redirectUri?: string,
		credentials?: string,
		clientSecret?: string,
		requestTimeout?: number,
		latencyThreshold?: number,
		ratelimiterOffset?: number,
	});
	request(method: string, path: string, data: any, headers: {auth?: {type: "Bearer" | "Bot", creds: string}}, contentType?: string): Promise<any>;
	on(event: "debug" | "warn", listener: (message: string) => void): this;
	tokenRequest(opts: {
		code?: string,
		clientId?: string,
		grantType: "authorization_code" | "refresh_token",
		redirectUri?: string,
		refreshToken?: string,
		clientSecret?: string,
	}): Promise<TokenRequestResult>;
	revokeToken(access_token: string, credentials?: string): Promise<string>;
	getUser(access_token: string): Promise<User>;
	getUserGuilds(access_token: string): Promise<PartialGuild[]>;
	getUserConnections(access_token: string): Promise<Connection[]>;
	getBotGuilds(botToken: string, opts?: {
		before?: string;
		after?: string;
		limit?: string;
	}): Promise<PartialGuild[]>;
	getGuild(botToken: string, guildId: string): Promise<Guild>;
	createGuildRole(botToken: string, guildId: string, opts: RoleInput): Promise<Role>;
	modifyGuildRole(botToken: string, guildId: string, roleId: string, opts: RoleInput): Promise<Role>;
	deleteGuildRole(botToken: string, guildId: string, roleId: string): Promise<void>;
	getGuildMember(botToken: string, guildId: string, memberId: string): Promise<Member>;
	modifyGuildMember(botToken: string, guildId: string, memberId: string, opts: {
		deaf?: boolean,
		mute?: boolean,
		nickname?: string,
		roles?: string[],
	}): Promise<Member>;
	addMember(opts: {
		deaf?: boolean,
		mute?: boolean,
		roles?: string[],
		nickname?: string,
		userId: string,
		guildId: string,
		botToken: string,
		accessToken: string,
	}): Promise<Member>;
	generateAuthUrl(opts: {
		scope: string[] | string,
		state?: string,
		clientId?: string,
		prompt?: "consent" | "none",
		redirectUri?: string,
		responseType?: "code" | "token",
		permissions?: number,
		guildId?: string,
		disableGuildSelect?: boolean,
	}): string;
}

export default OAuth
export {User, Member, Integration, Connection, Application, TokenRequestResult, PartialGuild, Guild, Emoji, RoleTags, Role, RoleInput}