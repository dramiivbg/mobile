import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
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
  public binCode:any;
  constructor(private storage: Storage ,private intServ: InterceptService
    , private js: JsonService, private barcodeScanner: BarcodeScanner,
    public popoverController: PopoverController,
    private wmsService: WmsService) { }

 async ngOnInit() {
  this.lists = await  this.storage.get('inventory');

  this.batch = await  this.storage.get('batch'); 

  this.intServ.loadingFunc(false);

  }

 async PopoverCounting(obj:any){

    const popover = await this.popoverController.create({
      component: PopoverCountingComponent,
      cssClass: 'popoverCountingComponent',
      componentProps: {list:obj},
      backdropDismiss: false
      
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();

    if(data.qty != undefined){
      
      this.WritePI(data.obj,data.qty);
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
          if(!res.Error){
            this.bin = code.toUpperCase();
            console.log(res);
            res.map(async x => {
    
              let obj = await this.lists.find(obj => obj.PLULicensePlates ===  x.LPHeader);
                     
               obj['seriales'] = x.Lines;
               obj.QtyPhysInventory = x.Lines.length; 
               obj.QtyCalculated = x.Lines.length;
               
               let line = this.lps.find(x => x.PLULicensePlates === obj.PLULicensePlates);
                if(line === null || line === undefined)this.lps.push(obj);          
              
              console.log(obj);
            
            });

            this.lists.map(x => x.BinCode === code.toUpperCase()?this.quantity+= x.QtyPhysInventory:x);
           
            this.intServ.loadingFunc(false);
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
}

  async WritePI(obj:any,qty:any){

    this.intServ.loadingFunc(true);
   
     let listI:any[] = [];
  
     let lists:any[] = [];
   
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
  
     /*
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

     
   
     
     this.listsFilter.filter((inv,i) => {
   
       let line =  listI.find(x => x.LineNo === inv.LineNo);
   
       if(line === undefined || line === null){
   
         this.listsFilter.splice(i,1);
   
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
     
       }
   
       
     });
   
   */

     try {
   
       let res = await this.wmsService.Write_WarehouseInvPhysicalCount(lists);
   
       if(res.Error) throw new Error(res.Error.Message);
   
       
       if(res.error) throw new Error(res.error.message);
   
   
      // let resR = await this.wmsService.PreRegister_WarehouseInvPhysicalCount(lists[0].LocationCode,lists[0].JournalTemplateName,lists[0].JournalBatchName);
   
      // if(resR.Error) throw new Error(resR.Error.Message);
   
   
       this.intServ.loadingFunc(false);
     //  console.log(resR);
       
       
     } catch (error) {
   
       this.intServ.loadingFunc(false);
       this.intServ.alertFunc(this.js.getAlert('error','', error.message));
       
     }
   
   
   
   }
     
   

}
