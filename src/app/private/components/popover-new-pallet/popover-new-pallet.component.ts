import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

import { SqlitePlureService} from '@svc/sqlite-plure.service';
import { AsyncLocalStorage } from 'async_hooks';


@Component({
  selector: 'app-popover-new-pallet',
  templateUrl: './popover-new-pallet.component.html',
  styleUrls: ['./popover-new-pallet.component.scss', './popover-new-pallet.component.css'],
})
export class PopoverNewPalletComponent implements OnInit {

  public boolean: Boolean = true;
 
  
  
  public items:any[] = [];

  public itemsL:any[] = [];
  public itemsLT:any[];


  public lpsNo: any[] = [];

  public lps: any[] = [];

  public lpsL: any[] = [];
  public lpsLT: any[];
  public pallet: any[] = [];

  public listLp: any[] = [];

  public wareReceipts:any;
  
  public listsFilter: any[] = [];
  public listT: any[] = []; 
  public list:any[] = [];


  public lp:any;
  public item:any;
  
  constructor(public intServ: InterceptService, public generalService:GeneralService, public wmsService:WmsService,
    public router: Router,public popoverController: PopoverController , private barcodeScanner: BarcodeScanner, private js: JsonService
    , private route: ActivatedRoute, private sqliteService: SqlitePlureService,
   ) { 


    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.pallet = this.router.getCurrentNavigation().extras.state.pallet;

        this.lp = this.router.getCurrentNavigation().extras.state.lp;
        
        this.item = this.router.getCurrentNavigation().extras.state.item;

        if(this.lp !== undefined){


   
        localStorage.setItem('lp', JSON.stringify(this.lp))
      
        let lp =   JSON.parse(localStorage.getItem('lp'));

         console.log(lp.fields.PLULPDocumentNo);
        }

    
        if(this.item !== undefined){


          localStorage.setItem('item', JSON.stringify(this.item))


      let item = JSON.parse(localStorage.getItem('item'));

      console.log(item);


        }

      
     
      } else {
        this.router.navigate(['page/wms/wmsMain'], { replaceUrl: true });
      }

    this.intServ.loadingFunc(false);
  });

}



public onBack() {
  this.router.navigate(['page/wms/wmsReceipt'], { replaceUrl: true });
}

 async  ngOnInit() {


   this.wareReceipts = this.wmsService.get();


 

  
  }


  



onBarCode(){

  let line:any = undefined;

  this.barcodeScanner.scan().then(
  async  (barCodeData) => {
      let code = barCodeData.text;




     
  for (const key in this.list) {


    if (this.list[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {line = this.list[key];this.intServ.loadingFunc(false); break; }

      
    }

    if (line === null || line === undefined) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', `The license plate '${code}' does not exist on the receipt`));
      this.intServ.loadingFunc(false);
    } else {

      this.boolean = true;
      this.listsFilter.push(line);
      this.listT.push(line);
    }


  
    }
  ).catch(
    err => {
      console.log(err);
    }
  )

}

 async  onSubmit(pallet:any){


  this.intServ.loadingFunc(true);
  let listLP: any[] = [];

  let obj = {

    LP_Pallet_Child_No: ""
  }

  this.listsFilter.filter(lp =>{


    obj.LP_Pallet_Child_No = lp.fields.PLULPDocumentNo;

    listLP.push(obj);

    obj = {

      LP_Pallet_Child_No: ""
    }
  });




  let res = await this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR(this.wareReceipts.No,pallet.LPPallet_DocumentNo,listLP);


  console.log(res);

  if(res.IsProcessed){

    this.popoverController.dismiss({});
    this.intServ.loadingFunc(false);

    this.intServ.alertFunc(this.js.getAlert('success', 'success', `the license plate were successfully assigned with the No  '${res.Remnant_LPChilds}' `));


  }else{
 
    this.popoverController.dismiss({});
    this.intServ.loadingFunc(false);

    this.intServ.alertFunc(this.js.getAlert('error', 'Error', res.Error.Message));


  }

  
  
}


async listLpOrItem(pallet:any){


 
  this.boolean = false;



  


  
    let lps = await this.wmsService.Calcule_Possible_LPChilds_From_WR(pallet.LPPallet_DocumentNo);
    
    let items = await this.wmsService.Calcule_Possible_ItemChilds_From_WR(pallet.LPPallet_DocumentNo);


    this.items = items;
    
    this.lpsNo = lps.Possible_LPChilds.split("|");


      
    this.lpsNo.filter(async(no) => {

      let lps = await this.wmsService.getLpNo(no);

      let lp = await this.wmsService.ListLp(lps);
    
      this.lps.push(lp);
      
    });


  
 

  
  


}




applyLP(lp:any){

this.items = [];
this.lps = [];

  this.lpsLT = [];    
  this.boolean = true;
 
  this.lpsL.push(lp);
  this.lpsLT.push(lp);

  console.log(this.lpsL);
      
      
    
    
    }
  
  
    
  
  
    applyItem(item:any){
  
  
      this.items = [];
      this.lps = [];
      this.itemsLT = [];
      this.boolean = true;

      this.itemsL.push(item);

      this.itemsLT.push(item);




      console.log(this.itemsL);
      
      
    }

}
