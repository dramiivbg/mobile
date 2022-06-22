import { Injectable } from "@angular/core";
import { SyncerpService } from "./syncerp.service";

@Injectable()
export class WmsService {
    constructor(private syncErp: SyncerpService
    ) {}

    public async getReceiptByNo(no: string): Promise<any> {
        try {
            let obj: any = [{
                No: no
            }];
            let p = await this.syncErp.processRequestParams('GetWarehouseReceipt', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }
    }

    public async getPendingToReceiveLP(no: string, itemNo: string, unitofMeasureCode: string, binCode: string = '') {
        try {
            let obj: any = [
                {
                    No: no,
                    ItemNo: itemNo,
                    BinCode: binCode,
                    UnitofMeasureCode: unitofMeasureCode
                }
            ];
            let p = await this.syncErp.processRequestParams('Get_Pending_To_Receive_LP', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }
    }

    public async getUnitOfMeasure() {
        try {
            let obj: any = [{}];
            let p = await this.syncErp.processRequestParams('GetUnitOfMeasure', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }
    }

    public async CreateLPFromWarehouseReceiptLine(obj: any) {
        try {
            let p = await this.syncErp.processRequestParams('CreateLP_FromWarehouseReceiptLine', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }
    }
}