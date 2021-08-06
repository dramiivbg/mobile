import { Injectable } from "@angular/core";
import { SK_NOTIFY } from "@var/consts";
import { E_NOTIFYTYPE } from "@var/enums";
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
    async getNotifications() : Promise<any> {
        let notify: any = null;
        if (await this.sqlConnect()) {
            let n = await this.sqLite.getItem(SK_NOTIFY);
            console.log(n)
            if (n !== null && n !== undefined && n !== '')
                notify = JSON.parse(n);
        }
        return notify;
    }

    /**
     * add new notifications
     * @param obj let obj = {
     *   type: 'notify',
     *   message: 'Welcome to plur-e',
     *   datetime: '',
     *   new: true
     *   }
     */
    async setNotifications(obj: any) {
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
     * count all notifications
     * @returns
     */
    async countNotifications(): Promise<number> {
        let notifies = await this.getNotifications();
        return (notifies !== undefined && notifies !== null) ? notifies.length : 0;
    }

    /**
     * Format for notifications
     * @param type 
     * @param message 
     */
    async createNotification(type: E_NOTIFYTYPE, message: string): Promise<void> {
        let notify: any = {
            id: '',
            type,
            message,
            datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            new: true,
            loading: true
        }
        this.setNotifications(notify);
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