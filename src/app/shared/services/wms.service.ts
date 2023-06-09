import { Injectable } from "@angular/core";
import { InterceptService } from "./intercept.service";
import { SyncerpService } from "./syncerp.service";

@Injectable()
export class WmsService {
    public wareReceipts: any = {}
    public contador: number = 0;
    public data: any;
    public lps:any[] = [];
    public boolean: Boolean;

    public dataWP:any; 

   
 
    constructor(private syncErp: SyncerpService,
         private interceptService: InterceptService
    ) {}


    public async GetBinContent_LP(BinCode: string, LocationCode: string){

        try {
            let obj: any = [
                {
                    BinCode,
                    LocationCode,
                    
                }
            ];
            let p = await this.syncErp.processRequestParams('GetBinContent_LP', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }

    }

    public async GetLicencesPlateInWR(No: string, boolean: boolean){


        try {
            let obj: any = [{
                No,
                IsPallet: boolean,
                LicensePlateStatus:1,
              
            }]; 
            
            let p = await this.syncErp.processRequestParams('GetLicencesPlateByStatus', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }

 }

 public async GetLicencesPlateByStatusGeneral(No:any,LicensePlateStatus:any){

    
    try {
        let obj: any = [{
            No,
            LicensePlateStatus
          
        }]; 
        
        let p = await this.syncErp.processRequestParams('GetLicencesPlateByStatusGeneral', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }

 }

 public async GetAllLicencesPlateByStatus(IsPallet:boolean,LicensePlateStatus:number){

    
    try {
        let obj: any = [{
            IsPallet,
            LicensePlateStatus
          }]; 
        
        let p = await this.syncErp.processRequestParams('GetAllLicencesPlateByStatus', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }

 }



 public async GetLicencesPlateInPW(No: string, boolean: boolean){


    try {
        let obj: any = [{
            No,
            IsPallet: boolean,
            LicensePlateStatus:2,
          
        }]; 
        
        let p = await this.syncErp.processRequestParams('GetLicencesPlateByStatus', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }

}

public async GetItemTrackingSpecificationV3(LocationCode:any){
    try {
        let obj: any = [{
            LocationCode
          
        }]; 
        
        let p = await this.syncErp.processRequestParams('GetItemTrackingSpecificationV3', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }
}

public async Update_QtyToReturn_V1(list:any){

    try {
        let obj: any = [{
            SalesLine: list
          
        }]; 
        
        let p = await this.syncErp.processRequestParams('Update_QtyToReturn_V1', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }

}

public async Update_QtyToShip_SalesLines_V1(list:any){

    
    try {
        let obj: any = [{
            SalesLine: list
          
        }]; 
        
        let p = await this.syncErp.processRequestParams('Update_QtyToShip_SalesLines_V1', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }
}


 public set(wareReceipts:any){

    this.wareReceipts = wareReceipts;


 }


 public setPallet(data: any){


    this.data = data;

 }


 public getPallet(){

    return this.data;
 }


 public get(){

    return this.wareReceipts;
 }


 public setBoolean(data:Boolean){



    this.boolean = data;

   }


 public getBoolean(){

    return this.boolean;
 }  


 public setLPS(lps:any){


    this.lps = lps;

 }


 public setBin(bin:any){

    this.data = bin;

 }

 public getBin(){

    return this.data;
 }
 
 public getLPS(){


   return this.lps; 

 }


 public setPutAway(data:any){


    this.dataWP = data;

    
}

 public getPutAway(){


    return this.dataWP;

 }

 public setAway(data: any){

    this.data = data;
 }

 public getAway(){

    return this.data;
 }


public async GetItemInfo(ItemNo:any){

    try {
        let obj: any = [{
            ItemNo
        }]; 
        
        let p = await this.syncErp.processRequestParams('GetItemInfo', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }

}

 public async GetLicencesPlate(No: string){


    try {
        let obj: any = [{
            No
        }]; 
        
        let p = await this.syncErp.processRequestParams('GetLicencesPlate', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
    } catch (error) {
        throw error;
    }

 }

    public async getReceiptByNo(no: string): Promise<any> {
        try {
            let obj: any = [{
                No: no
            }];
            
            let p = await this.syncErp.processRequestParams('GetWarehouseReceiptV3', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }
    }

    public async GetDefaultBin1(){
        try {
            let obj: any = [];
            let p = await this.syncErp.processRequestParams('GetDefaultBin', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }
    }

    public async Update_WsheReceiveLine(list:any){

        try {
            let p = await this.syncErp.processRequestParams('Update_WsheReceiveLine', list);
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

    public async getUnitOfMeasure(id: string) {
        try {
            let obj: any = [{

                ItemNo : id
            }];
            let p = await this.syncErp.processRequestParams('GetUnitOfMeasure', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
        } catch (error) {
            throw error;
        }
    }

    public async CreateLP_FromWarehouseReceiptLine(obj: any) {
        try {
            let p = await this.syncErp.processRequestParams('CreateLP_FromWarehouseReceiptLine', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
           
        } catch (error) {
            throw error;
        }
    }

    public async CreateLP_FromWarehouseReceiptLine_With_SNLOT(obj:any){

        console.log(JSON.stringify(obj));

        try {
            let p = await this.syncErp.processRequestParams('CreateLP_FromWarehouseReceiptLine_With_SNLOT', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
           
        } catch (error) {
            throw error;
        }

    }

    public async Post_WarehouseReceipts(No:any){

       
        

        try {

            let obj: any = [{

                No
            }];

            let p = await this.syncErp.processRequestParams('Post_WarehouseReceipts', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
           
        } catch (error) {
            throw error;
        }
        

    }


    public async Post_WarehousePutAways(No:any){


        try {

            let obj: any = [{

                No
            }];

            let p = await this.syncErp.processRequestParams('Post_WarehousePutAways', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
           
        } catch (error) {
            throw error;
        }

    }



    public async GetWarehousePutAway(No:any){


        

        try {

            let obj: any = [{

                No
            }];

            let p = await this.syncErp.processRequestParams('GetWarehousePutAway', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
           
        } catch (error) {
            throw error;
        }


    }


    public async getLpNo(No:any){


        try {

            let obj: any = [{

                No,

         
            }];

            let p = await this.syncErp.processRequestParams('GetLicencesPlate', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
           
        } catch (error) {
            throw error;
        }

        
    }


    public async CreateLPPallet_FromWarehouseReceiptLine(data:any){


        try {

            let obj: any = [{

                No: data.No,
                ZoneCode: data.ZoneCode,
                LocationCode: data.LocationCode,
                BinCode: data.BinCode
            }];

            let p = await this.syncErp.processRequestParams('CreateLPPallet_FromWarehouseReceiptLine', obj);
            let rsl = await this.syncErp.setRequest(p);
            return rsl;
           
        } catch (error) {
            throw error;
        }

    }


   public async  Assign_LPChild_to_LP_Pallet_From_WR(WarehouseReceipt_No:any,LP_Pallet_No:any, listLP:any){


    
    try {

        let obj: any = [{

            WarehouseReceipt_No,
            LP_Pallet_No,
            LPChild: listLP
        }];

        console.log( JSON.stringify(obj));

        
        let p = await this.syncErp.processRequestParams('Assign_LPChild_to_LP_Pallet_From_WR', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


   }


   public async Assign_ItemChild_to_LP_Pallet_From_WR( LP_Pallet_No:any, WarehouseReceipt_No:any, listItem:any){

    

        
    try {

        let obj: any = [{

     WarehouseReceipt_No: WarehouseReceipt_No ,
      LP_Pallet_No,
      ItemChild: listItem

        }];

        console.log( JSON.stringify(obj));

      

        
        let p = await this.syncErp.processRequestParams('Assign_ItemChild_to_LP_Pallet_From_WR', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


   }


   public async GetPossiblesBinFromWR(No:any){


    try {

        let obj: any = [{

            No
        }];

        console.log(obj);

        
        let p = await this.syncErp.processRequestParams('GetPossiblesBinFromPutAway', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


   }


   public async  GetItem(ItemNo:any){


    

    try {

        let obj: any = [{

            ItemNo
        }];

        console.log(obj);

        
        let p = await this.syncErp.processRequestParams('GetItem', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }
   }


   

   public async Calcule_Possible_LPChilds_From_WR_V3(LP_Pallet_No:any){


    
    try {

        let obj: any = [{

            LP_Pallet_No
            
        }];



        
        let p = await this.syncErp.processRequestParams('Calcule_Possible_LPChilds_From_WR_V3', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }



   public async Calcule_Possible_LPChilds_From_WR_V2(LP_Pallet_No:any){


    
    try {

        let obj: any = [{

            LP_Pallet_No
            
        }];



        
        let p = await this.syncErp.processRequestParams('Calcule_Possible_LPChilds_From_WR_V2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }

   


   

   public async Calcule_Possible_ItemChilds_From_WR(LP_Pallet_No:any){


    
    try {

        let obj: any = [{

            LP_Pallet_No
            
        }];


        


        
        let p = await this.syncErp.processRequestParams('Calcule_Possible_ItemChilds_From_WR', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }


   public async Delete_LPChild_to_LP_Pallet_From_WRV2(LP_Pallet_No:any, WarehouseReceipt_No:any, LP_Pallet_Child:any){


    try {

    
    let obj: any = [{

        LP_Pallet_No,
        WarehouseReceipt_No,
        LP_Pallet_Child
        
    }];

    console.log(JSON.stringify(obj));


    


    
    let p = await this.syncErp.processRequestParams('Delete_LPChild_to_LP_Pallet_From_WRV2', obj);
    let rsl = await this.syncErp.setRequest(p);
    return rsl;
   
} catch (error) {
    throw error;
}



   }

   public async Assign_ItemChild_to_LP_Pallet_From_WR_With_SNLOT_V2(WarhouseReceiptNo:any,LP_Pallet_No:any,BinCode:any,Item_Child:any){

    try {

    
        let obj: any = [{
    

            WarhouseReceiptNo, 
            LP_Pallet_No, 
            BinCode,
            Item_Child

        }];
    
        console.log(JSON.stringify(obj));

        
        let p = await this.syncErp.processRequestParams('Assign_ItemChild_to_LP_Pallet_From_WR_With_SNLOT_V2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }

   public async DeleteLPSingle_FromWarehouseReceiptLine(No:any){
    try {

    
        let obj: any = [{
    
           No
            
        }];
    
        console.log(JSON.stringify(obj));
    
    
        
    
    
        
        let p = await this.syncErp.processRequestParams('DeleteLPSingle_FromWarehouseReceiptLine', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


   }


   public async Delete_ItemChild_to_LP_Pallet_From_WR2(LP_Pallet_No:any,  WarehouseReceipt_No:any,Item_Child:any ){


    
    try {

    
        let obj: any = [{
    
            LP_Pallet_No,

            WarehouseReceipt_No,

            Item_Child,
            
        }];

        console.log(JSON.stringify(obj));
    
    
        
        let p = await this.syncErp.processRequestParams('Delete_ItemChild_to_LP_Pallet_From_WR2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


   }


   public async Update_Wsheput_Lines_V1(WarehousePutAwayLines:any){


    
    
    try {

    
        let obj: any = [{
    
            WarehousePutAwayLines
            
        }];

        console.log(JSON.stringify(obj));
    
    
        
        let p = await this.syncErp.processRequestParams('Update_Wsheput_Lines_V1', obj);
        let rsl = await this.syncErp.setRequest(p);
       return rsl;
       
    } catch (error) {
        throw error;
    }



   }



public async GetPossiblesBinFromPutAway(No:any){

    try {

      let obj: any = [{
    
            No
       }];

        console.log(JSON.stringify(obj));
        
        let p = await this.syncErp.processRequestParams('GetPossiblesBinFromPutAway', obj);
        let rsl = await this.syncErp.setRequest(p);
       return rsl;
       
    } catch (error) {
        throw error;
    }

   }


public async Update_Wsheput_Lines_V2(list:any){

        
    try {

    
        let obj: any = [{
    
            WarehousePutAwayLines:list
            
        }];

        console.log(JSON.stringify(obj));
    
    
        
        let p = await this.syncErp.processRequestParams('Update_Wsheput_Lines_V2', obj);
        let rsl = await this.syncErp.setRequest(p);
       return rsl;
       
    } catch (error) {
        throw error;
    }



   }



public async DeleteLPPallet_FromWarehouseReceiptLine(No:any){


    
    try {

    
        let obj: any = [{
    
          No
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Delete_LPPallet_FromWarehouseReceiptLine', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


}




public async Prepare_WarehousePutAway(No:any){


    try {

    
        let obj: any = [{
    
          No
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Prepare_WarehousePutAway', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}


public async GenerateEmptyLP(ZoneCode:any, LocationCode:any, BinCode:any,LPType:any){


    
    try {

    
        let obj: any = [{
    
            LPType,
            ZoneCode,
            LocationCode,
            BinCode

        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('GenerateEmptyLP', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


}


public async Get_LPLedgerEntries(No:any){

    try {

    
        let obj: any = [{
    
          No
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Get_LPLedgerEntries', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }
}


public async SplitLPSingle_Item(objS:any){


    try {

    
        let obj: any = [objS];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('SplitLPSingle_Item', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}


public async SplitPallet_LPSingleV2(list:any){

    
    try {

    
        let obj: any = [list];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('SplitPallet_LPSingleV2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}


public async SplitPallet_ItemV2(list:any){

     
    try {

    
        let obj: any = [list];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('SplitPallet_ItemV2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}

public async MergeLPSingle(LicensePlatesHeadersAddedCode:any,LicensePlatesHeadersBaseCode:any){


    try {

    
        let obj: any = [{
    
            LicensePlatesHeadersAddedCode,
            LicensePlatesHeadersBaseCode

        
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('MergeLPSingle', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}


public async SplitPallet_LPSingle(objP:any){


    
    try {

    
      /*  let obj: any = [  {
            OldLPPalletCode: objP.OldLPPalletCode,
            NewLPPalletCode: objP.NewLPPalletCode,
            LPChildSingleCode: objP.LPChildSingleCode
          }];

          */

          let obj: any = objP;
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('SplitPallet_LPSingle', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}

public async SplitPallet_Item(objP:any){

    
    
    try {

    
        let obj: any = [{

            NewLicensePlateCode: objP.NewLicensePlateCode,
            NewQuantity: objP.NewQuantity,
            OriginalQuantityModified: objP.OriginalQuantityModified,
            OriginalLicensePlateCode: objP.OriginalLicensePlateCode,
            ItemCode: objP.ItemCode
          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('SplitPallet_Item', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}


public async configurationTraking(Code:any){

    try {

    
        let obj: any = [{

            Code
          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('GetItemTracking', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}

public async WarehouseItemJournal_LP(LPNo:any,Zone:any,Bin:any,LocationCode:any,ItemNo:any,Qty:any,UnitofMeasureCode:any){


    try {

    
        let obj: any = [{

            LPNo,
            Zone,
            Bin,
            LocationCode,
            ItemNo,
            Qty,
            UnitofMeasureCode
          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('WarehouseItemJournal_LP', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


}


   public async CalculateWhseAdjustment(ItemNo:any,PostingDate:any){

    
    try {

    
        let obj: any = [{

            ItemNo,
            PostingDate
          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('CalculateWhseAdjustment', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }


   public async MoveBinToBinArray_LP(list:any){

    try {

    
        let obj: any = [{

            ArrayToMove: list
           
          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('MoveBinToBinArray_LP', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }



   public async GetBinByLocation(Location:any){

    
    try {

    
        let obj: any = [{

            Location

          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('GetBinByLocation', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


   }


public async Create_WarehouseInvPhysicalCount(ZoneCode:any,BinCode:any,LocationCode:any,RegisteringDate:any,
    WhseDocumentNo:any, JournalTemplateName:any, JournalBatchName:any){

    
    try {
  
        let obj: any = [{

            ZoneCode,
            BinCode,
            LocationCode,
            RegisteringDate,
            WhseDocumentNo,
            JournalTemplateName,
            JournalBatchName


          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Create_WarehouseInvPhysicalCount', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


   }




public async Get_WarehouseInvPhysicalCount(LocationCode:string,JournalTemplateName:string,JournalBatchName:string){
    
    try {
  
        let obj: any = [{

            LocationCode,
            JournalTemplateName,
            JournalBatchName
           
          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Get_WarehouseInvPhysicalCount', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }

   public async Write_WarehouseInvPhysicalCount(list:any){

    
    
    try {

    
        let obj: any = [{
            Warehouse_Physical_Inventory_Journal: list


          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Write_WarehouseInvPhysicalCount', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }
   }


   public async Delete_WarehouseInvPhysicalCount(list:any){

       
    try {

    
        let obj: any = [{
            Delete_WarehouseInvPhysicalCount: list
    
    
          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Delete_WarehouseInvPhysicalCount', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }
   
   }


   public async Register_WarehouseInvPhysicalCount(LocationCode:any, JournalTemplateName:any,JournalBatchName:any){


 
    try {

    
        let obj: any = [{
          JournalTemplateName,
           JournalBatchName,
            LocationCode


          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Register_WarehouseInvPhysicalCount', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }


   public async PreRegister_WarehouseInvPhysicalCount(LocationCode:any,JournalTemplateName:any,JournalBatchName:any){


    
    try {

    
        let obj: any = [{
            JournalTemplateName,
            JournalBatchName,
            LocationCode


          }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('PreRegister_WarehouseInvPhysicalCount', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }
   }




    
   public async GetItemTrackingSpecificationV2(ItemNo:any,SourceNo:any,SourceRefNo:any){

    try {

    
        let obj: any = [{

            ItemNo,
            SourceNo,
            SourceRefNo
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('GetItemTrackingSpecificationV2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }

   
 

   
   
   public async GetItemIdentifier(Code:any,){

    try {

    
        let obj: any = [{

            Code
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('GetItemIdentifier', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }

   public async SplitPutAwayLine(list:any){

        
    try {

    
        let obj: any = [list];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('SplitPutAwayLine', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }

   public async GetPlureSetup(){

    try {

    
        let obj: any = [ ];
        
        let p = await this.syncErp.processRequestParams('GetPlureSetup', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }
   }




   public async UpdateItemTrackingSpecificationOpenV2(item:any, TrackingInfo:any,QtyToReceive:any){

         
    try {

    
        let obj: any = [{

            WarhouseReceiptNo: item.No,
            ItemNo: item.ItemNo,
            QtyToReceive,
            UnitofMeasureCode: item.UnitofMeasureCode,
            SourceNo: item.SourceNo,
            SourceRefNo: item.SourceLineNo,
            LineNo:item.LineNo,
            TrackingInfo
              
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('UpdateItemTrackingSpecificationOpenV2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

   }
  

   public async listCode(list:any):Promise<any>{

    let obj = {};
    
    obj['lines'] = await this.fields(list.ItemTracking.fields);

    return obj;
       

    }


public async DeleteItemTrackingSpecificationOpenV2(item:any,TrackingInfo:any){

        
         
    try {

    
      
        let obj: any = [{

            WarhouseReceiptNo: item.No,
            ItemNo: item.ItemNo,
            SourceNo: item.SourceNo,
            SourceRefNo: item.SourceLineNo,
            TrackingInfo
              
        }];
    
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('DeleteItemTrackingSpecificationOpenV2', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

    }


public async Get_WarehouseJournalTemplate(num:number){

        
    try {

    
        let obj: any = [{

            Type: num
          

        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Get_WarehouseJournalTemplate', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }

}


public async Get_WarehouseJournalBatch(JournalTemplateName:string,UserID:string){

       
    try {

    
        let obj: any = [{

            JournalTemplateName,
            UserID
        
        }];
    

        console.log(JSON.stringify(obj));
    
        
        let p = await this.syncErp.processRequestParams('Get_WarehouseJournalBatch', obj);
        let rsl = await this.syncErp.setRequest(p);
        return rsl;
       
    } catch (error) {
        throw error;
    }


}


    public async listSetup(list):Promise<any>{

     let obj = {}

    obj = await this.fields(list.fields);
    return obj;
}
    public async listTraking(list):Promise<any>{

        let obj = {}

        let array = [];

        for (const key in list) {
          
        obj = await this.fields(list[key].fields);


        array.push(obj);

        obj = {};

    }

    return array;
}


public async listPalletVoid(list):Promise<any>{

    let obj = {}

    let array = [];

    for (const key in list) {
      
    obj = await this.fields(list[key].LicensePlatesHeaders.fields);

    array.push(obj);

    obj = {};

}

return array;
}

    private async fields(fields:any): Promise<any>{


        let obj = {};
        for (let i in fields) {
          obj[fields[i].name] = fields[i].value
          
        }
    
        return obj;
    }

   

 
   public async listPI(lists:any){


    
    let list: any[] = [];

    let obj= {

       company: "",
       fieldCount: 0,
       fields: { 
        JournalTemplateName: "",
        JournalBatchName: "",
        LineNo: 0,
        RegisteringDate: '',
        LocationCode: '',
        FromZoneCode: '',
        FromBinCode: '',
        Description:'',
        ItemNo: '',
        Quantity:null,
        ZoneCode: '',
        BinCode: '',
        SourceType:null,
        SourceSubtype: '',
        SourceNo: null,
        SourceLineNo: null,
        SourceSublineNo:null,
        SourceDocument: '',
        SourceCode: '',
        ToZoneCode: '',
        ToBinCode: '',
        ReasonCode: null,
        RegisteringNoSeries: null,
        FromBinTypeCode: '',
        Cubage: null,
        Weight: null,
        WhseDocumentNo: '',
        WhseDocumentType: '',
        WhseDocumentLineNo: null,
        QtyCalculated: 0,
        QtyPhysInventory: 0,
        QtyBase: null,
        QtyAbsolute: null,
        QtyAbsoluteBase: null,
        VariantCode: null,
        QtyperUnitofMeasure: 0,
        UnitofMeasureCode: '',
        QtyRoundingPrecision: 0,
        QtyRoundingPrecisionBase: 0,
        SerialNo: null,
        LotNo: null,
        WarrantyDate: null,
        ExpirationDate: null,
        NewSerialNo: null,
        NewLotNo: null,
        NewExpirationDate: null,
        PackageNo: null,
        NewPackageNo: null,
        PhysInvtCountingPeriodCode: null,
        PhysInvtCountingPeriodType: '',
        PLULicensePlates: '',
        PLULPPallets: null,
       $systemId: '',
       SystemCreatedAt: '',
       SystemCreatedBy: '',
       SystemModifiedAt: '',
       SystemModifiedBy: ''
},
       id: 0,
       name: "",
       position: "",
       recordId: ""


    }

    for (const i in lists.Warehouse_Physical_Inventory_Journal) {


        obj.company = lists.Warehouse_Physical_Inventory_Journal[i].company;
        obj.fieldCount = lists.Warehouse_Physical_Inventory_Journal[i].fieldCount;
        obj.id = lists.Warehouse_Physical_Inventory_Journal[i].id;
        obj.name = lists.Warehouse_Physical_Inventory_Journal[i].name;
        obj.position = lists.Warehouse_Physical_Inventory_Journal[i].position;
        obj.recordId = lists.Warehouse_Physical_Inventory_Journal[i].recordId;


        for (const j in lists.Warehouse_Physical_Inventory_Journal[i].fields) {


            obj.fields[lists.Warehouse_Physical_Inventory_Journal[i].fields[j].name] = lists.Warehouse_Physical_Inventory_Journal[i].fields[j].value;
         

            switch(lists.Warehouse_Physical_Inventory_Journal[i].fields[j].name){

                case 'Qty(Calculated)':
                    obj.fields.QtyCalculated = lists.Warehouse_Physical_Inventory_Journal[i].fields[j].value;
                    break;
                case 'Qty(PhysInventory)':
                    obj.fields.QtyPhysInventory = lists.Warehouse_Physical_Inventory_Journal[i].fields[j].value;
                    break;
                
                case 'Qty(Base)':
                    obj.fields.QtyBase = lists.Warehouse_Physical_Inventory_Journal[i].fields[j].value;
                    break;

                case 'Qty(Absolute)':
                    obj.fields.QtyAbsolute = lists.Warehouse_Physical_Inventory_Journal[i].fields[j].value;
                    break;

                case 'Qty(Absolute,Base)':
                    obj.fields.QtyAbsoluteBase = lists.Warehouse_Physical_Inventory_Journal[i].fields[j].value;
                    break;

                case 'QtyRoundingPrecision(Base)':
                    obj.fields.QtyRoundingPrecisionBase = lists.Warehouse_Physical_Inventory_Journal[i].fields[j].value;
                    break;

           }
            
        }

        list.push(obj);


        obj= {

            company: "",
            fieldCount: 0,
            fields: { 
             JournalTemplateName: "",
             JournalBatchName: "",
             LineNo: 0,
             RegisteringDate: '',
             LocationCode: '',
             FromZoneCode: '',
             FromBinCode: '',
             Description:'',
             ItemNo: '',
             Quantity:null,
             ZoneCode: '',
             BinCode: '',
             SourceType:null,
             SourceSubtype: '',
             SourceNo: null,
             SourceLineNo: null,
             SourceSublineNo:null,
             SourceDocument: '',
             SourceCode: '',
             ToZoneCode: '',
             ToBinCode: '',
             ReasonCode: null,
             RegisteringNoSeries: null,
             FromBinTypeCode: '',
             Cubage: null,
             Weight: null,
             WhseDocumentNo: '',
             WhseDocumentType: '',
             WhseDocumentLineNo: null,
             QtyCalculated: 0,
             QtyPhysInventory: 0,
             QtyBase: null,
             QtyAbsolute: null,
             QtyAbsoluteBase: null,
             VariantCode: null,
             QtyperUnitofMeasure: 0,
             UnitofMeasureCode: '',
             QtyRoundingPrecision: 0,
             QtyRoundingPrecisionBase: 0,
             SerialNo: null,
             LotNo: null,
             WarrantyDate: null,
             ExpirationDate: null,
             NewSerialNo: null,
             NewLotNo: null,
             NewExpirationDate: null,
             PackageNo: null,
             NewPackageNo: null,
             PhysInvtCountingPeriodCode: null,
             PhysInvtCountingPeriodType: '',
             PLULicensePlates: '',
             PLULPPallets: null,
            $systemId: '',
            SystemCreatedAt: '',
            SystemCreatedBy: '',
            SystemModifiedAt: '',
            SystemModifiedBy: ''
     },
            id: 0,
            name: "",
            position: "",
            recordId: ""
     
     
         }

   }

    return list;

   }

   
   public async listPIC(lists:any){


    
    let list: any[] = [];

    let obj= {

       company: "",
       fieldCount: 0,
       fields: { 
        JournalTemplateName: "",
        JournalBatchName: "",
        LineNo: 0,
        RegisteringDate: '',
        LocationCode: '',
        FromZoneCode: '',
        FromBinCode: '',
        Description:'',
        ItemNo: '',
        Quantity:null,
        ZoneCode: '',
        BinCode: '',
        SourceType:null,
        SourceSubtype: '',
        SourceNo: null,
        SourceLineNo: null,
        SourceSublineNo:null,
        SourceDocument: '',
        SourceCode: '',
        ToZoneCode: '',
        ToBinCode: '',
        ReasonCode: null,
        RegisteringNoSeries: null,
        FromBinTypeCode: '',
        Cubage: null,
        Weight: null,
        WhseDocumentNo: '',
        WhseDocumentType: '',
        WhseDocumentLineNo: null,
        QtyCalculated: 0,
        QtyPhysInventory: 0,
        QtyBase: null,
        QtyAbsolute: null,
        QtyAbsoluteBase: null,
        VariantCode: null,
        QtyperUnitofMeasure: 0,
        UnitofMeasureCode: '',
        QtyRoundingPrecision: 0,
        QtyRoundingPrecisionBase: 0,
        SerialNo: null,
        LotNo: null,
        WarrantyDate: null,
        ExpirationDate: null,
        NewSerialNo: null,
        NewLotNo: null,
        NewExpirationDate: null,
        PackageNo: null,
        NewPackageNo: null,
        PhysInvtCountingPeriodCode: null,
        PhysInvtCountingPeriodType: '',
        PLULicensePlates: '',
        PLULPPallets: null,
       $systemId: '',
       SystemCreatedAt: '',
       SystemCreatedBy: '',
       SystemModifiedAt: '',
       SystemModifiedBy: ''
},
       id: 0,
       name: "",
       position: "",
       recordId: ""


    }

    for (const i in lists.Warehouse_Physical_Inventory_Counted) {


        obj.company = lists.Warehouse_Physical_Inventory_Counted[i].company;
        obj.fieldCount = lists.Warehouse_Physical_Inventory_Counted[i].fieldCount;
        obj.id = lists.Warehouse_Physical_Inventory_Counted[i].id;
        obj.name = lists.Warehouse_Physical_Inventory_Counted[i].name;
        obj.position = lists.Warehouse_Physical_Inventory_Counted[i].position;
        obj.recordId = lists.Warehouse_Physical_Inventory_Counted[i].recordId;


        for (const j in lists.Warehouse_Physical_Inventory_Counted[i].fields) {


            obj.fields[lists.Warehouse_Physical_Inventory_Counted[i].fields[j].name] = lists.Warehouse_Physical_Inventory_Counted[i].fields[j].value;
         

            switch(lists.Warehouse_Physical_Inventory_Counted[i].fields[j].name){

                case 'Qty(Calculated)':
                    obj.fields.QtyCalculated = lists.Warehouse_Physical_Inventory_Counted[i].fields[j].value;
                    break;
                case 'Qty(PhysInventory)':
                    obj.fields.QtyPhysInventory = lists.Warehouse_Physical_Inventory_Counted[i].fields[j].value;
                    break;
                
                case 'Qty(Base)':
                    obj.fields.QtyBase = lists.Warehouse_Physical_Inventory_Counted[i].fields[j].value;
                    break;

                case 'Qty(Absolute)':
                    obj.fields.QtyAbsolute = lists.Warehouse_Physical_Inventory_Counted[i].fields[j].value;
                    break;

                case 'Qty(Absolute,Base)':
                    obj.fields.QtyAbsoluteBase = lists.Warehouse_Physical_Inventory_Counted[i].fields[j].value;
                    break;

                case 'QtyRoundingPrecision(Base)':
                    obj.fields.QtyRoundingPrecisionBase = lists.Warehouse_Physical_Inventory_Counted[i].fields[j].value;
                    break;

           }
            
        }

        list.push(obj);


        obj= {

            company: "",
            fieldCount: 0,
            fields: { 
             JournalTemplateName: "",
             JournalBatchName: "",
             LineNo: 0,
             RegisteringDate: '',
             LocationCode: '',
             FromZoneCode: '',
             FromBinCode: '',
             Description:'',
             ItemNo: '',
             Quantity:null,
             ZoneCode: '',
             BinCode: '',
             SourceType:null,
             SourceSubtype: '',
             SourceNo: null,
             SourceLineNo: null,
             SourceSublineNo:null,
             SourceDocument: '',
             SourceCode: '',
             ToZoneCode: '',
             ToBinCode: '',
             ReasonCode: null,
             RegisteringNoSeries: null,
             FromBinTypeCode: '',
             Cubage: null,
             Weight: null,
             WhseDocumentNo: '',
             WhseDocumentType: '',
             WhseDocumentLineNo: null,
             QtyCalculated: 0,
             QtyPhysInventory: 0,
             QtyBase: null,
             QtyAbsolute: null,
             QtyAbsoluteBase: null,
             VariantCode: null,
             QtyperUnitofMeasure: 0,
             UnitofMeasureCode: '',
             QtyRoundingPrecision: 0,
             QtyRoundingPrecisionBase: 0,
             SerialNo: null,
             LotNo: null,
             WarrantyDate: null,
             ExpirationDate: null,
             NewSerialNo: null,
             NewLotNo: null,
             NewExpirationDate: null,
             PackageNo: null,
             NewPackageNo: null,
             PhysInvtCountingPeriodCode: null,
             PhysInvtCountingPeriodType: '',
             PLULicensePlates: '',
             PLULPPallets: null,
            $systemId: '',
            SystemCreatedAt: '',
            SystemCreatedBy: '',
            SystemModifiedAt: '',
            SystemModifiedBy: ''
     },
            id: 0,
            name: "",
            position: "",
            recordId: ""
     
     
         }

   }

    return list;

   }

   public async listPINC(lists:any){


    
    let list: any[] = [];

    let obj= {

       company: "",
       fieldCount: 0,
       fields: { 
        JournalTemplateName: "",
        JournalBatchName: "",
        LineNo: 0,
        RegisteringDate: '',
        LocationCode: '',
        FromZoneCode: '',
        FromBinCode: '',
        Description:'',
        ItemNo: '',
        Quantity:null,
        ZoneCode: '',
        BinCode: '',
        SourceType:null,
        SourceSubtype: '',
        SourceNo: null,
        SourceLineNo: null,
        SourceSublineNo:null,
        SourceDocument: '',
        SourceCode: '',
        ToZoneCode: '',
        ToBinCode: '',
        ReasonCode: null,
        RegisteringNoSeries: null,
        FromBinTypeCode: '',
        Cubage: null,
        Weight: null,
        WhseDocumentNo: '',
        WhseDocumentType: '',
        WhseDocumentLineNo: null,
        QtyCalculated: 0,
        QtyPhysInventory: 0,
        QtyBase: null,
        QtyAbsolute: null,
        QtyAbsoluteBase: null,
        VariantCode: null,
        QtyperUnitofMeasure: 0,
        UnitofMeasureCode: '',
        QtyRoundingPrecision: 0,
        QtyRoundingPrecisionBase: 0,
        SerialNo: null,
        LotNo: null,
        WarrantyDate: null,
        ExpirationDate: null,
        NewSerialNo: null,
        NewLotNo: null,
        NewExpirationDate: null,
        PackageNo: null,
        NewPackageNo: null,
        PhysInvtCountingPeriodCode: null,
        PhysInvtCountingPeriodType: '',
        PLULicensePlates: '',
        PLULPPallets: null,
       $systemId: '',
       SystemCreatedAt: '',
       SystemCreatedBy: '',
       SystemModifiedAt: '',
       SystemModifiedBy: ''
},
       id: 0,
       name: "",
       position: "",
       recordId: ""


    }

    for (const i in lists.Warehouse_Physical_Inventory_NoCounted) {


        obj.company = lists.Warehouse_Physical_Inventory_NoCounted[i].company;
        obj.fieldCount = lists.Warehouse_Physical_Inventory_NoCounted[i].fieldCount;
        obj.id = lists.Warehouse_Physical_Inventory_NoCounted[i].id;
        obj.name = lists.Warehouse_Physical_Inventory_NoCounted[i].name;
        obj.position = lists.Warehouse_Physical_Inventory_NoCounted[i].position;
        obj.recordId = lists.Warehouse_Physical_Inventory_NoCounted[i].recordId;


        for (const j in lists.Warehouse_Physical_Inventory_NoCounted[i].fields) {


            obj.fields[lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].name] = lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].value;
         

            switch(lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].name){

                case 'Qty(Calculated)':
                    obj.fields.QtyCalculated = lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].value;
                    break;
                case 'Qty(PhysInventory)':
                    obj.fields.QtyPhysInventory = lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].value;
                    break;
                
                case 'Qty(Base)':
                    obj.fields.QtyBase = lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].value;
                    break;

                case 'Qty(Absolute)':
                    obj.fields.QtyAbsolute = lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].value;
                    break;

                case 'Qty(Absolute,Base)':
                    obj.fields.QtyAbsoluteBase = lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].value;
                    break;

                case 'QtyRoundingPrecision(Base)':
                    obj.fields.QtyRoundingPrecisionBase = lists.Warehouse_Physical_Inventory_NoCounted[i].fields[j].value;
                    break;

           }
            
        }

        list.push(obj);


        obj= {

            company: "",
            fieldCount: 0,
            fields: { 
             JournalTemplateName: "",
             JournalBatchName: "",
             LineNo: 0,
             RegisteringDate: '',
             LocationCode: '',
             FromZoneCode: '',
             FromBinCode: '',
             Description:'',
             ItemNo: '',
             Quantity:null,
             ZoneCode: '',
             BinCode: '',
             SourceType:null,
             SourceSubtype: '',
             SourceNo: null,
             SourceLineNo: null,
             SourceSublineNo:null,
             SourceDocument: '',
             SourceCode: '',
             ToZoneCode: '',
             ToBinCode: '',
             ReasonCode: null,
             RegisteringNoSeries: null,
             FromBinTypeCode: '',
             Cubage: null,
             Weight: null,
             WhseDocumentNo: '',
             WhseDocumentType: '',
             WhseDocumentLineNo: null,
             QtyCalculated: 0,
             QtyPhysInventory: 0,
             QtyBase: null,
             QtyAbsolute: null,
             QtyAbsoluteBase: null,
             VariantCode: null,
             QtyperUnitofMeasure: 0,
             UnitofMeasureCode: '',
             QtyRoundingPrecision: 0,
             QtyRoundingPrecisionBase: 0,
             SerialNo: null,
             LotNo: null,
             WarrantyDate: null,
             ExpirationDate: null,
             NewSerialNo: null,
             NewLotNo: null,
             NewExpirationDate: null,
             PackageNo: null,
             NewPackageNo: null,
             PhysInvtCountingPeriodCode: null,
             PhysInvtCountingPeriodType: '',
             PLULicensePlates: '',
             PLULPPallets: null,
            $systemId: '',
            SystemCreatedAt: '',
            SystemCreatedBy: '',
            SystemModifiedAt: '',
            SystemModifiedBy: ''
     },
            id: 0,
            name: "",
            position: "",
            recordId: ""
     
     
         }

   }

    return list;

   }


   


    public async createListLP(listLp: any){

       // console.log(listLp);

        let list = []

      for(let i in   listLp.LicensePlates.LPLines){


      //  for (const y in listLp.LicensePlates.LPLines[i].fields) {

         list[i] = listLp.LicensePlates.LPLines[i]

        //  this.contador++;

       // list.push(listLp.LicensePlates.LPLines[i].fields[y]);
        
      //  }

      //  this.contador++;
      }

     return list;



    }



    public async createListLPS(listLp: any){

        // console.log(listLp);
 
         let list = []
 
       for(let i in   listLp.LicensePlates.LPLines){
 
 
       //  for (const y in listLp.LicensePlates.LPLines[i].fields) {
 
          list[i] = listLp.LicensePlates.LPLines[i]
 
         //  this.contador++;
 
        // list.push(listLp.LicensePlates.LPLines[i].fields[y]);
         
       //  }
 
       //  this.contador++;
       }
 
      return list;
 
 
 
     }



     public async listsPutAways(putAway:any){



        
        let list: any[] = [];

         let obj= {

            company: "",
            fieldCount: 0,
            fields: {  Type: "",
            No: 0,
            LocationCode: "",
            AssignedUserID: null,
            AssignmentDate: null,
            AssignmentTime: null,
            SortingMethod: '',
            NoSeries: '',
            Comment: false,
            NoPrinted: null,
            NoofLines: null,
            PostingDate: null,
            RegisteringNo: null,
            LastRegisteringNo: null,
            RegisteringNoSeries: '',
            DateofLastPrinting: null,
            TimeofLastPrinting: null,
            BreakbulkFilter: false,
            SourceNo: null,
            SourceDocument: "",
            SourceType: "",
            SourceSubtype: "",
            DestinationType: "",
            DestinationNo: null,
            ExternalDocumentNo: null,
            ExpectedReceiptDate: null,
            ShipmentDate: null,
            ExternalDocumentNo2: null,
            $systemId: '',
            SystemCreatedAt: '',
            SystemCreatedBy: '',
            SystemModifiedAt: '',
            SystemModifiedBy: ''
},
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }


         for (const i  in putAway.WarehousePutAways) {


            obj.company = putAway.WarehousePutAways[i].company;
            obj.fieldCount = putAway.WarehousePutAways[i].fieldCount;
            obj.id = putAway.WarehousePutAways[i].id;
            obj.name = putAway.WarehousePutAways[i].name;
            obj.position = putAway.WarehousePutAways[i].position;
            obj.recordId = putAway.WarehousePutAways[i].recordId;
     
            

            for (const y in putAway.WarehousePutAways[i].fields) {


                
         obj.fields[putAway.WarehousePutAways[i].fields[y].name] =  putAway.WarehousePutAways[i].fields[y].value;

              
            }

          list.push(obj);


          obj= {

            company: "",
            fieldCount: 0,
            fields: {  Type: "",
            No: 0,
            LocationCode: "",
            AssignedUserID: null,
            AssignmentDate: null,
            AssignmentTime: null,
            SortingMethod: '',
            NoSeries: '',
            Comment: false,
            NoPrinted: null,
            NoofLines: null,
            PostingDate: null,
            RegisteringNo: null,
            LastRegisteringNo: null,
            RegisteringNoSeries: '',
            DateofLastPrinting: null,
            TimeofLastPrinting: null,
            BreakbulkFilter: false,
            SourceNo: null,
            SourceDocument: "",
            SourceType: "",
            SourceSubtype: "",
            DestinationType: "",
            DestinationNo: null,
            ExternalDocumentNo: null,
            ExpectedReceiptDate: null,
            ShipmentDate: null,
            ExternalDocumentNo2: null,
            $systemId: '',
            SystemCreatedAt: '',
            SystemCreatedBy: '',
            SystemModifiedAt: '',
            SystemModifiedBy: ''
},
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }

           
         }




         return list;

     }



     public async ListLp(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];

         let obj= {

            image: "",
            company: "",
            fieldCount: 0,
            fields: {  PLULPDocumentNo: "",
            PLULineNo: 0,
            PLUDocumentType: "",
            PLULPDocumentType: "",
            PLUType: "",
            PLUNo: "",
            place: '',
            PLUVariantCode: null,
            PLUReferenceDocument: "",
            PLUQuantity: 0,
            PLUQtyperUnitofMeasure: 0,
            PLUQuantityBase: 0 ,
            PLUUnitofMeasureCode : "",
            PLUExpirationDate: null,
            PLUParentLPNo: null,
            PLUParentLPLineNo: null,
            PLUStatus: null,
            PLUSerialNo: null,
            PLUUnitofMeasure: null,
            PLULotNo: null,
            PLUDescription: "",
            PLULocationCode: "",
            PLUZoneCode: "",
            PLUBinCode: "",
            PLUEntryQuantity: null,
            PLUSourceDocument: "",
            PLUSourceDocumentNo: "",
            PLUDocument: "",
            PLUDocumentNo: "",
            PLULicensePlateStatus: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUWhseDocumentNo: "",
            PLUSourceLineNo: 0,
            PLUWhseLineNo: 0,
            $systemId: '',
            SystemCreatedAt: '',
            SystemCreatedBy: '',
            SystemModifiedAt: '',
            SystemModifiedBy: ''

},
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
      for(let i in   listLp.LicensePlates.LicensePlatesLines){
 
        obj.company = listLp.LicensePlates.LicensePlatesLines[i].company;
        obj.fieldCount = listLp.LicensePlates.LicensePlatesLines[i].fieldCount;
        obj.id = listLp.LicensePlates.LicensePlatesLines[i].id;
        obj.name = listLp.LicensePlates.LicensePlatesLines[i].name;
        obj.position = listLp.LicensePlates.LicensePlatesLines[i].position;
        obj.recordId = listLp.LicensePlates.LicensePlatesLines[i].recordId;
 
        
     for (const y in listLp.LicensePlates.LicensePlatesLines[i].fields) {
 


         obj.fields[listLp.LicensePlates.LicensePlatesLines[i].fields[y].name] =  listLp.LicensePlates.LicensePlatesLines[i].fields[y].value;

         


      }

      return obj;


      obj= {

        company: "",
        image: " ",
        fieldCount: 0,
        fields: {  PLULPDocumentNo: "",
        PLULineNo: 0,
        PLUDocumentType: "",
        place: '',
        PLULPDocumentType: "",
        PLUType: "",
        PLUNo: "",
        PLUVariantCode: null,
        PLUQuantity: 0,
        PLUQtyperUnitofMeasure: 0,
        PLUUnitofMeasure:null,
        PLUQuantityBase: 0 ,
        PLUUnitofMeasureCode : "",
        PLULocationCode: "",
        PLUZoneCode: "",
        PLUBinCode: "",
        PLUReferenceDocument: "",
        PLUExpirationDate: null,
        PLUParentLPNo: null,
        PLUParentLPLineNo: null,
        PLUStatus: null,
        PLUSerialNo: null,
        PLULotNo: null,
        PLUDescription: "",
        PLUEntryQuantity: null,
        PLUSourceDocument: "",
        PLUSourceDocumentNo: "",
        PLUDocument: "",
        PLUDocumentNo: "",
        PLULicensePlateStatus: "",
        PLUShipmentSrcDocument: "",
        PLUShipmentSrcDocumentNo: null,
        PLUSourceLineNo: 0,
        PLUWhseDocumentNo: "",
        PLUWhseLineNo: 0,
        $systemId: '',
        SystemCreatedAt: '',
        SystemCreatedBy: '',
        SystemModifiedAt: '',
        SystemModifiedBy: ''
},
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }

         }

   }



  


     
     public async ListPallet(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];



        let product = {  
       PLULPDocumentNo: "",
        PLULineNo: 0,
        PLULPDocumentType: "",
        PLUType: "",
        PLUNo: "",
        PLUVariantCode: null,
        PLUQuantity: 0,
        PLUQtyperUnitofMeasure: 0,
        PLUQuantityBase: 0 ,
        PLUUnitofMeasureCode : "",
        PLUExpirationDate: null,
        PLUParentLPNo: null,
        PLUParentLPLineNo: null,
        PLUStatus: null,
        PLUSerialNo: null,
        PLULotNo: null,
        PLUDescription: "",
        PLUEntryQuantity: null,
        PLUSourceDocument: "",
        PLUSourceDocumentNo: "",
        PLUDocument: "",
        PLUDocumentNo: "",
        PLULicensePlateStatus: "",
        PLUShipmentSrcDocument: "",
        PLUShipmentSrcDocumentNo: null,
        PLUSourceLineNo: 0,
        PLUWhseLineNo: 0
}

         let obj= {

            company: "",
            fieldCount: 0,
            fields: [],
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }

      for(let i in   listLp.LicensePlates.LPLines){
 
        obj.company = listLp.LicensePlates.LPLines[i].company;
        obj.fieldCount = listLp.LicensePlates.LPLines[i].fieldCount;
        obj.id = listLp.LicensePlates.LPLines[i].id;
        obj.name = listLp.LicensePlates.LPLines[i].name;
        obj.position = listLp.LicensePlates.LPLines[i].position;
        obj.recordId = listLp.LicensePlates.LPLines[i].recordId;
 
        
     for (const y in listLp.LicensePlates.LPLines[i].fields) {
 


         product[listLp.LicensePlates.LPLines[i].fields[y].name] =  listLp.LicensePlates.LPLines[i].fields[y].value;

       



            
         

         }




    

        obj.fields.push(product);

        list.push(obj);

     
      
      


     

     
     

    
     


      product = {  
        PLULPDocumentNo: "",
         PLULineNo: 0,
         PLULPDocumentType: "",
         PLUType: "",
         PLUNo: "",
         PLUVariantCode: null,
         PLUQuantity: 0,
         PLUQtyperUnitofMeasure: 0,
         PLUQuantityBase: 0 ,
         PLUUnitofMeasureCode : "",
         PLUExpirationDate: null,
         PLUParentLPNo: null,
         PLUParentLPLineNo: null,
         PLUStatus: null,
         PLUSerialNo: null,
         PLULotNo: null,
         PLUDescription: "",
         PLUEntryQuantity: null,
         PLUSourceDocument: "",
         PLUSourceDocumentNo: "",
         PLUDocument: "",
         PLUDocumentNo: "",
         PLULicensePlateStatus: "",
         PLUShipmentSrcDocument: "",
         PLUShipmentSrcDocumentNo: null,
         PLUSourceLineNo: 0,
         PLUWhseLineNo: 0
 }
 
          obj= {
 
             company: "",
             fieldCount: 0,
             fields: [],
             id: 0,
             name: "",
             position: "",
             recordId: ""
 
 
          }
 
     

    

  
 
 
 
      }


      return list;
    
 
 
     }



     public async PalletL(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];



        let product = {  
       PLULPDocumentNo: "",
        PLULineNo: 0,
        PLULPDocumentType: "",
        PLUType: "",
        PLUNo: "",
        PLUVariantCode: null,
        PLUQuantity: 0,
        PLUQtyperUnitofMeasure: 0,
        PLUQuantityBase: 0 ,
        PLUUnitofMeasureCode : "",
        PLUExpirationDate: null,
        PLUParentLPNo: null,
        PLUParentLPLineNo: null,
        PLUStatus: null,
        PLUSerialNo: null,
        PLULotNo: null,
        PLUDescription: "",
        PLUEntryQuantity: null,
        PLUSourceDocument: "",
        PLUSourceDocumentNo: "",
        PLUDocument: "",
        PLUDocumentNo: "",
        PLULicensePlateStatus: "",
        PLUShipmentSrcDocument: "",
        PLUShipmentSrcDocumentNo: null,
        PLUSourceLineNo: 0,
        PLUWhseLineNo: 0
}

       

      for(let i in   listLp.LicensePlates.LicensePlatesLines){
 
       for (const y in  listLp.LicensePlates.LicensePlatesLines[i].fields) {
 
         product[listLp.LicensePlates.LicensePlatesLines[i].fields[y].name] =   listLp.LicensePlates.LicensePlatesLines[i].fields[y].value;


         }



   list.push(product);

     
     product = {  
        PLULPDocumentNo: "",
         PLULineNo: 0,
         PLULPDocumentType: "",
         PLUType: "",
         PLUNo: "",
         PLUVariantCode: null,
         PLUQuantity: 0,
         PLUQtyperUnitofMeasure: 0,
         PLUQuantityBase: 0 ,
         PLUUnitofMeasureCode : "",
         PLUExpirationDate: null,
         PLUParentLPNo: null,
         PLUParentLPLineNo: null,
         PLUStatus: null,
         PLUSerialNo: null,
         PLULotNo: null,
         PLUDescription: "",
         PLUEntryQuantity: null,
         PLUSourceDocument: "",
         PLUSourceDocumentNo: "",
         PLUDocument: "",
         PLUDocumentNo: "",
         PLULicensePlateStatus: "",
         PLUShipmentSrcDocument: "",
         PLUShipmentSrcDocumentNo: null,
         PLUSourceLineNo: 0,
         PLUWhseLineNo: 0
 }
 
       

 
      }


      return list;
    
 
 
     }






     
     public async ListLpH(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];

         let obj= {

            company: "",
            fieldCount: 0,
            fields: { 
                PLULPDocumentNo: "",
                PLULineNo: 0,
                PLUDocumentType: "",
                PLULicensePlateStatus: "",
                PLULocationCode: "",
                PLUZoneCode: "",
                PLUBinCode: "",
                PLUDocument: "",
                PLUDocumentNo: "" ,
                PLUUnitofMeasure : "",
                PLUWarehouseEntryNo: null,
                PLUReferenceDocument: "",
                PLUReferenceNo: null,
                PLUWhseDocumentNo: null,
                PLUWhseDocumentType: "",
                PLUShipmentSrcDocument: "",
                PLUShipmentSrcDocumentNo: null,
                PLUParentLPNo: null,
                PLUItemNo: "",
                PLULPTotalQuantities: 0,
                SystemCreatedAt: "",
                $systemId: "",
                SystemCreatedBy: "",
                SystemModifiedAt: "",
                SystemModifiedBy: "",
               },
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
    
        obj.company = listLp.LicensePlates.LicensePlatesHeaders.company;
        obj.fieldCount = listLp.LicensePlates.LicensePlatesHeaders.fieldCount;
        obj.id = listLp.LicensePlates.LicensePlatesHeaders.id;
        obj.name = listLp.LicensePlates.LicensePlatesHeaders.name;
        obj.position = listLp.LicensePlates.LicensePlatesHeaders.position;
        obj.recordId = listLp.LicensePlates.LicensePlatesHeaders.recordId;
 
        
     for (const y in listLp.LicensePlates.LicensePlatesHeaders.fields) {
 


         obj.fields[listLp.LicensePlates.LicensePlatesHeaders.fields[y].name] =  listLp.LicensePlates.LicensePlatesHeaders.fields[y].value;



      }

      return obj;


      obj= {

        company: "",
        fieldCount: 0,
        fields: { 
            PLULPDocumentNo: "",
            PLULineNo: 0,
            PLUDocumentType: "",
            PLULicensePlateStatus: "",
            PLULocationCode: "",
            PLUZoneCode: "",
            PLUBinCode: "",
            PLUDocument: "",
            PLUDocumentNo: "" ,
            PLUUnitofMeasure : "",
            PLUWarehouseEntryNo: null,
            PLUReferenceDocument: "",
            PLUReferenceNo: null,
            PLUWhseDocumentNo: null,
            PLUWhseDocumentType: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUParentLPNo: null,
            PLUItemNo: "",
            PLULPTotalQuantities: 0,
            SystemCreatedAt: "",
            $systemId: "",
            SystemCreatedBy: "",
            SystemModifiedAt: "",
            SystemModifiedBy: "",
           },
        id: 0,
        name: "",
        position: "",
        recordId: ""


     

      
     

 
     }

  
 
 
 

    
 
 
     }



     public async ListPutAwayH(listPw: any){

        // console.log(listLp);
 
      

         let obj= {

            company: "",
            fieldCount: 0,
            fields: { 
                Type: "",
                No: "",
                LocationCode: "",
                AssignedUserID: null,
                AssignmentDate: null,
                AssignmentTime: null,
                SortingMethod: "",
                NoSeries: "",
                Comment: false ,
                NoPrinted : null,
                NoofLines: 0,
                PostingDate: null,
                RegisteringNo: null,
                LastRegisteringNo: null,
                RegisteringNoSeries: "",
                DateofLastPrinting: null,
                TimeofLastPrinting: null,
                BreakbulkFilter: false,
                SourceNo: null,
                SourceDocument: "",
                SourceType: null,
                SourceSubtype: '',
                DestinationType: '',
                DestinationNo: null,
                ExternalDocumentNo: null,
                ExpectedReceiptDate: null,
                ShipmentDate: null,
                ExternalDocumentNo2: null,
                SystemCreatedAt: "",
                $systemId: "",
                SystemCreatedBy: "",
                SystemModifiedAt: "",
                SystemModifiedBy: "",
               },
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
    
        obj.company = listPw.WarehousePutAways.WarehousePutAwayHeader.company;
        obj.fieldCount = listPw.WarehousePutAways.WarehousePutAwayHeader.fieldCount;
        obj.id = listPw.WarehousePutAways.WarehousePutAwayHeader.id;
        obj.name = listPw.WarehousePutAways.WarehousePutAwayHeader.name;
        obj.position = listPw.WarehousePutAways.WarehousePutAwayHeader.position;
        obj.recordId = listPw.WarehousePutAways.WarehousePutAwayHeader.recordId;
 
        
     for (const y in listPw.WarehousePutAways.WarehousePutAwayHeader.fields) {
 


         obj.fields[listPw.WarehousePutAways.WarehousePutAwayHeader.fields[y].name] =  listPw.WarehousePutAways.WarehousePutAwayHeader.fields[y].value;



      }

      return obj;


      obj= {

        company: "",
        fieldCount: 0,
        fields: { 
            Type: "",
            No: "",
            LocationCode: "",
            AssignedUserID: null,
            AssignmentDate: null,
            AssignmentTime: null,
            SortingMethod: "",
            NoSeries: "",
            Comment: false ,
            NoPrinted : null,
            NoofLines: 0,
            PostingDate: null,
            RegisteringNo: null,
            LastRegisteringNo: null,
            RegisteringNoSeries: "",
            DateofLastPrinting: null,
            TimeofLastPrinting: null,
            BreakbulkFilter: false,
            SourceNo: null,
            SourceDocument: "",
            SourceType: null,
            SourceSubtype: '',
            DestinationType: '',
            DestinationNo: null,
            ExternalDocumentNo: null,
            ExpectedReceiptDate: null,
            ShipmentDate: null,
            ExternalDocumentNo2: null,
            SystemCreatedAt: "",
            $systemId: "",
            SystemCreatedBy: "",
            SystemModifiedAt: "",
            SystemModifiedBy: "",
           },
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }
  
 
 
 

    
 
 
     }



     
     public async ListPutAwayL(listPw: any){

        // console.log(listLp);
 

        let list:any[] = [];
      

         let obj= {

            company: "",
            fieldCount: 0,
            fields: { 
                ActivityType: "",
                No: "",
                LineNo: 0,
                SourceType: 0 ,
                SourceSubtype: '',
                SourceNo: '',
                SourceLineNo: 0,
                SourceSublineNo: null,
                SourceDocument: '' ,
                LocationCode: '',
                ShelfNo: null,
                SortingSequenceNo: null,
                ItemNo: '',
                VariantCode: null,
                UnitofMeasureCode: "",
                QtyperUnitofMeasure: 0,
                Description: '',
                Description2: null,
                Quantity: 0,
                QtyOutstanding:0,
                QtytoHandle: 0,
                QtyHandled: null,
                ShippingAdvice: '',
                DueDate: null,
                DestinationType: '',
                DestinationNo: null,
                ShippingAgentCode: null,
                ShippingAgentServiceCode: null,
                ShipmentMethodCode:null,
                StartingDate: '',
                QtyRoundingPrecision:null,
                AssembletoOrder:false,
                ATOComponent:false,
                SerialNo:null,
                LotNo:null,
                WarrantyDate:null,
                ExpirationDate:null,
                SerialNoBlocked:false,
                LotNoBlocked:false,
                PackageNo:null,
                BinCode: '',
                ZoneCode: '',
                ActionType: '',
                WhseDocumentType: '',
                WhseDocumentNo: '',
                WhseDocumentLineNo: 0,
                BinRanking: null,
                Cubage: null,
                Weight:null,
                SpecialEquipmentCode: null,
                BinTypeCode: '',
                BreakbulkNo: null,
                OriginalBreakbulk: false,
                Breakbulk: false,
                CrossDockInformation: '',
                Dedicated:false,
                PLUNoLPCreated: null,
                PLULPSingles: null,
                PLULPPalletChildsasLP: null,
                PLULPPalletChildasItem: null,
                SystemCreatedAt: "",
                $systemId: "",
                SystemCreatedBy: "",
                SystemModifiedAt: "",
                SystemModifiedBy: "",
               },
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
for (const i in listPw.WarehousePutAways.WarehousePutAwayLines) {


    
    obj.company = listPw.WarehousePutAways.WarehousePutAwayLines[i].company;
    obj.fieldCount = listPw.WarehousePutAways.WarehousePutAwayLines[i].fieldCount;
    obj.id = listPw.WarehousePutAways.WarehousePutAwayLines[i].id;
    obj.name = listPw.WarehousePutAways.WarehousePutAwayLines[i].name;
    obj.position = listPw.WarehousePutAways.WarehousePutAwayLines[i].position;
    obj.recordId = listPw.WarehousePutAways.WarehousePutAwayLines[i].recordId;

    
 for (const y in listPw.WarehousePutAways.WarehousePutAwayLines[i].fields) {



     obj.fields[listPw.WarehousePutAways.WarehousePutAwayLines[i].fields[y].name] =  listPw.WarehousePutAways.WarehousePutAwayLines[i].fields[y].value;



  }

  list.push(obj);

  obj= {

    company: "",
    fieldCount: 0,
    fields: { 
        ActivityType: "",
        No: "",
        LineNo: 0,
        SourceType: 0 ,
        SourceSubtype: '',
        SourceNo: '',
        SourceLineNo: 0,
        SourceSublineNo: null,
        SourceDocument: '' ,
        LocationCode: '',
        ShelfNo: null,
        SortingSequenceNo: null,
        ItemNo: '',
        VariantCode: null,
        UnitofMeasureCode: "",
        QtyperUnitofMeasure: 0,
        Description: '',
        Description2: null,
        Quantity: 0,
        QtyOutstanding:0,
        QtytoHandle: 0,
        QtyHandled: null,
        ShippingAdvice: '',
        DueDate: null,
        DestinationType: '',
        DestinationNo: null,
        ShippingAgentCode: null,
        ShippingAgentServiceCode: null,
        ShipmentMethodCode:null,
        StartingDate: '',
        QtyRoundingPrecision:null,
        AssembletoOrder:false,
        ATOComponent:false,
        SerialNo:null,
        LotNo:null,
        WarrantyDate:null,
        ExpirationDate:null,
        SerialNoBlocked:false,
        LotNoBlocked:false,
        PackageNo:null,
        BinCode: '',
        ZoneCode: '',
        ActionType: '',
        WhseDocumentType: '',
        WhseDocumentNo: '',
        WhseDocumentLineNo: 0,
        BinRanking: null,
        Cubage: null,
        Weight:null,
        SpecialEquipmentCode: null,
        BinTypeCode: '',
        BreakbulkNo: null,
        OriginalBreakbulk: false,
        Breakbulk: false,
        CrossDockInformation: '',
        Dedicated:false,
        PLUNoLPCreated: null,
        PLULPSingles: null,
        PLULPPalletChildsasLP: null,
        PLULPPalletChildasItem: null,
        SystemCreatedAt: "",
        $systemId: "",
        SystemCreatedBy: "",
        SystemModifiedAt: "",
        SystemModifiedBy: "",
       },
    id: 0,
    name: "",
    position: "",
    recordId: ""


 }
  
}


return list;
    
 

    
 
 
     }





     
     public async ListLpPalletH(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];

        let product = { 
            PLULPDocumentNo: "",
            PLUDescription: null,
            PLUDocumentType: "",
            PLULicensePlateStatus: "",
            PLULocationCode: "",
            PLUZoneCode: "",
            PLUBinCode: "",
            PLUDocument: "",
            PLUDocumentNo: "" ,
            PLUUnitofMeasure : "",
            PLUWarehouseEntryNo: null,
            PLUReferenceDocument: "",
            PLUReferenceNo: null,
            PLUWhseDocumentNo: null,
            PLUWhseDocumentType: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUParentLPNo: null,
            PLUItemNo: "",
            PLULPTotalQuantities: 0,
            SystemCreatedAt: "",
            $systemId: "",
            SystemCreatedBy: "",
            SystemModifiedAt: "",
            SystemModifiedBy: "",
           }
         let obj= {

            company: "",
            fieldCount: 0,
            fields: [],
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 

         for (const i in listLp.LicensePlates.LPHeaders) {
          
         
    
        obj.company = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.company;
        obj.fieldCount = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fieldCount;
        obj.id = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.id;
        obj.name = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.name;
        obj.position = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.position;
        obj.recordId = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.recordId;
 
        
     for (const y in listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields) {
 


         product[listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].name] =  listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].value;



      }

      obj.fields.push(product);

      list.push(obj);

       product = { 
        PLULPDocumentNo: "",
        PLUDescription: null,
        PLUDocumentType: "",
        PLULicensePlateStatus: "",
        PLULocationCode: "",
        PLUZoneCode: "",
        PLUBinCode: "",
        PLUDocument: "",
        PLUDocumentNo: "" ,
        PLUUnitofMeasure : "",
        PLUWarehouseEntryNo: null,
        PLUReferenceDocument: "",
        PLUReferenceNo: null,
        PLUWhseDocumentNo: null,
        PLUWhseDocumentType: "",
        PLUShipmentSrcDocument: "",
        PLUShipmentSrcDocumentNo: null,
        PLUParentLPNo: null,
        PLUItemNo: "",
        PLULPTotalQuantities: 0,
        SystemCreatedAt: "",
        $systemId: "",
        SystemCreatedBy: "",
        SystemModifiedAt: "",
        SystemModifiedBy: "",
       }
      obj= {

        company: "",
        fieldCount: 0,
        fields: [],
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }

     }

  

     return list;
 
 
}




public async PalletH(listLp: any){

    // console.log(listLp);



    
     let obj= {

        company: "",
        fieldCount: 0,
        fields:{ 
            PLULPDocumentNo: "",
            PLUDescription: null,
            PLUDocumentType: "",
            PLULicensePlateStatus: "",
            PLULocationCode: "",
            PLUZoneCode: "",
            PLUBinCode: "",
            PLUDocument: "",
            PLUDocumentNo: "" ,
            PLUUnitofMeasure : "",
            PLUWarehouseEntryNo: null,
            PLUReferenceDocument: "",
            PLUReferenceNo: null,
            PLUWhseDocumentNo: null,
            PLUWhseDocumentType: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUParentLPNo: null,
            PLUItemNo: "",
            PLULPTotalQuantities: 0,
            SystemCreatedAt: "",
            $systemId: "",
            SystemCreatedBy: "",
            SystemModifiedAt: "",
            SystemModifiedBy: "",
           } ,
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }



      
     

    obj.company = listLp.LicensePlates.LicensePlatesHeaders.company;
    obj.fieldCount = listLp.LicensePlates.LicensePlatesHeaders.fieldCount;
    obj.id = listLp.LicensePlates.LicensePlatesHeaders.id;
    obj.name = listLp.LicensePlates.LicensePlatesHeaders.name;
    obj.position = listLp.LicensePlates.LicensePlatesHeaders.position;
    obj.recordId = listLp.LicensePlates.LicensePlatesHeaders.recordId;

    
 for (const y in listLp.LicensePlates.LicensePlatesHeaders.fields) {



     obj.fields[listLp.LicensePlates.LicensePlatesHeaders.fields[y].name] =  listLp.LicensePlates.LicensePlatesHeaders.fields[y].value;



  }


 return obj;


 }











    public async ListLP(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];

         let obj= {

            company: "",
            fieldCount: 0,
            fields: {  PLULPDocumentNo: "",
            PLULineNo: 0,
            PLULPDocumentType: "",
            place: '',
            PLUBinCode: "",
            PLUItemNo: "",
            PLUType: "",
            PLUNo: "",
            PLUVariantCode: null,
            PLUQuantity: 0,
            PLUQtyperUnitofMeasure: 0,
            PLUQuantityBase: 0 ,
            PLUUnitofMeasureCode : "",
            PLUExpirationDate: null,
            PLUParentLPNo: null,
            PLUParentLPLineNo: null,
            PLUStatus: null,
            PLUSerialNo: null,
            PLULotNo: null,
            PLUDescription: "",
            PLUEntryQuantity: null,
            PLUSourceDocument: "",
            PLUSourceDocumentNo: "",
            PLUDocument: "",
            PLUDocumentNo: "",
            PLULicensePlateStatus: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUSourceLineNo: 0,
            PLUWhseLineNo: 0
},
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
      for(let i in   listLp.LicensePlates.LPLines){
 
        obj.company = listLp.LicensePlates.LPLines[i].company;
        obj.fieldCount = listLp.LicensePlates.LPLines[i].fieldCount;
        obj.id = listLp.LicensePlates.LPLines[i].id;
        obj.name = listLp.LicensePlates.LPLines[i].name;
        obj.position = listLp.LicensePlates.LPLines[i].position;
        obj.recordId = listLp.LicensePlates.LPLines[i].recordId;
 
        
     for (const y in listLp.LicensePlates.LPLines[i].fields) {
 


         obj.fields[listLp.LicensePlates.LPLines[i].fields[y].name] =  listLp.LicensePlates.LPLines[i].fields[y].value;



      }

      list.push(obj);


      obj= {

        company: "",
        fieldCount: 0,
        fields: {  PLULPDocumentNo: "",
        place: '',
        PLULineNo: 0,
        PLULPDocumentType: "",
        PLUItemNo: "",
        PLUBinCode: "",
        PLUType: "",
        PLUNo: "",
        PLUVariantCode: null,
        PLUQuantity: 0,
        PLUQtyperUnitofMeasure: 0,
        PLUQuantityBase: 0 ,
        PLUUnitofMeasureCode : "",
        PLUExpirationDate: null,
        PLUParentLPNo: null,
        PLUParentLPLineNo: null,
        PLUStatus: null,
        PLUSerialNo: null,
        PLULotNo: null,
        PLUDescription: "",
        PLUEntryQuantity: null,
        PLUSourceDocument: "",
        PLUSourceDocumentNo: "",
        PLUDocument: "",
        PLUDocumentNo: "",
        PLULicensePlateStatus: "",
        PLUShipmentSrcDocument: "",
        PLUShipmentSrcDocumentNo: null,
        PLUSourceLineNo: 0,
        PLUWhseLineNo: 0
},
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }

      
     

 
     }

  
 
     return list;
 

    
 
 
     }
     



     
    public async ListLPallet(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];

        let product = 
        {  PLULPDocumentNo: "",
        PLULineNo: 0,
        PLUDocumentType: "",
        PLUBinCode: "",
        PLUItemNo: "",
        PLUType: "",
        PLUNo: "",
        PLUVariantCode: null,
        PLUQuantity: 0,
        PLUQtyperUnitofMeasure: 0,
        PLUQuantityBase: 0 ,
        PLUUnitofMeasureCode : "",
        PLUExpirationDate: null,
        PLUParentLPNo: null,
        PLUParentLPLineNo: null,
        PLUStatus: null,
        PLUSerialNo: null,
        PLULotNo: null,
        PLUDescription: "",
        PLUEntryQuantity: null,
        PLUSourceDocument: "",
        PLUSourceDocumentNo: "",
        PLUDocument: "",
        PLUDocumentNo: "",
        PLULicensePlateStatus: "",
        PLUShipmentSrcDocument: "",
        PLUShipmentSrcDocumentNo: null,
        PLUSourceLineNo: 0,
        PLUWhseLineNo: 0
}

         let obj= {

            company: "",
            fieldCount: 0,
            fields: [],
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
      for(let i in   listLp.LicensePlates.LPLines){
 
        obj.company = listLp.LicensePlates.LPLines[i].company;
        obj.fieldCount = listLp.LicensePlates.LPLines[i].fieldCount;
        obj.id = listLp.LicensePlates.LPLines[i].id;
        obj.name = listLp.LicensePlates.LPLines[i].name;
        obj.position = listLp.LicensePlates.LPLines[i].position;
        obj.recordId = listLp.LicensePlates.LPLines[i].recordId;
 
        
     for (const y in listLp.LicensePlates.LPLines[i].fields) {
 


         product[listLp.LicensePlates.LPLines[i].fields[y].name] =  listLp.LicensePlates.LPLines[i].fields[y].value;



      }

      obj.fields.push(product);
      list.push(obj);


      obj= {

        company: "",
        fieldCount: 0,
        fields:[],
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }

     product = 
     {  PLULPDocumentNo: "",
     PLULineNo: 0,
     PLUDocumentType: "",
     PLUBinCode: "",
     PLUItemNo: "",
     PLUType: "",
     PLUNo: "",
     PLUVariantCode: null,
     PLUQuantity: 0,
     PLUQtyperUnitofMeasure: 0,
     PLUQuantityBase: 0 ,
     PLUUnitofMeasureCode : "",
     PLUExpirationDate: null,
     PLUParentLPNo: null,
     PLUParentLPLineNo: null,
     PLUStatus: null,
     PLUSerialNo: null,
     PLULotNo: null,
     PLUDescription: "",
     PLUEntryQuantity: null,
     PLUSourceDocument: "",
     PLUSourceDocumentNo: "",
     PLUDocument: "",
     PLUDocumentNo: "",
     PLULicensePlateStatus: "",
     PLUShipmentSrcDocument: "",
     PLUShipmentSrcDocumentNo: null,
     PLUSourceLineNo: 0,
     PLUWhseLineNo: 0
}



     

      
     

 
     }

  
 
     return list;
 

    
 
 
     }


     
     public async ListPallets(listLp: any){

        // console.log(listLp);
 
        let listH: any[] = [];

         let obj= {

            company: "",
            fieldCount: 0,
            fields:{ 
                PLULPDocumentNo: "",
                PLUDescription: null,
                PLULPDocumentType: "",
                PLULicensePlateStatus: "",
                PLULocationCode: "",
                PLUZoneCode: "",
                PLUType: "",
                PLUNo: "",
                PLUBinCode: "",
                PLUDocument: "",
                PLUDocumentNo: "" ,
                PLUUnitofMeasure : "",
                PLUWarehouseEntryNo: null,
                PLUReferenceDocument: "",
                PLUReferenceNo: null,
                PLUWhseDocumentNo: null,
                PLUWhseDocumentType: "",
                PLUShipmentSrcDocument: "",
                PLUShipmentSrcDocumentNo: null,
                PLUParentLPNo: null,
                PLUItemNo: "",
                PLULPTotalQuantities: 0,
                SystemCreatedAt: "",
                $systemId: "",
                SystemCreatedBy: "",
                SystemModifiedAt: "",
                SystemModifiedBy: "",
               },
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
      for(let i in   listLp.LicensePlates.LPHeaders){
 
        obj.company = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.company;
        obj.fieldCount = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fieldCount;
        obj.id = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.id;
        obj.name = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.name;
        obj.position = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.position;
        obj.recordId = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.recordId;
 
        
     for (const y in listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields) {
 


         obj.fields[listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].name] =  listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].value;



      }

      listH.push(obj);

      obj= {

        company: "",
        fieldCount: 0,
        fields: { 
            PLULPDocumentNo: "",
            PLUDescription: null,
            PLULPDocumentType: "",
            PLUType: "",
            PLUNo: "",
            PLULicensePlateStatus: "",
            PLULocationCode: "",
            PLUZoneCode: "",
            PLUBinCode: "",
            PLUDocument: "",
            PLUDocumentNo: "" ,
            PLUUnitofMeasure : "",
            PLUWarehouseEntryNo: null,
            PLUReferenceDocument: "",
            PLUReferenceNo: null,
            PLUWhseDocumentNo: null,
            PLUWhseDocumentType: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUParentLPNo: null,
            PLUItemNo: "",
            PLULPTotalQuantities: 0,
            SystemCreatedAt: "",
            $systemId: "",
            SystemCreatedBy: "",
            SystemModifiedAt: "",
            SystemModifiedBy: "",
           },
        id: 0,
        name: "",
        position: "",
        recordId: ""


     

      
     

 
     }

  
 
 
 

      
     

 
     }

  
 
     return listH;
 

    
 
 
     }


     public async ListLPH(listLp: any){

        // console.log(listLp);
 
        let listH: any[] = [];

         let obj= {

            company: "",
            fieldCount: 0,
            fields:{ 
                PLULPDocumentNo: "",
                PLUDescription: null,
                PLULPDocumentType: "",
                PLULicensePlateStatus: "",
                PLULocationCode: "",
                PLUZoneCode: "",
                PLUBinCode: "",
                PLUDocument: "",
                PLUDocumentNo: "" ,
                PLUUnitofMeasure : "",
                PLUWarehouseEntryNo: null,
                PLUReferenceDocument: "",
                PLUReferenceNo: null,
                PLUWhseDocumentNo: null,
                PLUWhseDocumentType: "",
                PLUShipmentSrcDocument: "",
                PLUShipmentSrcDocumentNo: null,
                PLUParentLPNo: null,
                PLUItemNo: "",
                PLULPTotalQuantities: 0,
                SystemCreatedAt: "",
                $systemId: "",
                SystemCreatedBy: "",
                SystemModifiedAt: "",
                SystemModifiedBy: "",
               },
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
      for(let i in   listLp.LicensePlates.LPHeaders){
 
        obj.company = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.company;
        obj.fieldCount = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fieldCount;
        obj.id = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.id;
        obj.name = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.name;
        obj.position = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.position;
        obj.recordId = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.recordId;
 
        
     for (const y in listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields) {
 


         obj.fields[listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].name] =  listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].value;



      }

      listH.push(obj);

      obj= {

        company: "",
        fieldCount: 0,
        fields: { 
            PLULPDocumentNo: "",
            PLUDescription: null,
            PLULPDocumentType: "",
            PLULicensePlateStatus: "",
            PLULocationCode: "",
            PLUZoneCode: "",
            PLUBinCode: "",
            PLUDocument: "",
            PLUDocumentNo: "" ,
            PLUUnitofMeasure : "",
            PLUWarehouseEntryNo: null,
            PLUReferenceDocument: "",
            PLUReferenceNo: null,
            PLUWhseDocumentNo: null,
            PLUWhseDocumentType: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUParentLPNo: null,
            PLUItemNo: "",
            PLULPTotalQuantities: 0,
            SystemCreatedAt: "",
            $systemId: "",
            SystemCreatedBy: "",
            SystemModifiedAt: "",
            SystemModifiedBy: "",
           },
        id: 0,
        name: "",
        position: "",
        recordId: ""

     }

  
 }

  
     return listH;
 
 
     }



   public async listItem(item:any){


    let obj = {

        company: "",
        id: 0,
        name: "",
        fields: {

            timestamp:'',
            No: '',
            Description: '',
            BaseUnitofMeasure: '',
            Type: '',
            UnitPrice: 0,
            UnitCost: 0.0,
            VendorNo: null,
            VendorItemNo: null,
            GrossWeight: null,
            NetWeight: null,
            UnitVolume: null,
            Blocked: false,
            BlockReason:null,
            GenProdPostingGroup: '',
            Picture: '',
            VATProdPostingGroup:null,
            GlobalDimension1Code: null,
            GlobalDimension2Code: null,
            GTIN: null,
            ItemTrackingCode: null,
            SerialNos:null,
            LotNos:null,
            ExpirationCalculation: '',
            SalesUnitofMeasure: '',
            ItemCategoryCode: null,
            IdentifierCode: null

        }
    };

    obj.company = item.company;
    obj.id = item.id;
    obj.name = item.name;

    for (const key in item.fields) {


        obj.fields[item.fields[key].name] = item.fields[key].value;
           
    }


    return obj;

   }  



     public async ListLPS(lp: any){

        // console.log(listLp);
 
   
        let fields = {

            PLULPDocumentNo: "",
            PLULineNo: 0,
            PLUDocumentType: "",
            PLUType: "",
            PLUNo: "",
            PLUVariantCode: null,
            PLUQuantity: 0,
            PLUQtyperUnitofMeasure: 0,
            PLUQuantityBase: 0 ,
            PLUUnitofMeasureCode : "",
            PLUExpirationDate: null,
            PLUParentLPNo: null,
            PLUParentLPLineNo: null,
            PLUStatus: null,
            PLUSerialNo: null,
            PLULotNo: null,
            PLUDescription: "",
            PLUEntryQuantity: null,
            PLUSourceDocument: "",
            PLUSourceDocumentNo: "",
            PLUDocument: "",
            PLUDocumentNo: "",
            PLULicensePlateStatus: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUSourceLineNo: 0,
            PLUWhseLineNo: 0

        };

         let obj= {

            company: "",
            fieldCount: 0,
            fields: [],
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
    
 
        obj.company = lp.company;
        obj.fieldCount = lp.fieldCount;
        obj.id = lp.id;
        obj.name = lp.name;
        obj.position = lp.position;
        obj.recordId = lp.recordId;
 
        
     for (const y in lp.fields) {
 


         fields[lp.fields[y].name] =  lp.fields[y].value;



     
 
     }

     obj.fields.push(fields);
 
     return obj;
 

    
 
 
     }


   


     public async list(listLp:any){

      
     let list: any[] = [];
        
       
        let obj= {

            company: "",
            fieldCount: 0,
            fields: { 
            PLULPDocumentNo: "",
            PLULineNo: 0,
            PLUDocumentType: "",
            PLULicensePlateStatus: "",
            PLULocationCode: "",
            PLUZoneCode: "",
            PLUBinCode: "",
            PLUDocument: "",
            PLUDocumentNo: "" ,
            PLUUnitofMeasure : "",
            PLUWarehouseEntryNo: null,
            PLUReferenceDocument: "",
            PLUReferenceNo: null,
            PLUWhseDocumentNo: null,
            PLUWhseDocumentType: "",
            PLUShipmentSrcDocument: "",
            PLUShipmentSrcDocumentNo: null,
            PLUParentLPNo: null,
            PLUItemNo: "",
            PLULPTotalQuantities: 0,
            SystemCreatedAt: "",
            $systemId: "",
            SystemCreatedBy: "",
            SystemModifiedAt: "",
            SystemModifiedBy: "",
           },
            id: 0,
            name: "",
            position: "",
            recordId: ""


         }
 
         for (const i in listLp.LicensePlates.LPHeaders) {
        
                
            
         
 
        obj.company = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.company;
        obj.fieldCount = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fieldCount;
        obj.id = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.id;
        obj.name = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.name;
        obj.position = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.position;
        obj.recordId = listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.recordId;
 
        
     for (const y in listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields) {
 


         obj.fields[listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].name] =  listLp.LicensePlates.LPHeaders[i].LicensePlatesHeaders.fields[y].value;




     

     }

     list.push(obj);


      obj= {

        company: "",
        fieldCount: 0,
        fields: { 
        PLULPDocumentNo: "",
        PLULineNo: 0,
        PLUDocumentType: "",
        PLULicensePlateStatus: "",
        PLULocationCode: "",
        PLUZoneCode: "",
        PLUBinCode: "",
        PLUDocument: "",
        PLUDocumentNo: "" ,
        PLUUnitofMeasure : "",
        PLUWarehouseEntryNo: null,
        PLUReferenceDocument: "",
        PLUReferenceNo: null,
        PLUWhseDocumentNo: null,
        PLUWhseDocumentType: "",
        PLUShipmentSrcDocument: "",
        PLUShipmentSrcDocumentNo: null,
        PLUParentLPNo: null,
        PLUItemNo: "",
        PLULPTotalQuantities: 0,
        SystemCreatedAt: "",
        $systemId: "",
        SystemCreatedBy: "",
        SystemModifiedAt: "",
        SystemModifiedBy: "",
       },
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }


     }

     return list;


     

    
     }


}