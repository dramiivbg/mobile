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
  public listPhysical = [];
  public counted = 0;
  public quantity = 0;
  public listaCount = [];
  public locate:any;
  public template:any;
  constructor(private storage: Storage ,private intServ: InterceptService
    , private js: JsonService, private barcodeScanner: BarcodeScanner,
    public popoverController: PopoverController,
    private wmsService: WmsService, public router: Router) { }

 async ngOnInit() {
  this.lists = await  this.storage.get('inventory');
  this.listPhysical = await this.storage.get('inventory');

  console.log(this.lists);

  this.batch = await  this.storage.get('batch'); 

  this.template = await this.storage.get('template');

 this.locate =  await this.storage.get('location');

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
  
      if(data.qty != undefined)this.WritePI(data.obj,data.qty,data.seriales,data.type);
      
      break;

      

    default:

    this.CountPallet(obj);
      break;
  }
 

  }

 async  CountPallet(obj:any){

  const popover = await this.popoverController.create({
    component: PopoverChildrensPalletComponent,
    cssClass: 'popoverChildrensPalletComponent',
    componentProps: { item:obj, count:true},
  });
  await popover.present();

  const { data } = await popover.onDidDismiss();

     if(data.line != undefined)this.counting(data.line);
 }

 async counting(obj){

  const popover = await this.popoverController.create({
    component: PopoverCountingComponent,
    cssClass: 'popoverCountingComponent',
    componentProps: {list:obj},
    backdropDismiss: false
    
  });
  await popover.present();
  const { data } = await popover.onDidDismiss();

  if(data.qty != undefined) this.WritePI(data.obj,data.qty,data.seriales,data.type);
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
          
          if(!res.Error && res.length > 0){
            this.bin = code.toUpperCase();
            console.log(this.lists);
            res.map(async x => {    
              let obj = this.lists.find(obj => obj.PLULPDocumentNo ===  x.LPHeader || obj.PLUParentLPNo === x.LPHeader);
              console.log(obj);
              if(obj.PLUParentLPNo === null){
                obj['seriales'] = x.Lines;
                obj.QtyPhysInventory = 0;
                x.Lines.map(i =>  {this.quantity+= i.Quantity; obj.QtyPhysInventory+=i.Quantity}); 
                 obj.QtyCalculated = obj.QtyPhysInventory;              
                let line = this.lps.find(x => x.PLULPDocumentNo === obj.PLULPDocumentNo);
                 if(line === null || line === undefined)this.lps.push(obj);          
               
               console.log(obj);
              }else{

                let pallet = {
                  PLULPDocumentNo: "",
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
                pallet.PLULPDocumentNo = lp.PLULPDocumentNo;
                pallet.BinCode = lp.PLUBinCode;
                pallet.type = lp.PLULPDocumentType;
                console.log(pallet,x);

               x.Lines.filter(lp => {            

                  console.log(lp);
                  let line = this.lists.find(x => x.PLULPDocumentNo === lp.No);
                  if(line != undefined){
                    line['seriales'] = lp.Childs;
                    line.QtyPhysInventory = 0;
                    lp.Childs.map(i => {this.quantity+= i.Quantity;line.QtyPhysInventory+=i.Quantity });
                    line.QtyCalculated = line.QtyPhysInventory;
                    pallet.childrens.push(line);
                  }              
               });

               this.lps.push(pallet);
               console.log(pallet);

              }                     
              
            
            });

        //    this.lists.map(x => x.BinCode === code.toUpperCase()?this.quantity+= x.QtyPhysInventory:x);
           
            this.intServ.loadingFunc(false);
          }else{
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error','', `The bin ${code.toUpperCase()}  does not exist`));
          }
          break;

          case false:
            console.log(code)

          let line = this.lps.find(x => x.PLULPDocumentNo === code.toUpperCase() || x.ItemNo === code.toUpperCase());
        
          let res1 = await this.wmsService.GetBinContent_LP(this.bin,'WMS');
          let x  = res1.find(x => x.LPHeader === code.toUpperCase());

          if(line != undefined)this.PopoverCounting(line);
          console.log(x,this.lists,line);
          if((line === undefined || line === null) && x != undefined){
            this.intServ.loadingFunc(true);
            
           // let x = await res1.map(x => x.LPHeader === code.toUpperCase());
              let line2 = this.lists.find(obj => obj.PLULPDocumentNo ===  x.LPHeader || obj.PLUParentLPNo === x.LPHeader);
              console.log(line2);
              if(line2.PLUParentLPNo === null){
                line2['seriales'] = x.Lines;
                line2.QtyPhysInventory = 0;
               x.Lines.map(i => line2.QtyPhysInventory+=i.Quantity); 
                line2.QtyCalculated = line2.QtyPhysInventory;
                
                this.lps.push(line2);          
               
               console.log(line2);
               this.PopoverCounting(line2);
              }else{

                let pallet = {
                  PLULPDocumentNo: "",
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
                pallet.PLULPDocumentNo = lp.PLULPDocumentNo;
                pallet.BinCode = lp.PLUBinCode;
                pallet.type = lp.PLULPDocumentType;
                console.log(pallet,x);

               x.Lines.filter(lp => {            

                  console.log(lp);
                  let line = this.lists.find(x => x.PLULPDocumentNo === lp.No);
                  if(line != undefined){
                    line['seriales'] = lp.Childs;
                    line.QtyPhysInventory = 0;
                    lp.Childs.map(i => {this.quantity+= i.Quantity;line.QtyPhysInventory+=i.Quantity });
                    line.QtyCalculated = line.QtyPhysInventory;
                    pallet.childrens.push(line);
                  }              
               });

               this.lps.push(pallet);
               console.log(pallet);
               this.PopoverCounting(pallet);

              }                     
              
            
            

          //  this.lists.map(x => x.BinCode === this.bin?this.quantity+= x.QtyPhysInventory:x);
           
            this.intServ.loadingFunc(false);
            
          }
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
        backdropDismiss: false
      });
      this.intServ.loadingFunc(false);
      await popover.present();

      const { data } = await popover.onDidDismiss();

      if(data.line != undefined)this.counting(data.line);

      console.log(data);

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
  let  resR = await this.wmsService.PreRegister_WarehouseInvPhysicalCount(this.locate,this.template,this.batch);
  let Nocount = await this.wmsService.listTraking(resR.Warehouse_Physical_Inventory_NoCounted);
  this.storage.set('Nocount',Nocount);
  this.router.navigate(['page/wms/physicalNoCount']);
}

  async WritePI(obj:any,qty:any,seriales:any,type:any){

    this.intServ.loadingFunc(true);

     let listI:any[] = [];
  
     let lists:any[] = [];

     switch(type){
      case 'serial':
        obj.seriales.map(x => {
          let line = this.listPhysical.find(o => x.SerialNo === o.SerialNo);
          this.listaCount.push(line);
          console.log(line);
          let line2 = seriales.find(k => k.SerialNo === x.SerialNo);
          if(line2 === undefined || line2 === null)line.QtyPhysInventory = 0;
          this.counted += line.QtyPhysInventory;
          listI.push(line);     
       });
        break;

      default:
        obj.seriales.map(x => {
          let line = this.listPhysical.find(o => x.LPDocumentNo === o.PLULPDocumentNo);
          this.listaCount.push(line);
          console.log(line);
          line.QtyPhysInventory = qty;
          this.counted += line.QtyPhysInventory;
          listI.push(line);   
        });
        break;
     }
   
   
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
           name: "PLULPDocumentNo",
           value: inv.PLULPDocumentNo,      
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
           name: "PLULPDocumentNo",
           value: "",      
         }]
       };
   
     });

    

     try {
   
       let res = await this.wmsService.Write_WarehouseInvPhysicalCount(lists);
   
       if(res.Error) throw new Error(res.Error.Message);
          
     //  if(res.error) throw new Error(res.error.message);

     //  if(res.message) throw new Error(res.message);
   
       console.log(res);
   
     this.lps.map((j,i) => (j.PLULPDocumentNo === obj.PLULPDocumentNo || j.PLULPDocumentNo === obj.PLUParentLPNo)?this.lps.splice(i,1):j);
            
      let res3 = await this.wmsService.Get_WarehouseInvPhysicalCount(this.locate,this.template,this.batch);

      if(res3.Error) throw new Error(res3.Error.Message);
      if(res3.error) throw new Error(res3.error.message);
      if(res3.message) throw new Error(res3.message);
      
           
    let  items = await this.wmsService.listTraking(res3.Warehouse_Physical_Inventory_Journal);


     this.storage.set('inventory',items);

     this.lists = await  this.storage.get('inventory');
     this.intServ.loadingFunc(false);

     this.intServ.alertFunc(this.js.getAlert('success', '', 'Successful'));
   
     //  console.log(resR);
       
       
     } catch (error) {
   
       this.intServ.loadingFunc(false);
       this.intServ.alertFunc(this.js.getAlert('error','', error.message));
       
     }
   
   
   }
     
 async  Register(){

  this.intServ.alertFunc(this.js.getAlert('alert','',`Are you sure to finish the count in the bin ${this.bin}?`, async() => {

    let lists = [];
    let listNoCount = [];
    this.lists.map(x => {if(x.BinCode === this.bin){
      let line = this.listaCount.find(i => x.PLULPDocumentNo === i.PLULPDocumentNo);
      if(line === null || line === undefined){
        x.QtyPhysInventory = 0;
        listNoCount.push(x);
      }
    }});

    
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
 
    
    listNoCount.filter(inv => {
  
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
          name: "PLULPDocumentNo",
          value: inv.PLULPDocumentNo,      
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
          name: "PLULPDocumentNo",
          value: "",      
        }]
      };
  
    });

    try {

      let res = await this.wmsService.Write_WarehouseInvPhysicalCount(lists);
   
      if(res.Error) throw new Error(res.Error.Message);
  
       
      if(res.error) throw new Error(res.error.message);

      if(res.message) throw new Error(res.message);

      let res2 = await this.wmsService.Register_WarehouseInvPhysicalCount(this.locate);

      if(res2.Error) throw new Error(res2.Error.Message);
  
       
      if(res2.error) throw new Error(res2.error.message);

      if(res2.message) throw new Error(res2.message);
  
      this.lps = [];
      this.listaCount = [];
      this.bin = '';
      let res3 = await this.wmsService.Get_WarehouseInvPhysicalCount(this.locate,this.template,this.batch);

      if(res3.Error) throw new Error(res3.Error.Message);
      if(res3.error) throw new Error(res3.error.message);
      if(res3.message) throw new Error(res3.message);
      
           
    let  items = await this.wmsService.listTraking(res3.Warehouse_Physical_Inventory_Journal);


     this.storage.set('inventory',items);

     this.lists = await  this.storage.get('inventory');
      
    } catch (error) {
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error','', error.message));
    }
  }));
   

   }
  
}
