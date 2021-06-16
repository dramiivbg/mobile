import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment} from '@env/environment';
import { Storage } from '@ionic/storage';

import { OfflineService } from './offline.service';
import { SK_USER_SESSION } from '@var/consts';

@Injectable()
export class ApiService {
    private apiBaseUrl: string = `${environment.apiUrl}/${environment.apiVersion}`;
    private timeOut = 60000;
    private msgTimeOut = 'The waiting time for execution has been exceeded';

    constructor(private httpClient: HttpClient,
        private offline: OfflineService,
        private storage: Storage) {}

    /**
     * Method GET for call processRequests in the plure api
     * @param type
     * @param params
     * @returns
     */
    getData = async (type: string, method: string): Promise<any> => {
        const url = `${this.apiBaseUrl}/${type}/${method}`;
        let headers = await this.getHeaders();

        return new Promise((resolve, reject) => {
            try {
                let subscription: any;
                let timer: any;

                timer = setTimeout(() => {
                    subscription.unsubscribe();
                    reject({message: this.msgTimeOut, status: 500});
                }, this.timeOut);

                subscription = this.httpClient
                    .get(url, { headers : headers })
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
        let headers = await this.getHeaders();

        return new Promise((resolve, reject) => {
            try {
                let subscription: any;
                let timer: any;

                timer = setTimeout(() => {
                    subscription.unsubscribe();
                    reject({message: this.msgTimeOut, status: 500});
                }, this.timeOut);

                subscription = this.httpClient
                    .post(url, params, { headers : headers })
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
    async getHeaders() : Promise<any> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8').set('plureApiKey', environment.apiKey);

        try {
            await this.storage.get(SK_USER_SESSION)
            .then(res => {
                let userSession = JSON.parse(res);
                headers = headers.set('Authorization', `Bearer ${userSession.token}`);
            });
        } catch (error) {}

        return headers;
    }
}