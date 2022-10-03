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
  private wareReceipts:any;
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

    this.wareReceipts = this.routExtras.wareReceipts;

    this.intServ.loadingFunc(false);

    console.log(this.items, this.listLp);


  }


  public onBack() {
    this.router.navigate(['page/main/listPallet'], { replaceUrl: true });
  }


 async addItem(item:any){

  console.log(item);
  

let listsI:any[] = [];
  
  let listItem =   {
      Item_Child_No: "",
      Qty: "",
      WarehouseReceipt_LineNo: ""
    }


    listItem.Item_Child_No =  item.ItemNo;

    listItem.Qty = item.Qty;
  
    listItem.WarehouseReceipt_LineNo = item.LineNo

      //console.log(Delete);

      listsI.push(listItem);


  try {

    this.intServ.loadingFunc(true);

    let addI = await this.wmsService.Assign_ItemChild_to_LP_Pallet_From_WR(this.pallet.fields[0].PLULPDocumentNo,item.No, listsI);


    console.log(addI);

    if(addI != undefined || addI != null){
  
      

  if(addI.Error) throw Error(addI.Error.Message);
          

  this.intServ.loadingFunc(false);
  this.intServ.alertFunc(this.js.getAlert('success', '', `The Item ${item.ItemNo} has been Add correctly`));

  this.items.Possible_ItemsChilds.filter( (Item, index) => {

    if(item.ItemNo === Item.ItemNo){


      this.items.Possible_ItemsChilds.splice(index,1);


    }
  })



}else{

  this.intServ.loadingFunc(false);

  this.intServ.alertFunc(this.js.getAlert('error', '', `The Item ${item.ItemNo} has  been not Add  correctly`));


}

}


      
     catch (Error) {


      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));

     
    }

     

  



  }


 async  addLP(item:any){


  let listLP:any[] = [];

    let objL = {

      LP_Pallet_Child_No: ""  
    }


    objL.LP_Pallet_Child_No = item.fields.PLULPDocumentNo;

    listLP.push(objL);



    try{

      this.intServ.loadingFunc(true);
  

   let resL = await this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR(this.wareReceipts.No,this.pallet.fields[0].PLULPDocumentNo,listLP);


   
   if(resL != undefined || resL != null){
  
   
  if(resL.Error) throw Error(resL.Error.Message);
          

  this.intServ.loadingFunc(false);
  this.intServ.alertFunc(this.js.getAlert('success', '', `The Item ${item.ItemNo} has been Add correctly`));

  this.listLp.filter( (lp, index) => {

    if(item.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo){


      this.listLp.splice(index,1);


    }
  })



}else{

  this.intServ.loadingFunc(false);

  this.intServ.alertFunc(this.js.getAlert('error', '', `The Item ${item.ItemNo} has  been not Add  correctly`));


}

}


  
     catch (Error) {


      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));

     
    }
  }

}
