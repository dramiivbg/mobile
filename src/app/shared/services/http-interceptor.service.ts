import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor, HttpEvent, HttpResponse} from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';
import {catchError, concatAll, map} from 'rxjs/operators';
import { OfflineService } from './offline.service';
import { disableDebugTools } from '@angular/platform-browser';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private offline: OfflineService
  ) { }

  /**
   * Intercept http
   * @param req 
   * @param next 
   * @returns 
   */
  intercept(req: HttpRequest<any>, next: HttpHandler){ 
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.offline.setProcess(req.body, event);
        }
        return event;
      }),
      catchError(err => {
        return this.offline.getProcess(req.body).then(          
          (event: any) => {
            debugger;
            if (event !== null) return event;
            else {
              let message: string = '';
              if (err instanceof ErrorEvent) {
                message = `ErrorEvent: ${err.error.message}`;
              } else if (err.error instanceof ProgressEvent) {
                switch(err.status)
                {
                  case 0:
                    message = 'Unable to connect to plur-e.com';
                    break;
            
                  default:
                    message = `ProgressEvent: ${err.message}`;        
                    break;
                }
              }
              return message;
            }
          }
        );
      })
    )
  }
}