import { Injectable } from "@angular/core";
import { Process } from "@mdl/module";
import { GeneralService } from "./general.service";
import { SyncerpService } from "./syncerp.service";

@Injectable()
export class SalesService {

  constructor(private syncErp: SyncerpService
    , private general: GeneralService
  ) { }

  public async post(type: string, DocNo: string): Promise<any> {
    try {
      let params = await this.syncErp.processRequestParams('PostSalesOrders', [{ type, DocNo }]);
      return await this.syncErp.setProcessRequest(params);
    } catch (error) {
      throw error;
    }
  }

  public async getSales(process, erpUserId): Promise<any> {
    try {
      const method = await this.method(process);
      let p = await this.syncErp.processRequestParams(method, [{ type: process.salesType, pageSize: '', position: '', salesPerson: erpUserId }]);
      let sales = await this.syncErp.setProcessRequest(p);
      return await this.general.salesOrderList(sales.SalesOrders);
    } catch (error) {
      throw error;
    }
  }

  /**
   * get posted sales invoices
   * @param obj { paid: boolean, salesPerson: string }
   * @returns 
   */
  public async getPostedSalesInvoices(obj: any): Promise<any> {
    try {
      let params = await this.syncErp.processRequestParams('PostedSalesInvoices', [obj]);
      return await this.syncErp.setProcessRequest(params);
    } catch (error) {
      throw error;
    }
  }

    /**
   * paid posted sales invoice
   * @param obj { customerNo: string, postedDocNo: string, amount: number, transactionNo: string }
   * @returns 
   */
     public async paidPostedSalesInvoices(obj: any): Promise<any> {
      try {
        let params = await this.syncErp.processRequestParams('PaymentOrder', [obj]);
        return await this.syncErp.setProcessRequest(params);
      } catch (error) {
        throw error;
      }
    }

  private async method(process: Process): Promise<string> {
    switch (process.processId) {
      case "P001":
        return 'GetSalesOrders';
      case "P002":
        return 'GetSalesReturnOrders';
      case "P003":
        return 'GetSalesInvoices';
      case "P004":
        return 'GetSalesCreditMemo';
    }
  }
}