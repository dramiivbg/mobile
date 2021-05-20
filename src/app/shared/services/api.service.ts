import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from '@env/environment';
import { concatAll } from 'rxjs/operators';
import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';
import { OfflineService } from './offline.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { CommentStmt, computeMsgId } from '@angular/compiler';

@Injectable()
export class ApiService {
    private apiBaseUrl: string = `${environment.apiUrl}/${environment.apiVersion}`;
    private timeOut = 60000;
    private msgTimeOut = 'The waiting time for execution has been exceeded';

    constructor(
        private httpClient: HttpClient,
        private offline: OfflineService
    ) {
    }

    /**
     * Method GET for call processRequests in the plure api
     * @param type 
     * @param params 
     * @returns 
     */
    getData = async (type: string, method: string): Promise<any> => {
        const url = `${this.apiBaseUrl}/${type}/${method}`;
       
        return new Promise((resolve, reject) => {
            try {
                let subscription: any;
                let timer: any;

                timer = setTimeout(() => {
                    subscription.unsubscribe();
                    reject({message: this.msgTimeOut, status: 500});
                }, this.timeOut);

                subscription = this.httpClient
                    .get(url, { headers : this.getHeader() })
                    .subscribe(
                        rsl => {
                            resolve(rsl);
                        },
                        err => reject({ error: err.error, status: 500 })
                    )
            } catch (err) {
                reject({ error: err.error, status: 500 });
            }
        });
    }

    /**
     * Method POST for call processRequests in the plure api
     * @param type 
     * @param method 
     * @param params 
     * @returns 
     */
    postData = async (type: string, method: string, params: any): Promise<any> => {
        const url = `${this.apiBaseUrl}/${type}/${method}`;
        return new Promise((resolve, reject) => {
            try {
                let subscription: any;
                let timer: any;

                timer = setTimeout(() => {
                    subscription.unsubscribe();
                    reject({message: this.msgTimeOut, status: 500});
                }, this.timeOut);

                subscription = this.httpClient
                    .post(url, params,{ headers : this.getHeader() })
                    .subscribe(
                    async (rsl: any) => {
                            await this.offline.setProcess(params.processMethod, rsl);
                            resolve(rsl);
                        },
                        async err => {
                            let rsl = await this.offline.getProcess(params.processMethod);
                            if (rsl !== null) {
                                resolve(rsl);
                            } else {
                                console.log(222)
                                reject(err);
                            }
                        } 
                    )
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Header Struct
     * @returns 
     */
    getHeader() : any {
        let sessionLogin = JSON.parse(localStorage.getItem('SESSION_LOGIN'));
        if ( sessionLogin !== null && sessionLogin !== undefined ) {
            return {
                'Content-Type': 'application/json',
                'plureApiKey': environment.apiKey,
                'Authorization': `Bearer ${sessionLogin.token}`
            }
        } else {
            return {
                'Content-Type': 'application/json',
                'plureApiKey': environment.apiKey
            }
        }
    }
}