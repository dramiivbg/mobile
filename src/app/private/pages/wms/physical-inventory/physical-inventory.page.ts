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
  public listCounted = [];
  public listBin = [];
  public data = '';
  public lpsT:any[] = [];
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
        let res = await this.wmsService.GetBinContent_LP(code.toUpperCase(), this.locate);
  
        switch(this.bin === '' || !res.Error){

          case true:
          this.lps = [];
          this.intServ.loadingFunc(true);
          console.log(res);
          
          if(!res.Error){
            this.bin = code.toUpperCase();
            console.log(this.lists);

            res.map(async x => {   
              console.log(x); 
              let obj = this.lists.find(j => j.PLULPDocumentNo ===  x.LPHeader || j.PLUParentLPNo === x.LPHeader);
              console.log(obj);
             if(obj != undefined){
              switch(obj.PLUParentLPNo === null){
                case true:
                x.Lines.map(j => {
                  let find  = this.lists.find(o => o.PLULPDocumentNo === j.LPDocumentNo);
                  if(find != undefined)j.Quantity = find.QtyPhysInventoryBase;
                });

                obj['seriales'] = x.Lines;
                obj.QtyPhysInventory = 0;
                x.Lines.map(i =>  {this.quantity+= i.Quantity; obj.QtyPhysInventory+=i.Quantity}); 
                 obj.QtyCalculated = obj.QtyPhysInventory;  
                 obj.QtyPhysInventoryBase = obj.QtyPhysInventory;          
                let line = this.lps.find(x => x.PLULPDocumentNo === obj.PLULPDocumentNo);
                 if(line === null || line === undefined)this.lps.push(obj);
                        
               
               break;
              
               default:

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
                    lp.Childs.map(j => {
                      let find  = this.lists.find(o => o.PLULPDocumentNo === j.LPDocumentNo);
                     if(find != undefined)j.Quantity = find.QtyPhysInventoryBase;
                    });
                    line['seriales'] = lp.Childs;
                    line.QtyPhysInventory = 0;
                    lp.Childs.map(i => {this.quantity+= i.Quantity;line.QtyPhysInventory+=i.Quantity });
                    line.QtyCalculated = line.QtyPhysInventory;
                    obj.QtyPhysInventoryBase = obj.QtyPhysInventory;   
                    pallet.childrens.push(line);
                  }              
               });

               this.lps.push(pallet);
               console.log(pallet);

               break;

              }       
             }           
            
            });

            var time =   setTimeout(() => {
              
              this.intServ.loadingFunc(false);   
              clearTimeout(time);
              
             }, 100);
                 

          }else{
            let res = await this.wmsService.getLpNo(code.toUpperCase());
            let resI = await this.wmsService.GetItem(code.toUpperCase());
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error','', (res.Error && resI.Error)?`The bin ${code.toUpperCase()}  does not exist`:`Please scan a bin!` ));
          }
          break;

          case false:
            console.log(code)

          let line = this.lps.find(x => x.PLULPDocumentNo === code.toUpperCase() || x.ItemNo === code.toUpperCase());
        
          let res1 = await this.wmsService.GetBinContent_LP(this.bin,this.locate);
          let x  = res1.find(x => x.LPHeader === code.toUpperCase());

          if(line != undefined){
            this.PopoverCounting(line);
            return;
          }
          console.log(x,this.lists,line);
          if((line === undefined || line === null) && x != undefined){
            this.intServ.loadingFunc(true);
            
           // let x = await res1.map(x => x.LPHeader === code.toUpperCase());
              let line2 = this.lists.find(obj => obj.PLULPDocumentNo ===  x.LPHeader || obj.PLUParentLPNo === x.LPHeader);
              console.log(line2);
              if(line2.PLUParentLPNo === null){
                x.Lines.map(j => {
                  let find  = this.lists.find(o => o.PLULPDocumentNo === j.LPDocumentNo);
                  if(find != undefined)j.Quantity = find.QtyPhysInventoryBase;
                });
                line2['seriales'] = x.Lines;
                line2.QtyPhysInventory = 0;
               x.Lines.map(i => line2.QtyPhysInventory+=i.Quantity); 
                line2.QtyCalculated = line2.QtyPhysInventory;
                line2.QtyPhysInventoryBase = line2.QtyPhysInventory;   
                
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
                    lp.Childs.map(j => {
                      let find  = this.lists.find(o => o.PLULPDocumentNo === j.LPDocumentNo);
                      if(find != undefined)j.Quantity = find.QtyPhysInventoryBase;
                    });
                    line['seriales'] = lp.Childs;
                    line.QtyPhysInventory = 0;
                    lp.Childs.map(i => {this.quantity+= i.Quantity;line.QtyPhysInventory+=i.Quantity });
                    line.QtyCalculated = line.QtyPhysInventory;
                    line.QtyPhysInventoryBase = line.QtyPhysInventory;   
                    pallet.childrens.push(line);
                  }              
               });

               this.lps.push(pallet);
               console.log(pallet);
               this.PopoverCounting(pallet);

              }                     
              
            
            

          //  this.lists.map(x => x.BinCode === this.bin?this.quantity+= x.QtyPhysInventory:x);
           
            this.intServ.loadingFunc(false);
            
          }else{

            this.intServ.loadingFunc(true);
            let find = this.lists.find(obj => obj.PLULPDocumentNo ===  code.toUpperCase() || obj.PLUParentLPNo === code.toUpperCase());
            
            switch(find){

              case undefined || null:
                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.js.getAlert('error','', 'Does not exist in the inventory'));
                break;

              default:
            
              let res = await this.wmsService.getLpNo(code.toUpperCase());
              let resI = await this.wmsService.GetItem(code.toUpperCase());

              let item = await this.wmsService.listItem(resI);
              let lp = await this.wmsService.listSetup(res.LicensePlates.LicensePlatesHeaders);
              if((lp.PLULPDocumentType === "Single" && find.PLUParentLPNo === null)  || lp.PLULPDocumentType === "Pallet"){

                console.log(lp);
                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.js.getAlert('confirm','',(res.Error)?`The Item ${code.toUpperCase()} is registered in the system in the Bin ${find.BinCode}, Do you want to tell it in this Bin?`
                :(lp.PLULPDocumentType === "Single")?`The LP ${code.toUpperCase()} is registered in the system in the Bin ${find.BinCode}, Do you want to tell it in this Bin?`
                :`The Pallet ${code.toUpperCase()} is registered in the system in the Bin ${find.BinCode}, Do you want to tell it in this Bin?` ,async() => {
  
                  this.intServ.loadingFunc(true);
                  try {
  
  
                    if(!res.Error){
  
                      let resB = await this.wmsService.MoveBinToBin_LP(lp.PLULPDocumentNo,find.ZoneCode,find.BinCode,this.bin,find.LocationCode);
  
                      if(res.Error) throw new Error(res.Error.Message);
                      if(res.error) throw new Error(res.error.message);
                      if(res.message) throw new Error(res.message);
  
                      let res3 = await this.wmsService.Get_WarehouseInvPhysicalCount(this.locate,this.template,this.batch);
  
                      if(res3.Error) throw new Error(res3.Error.Message);
                      if(res3.error) throw new Error(res3.error.message);
                      if(res3.message) throw new Error(res3.message);
                      
                           
                    let  items = await this.wmsService.listTraking(res3.Warehouse_Physical_Inventory_Journal);
                
                
                     this.storage.set('inventory',items);
                
                     this.lists = await  this.storage.get('inventory');
  
                     let i = this.lists.find(obj => obj.PLULPDocumentNo ===  code.toUpperCase() || obj.PLUParentLPNo === code.toUpperCase());
  
                     console.log(i);
  
  
                    }
                
                             
                    
                  } catch (error) {
                    this.intServ.loadingFunc(false);
                    this.intServ.alertFunc(this.js.getAlert('error','',error.message));
                    
                  }
            
                }));
              }else{
                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.js.getAlert('alert','',(res.Error)?`The Item ${code.toUpperCase()} belongs to the pallet ${find.PLUParentLPNo}`
                :(lp.PLULPDocumentType === "Single")?`The LP ${code.toUpperCase()} belongs to the pallet ${find.PLUParentLPNo}`
                :`The Pallet ${code.toUpperCase()} belongs to the pallet ${find.PLUParentLPNo}`));
              }
          
                break;
            }
           
          }
            break;     

        }

        this.lpsT = this.lps;
             
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
      let boolean = false;
      if(item.seriales.length > 0){

        item.seriales.map(x => {x['proceded'] = false; list.push(x); boolean = x.Quantity > 1?true:false });
    
        const popover = await this.popoverController.create({
          component: PopoverListSNComponent,
          cssClass: 'popoverListSNComponent-modal',
          componentProps: { list, boolean},
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
  let  resR = await this.wmsService.PreRegister_WarehouseInvPhysicalCount(this.locate,this.template,this.batch);

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
          console.log(line);
          let line2 = seriales.find(k => k.SerialNo === x.SerialNo);
          if(line2 === undefined || line2 === null){
            line.QtyPhysInventory = 0;
          }else{
            this.listaCount.map((x,i) => x.LineNo === line.LineNo?this.listaCount.splice(i,1):x);        
            this.listaCount.push(line);
          }
          for (const key in this.listCounted) {
            if (line.LineNo === Number(key)) {
              console.log(key);
              this.counted-= line.QtyPhysInventory;
              
            }
          }
          this.listCounted[line.LineNo] = line.QtyPhysInventory;
          this.counted += line.QtyPhysInventory;
          listI.push(line);     
       });
        break;

      default:
        obj.seriales.map(x => {
          let line = this.listPhysical.find(o => x.LPDocumentNo === o.PLULPDocumentNo);
          this.listaCount.map((x,i) => x.LineNo === line.LineNo?this.listaCount.splice(i,1):x); 
          this.listaCount.push(line);
          console.log(line);
          for (const key in this.listCounted) {
            console.log('line =>',key)
            if (line.LineNo === Number(key)) {
              console.log(key);
              this.counted-= line.QtyPhysInventory;
              
            }
          }
          this.listCounted[line.LineNo] = qty;
          line.QtyPhysInventory = qty;
          this.counted += line.QtyPhysInventory;
          listI.push(line);   
        });
        break;
     }

     console.log(this.listCounted);
   
   
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

    console.log('update =>',items);

    this.storage.set('inventory',items);

     this.lists = items;
     this.intServ.loadingFunc(false);

     this.intServ.alertFunc(this.js.getAlert('success', '', 'Successful'));
   
     //  console.log(resR);
       
       
     } catch (error) {
   
       this.intServ.loadingFunc(false);
       this.intServ.alertFunc(this.js.getAlert('error','', error.message));
       
     }
   
   
   }
     
 async  onRegister(){

  let lists = [];
  let listNoCount = [];
  let QtyNoCount = 0;
  let listDelet = [];
  this.lists.map(x => {if(x.BinCode === this.bin){
  let line = this.listaCount.find(i => x.PLULPDocumentNo === i.PLULPDocumentNo);
  if(line === null || line === undefined){
      listNoCount.push(x);
      QtyNoCount += x.QtyPhysInventoryBase;
    }
  }});

  this.intServ.alertFunc(this.js.getAlert('res', (listNoCount.length > 0)?`Are you sure to finish the count in the bin ${this.bin}?`:'',(listNoCount.length > 0)?String(QtyNoCount):`Are you sure to finish the count in the bin ${this.bin}?`, async() => {

    this.intServ.loadingFunc(true);

    let  listD = {
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
        name: "LocationCode",
        value: "",   
      },
  
      {
        name: "LPDocumentNo",
        value: "",      
      }]
    };

 
 
    

       listNoCount.filter(async x => {
       if(x.PLUParentLPNo === null && x.PLULPDocumentNo != null){

        try {

          let res =  await this.wmsService.MoveBinToBin_LP(x.PLULPDocumentNo,x.ZoneCode,x.BinCode,"NOCOUNT",x.LocationCode);
       
       console.log(res);

       if(res.Error) throw new Error(res.Error.Message);
      
       if(res.error) throw new Error(res.error.message);

       if(res.message) throw new Error(res.message);
       

        listD = {
          name: "WarehouseJournalLine",
          fields: [ {
            name: "JournalTemplateName",
            value: x.JournalTemplateName,
          },
          {
          
            name: "JournalBatchName",
            value: x.JournalBatchName,
          },
          {
            name: "LineNo",
            value: x.LineNo,
          },
         
          {
            name: "LocationCode",
            value: x.LocationCode,   
          },
      
          {
            name: "LPDocumentNo",
            value: x.PLULPDocumentNo,      
          }]
        };
  
  
     let res2 =  await this.wmsService.Delete_WarehouseInvPhysicalCount(listD);

        
       if(res2.Error) throw new Error(res2.Error.Message);
      
       if(res2.error) throw new Error(res2.error.message);

       if(res2.message) throw new Error(res2.message);
       
  
        listD = {
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
            name: "LocationCode",
            value: "",   
          },
      
          {
            name: "LPDocumentNo",
            value: "",      
          }]
        };
          
        } catch (error) {
          this.intServ.loadingFunc(false);
          this.intServ.alertFunc(this.js.getAlert('error','', error.message));
        }
      
      }
    
      });
     
    try {

      let res2 = await this.wmsService.Register_WarehouseInvPhysicalCount(this.locate, this.template,this.batch);

      if(res2.Error) throw new Error(res2.Error.Message);
  
       
      if(res2.error) throw new Error(res2.error.message);

      if(res2.message) throw new Error(res2.message);

      let res = new Date();
      
      let month = (res.getMonth()+1 < 10)?'0'+(res.getMonth()+1):res.getMonth()+1;
  
      let day = (res.getDate() < 10)?'0'+res.getDate():res.getDate();
  
      let fecha = res.getFullYear()+'-'+month+'-'+day;

      let res4 = await this.wmsService.Create_WarehouseInvPhysicalCount("STO","",this.locate,fecha,"TOO",this.template,this.batch);

      if(res4.Error) throw new Error(res4.Error.Message);
      if(res4.error) throw new Error(res4.error.message);
      if(res4.message) throw new Error(res4.message);
        
      this.lps = [];
      this.listaCount = [];
      this.bin = '';
  
    let  items = await this.wmsService.listTraking(res4.Warehouse_Physical_Inventory_Journal);


     this.storage.set('inventory',items);

     this.lists = await  this.storage.get('inventory');

     this.intServ.loadingFunc(false);
     this.bin = '';
     this.intServ.alertFunc(this.js.getAlert('success', '',`Bin ${this.bin} has been successfully registered`))
      
    } catch (error) {
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error','', error.message));
    }
  }));
   

   }

  async onSyncTemp(){

    try {

      this.intServ.loadingFunc(true);
      let res = await this.wmsService.Get_WarehouseInvPhysicalCount(this.locate,this.template,this.batch);

      if(res.Error) throw new Error(res.Error.Message);
      if(res.error) throw new Error(res.error.message);
      if(res.message) throw new Error(res.message);
      
           
    let  items = await this.wmsService.listTraking(res.Warehouse_Physical_Inventory_Journal);
  
    console.log('update =>',items);
  
    this.storage.set('inventory',items);
  
    this.lists = items;

    console.log(this.lists);

    this.intServ.loadingFunc(false);

    this.intServ.alertFunc(this.js.getAlert('success', '', 'Synchronized correctly'));
      
    } catch (error) {

      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
      
    }

   }

   
  autoComplet() {

    this.barcodeScanner.scan().then(
      async (barCodeData) => {


        let code = barCodeData.text;

        this.data = code.toUpperCase();


        this.onFilter('', this.data);



      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }


  onFilter(e, data: any = '') {

    switch (data) {
      case '':
        let val = e.target.value;

        console.log(val);

        if (val === '') {
          this.lps = this.lpsT;
        } else {
          this.lps = this.lpsT.filter(
            x => {
              return (x.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
            }
          )

      
        }
        break;

      default:


        this.lps = this.lpsT.filter(
          x => {
            return (x.PLULPDocumentNo.toLowerCase().includes(data.toLowerCase()));
          }
        )


        break;
    }

  }
  
}
