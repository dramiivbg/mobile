import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterEvent } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverOptionsComponent } from '../popover-options/popover-options.component';

@Component({
  selector: 'app-list-pallet',
  templateUrl: './list-pallet.component.html',
  styleUrls: ['./list-pallet.component.scss'],
})
export class ListPalletComponent implements OnInit {

  public routExtras: any;

  public listPallet: any;

  public lpsNo: any[] = [];

  public lps: any[] = [];

  public wareReceipts: any;
  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router, private popoverController: PopoverController,private barcodeScanner: BarcodeScanner) {

    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.routExtras = this.router.getCurrentNavigation().extras.state;

      
        
      } else {
        this.router.navigate(['page/wms/wmsReceipt'], { replaceUrl: true });
      }
    });
   }

  async ngOnInit() {


    if(this.routExtras != undefined){

      let wareReceipts = this.routExtras.wareReceipts;
      let pallet = this.routExtras.pallet;
      localStorage.setItem('wareReceipts', JSON.stringify(wareReceipts));
      localStorage.setItem('pallet', JSON.stringify(pallet));

      
    }

    console.log(localStorage.getItem('wareReceipts'));
     // console.log(localStorage.getItem('pallet'));



    this.wareReceipts = (this.routExtras != undefined) ? this.routExtras.wareReceipts : localStorage.getItem('wareReceipts'); 

    this.listPallet = (this.routExtras  != undefined) ? this.routExtras.pallet :  localStorage.getItem('pallet');

    console.log('pallet =>',this.listPallet);

    this.intServ.loadingFunc(false);



    this.listPallet.filter(lp => {



      let f  = new  Date(lp.fields[0].SystemCreatedAt);

      let fecha = f.getDate()+'/'+(f.getMonth()+1)+'/'+f.getFullYear();
      
      
    lp.fields[0].SystemCreatedAt = fecha;
   
   
    
   
     
     



    })
    



    this.intServ.loadingFunc(false);



    



  }


  public onBack() {
    this.router.navigate(['page/wms/wmsReceipt'], { replaceUrl: true });
  }


  listLpOrItems(item:any){


    console.log(item);


   let listItem: any[] = []

   let listLp: any[] = [];
   let listP: any[] = [];



   console.log('LP =>',item)


   item.fields.filter((lp, index) => {


    if(lp.PLUType == 'LP'){

      listLp.push(item.fields[index]);


    }else if(lp.PLUType == 'Item'){


      listItem.push(item.fields[index]);


    }else{


      listP.push( item.fields[index]);

    }
   })


   let pallet = item;

   let pallets = this.listPallet;

   let wareReceipts = this.wareReceipts;

    let navigationExtras: NavigationExtras = {
      state: {
        listItem, 
        listLp,
        listP,
        pallet,
        wareReceipts,
        pallets,
        new: false
      },
      replaceUrl: true
    };
    this.router.navigate(['page/wms/lists'], navigationExtras);

    


  }


  delete(item:any){


    let line:any = undefined;
    this.intServ.alertFunc(this.js.getAlert('confirm', '', `You are sure to delete the Pallet ${item.fields[0].PLULPDocumentNo} `, async() => {


      this.intServ.loadingFunc(true);

  

      let res = await this.wmsService.DeleteLPPallet_FromWarehouseReceiptLine(item.fields[0].PLULPDocumentNo);

      if(!res.Error){

        this.listPallet.filter((pallet,index) => {


          if(pallet.fields[0].PLULPDocumentNo === item.fields[0].PLULPDocumentNo){



            this.listPallet.splice(index,1);


          }
        })
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `The pallet ${item.fields[0].PLULPDocumentNo} has been removed correctly`));
      
      }else{

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', res.Error.Message));
      }
    }));


  }





}
