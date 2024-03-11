import { ExecutionContext, Injectable } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/common/cache/interceptors";

@Injectable()
export default class CustomHttpCacheInterceptor extends CacheInterceptor {
  httpServer: any;
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const isGetRequest = request.method === 'GET';
    const requestURl = request.path;
    const excludePaths = ['/auth/signin', '/auth/signup'];

    if (!isGetRequest || (isGetRequest && excludePaths.some((url) => requestURl.includes(url)))) {
      return undefined;
    }
    return requestURl;
  }
}
