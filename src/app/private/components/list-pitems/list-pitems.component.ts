import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { error } from 'console';
import { PopoverOptionsComponent } from '../popover-options/popover-options.component';

@Component({
  selector: 'app-list-pitems',
  templateUrl: './list-pitems.component.html',
  styleUrls: ['./list-pitems.component.scss'],
})
export class ListPItemsComponent implements OnInit {

  private routExtras: any;
  private listsI: any[] = [];
  private boolean: Boolean = true;
  private listItem: any[] = []
 private lists:any[] = [];
  private listLp: any[] = [];
  private  wareReceipts:any;
  private pallet:any;
  private pallets:any;
  private listLP: any[] = [];
  private listP: any[] = [];
  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router,  public popoverController: PopoverController,   private general: GeneralService) { 

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

    this.listItem = this.routExtras.listItem;



    this.listLp  = this.routExtras.listLp;


    this.pallet  = this.routExtras.pallet;

    this.wareReceipts  = this.routExtras.wareReceipts;

   
    this.pallets  = this.routExtras.pallets;

    this.lists  =  this.routExtras.listLp;
 
    this.listsI = this.routExtras.listItem;

    //console.log(listL);

    
    this.listP  = this.routExtras.listP;

   console.log(this.listItem, this.listLp, this.listP);
   }


  public onBack() {
    this.router.navigate(['page/wms/listPallet'], { replaceUrl: true });
  }


  async opcionL(item:any,ev){



      this.intServ.alertFunc(this.js.getAlert('confirm', '', `Are you sure to remove the license plate '${item.PLUNo}' ?`, async() =>{

        console.log(item);

        try {

          this.intServ.loadingFunc(true);

          let Delete = await this.wmsService.Delete_LPChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo,item.PLUNo);
  
          console.log(Delete);
  
      if(Delete.Error) throw Error(Delete.Error.Message)
  
      this.listLp.filter((lp,index) => {


        if(lp.PLUNo === item.PLUNo){



          this.listLp.splice(index,1);


        }
      })
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `The licence plate ${item.PLUNo} has been removed`));
  
        
  
     
  
          
        } catch (Error) {
          
          this.intServ.loadingFunc(false);
  
          this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
        }
      

      }))

      
    

        this.intServ.loadingFunc(true);
    
        const lpsP = await this.wmsService.GetLicencesPlateInWR(this.wareReceipts.No, true);
    


        

        console.log('lines =>',this.pallets);
        let palletH = await this.wmsService.ListLpPalletH(lpsP);


       // console.log('lines =>',this.pallets);

       // console.log('Header =>',palletH);

        palletH.filter(lpH => {


          this.pallets.push(lpH);
        });

        this.intServ.loadingFunc(false);

        let obj = this.general.structSearch(this.pallets, `Search Pallet `, 'Pallets', async (pallet) => {

          console.log('data =>', pallet);


          try {

            this.intServ.loadingFunc(true);
  
            let Delete = await this.wmsService.Delete_LPChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo,item.PLUNo);
    
            console.log(Delete);
    
        if(Delete.Error) throw Error(Delete.Error.Message)
    
        this.listLp.filter((lp,index) => {
  
  
          if(lp.PLUNo === item.PLUNo){
  
  
  
            this.listLp.splice(index,1);
  
  
          }
        })
         

      let listl:any[] = [];
        
        let objL = {

          LP_Pallet_Child_No: ""
        }

     
        objL.LP_Pallet_Child_No =   item.PLUNo;
        
        listl.push(objL);
             
      let lp = await  this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR( this.wareReceipts.No,pallet.fields[0].PLULPDocumentNo,listl );
    

      if(lp.IsProcessed){

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `  The license place '${ item.PLUNo}' has been assigned correctly `));
      
          
   

  

       }else{

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `  The license place '${ item.PLUNo}' has been not assigned correctly `));
      
       }
          
    
       
    
            
          } catch (Error) {
            
            this.intServ.loadingFunc(false);
    
            this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
          }
    

   



        }, false, 3,);
        this.intServ.searchShowFunc(obj);

        console.log(this.pallets);

  
       




      
    


  }

  
 async  opcionI(item:any,ev){


   
      this.intServ.loadingFunc(true);
    
      const lpsP = await this.wmsService.GetLicencesPlateInWR(this.wareReceipts.No, true);
  


      

      console.log('lines =>',this.pallets);
      let palletH = await this.wmsService.ListLpPalletH(lpsP);


     // console.log('lines =>',this.pallets);

     // console.log('Header =>',palletH);

      palletH.filter(lpH => {


        this.pallets.push(lpH);
      });

      this.intServ.loadingFunc(false);

      let obj = this.general.structSearch(this.pallets, `Search Pallet `, 'Pallets', async (pallet) => {

        console.log('data =>', pallet);


        try {

          this.intServ.loadingFunc(true);

          let Delete = await this.wmsService.Delete_ItemChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo, item.PLUWhseLineNo, item.PLUQuantity,item.PLUNo);

          console.log(Delete);
  
      if(Delete.Error) throw Error(Delete.Error.Message)
  
      this.listItem.filter((Item,index) => {


        if(Item.PLUNo === item.PLUNo){



          this.listLp.splice(index,1);


        }
      })
       


      let listsI:any[] = []
        
  let listItems =   {
    Item_Child_No: "",
    Qty: "",
    WarehouseReceipt_LineNo: ""
  }



  listItems.Item_Child_No = item.PLUNo;

  listItems.Qty = item.PLUQuantity;

  listItems.WarehouseReceipt_LineNo = item.PLUWhseLineNo;


  listsI.push(listItems)
  

      let addI = await this.wmsService.Assign_ItemChild_to_LP_Pallet_From_WR(this.pallet.fields[0].PLULPDocumentNo,item.PLUWhseDocumentNo,listsI);


    try {


      if(addI.Error) throw Error(addI.Error.Message);

      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('success', '', `  The Item '${ item.PLUNo}' has been assigned correctly `));

   
   let listItem =    this.listItem;



    let  listLp =   this.listLp; 
  
  
   let pallet =    this.pallet;  
  
    let wareReceipts =  this.wareReceipts;  
  
     
    let pallets =   this.pallets;

   let listP =  this.listP;


   

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
  
     
        
  
      
    } catch (Error) {

      this.intServ.loadingFunc(false);
  
      this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
      
    }
   
     
  
          
        } catch (Error) {
          
          this.intServ.loadingFunc(false);
  
          this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
        }
  

 



      }, false, 3,);
      this.intServ.searchShowFunc(obj);

      console.log(this.pallets);


     


    

    
  

  }


 




  enableLP(){

    this.boolean = true;


  }

  enableItem(){

    this.boolean = false;


  }


  onChangeI(e){

  
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




  }


  onChangeLp(e){


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



  }


  select(item:any){

    console.log(item);
  }


}
