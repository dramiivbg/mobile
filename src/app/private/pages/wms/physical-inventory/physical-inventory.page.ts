import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverChildrensPalletComponent } from '@prv/components/popover-childrens-pallet/popover-childrens-pallet.component';
import { PopoverCountingComponent } from '@prv/components/popover-counting/popover-counting.component';
import { PopoverListSNComponent } from '@prv/components/popover-list-sn/popover-list-sn.component';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-physical-inventory',
  templateUrl: './physical-inventory.page.html',
  styleUrls: ['./physical-inventory.page.scss'],
})
export class PhysicalInventoryPage implements OnInit {

  public lists:any;
  public bins:string[] = [];
  public listT:any[] = [];
  public list:any[] = [];
  public bin:any = '';
  public batch:any;
  public lps:any[] = [];
  public counted = 0;
  public quantity = 0;
  public template:any;
  constructor(private storage: Storage ,private intServ: InterceptService
    , private js: JsonService, private barcodeScanner: BarcodeScanner,
    public popoverController: PopoverController,
    private wmsService: WmsService, public router: Router) { }

 async ngOnInit() {
  this.lists = await  this.storage.get('inventory');

  console.log(this.lists);

  this.batch = await  this.storage.get('batch'); 

  this.template = await this.storage.get('template');

  this.intServ.loadingFunc(false);

  }

 async PopoverCounting(obj:any){

  switch(obj.type){
    case undefined:
      const popover = await this.popoverController.create({
        component: PopoverCountingComponent,
        cssClass: 'popoverCountingComponent',
        componentProps: {list:obj},
        backdropDismiss: false
        
      });
      await popover.present();
      const { data } = await popover.onDidDismiss();
  
      if(data.qty != undefined){
        
        console.log(data);
        this.WritePI(data.obj,data.qty);
      }
      break;

    default:

    const popover1 = await this.popoverController.create({
      component: PopoverChildrensPalletComponent,
      cssClass: 'popoverChildrensPalletComponent',
      componentProps: { item:obj, count:true},
    });
    await popover1.present();
      break;
  }
 

  }

  async onBarCode(){

    this.barcodeScanner.scan().then(
     async barCodeData => {
        let code = barCodeData.text;
        switch(this.bin === ''){

          case true:
          this.intServ.loadingFunc(true);
          let res = await this.wmsService.GetBinContent_LP(code.toUpperCase(),'WMS');
          console.log(res);
          
          if(!res.Error){
            this.bin = code.toUpperCase();
            console.log(res);
            res.map(async x => {    
              let obj = await this.lists.find(obj => obj.PLULicensePlates ===  x.LPHeader);
              if(obj != undefined){
                obj['seriales'] = x.Lines;
                obj.QtyPhysInventory = x.Lines.length; 
                obj.QtyCalculated = x.Lines.length;
                
                let line = this.lps.find(x => x.PLULicensePlates === obj.PLULicensePlates);
                 if(line === null || line === undefined)this.lps.push(obj);          
               
               console.log(obj);
              }else{

                let pallet = {
                  PLULicensePlates: "",
                  QtyCalculated: 0,
                  QtyPhysInventory: 0,
                  ItemNo: null,
                  UnitofMeasureCode: null,
                  BinCode: "",
                  type: "",
                  SerialNo: null,
                  LotNo: null,
                  childrens: [],
                  seriales: [],
                }

                let res = await this.wmsService.getLpNo(x.LPHeader);
                let lp = await this.wmsService.listSetup(res.LicensePlates.LicensePlatesHeaders);
                pallet.PLULicensePlates = lp.PLULPDocumentNo;
                pallet.BinCode = lp.PLUBinCode;
                pallet.type = lp.PLULPDocumentType;
                console.log(pallet,x);

               x.Lines.filter(lp => {

                lp.map(j => {

                  console.log(lp);
                  let line = this.lists.find(x => x.PLULicensePlates === lp.No);
                  if(line != undefined){
                    line['seriales'] = lp.Childs;
                    line.QtyPhysInventory = 0;
                    lp.Childs.map(i => {this.quantity+= i.Quantity;line.QtyPhysInventory+=i.Quantity });
                    line.QtyCalculated = line.QtyPhysInventory;
                    pallet.childrens.push(line);
                  }

                });
                
               });

               this.lps.push(pallet);
               console.log(pallet);

              }                     
              
            
            });

            this.lists.map(x => x.BinCode === code.toUpperCase()?this.quantity+= x.QtyPhysInventory:x);
           
            this.intServ.loadingFunc(false);
          }else{
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error','', `The bin ${code.toUpperCase()}  does not exist`));
          }
          break;

          case false:

          let line = this.lps.find(x => x.PLULicensePlates === code.toUpperCase() || x.ItemNo === code.toUpperCase());
          if(line != undefined)this.PopoverCounting(line);
            break;

            

        }
      
       
        
      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }

async show(item:any){

  let list = [];
  switch(item.type){

    case undefined:
      if(item.seriales.length > 0){

        item.seriales.map(x => {x['proceded'] = false; list.push(x)});
    
        const popover = await this.popoverController.create({
          component: PopoverListSNComponent,
          cssClass: 'popoverListSNComponent-modal',
          componentProps: { list },
        });
        this.intServ.loadingFunc(false);
        await popover.present();
      }
      break;

    default:
      const popover = await this.popoverController.create({
        component: PopoverChildrensPalletComponent,
        cssClass: 'popoverChildrensPalletComponent',
        componentProps: { item, count:false},
      });
      this.intServ.loadingFunc(false);
      await popover.present();

      break;
  }
 
}

public async popoverCount(){
  this.intServ.loadingFunc(true);
  let  resR = await this.wmsService.PreRegister_WarehouseInvPhysicalCount('WMS',this.template,this.batch);

  let count = await this.wmsService.listTraking(resR.Warehouse_Physical_Inventory_Counted);
  this.storage.set('count', count);
  this.router.navigate(['page/wms/physicalCount']);
  
}

public async popoverNonCount(){

  this.intServ.loadingFunc(true);
  let  resR = await this.wmsService.PreRegister_WarehouseInvPhysicalCount('WMS',this.template,this.batch);
  let Nocount = await this.wmsService.listTraking(resR.Warehouse_Physical_Inventory_NoCounted);
  this.storage.set('Nocount',Nocount);
  this.router.navigate(['page/wms/physicalNoCount']);
}

  async WritePI(obj:any,qty:any){

    this.intServ.loadingFunc(true);
   
     let listI:any[] = [];
  
     let lists:any[] = [];

     obj.map(x => {
      let line = this.lists.find(o => x.SerialNo === o.SerialNo);
      if(line != undefined){
        listI.push(line);
        this.lps.map((j,i) => (j.SerialNo === line.SerialNo || j.PLULicensePlates === line.PLULicensePlates)?this.lps.splice(i,1):j);
      }
    
     });
   
     let  list = {
       name: "WarehouseJournalLine",
       fields: [ {
         name: "JournalTemplateName",
         value: "",
       },
       {
         name: "JournalBatchName",
         value: "",
       },
       {
         name: "LineNo",
         value: "",
       },
       {
         name: "RegisteringDate",
         value: "",
       },
       {
         name: "LocationCode",
         value: "",   
       },
       {
         name: "ItemNo",
         value: "",
       },
       {
         name: "Qty(PhysInventory)",
         value: "",
       },
       {
         name: "UserID",
         value: "",    
       },
       {
         name: "VariantCode",
         value: "",
       },
       {
         name: "SerialNo",
         value: "",      
       },
       {
         name: "LotNo",
         value: "",     
       },   
       {
         name: "PLULicensePlates",
         value: "",      
       }]
     };
  
     
     listI.filter(inv => {
   
       list = {
         name: "WarehouseJournalLine",
         fields: [ {
           name: "JournalTemplateName",
           value: inv.JournalTemplateName,
         },
         {
           name: "JournalBatchName",
           value: inv.JournalBatchName,
         },
         {
           name: "LineNo",
           value: inv.LineNo,
         },
         {
           name: "RegisteringDate",
           value: inv.RegisteringDate,
         },
         {
           name: "LocationCode",
           value: inv.LocationCode,   
         },
         {
           name: "ItemNo",
           value: inv.ItemNo,
         },
         {
           name: "Qty(PhysInventory)",
           value: Number(inv.QtyPhysInventory),
         },
         {
           name: "UserID",
           value: inv.UserID,    
         },
         {
           name: "VariantCode",
           value: inv.VariantCode,
         },
         {
           name: "SerialNo",
           value: inv.SerialNo,      
         },
         {
           name: "LotNo",
           value: inv.LotNo,     
         },   
         {
           name: "PLULicensePlates",
           value: inv.PLULicensePlates,      
         }]
       };
   
       lists.push(list);
   
       list = {
         name: "WarehouseJournalLine",
         fields: [ {
           name: "JournalTemplateName",
           value: "",
         },
         {
           name: "JournalBatchName",
           value: "",
         },
         {
           name: "LineNo",
           value: "",
         },
         {
           name: "RegisteringDate",
           value: "",
         },
         {
           name: "LocationCode",
           value: "",   
         },
         {
           name: "ItemNo",
           value: "",
         },
         {
           name: "Qty(PhysInventory)",
           value: "",
         },
         {
           name: "UserID",
           value: "",    
         },
         {
           name: "VariantCode",
           value: "",
         },
         {
           name: "SerialNo",
           value: "",      
         },
         {
           name: "LotNo",
           value: "",     
         },   
         {
           name: "PLULicensePlates",
           value: "",      
         }]
       };
   
     });

     
   
     /*
     this.lps.filter((inv,i) => {
   
         list = {
           name: "WarehouseJournalLine",
           fields: [ {
             name: "JournalTemplateName",
             value: inv.JournalTemplateName,
           },
           {
             name: "JournalBatchName",
             value: inv.JournalBatchName,
           },
           {
             name: "LineNo",
             value: inv.LineNo,
           },
           {
             name: "RegisteringDate",
             value: inv.RegisteringDate,
           },
           {
             name: "LocationCode",
             value: inv.LocationCode,   
           },
           {
             name: "ItemNo",
             value: inv.ItemNo,
           },
           {
             name: "Qty(PhysInventory)",
             value: 0,
           },
           {
             name: "UserID",
             value: inv.UserID,    
           },
           {
             name: "VariantCode",
             value: inv.VariantCode,
           },
           {
             name: "SerialNo",
             value: inv.SerialNo,      
           },
           {
             name: "LotNo",
             value: inv.LotNo,     
           },   
           {
             name: "PLULicensePlates",
             value: inv.PLULicensePlates,      
           }]
         };
     
         lists.push(list);
     
         list = {
           name: "WarehouseJournalLine",
           fields: [ {
             name: "JournalTemplateName",
             value: "",
           },
           {
             name: "JournalBatchName",
             value: "",
           },
           {
             name: "LineNo",
             value: "",
           },
           {
             name: "RegisteringDate",
             value: "",
           },
           {
             name: "LocationCode",
             value: "",   
           },
           {
             name: "ItemNo",
             value: "",
           },
           {
             name: "Qty(PhysInventory)",
             value: "",
           },
           {
             name: "UserID",
             value: "",    
           },
           {
             name: "VariantCode",
             value: "",
           },
           {
             name: "SerialNo",
             value: "",      
           },
           {
             name: "LotNo",
             value: "",     
           },   
           {
             name: "PLULicensePlates",
             value: "",      
           }]
         };
     
        }); 
   */

     try {
   
       let res = await this.wmsService.Write_WarehouseInvPhysicalCount(lists);
   
       if(res.Error) throw new Error(res.Error.Message);
   
       
       if(res.error) throw new Error(res.error.message);
   
       console.log(res);
   
     
   
       this.intServ.loadingFunc(false);
     //  console.log(resR);
       
       
     } catch (error) {
   
       this.intServ.loadingFunc(false);
       this.intServ.alertFunc(this.js.getAlert('error','', error.message));
       
     }
   
   
   }
     
   
  
}
