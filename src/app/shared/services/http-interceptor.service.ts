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
   * Intercept http Request
   * @param req 
   * @param next 
   * @returns 
   */
   intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.offline.setProcess(req.body, event);
          // console.log(`Event: <!--${JSON.stringify(event)}-->`);
          // console.log(`Req: <!--${JSON.stringify(req)}-->`);
        }
        return event;
      }),
      catchError(err => {
        let message: string;
        // return this.Test(req);
        return throwError(message);
        // return new Promise<HttpEvent<any>>(
        //   (resolve, reject) => {
        //     this.offline.getProcess(req.body).then(
        //       (event:  HttpEvent<any>) => {
        //         debugger;
        //         console.log('Quien PRIMERO')
        //         console.log(event)
        //         if (event !== null) {
        //           resolve(event);
        //         } else {
        //           if (err instanceof ErrorEvent) {          
        //             message = `ErrorEvent: ${err.error.message}`;
        //           } else if (err.error instanceof ProgressEvent) {
        //             switch(err.status)
        //             {
        //               case 0:
        //                 message = 'Unable to connect to plur-e.com';
        //                 break;

        //               default:
        //                 message = `ProgressEvent: ${err.message}`;        
        //                 break;
        //             }
                    
        //           } else {
        //             message = `${err.error.message}`;
        //           }
        //           console.log(message);
        //           reject(message);
        //         }
        //       }
        //     )
        //   }
        // )
      })
    );
  }

  // Test(req: HttpRequest<any>) : Observable<HttpEvent<any>> {
  //   from(this.offline.getProcess(req.body)).pipe(
  //     map((event: HttpEvent<any>) => {
  //       debugger;
  //       if (event instanceof HttpResponse) {
  //         this.offline.setProcess(req.body, event);
  //         // console.log(`Event: <!--${JSON.stringify(event)}-->`);
  //         // console.log(`Req: <!--${JSON.stringify(req)}-->`);
  //       }
  //       return event;
  //     })
  //   );
  // }
}
