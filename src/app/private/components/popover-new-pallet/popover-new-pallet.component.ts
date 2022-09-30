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

  public val: string;

  public listItemsL:any[] = [];


  public lpsNo: any[] = [];

  public lps: any[] = [];

  public lpsL: any[] = [];

  public nullL: boolean = false;

  public nullI: boolean = false;
  public listLpsL: any[] = [];
  public lpsLT: any[];
  public pallet: any;

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


   let f  = new  Date(this.pallet.fields.SystemCreatedAt);

   let fecha = f.getDate()+'/'+(f.getMonth()+1)+'/'+f.getFullYear();
   
   
   this.pallet.fields.SystemCreatedAt = fecha;


 

  
  }


  



async onBarCode(){

  let listaL: any[] = [];

  let line:any = undefined;



  let boolean:Boolean = false;

  let lps = await this.wmsService.Calcule_Possible_LPChilds_From_WR(this.pallet.fields.PLULPDocumentNo);
    
  let items = await this.wmsService.Calcule_Possible_ItemChilds_From_WR(this.pallet.fields.PLULPDocumentNo);


  
  this.lpsNo = lps.Possible_LPChilds.split("|");


      
  this.lpsNo.filter(async(no) => {

    let lps = await this.wmsService.getLpNo(no);

    let lp = await this.wmsService.ListLp(lps);
  
    listaL.push(lp);
    
  });




  this.barcodeScanner.scan().then(
  async  (barCodeData) => {
      let code = barCodeData.text;




     
  for (const key in listaL) {


    if (listaL[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {
      line = listaL[key];

   
    
      boolean = true;
      this.intServ.loadingFunc(false); 
    }

        
  }


      for (const key in items.Possible_ItemsChilds) {
        if (items.Possible_ItemsChilds[key].ItemNo === code) {
        
          line = items.Possible_ItemsChilds[key];
       
          boolean = false;
          this.intServ.loadingFunc(false); 
          
        }
      }

     

    

  

    if (line === null || line === undefined ) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', `  The license plate '${code}' is not available `));
      this.intServ.loadingFunc(false);
    } else {

      switch(boolean){

       case true:  

       
         if(this.lpsL.length < 1){
      

          


            
            this.lpsL.push(line);

            console.log(this.lpsL);
      
            this.lpsLT = [];
      
            this.listLpsL.push(line);
          }

        else{

          
          let  find = this.lpsL.find(lp => lp.fields.PLULPDocumentNo === line.fields.PLULPDocumentNo); 


          if(find != null ||  find != undefined){


            this.intServ.alertFunc(this.js.getAlert('alert', '', 'The license plate is already assigned'));


        }else{

           
          this.lpsL.push(line);

          console.log(this.lpsL);
    
          this.lpsLT = [];
    
          this.listLpsL.push(line);

        }

      }

      break;
      

      case false:

        if(this.itemsL.length < 1){
      

          

          this.itemsL.push(line);
          this.itemsLT = [];
  
          this.listItemsL.push(line);
        }

      else{

        
        let  find = this.itemsL.find(item => item.ItemNo  === line.ItemNo); 


        if(find != null ||  find != undefined){


          this.intServ.alertFunc(this.js.getAlert('alert', '', 'The Item is already assigned'));


      }else{

         
        this.itemsL.push(line);
        this.itemsLT = [];

        this.listItemsL.push(line);

      }

    }

    break;
    

     
      
   
    }


  
    }
  }

  ).catch(
    err => {
      console.log(err);
    }
  )

}

 async  onSubmit(pallet:any){


  let resI:any;

  this.intServ.loadingFunc(true);
  let listLP: any[] = [];

  let objL = {

    LP_Pallet_Child_No: ""
  }

  this.lpsL.filter(lp =>{


    objL.LP_Pallet_Child_No = lp.fields.PLULPDocumentNo;

    listLP.push(objL);

    objL = {

      LP_Pallet_Child_No: ""
    }
  });






  let resL = await this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR(this.wareReceipts.No,pallet.fields.PLULPDocumentNo,listLP);


 // console.log(this.itemsL);

  

  this.itemsL.filter(async(item) =>{



  console.log(item);

   //resI = await this.wmsService.Assign_ItemChild_to_LP_Pallet_From_WR(pallet.fields.PLULPDocumentNo,item.No,item.ItemNo,item.Qty,item.LineNo);

  });


 // console.log(resL);
  console.log(resI);



    if(resL.IsProcessed == true && !resL.Error){


      this.intServ.loadingFunc(false);
  
      this.intServ.alertFunc(this.js.getAlert('success', 'success', `the license plate were successfully assigned with the No  '${resL.Remnant_LPChilds}' `, () =>{this.router.navigate(['/page/wms/wmsReceipt'])}));
  
  
    }else{
   
  
      this.intServ.loadingFunc(false);
  
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', resL.Error.Message));
  
  
    }
    
  
/*  
if(resI.IsProcessed == true && !resI.Error ){


  



    this.intServ.loadingFunc(false);

    this.intServ.alertFunc(this.js.getAlert('success', 'success', `the Item were successfully assigned `, () =>{this.router.navigate(['/page/wms/wmsReceipt'])}));



  }else{

    this.intServ.loadingFunc(false);

    this.intServ.alertFunc(this.js.getAlert('error', 'Error', resI.Error.Message));



  


  

}

*/

  
  
}


async listLpOrItem(pallet:any){

this.intServ.loadingFunc(true);
 
  this.boolean = false;



  


  
    let lps = await this.wmsService.Calcule_Possible_LPChilds_From_WR(pallet.fields.PLULPDocumentNo);
    
    let items = await this.wmsService.Calcule_Possible_ItemChilds_From_WR(pallet.fields.PLULPDocumentNo);


   // console.log( JSON.stringify(items));

    this.items = items;

    console.log('item =>',this.items);


    
    this.lpsNo = lps.Possible_LPChilds.split("|");


      
    this.lpsNo.filter(async(no) => {

      let lps = await this.wmsService.getLpNo(no);

      let lp = await this.wmsService.ListLp(lps);
    
      this.lps.push(lp);
      
    });

    this.intServ.loadingFunc(false);


  
 

  
  


}




applyLP(lp:any){

this.items = [];
this.lps = [];
let line:any = undefined;
  this.lpsLT = [];    
  this.boolean = true;
 

  if(this.lpsLT != undefined){


  line =  this.listLpsL.find(lp1 => lp1.fields.PLULPDocumentNo == lp1.fields.PLULPDocumentNo )
  }


  if(line != null || line != undefined){

    this.intServ.alertFunc(this.js.getAlert('alert', '', 'This pallet has already been assigned'));

    
  }else{


    this.lpsL.push(lp);
    this.listLpsL.push(lp);
    this.lpsLT.push(lp);
  
    console.log(this.lpsL);
        
  }

      
    
    
    }
  
  
    
  
  
    applyItem(item:any){
  
      let line:any = undefined;
      this.items = [];
      this.lps = [];
      this.itemsLT = [];
      this.boolean = true;



      
  if(this.itemsLT != undefined){


    line =  this.listItemsL.find(item1 => item1.ItemNo == item.ItemNo)
    }
  
  
    if(line != null || line != undefined){
  
      this.intServ.alertFunc(this.js.getAlert('alert', '', 'This Item has already been assigned'));
  
      
    }else{
  
  
      this.itemsL.push(item);

      this.itemsLT.push(item);


      this.listItemsL.push(item);
          
    }
  

      console.log(this.itemsL);
      
      
    }

    delete(){


      this.intServ.alertFunc(this.js.getAlert('confirm', 'confirm',"I'm sure you want to delete everything?", () => {



      this.items = [];
      this.lps = [];



        this.itemsL = [];
        this.lpsL = [];

        
        this.itemsLT = undefined;
        this.lpsLT = undefined;

      }


    
      ));
  

  
    }


    
 

  filter(e) {
    let val = e.target.value;
    this.val = val;
  //  console.log('change =>',val);
    
    if (val === '') {
      this.lpsL = this.listLpsL;
      this.itemsL = this.listItemsL;
    } else {
      this.lpsL = this.listLpsL.filter(
        x => {
          return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()) );
        }
      )

      this.itemsL = this.listItemsL.filter(
        x => {
          return (x.ItemNo.toLowerCase().includes(val.toLowerCase()));
        }
      )
    } 
  }


  deleteI(item:any){


    this.intServ.alertFunc(this.js.getAlert('confirm', 'confirm',"you want to delete it", () => {



    this.listItemsL.filter((itemI, index) =>{


      if(item.ItemNo == itemI.ItemNo){


        this.listItemsL.splice(index,1);

        this.itemsL.splice(index,1);
      }
    })
    }));


  }

  deleteL(item:any){

    this.intServ.alertFunc(this.js.getAlert('confirm', 'confirm',"you want to delete it", () => {


    this.listLpsL.filter((lp, index) =>{


      if(item.fields.PLULPDocumentNo == lp.fields.PLULPDocumentNo){


        this.listLpsL.splice(index,1);

        this.lpsL.splice(index,1);
      }
    })

  }))

  }

}
