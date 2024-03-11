import { CacheModule, CACHE_MANAGER, Module } from '@nestjs/common';

const cacheModule = CacheModule.register({
  ttl: Number(process.env.CACHE_TTL),
  max: Number(process.env.CACHE_MAX_TIMES),
});

@Module({
  imports: [cacheModule],
  exports: [cacheModule],
})
export class CachingModule {}
