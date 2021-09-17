import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Storage } from '@ionic/storage';
import { Network } from '@capacitor/network';

import { OfflineService } from './offline.service';
import { SK_ENVIRONMENT, SK_OFFLINE, SK_USER_SESSION } from '@var/consts';

@Injectable()
export class ApiService {
    private timeOut = 60000;
    private msgTimeOut = 'The waiting time for execution has been exceeded';
    instance: string = 'DEV';

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
        const url = `${environment.apiUrl[this.instance]}/${environment.apiVersion}/${type}/${method}`;
        // const url = `${this.apiBaseUrl}/${type}/${method}`;
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
        const url = `${environment.apiUrl[this.instance]}/${environment.apiVersion}/${type}/${method}`;
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
                            this.storage.set(SK_OFFLINE, false);
                            await this.offline.setProcess(params.processMethod, rsl);
                            await this.methods(params, true);
                            resolve(rsl);
                        },
                        async err => {
                            // if (err.status === 400) // bad request error en el api
                            // if (err.status === 502) // error de bc
                            // if (err.status === 503) // no hay conexion a BC
                            const status = await Network.getStatus();
                            if (!status.connected) {
                            // if (err.status === 0 || err.status === 503) {
                                let save = await this.methods(params);
                                if (save !== null)  resolve(save);
                                let rsl = await this.offline.getProcess(params.processMethod);
                                if (rsl !== null) {
                                    resolve(rsl);
                                } else {
                                    reject(err);
                                }
                            } else if (params.processMethod === 'ProcessSalesOrders' ) {
                                let save = await this.methods(params);
                                resolve(save);
                            } else {
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
        headers = headers.set('Content-Type', 'application/json; charset=utf-8').set('plureApiKey', environment.apiKey[this.instance]);

        try {
            await this.storage.get(SK_USER_SESSION)
            .then(res => {
                let userSession = JSON.parse(res);
                headers = headers.set('Authorization', `Bearer ${userSession.token}`);
            });
        } catch (error) {}

        return headers;
    }

    async methods(params, typeMethod: boolean = false): Promise<any> {
        switch(params.processMethod){
            case 'ProcessSalesOrders':
                if (!typeMethod)
                    return await this.processSalesOrders(params);
                else 
                    return await this.processRemoveSalesTemp(params);
            break;
        }
        return null;
    }

    async processRemoveSalesTemp(params): Promise<void> {
        let jsonParams = JSON.parse(params.jsonRequest);
        let parameters = jsonParams.Parameters;
        if (parameters[0].SalesOrder !== undefined) {
            let json = {
                SalesOrder: parameters[0].SalesOrder,
                id: parameters[0].SalesOrder,
                parameters: parameters[0],
            }
            this.offline.removeProcessSales(params.processMethod, json);
        }        
    }

    async processSalesOrders(params): Promise<any> {
        let salesOrders: any = [];
        let tempId: string;
        let jsonParams = JSON.parse(params.jsonRequest);
        let parameters = jsonParams.Parameters;
        if (parameters[0].SalesOrder === undefined) 
            tempId = 'TEMP_' + (await this.generateId(10));
        else 
            tempId = parameters[0].SalesOrder;
        let json = {
            SalesOrder: tempId,
            id: tempId,
            value: parameters[0].customerName, 
            documentType: parameters[0].documentType,
            salesPerson: parameters[0].salesPerson,
            parameters: parameters[0],
            fields: {
                SelltoCustomerNo: parameters[0].customerNo,
                DocumentDate: parameters[0].orderDate
            },
            temp: true
        }
        salesOrders = await this.offline.getProcess(params.processMethod);
        if (salesOrders !== undefined && salesOrders !== null) {
            let salesOrder = salesOrders.find(x => x.id === json.id);
            if (salesOrder !== null && salesOrder !== undefined) {
                let edit = await this.offline.editProcessSales(params.processMethod, json);
                if (edit) return json; else return null;
            } else {
                if (salesOrders.length === 0) salesOrders = [];
                salesOrders.push(json);
            }
        } else {
            salesOrders = [];
            salesOrders.push(json);
        }
        await this.offline.setProcessSalesOrder(params.processMethod, salesOrders);
        return json;
    }

    async generateId(n: Number = 10): Promise<string> {
        let id: string = '';
        let letters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < n; i++) {
            let num = this.getRandomInt(0, letters.length - 1);
            id += letters.substr(num, 1);
        }
        return id;
    }

    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}