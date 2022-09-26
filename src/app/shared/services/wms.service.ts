import { identifierModuleUrl } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { parseJSON } from "jquery";
import { Observable, Subject } from "rxjs";
import { InterceptService } from "./intercept.service";
import { SyncerpService } from "./syncerp.service";

@Injectable()
export class WmsService {
    public wareReceipts: any = {}
    public contador: number = 0;
    public data: any;
    public lps:any[] = [];
    public boolean: Boolean;

   
 
    constructor(private syncErp: SyncerpService,
         private interceptService: InterceptService
    ) {}


    public async GetBinContent_LP(BinCode: string, LocationCode: string, ItemNo: string, UnitofMeasureCode: string){

        try {
            let obj: any = [
                {
                    BinCode,
                    LocationCode,
                    ItemNo,
                    UnitofMeasureCode
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

 
 public getLPS(){


   return this.lps; 

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

    public async CreateLPFromWarehouseReceiptLine(obj: any) {
        try {
            let p = await this.syncErp.processRequestParams('CreateLP_FromWarehouseReceiptLine', obj);
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


   public async Assign_ItemChild_to_LP_Pallet_From_WR( LP_Pallet_No:any, WarehouseReceipt_No:any,  Item_Child_No:any, Qty:any,  WarehouseReceipt_LineNo:any){

    

        
    try {

        let obj: any = [{

            LP_Pallet_No,
            WarehouseReceipt_No,
            Item_Child_No,
            Qty,
            WarehouseReceipt_LineNo
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


   public async Calcule_Possible_LPChilds_From_WR(LP_Pallet_No:any){


    
    try {

        let obj: any = [{

            LP_Pallet_No
            
        }];



        
        let p = await this.syncErp.processRequestParams('Calcule_Possible_LPChilds_From_WR', obj);
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

     LicensePlatesLines



     public async ListLp(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];

         let obj= {

            company: "",
            fieldCount: 0,
            fields: {  PLULPDocumentNo: "",
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
        fieldCount: 0,
        fields: {  PLULPDocumentNo: "",
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




    public async ListLP(listLp: any){

        // console.log(listLp);
 
        let list: any[] = [];

         let obj= {

            company: "",
            fieldCount: 0,
            fields: {  PLULPDocumentNo: "",
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
},
        id: 0,
        name: "",
        position: "",
        recordId: ""


     }

      
     

 
     }

  
 
     return list;
 

    
 
 
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