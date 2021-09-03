import { Injectable } from "@angular/core";
import { SK_NOTIFY } from "@var/consts";
import { E_NOTIFYTYPE } from "@var/enums";
import { Guid } from 'guid-typescript';
import * as moment from 'moment';

/** Services */
import { SqlitePlureService } from "./sqlite-plure.service";

@Injectable()
export class NotifyService {

    constructor(
        private sqLite: SqlitePlureService
    ) {
        this.getNotifications();
    }

    /**
     * Get all notifications in this session
     * @returns 
     */
    public async getNotifications() : Promise<any> {
        let notify: any = null;
        if (await this.sqlConnect()) {
            let n = await this.sqLite.getItem(SK_NOTIFY);
            if (n !== null && n !== undefined && n !== '')
                notify = JSON.parse(n);
        }
        return notify;
    }

    /**
     * add new notifications
     * @param obj let obj = {
     *   type: ENUM,
     *   message: 'Welcome to plur-e',
     *   datetime: '',
     *   new: boolean,
     *   loading: boolean
     *   }
     */
    public async setNotifications(obj: any) {
        let nots: any = [];
        let notifies = await this.getNotifications();
        if (notifies !== null && notifies !== undefined) {
            nots.push(obj);
            for (let i in notifies) {
                nots.push(notifies[i]);
            }
        } else {
            nots.push(obj);
        }
        if (await this.sqlConnect()) await this.sqLite.setItem(SK_NOTIFY, JSON.stringify(nots));
    }

    /**
     * add new notifications
     * @param obj let obj = {
     *   type: ENUM,
     *   message: 'Welcome to plur-e',
     *   datetime: '',
     *   new: boolean,
     *   loading: boolean
     *   }
     */
     public async setNotificationsEdit(obj: any) {
        let nots: any = [];
        let notifies = await this.getNotifications();
        if (notifies !== null && notifies !== undefined) {
            for (let i in notifies) {
                if (obj.id === notifies[i].id) {
                    notifies[i].new = true;
                    notifies[i] = obj;
                }
                nots.push(notifies[i]);
            }
        } else {
            nots.push(obj);
        }
        if (await this.sqlConnect()) await this.sqLite.setItem(SK_NOTIFY, JSON.stringify(nots));
    }

    /**
     * count all notifications
     * @returns
     */
    public async countNotifications(): Promise<number> {
        let notifies = await this.getNotifications();
        return (notifies !== undefined && notifies !== null) ? notifies.length : 0;
    }

    /**
     * Format for notifications
     * @param type 
     * @param message 
     */
    public async createNotification(type: E_NOTIFYTYPE, message: string, loading: boolean = false): Promise<any> {
        let id: any = Guid.create()
        let notify: any = {
            id: id.value,
            type,
            message,
            datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            new: true,
            loading
        }
        this.setNotifications(notify);
        return notify;
    }

    /**
     * Format for notifications
     * @param type 
     * @param message 
     */
     public async editNotification(notify: any): Promise<any> {
        await this.setNotificationsEdit(notify);
        return notify;
    }

    /**
     * see all notifications
     */
    public async changeNotifications() {
        let nots: any = [];
        let notifies = await this.getNotifications();
        for (let i in notifies) {
            notifies[i].new = false;
            nots.push(notifies[i]);
        }
        if (nots.length > 0) {
            if (await this.sqlConnect()) await this.sqLite.setItem(SK_NOTIFY, JSON.stringify(nots));
        }
    }

    /**
     * connection to the local sql
     * @returns 
     */
    private async sqlConnect() : Promise<boolean> {
        await this.sqLite.init();
        await this.sqLite.openStorageOptions();
        return await this.sqLite.openStore();
    }
}