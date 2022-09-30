import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-add-item-or-lp',
  templateUrl: './add-item-or-lp.component.html',
  styleUrls: ['./add-item-or-lp.component.scss'],
})
export class AddItemOrLpComponent implements OnInit {

  private routExtras: any;

  
  private items:any;

  private pallet: any;
  private listLp: any[] = [];

  private listLP: any[] = [];
  private listP: any[] = [];
  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router) { 

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
          this.router.navigate(['page/wms/wmsMain'], { replaceUrl: true });
        }

      });
    }

  ngOnInit() {

    this.items = this.routExtras.items;



    this.listLp  = this.routExtras.lps;


    this.pallet = this.routExtras.pallet;

    this.intServ.loadingFunc(false);

    console.log(this.items, this.listLp);


  }


  public onBack() {
    this.router.navigate(['page/main/listPallet'], { replaceUrl: true });
  }


 async addItem(item:any){

  console.log(item);
  




      //console.log(Delete);


  try {

    this.intServ.loadingFunc(true);

    let addI = await this.wmsService.Assign_ItemChild_to_LP_Pallet_From_WR(this.pallet.fields[0].PLULPDocumentNo,item.No,item.ItemNo,item.Qty,item.LineNo);


    console.log(addI);

    if(addI != undefined || addI != null){
  
      

  if(!addI.IsProcessed) throw Error(addI.Error);
          

  this.intServ.loadingFunc(false);
  this.intServ.alertFunc(this.js.getAlert('success', '', `The Item ${item.ItemNo} has been Add`));



}else{

  this.intServ.alertFunc(this.js.getAlert('error', '', `The Item ${item.ItemNo} has  been not  removed correctly`));


}

}


      
     catch (Error) {


      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', '', Error.Message));

     
    }

     

  



  }


 async  addLP(item:any){


  let listLP:any[] = [];

    let objL = {

      LP_Pallet_Child_No: ""  
    }


    objL.LP_Pallet_Child_No = item.fields.PLULPDocumentNo;
  

  // let resL = await this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR(this.wareReceipts.No,pallet.fields.PLULPDocumentNo,listLP);

  
  }

}
