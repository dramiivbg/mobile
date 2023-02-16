import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { error } from 'console';
import { ListPalletComponent } from '../list-pallet/list-pallet.component';
import { PopoverOptionsComponent } from '../popover-options/popover-options.component';

@Component({
  selector: 'app-list-pitems',
  templateUrl: './list-pitems.component.html',
  styleUrls: ['./list-pitems.component.scss'],
})
export class ListPItemsComponent implements OnInit {
  public listL:any[] = [];
  public listI:any[] = [];
  public routExtras: any;
  public listsI: any[] = [];
  public boolean: Boolean = true;
  public listItem: any[] = []
  public lists:any[] = [];
  public listLp: any[] = [];
  public  wareReceipts:any;

  public testListI: any[] = [];

  public testListL: any[] = [];

  
  public QtyLP:number = 0;
  public QtyItem: number = 0;

  public itemNo:any = '';
  public lpNo: any = '';
  public visibilityL:Boolean = true;
  public visibilityI:Boolean = true;
  public pallet:any;
  public pallets:any;
  public listLP: any[] = [];
  public listP: any[] = [];
  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router,  public popoverController: PopoverController,   private general: GeneralService, private barcodeScanner: BarcodeScanner,
    private modalCtrl: ModalController) { 

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

 async  ngOnInit() {


    let items: any[] = [];


    if(this.routExtras.listItem != undefined && this.routExtras.listLp != undefined && this.routExtras.pallet != undefined && this.routExtras.wareReceipts != undefined
       && this.routExtras.pallets != undefined && this.routExtras.listLp != undefined && this.routExtras.listItem != undefined){


      localStorage.setItem('listItem', this.routExtras.listItem);
      localStorage.setItem('listLp', this.routExtras.listLp);
      localStorage.setItem('pallet',  this.routExtras.pallet);
      localStorage.setItem('wareReceipts', this.routExtras.wareReceipts);
      localStorage.setItem('pallets', this.routExtras.pallets);
      localStorage.setItem('lists ', this.routExtras.listLp);
      localStorage.setItem('listsI', this.routExtras.listItem);
      localStorage.setItem('listP ',this.routExtras.listP);


    }
  
    this.listItem = (this.routExtras.listItem != undefined) ? this.routExtras.listItem : localStorage.getItem('listItem') ;



    this.listLp  = (this.routExtras.listLp != undefined) ? this.routExtras.listLp : localStorage.getItem('listLp');


    this.pallet  = (this.routExtras.pallet != undefined) ? this.routExtras.pallet : localStorage.getItem('pallet');

    this.wareReceipts  = (this.routExtras.wareReceipts != undefined) ? this.routExtras.wareReceipts : localStorage.getItem('wareReceipts');

   
    this.pallets  = (this.routExtras.pallets != undefined) ? this.routExtras.pallets : localStorage.getItem('pallets');

    this.lists  =  (this.routExtras.listLp != undefined) ? this.routExtras.listLp : localStorage.getItem('lists');
 
    this.listsI = (this.routExtras.listItem != undefined) ? this.routExtras.listItem : localStorage.getItem('listsI');

    //console.log(listL);

    
    this.listP  = (this.routExtras.listP != undefined) ? this.routExtras.listP : localStorage.getItem('listP');

   console.log(this.listItem, this.listLp, this.listP);


   
   

   let checkboxL = {testID: 0, testName: "", checked: false}

   let checkboxI = {testID: 0, testName: "", checked: false}


   this.listLp.filter((lp, index) => {

     this.QtyLP++;
    checkboxL.testID = Number(index),
    checkboxL.testName = `test${index}`
    checkboxL.checked = false;

    this.testListL.push(checkboxL);
   checkboxL = {testID: 0, testName: "", checked: false};

   });


   this.listItem.filter((item,index) =>{

    this.QtyItem++;
    checkboxI.testID = Number(index),
    checkboxI.testName = `test${index}`
    checkboxI.checked = false;

    this.testListI.push(checkboxI);
   checkboxI = {testID: 0, testName: "", checked: false};
   })




   }


  public onBack() {
    this.router.navigate(['page/wms/listPallet'], { replaceUrl: true });
  }




  enableLP(){

    this.boolean = true;


  }

  enableItem(){

    this.boolean = false;


  }


  onChangeI(e, itemNo:any = ''){

  switch(itemNo){

  case  '':

    let val = e.target.value;

    if (val === '') {
      this.listItem = this.listsI;
    } else {
      this.listItem = this.listsI.filter(
        x => {
          return (x.PLUNo.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }
    break;

  default:


    this.listItem = this.listsI.filter(
      x => {
        return (x.PLUNo.toLowerCase().includes(itemNo.toLowerCase()));
      }
    )
    break;
  }




  }


  onChangeLp(e, lpNo:any = ''){

    switch(lpNo){


    case '':
      let val = e.target.value;

      if (val === '') {
       this.listLp = this.lists;
      } else {
        this.listLp = this.lists.filter(
          x => {
            return (x.PLUNo.toLowerCase().includes(val.toLowerCase()));
          }
        )
      }
      break;

    default:


        this.listLp = this.lists.filter(
          x => {
            return (x.PLUNo.toLowerCase().includes(lpNo.toLowerCase()));
          }
        )
     break;
      
    }


 
   
  }



  

  checkAll(ev){


    console.log(ev);
  switch(ev.detail.checked){
  
  case true:
  
  if(this.boolean){
  
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
  
      if(this.boolean){
  
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


selectl(item:any,ev){


switch(ev.detail.checked){

 case true:
  
 
    if(this.boolean){


      this.listL.push(item);

      console.log(this.listL);
    }else{

      this.listI.push(item);
      
      console.log(this.listI);
    }

   
    break;

    case false:

      this.removel(item,ev);

      break;
    }

    //console.log(item);
  }


  delect(){


    
    this.intServ.alertFunc(this.js.getAlert('confirm', '', `Are you sure to remove?`, async() =>{


  if(this.boolean){

    let Delete:any;


    this.intServ.loadingFunc(true);


    try {



      this.listL.forEach(async(item) => {
        

         await this.wmsService.Delete_LPChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo,item.PLUNo);

      });

   
  
  this.listL.forEach(async(item) =>{

    this.listLp.forEach((lp,index) => {


      if(lp.PLUNo === item.PLUNo){

       this.listLp.splice(index,1);
       this.QtyLP-=1;


      }
    })
    

  });
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('success', '', `The licence plate has been removed`, () => { this.router.navigate(['page/wms/wmsReceipt']);}));

    

      
    } catch (Error) {
      
      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
    }
  

    
  }else{

   

    this.intServ.loadingFunc(true);

    try {

      this.intServ.loadingFunc(true);


      this.listI.filter(async(item) => {
        await this.wmsService.Delete_ItemChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo, item.PLUWhseLineNo, item.PLUQuantity,item.PLUNo);

      });

   
    

  this.listI.filter(async(Item) =>{

    this.listItem.filter((item,index) => {


      if(item.PLUNo === Item.PLUNo){

      this.listItem.splice(index,1);

      this.QtyItem-=1;


      }
    })
    

  });
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('success', '', `The Item has been removed`, () => {this.router.navigate(['page/wms/wmsReceipt']);}));

    

 

      
    } catch (Error) {
      
      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
    }
  

  }
    
    }))

  }


 async back(){

  let navigationExtras: NavigationExtras = {
    state: {
      pallet:this.pallets,
      wareReceipts:this.wareReceipts,
      new: false
    },
    replaceUrl: true
  };
  this.router.navigate(['page/wms/listPallet'], navigationExtras);
  }


  removel(item:any,ev){


    if(this.boolean){


      this.listL.filter((lp, index) =>{


        if(lp.PLUNo === item.PLUNo){


          this.listL.splice(index,1);
        }
        
       
      })

    
        console.log(this.listL);

    

    }else{


      this.listI.filter((Item, index) =>{


        if(Item.PLUNo === item.PLUNo){


          this.listI.splice(index,1);
        }
        
      })

     
        console.log(this.listI);

      


    }




  }


  exit(){


    this.boolean = true;
  }





  


  remove(){

    if(this.boolean){

      this.listL = [];

      console.log(this.listL);


      this.visibilityL = true;

    }else{


      this.listI = [];

      console.log(this.listI);

      this.visibilityI = true;

    }
  }




  autoComplet(){


   if(this.boolean){


    
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
