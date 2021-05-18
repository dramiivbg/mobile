// import {Injectable} from '@angular/core';
// import {HttpHandler, HttpRequest, HttpInterceptor, HttpEvent, HttpResponse} from '@angular/common/http';
// import {throwError} from 'rxjs';
// import {catchError, map} from 'rxjs/operators';
// import { OfflineService } from './offline.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpErrorInterceptor implements HttpInterceptor {

//   construct(
//     private offline: OfflineService;
//   ) {}
  
//   /**
//    * Intercept http Request
//    * @param req 
//    * @param next 
//    * @returns 
//    */
//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     console.log(req);
//     this.offline.getProcess(req);
//     return next.handle(req).pipe(
//       map((event: HttpEvent<any>) => {
//         if (event instanceof HttpResponse) {
//           console.log('event--->>>', event);
//           console.log(req);
//         }
//         return event;
//       }),
//       catchError(err => {
//         this.offline.getProcess(req);

//         let message = '';
//         if (err instanceof ErrorEvent) {          
//           message = `ErrorEvent: ${err.error.message}`;
//         } else if (err.error instanceof ProgressEvent) {
//           switch(err.status)
//           {
//             case 0:
//               message = 'Unable to connect to plur-e.com';
//               break;

//             default:
//               message = `ProgressEvent: ${err.message}`;        
//               break;
//           }
          
//         } else {
//           message = `${err.error.message}`;
//         }

//         return throwError(message);
//       })
//     );
//   }
// }