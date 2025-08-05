import { REDIS_CACHE_TOKEN } from './cache.constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger, OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import Redis from 'ioredis'

@Injectable()
export class LocalCacheService implements OnApplicationShutdown {
	private readonly logger = new Logger()

	constructor(
		@Inject(REDIS_CACHE_TOKEN) private readonly redis: Redis,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly configService: ConfigService,
	) {}

	onApplicationShutdown() {
		if (this.useRedis()) {
			this.redis.disconnect()
		}
	}

	public useRedis(): boolean {
		const redisPort = this.configService.get<string>('REDIS_PORT')
		const redisHost = this.configService.get<string>('REDIS_HOST')
		return !!(redisPort && redisHost)
	}

	/**
	 * Read from cache
	 * * Will use Redis if available
	 * * otherwise will use in-memory cache
	 */

	public async read(key: string): Promise<unknown> {
		if (this.useRedis()) {
			if (this.redis.status !== 'ready') {
				this.logger.error('Redis client is not ready', this.redis)
				throw new Error('Redis client not ready')
			}

			const value = await this.redis.get(key)
			this.logger.debug(`Cache read from Redis: ${key}`)
			return value ? JSON.parse(value) : undefined
		} else {
			this.logger.debug(`Cache read from in-memory: ${key}`)
			return await this.cacheManager.get(key)
		}
	}

	/**
	 * Write to cache
	 * * Will use Redis if available
	 * * otherwise will use in-memory cache
	 */

	public async write(key: string, value: any, ttl?: number): Promise<void> {
		if (this.useRedis()) {
			if (this.redis.status !== 'ready') {
				throw new Error('Redis client not ready')
			}

			if (!ttl || ttl <= 0) {
				// If no TTL is provided, don't set a TTL
				this.logger.debug(`Cache write to Redis: ${key} without TTL`)
				await this.redis.set(key, JSON.stringify(value))
			} else {
				this.logger.debug(`Cache write to Redis: ${key} with TTL: ${ttl}ms`)
				await this.redis.set(key, JSON.stringify(value), 'PX', ttl)
			}
		} else {
			this.logger.debug(`Cache write to in-memory: ${key} with TTL: ${ttl}ms`)
			await this.cacheManager.set(key, value, ttl)
		}
	}

	/**
	 * Delete from cache
	 * * Will use Redis if available
	 * * otherwise will use in-memory cache
	 */

	public async del(key: string): Promise<void> {
		if (this.useRedis()) {
			if (this.redis.status !== 'ready') {
				throw new Error('Redis client not ready')
			}

			this.logger.debug(`Cache delete from Redis: ${key}`)
			await this.redis.del(key)
		} else {
			this.logger.debug(`Cache delete from in-memory: ${key}`)
			await this.cacheManager.del(key)
		}
	}
}
