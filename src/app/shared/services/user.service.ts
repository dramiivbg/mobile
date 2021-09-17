import { Injectable } from "@angular/core";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { Storage } from "@ionic/storage";
import { SK_AUTHORIZE_ACCESS_CLIENT } from "@var/consts";
import { ApiService } from "./api.service";
import { AuthService } from "./auth.service";

@Injectable()
export class UserService {
    constructor(private api: ApiService
        , private authService: AuthService
        , private storage: Storage
        , private appVersion: AppVersion
    ) {}

    /**
     * compare version
     * @param obj { customerId, environmentId, versionCode }
     * @returns 
     */
    public async compareVersion(): Promise<any> {
        try {
            let customer = await this.getCustomer();
            let versionCode = await this.appVersion.getVersionCode();
            let userSession = await this.authService.getUserSession();
            if (customer !== null && userSession !== null) {
                let obj: any = {
                    customerId: customer.customerId,
                    environmentId: userSession.environmentId,
                    versionCode
                }
                return await this.api.postData('versionapp', 'validatemobileversion', obj);
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return {error};
        }
    }

    /**
     * compare version
     * @param obj { customerId, environmentId, versionCode }
     * @returns 
     */
     public async compareVersionByEnvironment(environmentId: string): Promise<any> {
        try {
            let customer = await this.getCustomer();
            let versionCode = await this.appVersion.getVersionCode();
            let obj: any = {
                customerId: customer.customerId,
                versionCode,
                environmentId
            }
            let vers = await this.api.postData('versionapp', 'validatemobileversion', obj);
            return vers;
        } catch (error) {
            throw {error};
        }
    }

    /**
     * get customer
     * @returns { apiKey, customerId }
     */
    public async getCustomer(): Promise<any> {
        try {
            let customer: string = await this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT);
            if (customer !== null){
                return JSON.parse(customer);
            }
        } catch (error) {
            return {error};
        }
        return null;
    }
}