import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterEvent } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverOptionsComponent } from '../popover-options/popover-options.component';
import { Storage } from '@ionic/storage';
import { parse } from 'path';

@Component({
  selector: 'app-list-pallet',
  templateUrl: './list-pallet.component.html',
  styleUrls: ['./list-pallet.component.scss'],
})
export class ListPalletComponent implements OnInit {

  public lpsNo: any[] = [];

  public lps: any[] = [];

  public listPallet:any;

  public listLP:any;

  public wareReceipts: any;

  public boolean:boolean = true;

  public QtyPallet = 0;

  public QtyLP = 0;

  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router, private popoverController: PopoverController
    ,private barcodeScanner: BarcodeScanner,private modalCtrl: ModalController,
    private storage: Storage) {

   
   }

  async ngOnInit() {

    this.wareReceipts = await this.storage.get(`wareReceipt`);

    this.listPallet = await this.storage.get(`${this.wareReceipts.No}, pallet`); 
    this.listLP = await this.storage.get(`${this.wareReceipts.No}, LP Single`); 
    this.listLP.map(x => {
      x['qty'] = 0 
      x.LPLines.map(i => x.qty += i.PLUQuantity);
    });

    this.QtyPallet = this.listPallet.length;
    this.QtyLP = this.listLP.length;

    console.log('pallet =>',this.listPallet);
    console.log('single =>',this.listLP);
    
    this.intServ.loadingFunc(false);
    
  }

  listSerial(item:any){

   
  }

  listLpOrItems(item:any){


    console.log(item);


   let listItem: any[] = []

   let listLp: any[] = [];
   let listP: any[] = [];



   console.log('LP =>',item)


   item.LPLines.filter((lp, index) => {

    switch(lp.PLULPDocumentType){
      case 'Single':
        let find  = listLp.find(x => x.PLULPDocumentNo === lp.PLULPDocumentNo);
        (find === undefined)?listLp.push(lp): find.PLUQuantity += lp.PLUQuantity;
        break

      default:
        listItem.push(lp);
        break;
    }

   });


   let pallet = item;

 
   this.storage.set(`${pallet.LPDocumentNo} listItem`, listItem);
   this.storage.set(`${pallet.LPDocumentNo} listLp`, listLp);
   this.storage.set(`pallet`, pallet);

    this.router.navigate(['page/wms/lists']);

  }


async delete(item:any){

 
this.intServ.alertFunc(this.js.getAlert('confirm', '', item.LPDocumentType == "Pallet"?`Are you sure you want to delete the Pallet ${item.LPDocumentNo}?`:
 `Are you sure you want to delete the LP Single ${item.LPDocumentNo}?`, async() => {
  this.intServ.loadingFunc(true);
    switch(item.LPDocumentType){

      case "Pallet":
      

      try {

          
        let res = await this.wmsService.DeleteLPPallet_FromWarehouseReceiptLine(item.LPDocumentNo);

         if(res.Error) throw new Error(res.Error.Message);
         if(res.error) throw new  Error(res.error.message);
         
        
         this.listPallet.filter((pallet,index) => {
  
  
          if(pallet.LPDocumentNo === item.LPDocumentNo){
  
             this.listPallet.splice(index,1);
  
          }
        });
  
        this.intServ.loadingFunc(false);
     
        this.intServ.alertFunc(this.js.getAlert('success', '', `The pallet ${item.LPDocumentNo} has been removed correctly`, 
            () => {

              this.listPallet.map((x,i) => {if(x.LPDocumentNo === item.LPDocumentNo)this.listPallet.splice(i,1)});
              this.storage.set(`${this.wareReceipts.No}, pallet`, this.listPallet); 

              this.QtyPallet = this.listPallet.length;

            }));
    
  
  
            
          } catch (error) {
  
            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
            
          }

          break;

          default:
      
          try {
      
            let lpD = await this.wmsService.DeleteLPSingle_FromWarehouseReceiptLine(item.LPDocumentNo);
      
            if(lpD.Error) throw new Error(lpD.Error.Message);
            if(lpD.error) throw new  Error(lpD.error.message);
          
            
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('success', '', `The license plate ${item.LPDocumentNo} has been successfully deleted`, () => {
            
              this.listLP.map((x,i) => {if(x.LPDocumentNo === item.LPDocumentNo)this.listLP.splice(i,1)});

              this.storage.set(`${this.wareReceipts.No}, LP Single`, this.listLP); 

              this.QtyLP = this.listLP.length;
           
            }));
         
         } catch (error) {
           
           this.intServ.loadingFunc(false);
           this.intServ.alertFunc(this.js.getAlert('error', '', error.message))
         }
      
            break;
        }
      
    }));
  
  }


  enableLP(){

    this.boolean = false;
  }

enablePallet(){
 this.boolean = true;
}


deleteAll(){

  switch(this.boolean){
    case true:
      console.log(this.listPallet);
      break;

    default:
      console.log(this.listLP);
      break;

  }
}


}
