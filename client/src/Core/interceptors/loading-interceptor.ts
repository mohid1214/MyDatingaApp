import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';


const cache = new Map<string, any>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const busyService = inject(BusyService);
  
  const generteCacheKey = (url: string,params: HttpParams): string => {
    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}`: url
  }

  const invalidateCache = (urlPattern: string) =>{
    for(const key of cache.keys()){
      if(key.includes(urlPattern)){
        cache.delete(key);
        console.log(`Cache invalided for : ${key}`);
      }
    }
  }

  const cachedKey = generteCacheKey(req.url, req.params);

  if(req.method.includes('POST') && req.url.includes('/likes')){
    invalidateCache('/likes');
  }

  if (req.method == 'GET') {
    const cachedResponse = cache.get(cachedKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => {
      cache.set(cachedKey, response)
    }),
    finalize(() => {
      busyService.idle()
    })
  )
};
