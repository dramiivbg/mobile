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

  public boolean:Boolean = true;
  public lps: any[] = [];

  public listPallet:any;

  public wareReceipts: any;


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

    console.log('pallet =>',this.listPallet);

    
    this.intServ.loadingFunc(false);
    
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


 delete(item:any){

    this.intServ.alertFunc(this.js.getAlert('confirm', '', `Are you sure you want to delete the Pallet ${item.LPDocumentNo}?`, async() => {

      this.intServ.loadingFunc(true);
      try {

          
        let res = await this.wmsService.DeleteLPPallet_FromWarehouseReceiptLine(item.LPDocumentNo);

         if(res.Error) throw new Error(res.Error.Message);
         
        
         this.listPallet.filter((pallet,index) => {
  
  
          if(pallet.LPDocumentNo === item.LPDocumentNo){
  
             this.listPallet.splice(index,1);
  
          }
        });
  
        this.intServ.loadingFunc(false);
     
        this.intServ.alertFunc(this.js.getAlert('success', '', `The pallet ${item.LPDocumentNo} has been removed correctly`));
    
  
  
            
          } catch (error) {
  
            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
            
          }
      
    }))


  
  }


  




}
