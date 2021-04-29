import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from '@env/environment';

@Injectable()
export class ApiService {
    private apiBaseUrl: string = `${environment.apiUrl}/${environment.apiVersion}`;
    private timeOut = 120000;
    private msgTimeOut = 'The waiting time for execution has been exceeded';

    constructor(private httpClient: HttpClient) {
    }

    // method get for call processRequests in the plure api
    getData = async (method: string, params: string): Promise<any> => {
        const url = `${this.apiBaseUrl}/${method}/${params}`;
       
        return new Promise((resolve, reject) => {
            try {
                let subscription: any;
                let timer: any;

                timer = setTimeout(() => {
                    subscription.unsubscribe();
                    reject({message: this.msgTimeOut, status: 500});
                }, this.timeOut);

                subscription = this.httpClient
                    .get(
                        url,  
                        {
                            headers : this.getHeader()
                        })
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

    // method post for call processRequests in the plure api
    postData = async (method: string, params: string, object: any): Promise<any> => {
        const url = `${this.apiBaseUrl}/${method}/${params}`;

        console.log(url);

        return new Promise((resolve, reject) => {
            try {
                let subscription: any;
                let timer: any;

                timer = setTimeout(() => {
                    subscription.unsubscribe();
                    reject({message: this.msgTimeOut, status: 500});
                }, this.timeOut);

                subscription = this.httpClient
                    .post(
                        url,
                        object,
                        {
                            headers : this.getHeader()
                        })
                    .subscribe(
                        rsl => {
                            resolve(rsl);
                        },
                        err => {
                            reject(err)
                        } 
                    )
            } catch (err) {
                reject(err);
            }
        });
    }

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