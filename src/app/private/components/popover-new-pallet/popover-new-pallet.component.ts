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
import { ifError } from 'assert';


@Component({
  selector: 'app-popover-new-pallet',
  templateUrl: './popover-new-pallet.component.html',
  styleUrls: ['./popover-new-pallet.component.scss', './popover-new-pallet.component.css'],
})
export class PopoverNewPalletComponent implements OnInit {

  public boolean: Boolean = true;
 


  
 public testListI: any[] = [];

 public testListL: any[] = [];
 
  public lpNo: any = '';
  public itemNo:any = '';
  public visilityL:Boolean = true;
  public visilityI:Boolean = true;
  public booleanL: Boolean = true;
  

  
  public items:any [] = [];

  public itemsL:any[] = [];
  public itemsLT:any[];

  private lpsT: any[] = [];

  private itemsT:any[] =[];
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


  onChangeI(e, itemNo:any = ''){


    if(itemNo === ''){
    let val = e.target.value;

    if (val === '') {
      this.items = this.itemsT;
    } else {
      this.items = this.itemsT.filter(

     
        x => {

        
          return (x.ItemNo.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }

  }else{


    this.items = this.itemsT.filter(
      x => {
        return (x.ItemNo.toLowerCase().includes(itemNo.toLowerCase()));
      }
    )
  }




  }
  
  
  onChangeLp(e, lpNo:any = ''){

    if(lpNo === ''){


      let val = e.target.value;

      if (val === '') {
       this.lps = this.lpsT;
      } else {
        this.lps = this.lpsT.filter(
          x => {
            return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
          }
        )
      }

    }else{


        this.lps = this.lpsT.filter(
          x => {
            return (x.fields.PLULPDocumentNo.toLowerCase().includes(lpNo.toLowerCase()));
          }
        )
      
    }


 
   
  }



async onBarCode(){


  this.intServ.loadingFunc(true);
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



  this.intServ.loadingFunc(false);
  this.barcodeScanner.scan().then(
  async  (barCodeData) => {
      let code = barCodeData.text;



      this.intServ.loadingFunc(true);
     
  for (const key in listaL) {


    if (listaL[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {
      line = listaL[key];

   
    
      boolean = true;
    
    }

        
  }


      for (const key in items.Possible_ItemsChilds) {
        if (items.Possible_ItemsChilds[key].ItemNo === code) {
        
          line = items.Possible_ItemsChilds[key];
       
          boolean = false;
        
          
        }
      }

     

    

  

    if (line === null || line === undefined ) {

      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', `  The license plate '${code}' is not available `));
   
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

            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.js.getAlert('alert', '', 'The license plate is already assigned'));


        }else{

           
          this.lpsL.push(line);

          console.log(this.lpsL);
    
          this.lpsLT = [];
    
          this.listLpsL.push(line);

        }


        this.intServ.loadingFunc(false);

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

          this.intServ.loadingFunc(false);
          this.intServ.alertFunc(this.js.getAlert('alert', '', 'The Item is already assigned'));


      }else{

         
        this.itemsL.push(line);
        this.itemsLT = [];

        this.listItemsL.push(line);

      }

    }

    this.intServ.loadingFunc(false);

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






 // console.log(this.itemsL);


 if(this.itemsLT != undefined || this.lpsL != undefined){

  let listsI:any[] = [];

  let resI:any;

  this.intServ.loadingFunc(true);
  let listLP: any[] = [];

  let objL = {

    LP_Pallet_Child_No: ""
  }

  if(this.lpsL.length > 0){


    this.lpsL.filter(lp =>{


      objL.LP_Pallet_Child_No = lp.fields.PLULPDocumentNo;
  
      listLP.push(objL);
  
      objL = {
  
        LP_Pallet_Child_No: ""
      }
    });
  }



  
  let listItems =   {
    Item_Child_No: "",
    Qty: "",
    WarehouseReceipt_LineNo: ""
  }
  
  if(this.itemsL.length > 0){


    this.itemsL.filter(async(item) =>{
  

  
      listItems.Item_Child_No = item.ItemNo;
      listItems.Qty = item.Qty;
      listItems.WarehouseReceipt_LineNo = item.LineNo;
    
    
      listsI.push(listItems);
  
    
      listItems =   {
        Item_Child_No: "",
        Qty: "",
        WarehouseReceipt_LineNo: ""
      }
    
    
      });
  }



  try {


        if(this.itemsL.length > 0){

          
         resI = await this.wmsService.Assign_ItemChild_to_LP_Pallet_From_WR(pallet.fields.PLULPDocumentNo,this.wareReceipts.No,listsI);
    

        }

         if(this.lpsL.length > 0){


          let resL = await this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR(this.wareReceipts.No,pallet.fields.PLULPDocumentNo,listLP);


         }
      

       



    
     


         this.intServ.loadingFunc(false);
  
         this.intServ.alertFunc(this.js.getAlert('success', 'success', ` `, () =>{this.router.navigate(['/page/wms/wmsReceipt'])}));
     
     

  
  } catch (Error) {
   

    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error', '', Error.message,));
     
  }
 }
  

        


  


  
}



exit(){


  this.boolean = true;

  this.items = [];
this.lps = [];

  this.testListI = [];

  this.testListL = [];


}

async listLpOrItem(pallet:any){

this.intServ.loadingFunc(true);
 
  this.boolean = false;



  


  
    let lps = await this.wmsService.Calcule_Possible_LPChilds_From_WR(pallet.fields.PLULPDocumentNo);
    
    let items = await this.wmsService.Calcule_Possible_ItemChilds_From_WR(pallet.fields.PLULPDocumentNo);


   // console.log( JSON.stringify(items));

    this.items = items.Possible_ItemsChilds;


   

   let checkboxL = {testID: 0, testName: "", checked: false}

   let checkboxI = {testID: 0, testName: "", checked: false}

   console.log(this.items);

  

  

    console.log('item =>',this.items);


    
    this.lpsNo = lps.Possible_LPChilds.split("|");


      
    this.lpsNo.filter(async(no,index) => {

      let lps = await this.wmsService.getLpNo(no);

      let lp = await this.wmsService.ListLp(lps);
    
      
      let line = this.lpsL.find(Lp => Lp.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

      if(line == undefined || line == null){


         this.lps.push(lp);

         checkboxL.testID = Number(index),
         checkboxL.testName = `test${index}`
         checkboxL.checked = false;
   
         this.testListL.push(checkboxL);
        checkboxL = {testID: 0, testName: "", checked: false};


      }
     
      
    });

    this.items.filter((item, index) =>{

      if(item.Qty === 0){
  
  
        this.items.splice(index,1);

      }

      
      let line = this.itemsL.find(Item => Item.ItemNo === item.ItemNo);

      if(line != undefined || line != null){

          this.items.splice(index,1);

     

      }

     
    })

    for (const i  in this.items) {


      checkboxI.testID = Number(i),
      checkboxI.testName = `test${i}`
      checkboxI.checked = false;

      this.testListI.push(checkboxI);

     checkboxI = {testID: 0, testName: "", checked: false};
     
    }


  
    this.lpsT = this.lps;

    this.itemsT = this.items;

    console.log(this.itemsT, this.lpsT);

   


    console.log(this.testListI, this.testListL);

    this.intServ.loadingFunc(false);


  
 

  
  


}


disable(){

this.items = [];
this.lps = [];

  this.boolean = true;

  this.testListI = [];

  this.testListL = [];




 

}




checkAll(ev){


  console.log(ev);
switch(ev.detail.checked){

case true:

if(this.booleanL){

  for(let i =0; i <= this.testListL.length; i++) {


    this.testListL[i].checked = true;


 
    }  
    console.log(this.testListL);
  }else{

    for(let i =0; i <= this.testListI.length; i++) {
      this.testListI[i].checked = true;


      }     
  }

  break;

  
  case false:

    if(this.booleanL){

      for(let i =0; i <= this.testListL.length; i++) {
        this.testListL[i].checked = false;


        }
        console.log(this.testListL);
      }else{
    
        for(let i =0; i <= this.testListI.length; i++) {
          this.testListI[i].checked = false;

      

          }
          console.log(this.testListI);
      }
  

      break;


}

  
}






applyLP(lp:any,ev){



    
switch(ev.detail.checked){

  case true:  
  
  let line:any = undefined;



  line = this.lpsL.find(Lp =>  Lp.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);


  if(line == null || line === undefined){


    this.lpsLT = [];
   
    this.lpsL.push(lp);
     this.listLpsL.push(lp);
     this.lpsLT.push(lp);
   
     console.log(this.lpsL);

  }

  
  
       

    
  break;
  
  case false:
  
     this.lpsL.filter( (Lp, index) => {
  
        if(Lp.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo){
           this.lpsL.splice(index,1)
          this.listLpsL.splice(index,1)
          this.lpsLT.splice(index,1)
        }
      })
  
  
   console.log('Delete =>',this.listLpsL,this.lpsL, this.lpsLT);
  
   break;
    }

  

  
      
    
    
    }
  
  
    
  
  
applyItem(item:any,ev,){
  

switch(ev.detail.checked){

case true:

  let line:any = undefined;


  
  line = this.itemsL.find(Item =>  Item.ItemNo ===  item.ItemNo);


  if(line == null || line === undefined){


 
    this.itemsLT = [];


    this.itemsL.push(item);
  
    this.itemsLT.push(item);
  
  
    this.listItemsL.push(item);
  
  
        
  
   console.log(this.itemsL);

  }

  


  


 
  break;

case false:


  this.itemsL.filter( (Item,i) => {

    if(Item.ItemNo === item.ItemNo){

      this.itemsL.splice(i,1);

      this.itemsLT.push(i,1);
    
    
      this.listItemsL.push(i,1);

    }
  })
 

  console.log('Delete =>', this.listItemsL, this.itemsLT, this.listItemsL);

  break;
}

      
      
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


  enableLP(){

    this.booleanL = true;

    


  }

  enableItem(){

    this.booleanL = false;


  }


  

  autoComplet(){



  if(this.booleanL){

    
    this.barcodeScanner.scan().then(
      async  (barCodeData) => {
          let code = barCodeData.text;
    
    
  
          this.lpNo = code;


          this.onChangeLp('', this.lpNo);
          
    
      
        }
      ).catch(
        err => {
          console.log(err);
        }
      )



    
  }else{

    
    this.barcodeScanner.scan().then(
      async  (barCodeData) => {
          let code = barCodeData.text;
    
    
  
          this.itemNo = code;


          this.onChangeI('', this.itemNo);
          
    
      
        }
      ).catch(
        err => {
          console.log(err);
        }
      )



  }
   
  }

}
