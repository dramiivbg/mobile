import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { Storage } from '@ionic/storage';
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
    , private router: Router,  
    public popoverController: PopoverController,   
    private general: GeneralService, 
    private barcodeScanner: BarcodeScanner,
    private modalCtrl: ModalController,
    private storage: Storage) { 

    
    }

 async  ngOnInit() {
  this.pallet =  await this.storage.get(`pallet`);
    this.listItem =  await this.storage.get(`${this.pallet.LPDocumentNo} listItem`);
  this.listLp = await  this.storage.get(`${this.pallet.LPDocumentNo} listLp`);
  this.lists = await  this.storage.get(`${this.pallet.LPDocumentNo} listLp`);
  this.listsI =   await this.storage.get(`${this.pallet.LPDocumentNo} listItem`);

  console.log('duplicado',this.lists,this.listsI);

   let checkboxL = {testID: 0, testName: "", checked: false}

   let checkboxI = {testID: 0, testName: "", checked: false}

   for (const index in  this.listLp) {
    this.QtyLP++;
    checkboxL.testID = Number(index),
    checkboxL.testName = `test${index}`
    checkboxL.checked = false;
    this.testListL.push(checkboxL);
   checkboxL = {testID: 0, testName: "", checked: false};
   }

   for (const index in this.listItem) {
    this.QtyItem++;
    checkboxI.testID = Number(index),
    checkboxI.testName = `test${index}`
    checkboxI.checked = false;
    this.testListI.push(checkboxI);
   checkboxI = {testID: 0, testName: "", checked: false};
   }
  

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
          return (x.PLUNo.toLowerCase().includes(val.toLowerCase()) || x.PLUSerialNo.toLowerCase().includes(val.toLowerCase()));
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
            return (x.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
          }
        )
      }
      break;

    default:


        this.listLp = this.lists.filter(
          x => {
            return (x.PLULPDocumentNo.toLowerCase().includes(lpNo.toLowerCase()));
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

    this.intServ.loadingFunc(true);

      if(this.listL.length > 0){
        this.listL.forEach(async(item) => {

          try {

            let res  =    await this.wmsService.Delete_LPChild_to_LP_Pallet_From_WR(this.pallet.LPDocumentNo,item.PLUWhseDocumentNo,item.PLULPDocumentNo);
        
             if(res.Error) throw new Error(res.Error.Message);
             if(res.error) throw new Error(res.error.message);
             
             
            this.listLp.forEach((lp,index) => {

            if(lp.PLULPDocumentNo === item.PLULPDocumentNo){
      
             this.listLp.splice(index,1);
             this.QtyLP-=1;
            }
            });
              
            } catch (error) {
              this.intServ.loadingFunc(false);
              return  this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
              
            }
  
       });

      }



 if(this.listI.length > 0){
  this.listI.filter(async(item) => {
    try {

    let res  =   await this.wmsService.Delete_ItemChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo, item.PLUWhseLineNo, item.PLUQuantity,item.PLUNo);

     if(res.Error) throw new Error(res.Error.Message);
     if(res.error) throw new Error(res.error.message);
     
      this.listItem.filter((item,index) => {
  
        if(item.PLUNo === item.PLUNo){
      
        this.listItem.splice(index,1);
      
        this.QtyItem-=1;
    
        }
      });
      
    } catch (error) {
      this.intServ.loadingFunc(false);
      return  this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
      
    }
   
  });
 } 
  

    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('success', '', `The licence plate has been removed`, () => { this.router.navigate(['page/wms/wmsReceipt']);}));

    
  
  }));

}



  removel(item:any,ev){


    if(this.boolean){


      this.listL.filter((lp, index) =>{


        if(lp.PLULPDocumentNo === item.PLULPDocumentNo){


          this.listL.splice(index,1);
        }
        
       
      });

    
        console.log(this.listL);

    

    }else{


      this.listI.filter((Item, index) =>{


        if(Item.PLUNo === item.PLUNo){


          this.listI.splice(index,1);
        }
        
      });

     
        console.log(this.listI);

      


    }




  }


  exit(){


    this.boolean = true;
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
