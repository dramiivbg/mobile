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
  private listL:any[] = [];
  private listI:any[] = [];
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

   // this.list.push(item);

   // console.log(this.list);
    //console.log(item);
  }


  selectl(item:any){


    if(this.boolean){


      this.listL.push(item);

      console.log(this.listL);
    }else{

      this.listI.push(item);
      
      console.log(this.listI);
    }

    //console.log(item);
  }


  delect(){


    
    this.intServ.alertFunc(this.js.getAlert('confirm', '', `Are you sure to remove?`, async() =>{


  if(this.boolean){

    let Delete:any;


    try {

      this.intServ.loadingFunc(true);


      this.listL.filter(async(item) => {
        Delete = await this.wmsService.Delete_LPChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo,item.PLUNo);

      });

   
      console.log(Delete);

  if(Delete.Error) throw Error(Delete.Error.Message);

  this.listL.filter(async(item) =>{

    this.listLp.filter((lp,index) => {


      if(lp.PLUNo === item.PLUNo){



        this.listLp.splice(index,1);


      }
    })
    

  })
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('success', '', `The licence plate has been removed`));

    

 

      
    } catch (Error) {
      
      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
    }
  

    
  }else{

    let Delete:any;


    try {

      this.intServ.loadingFunc(true);


      this.listI.filter(async(item) => {
        let Delete = await this.wmsService.Delete_ItemChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo, item.PLUWhseLineNo, item.PLUQuantity,item.PLUNo);

      });

   
      console.log(Delete);

  if(Delete.Error) throw Error(Delete.Error.Message)

  this.listI.filter(async(item) =>{

    this.listLp.filter((lp,index) => {


      if(lp.PLUNo === item.PLUNo){



        this.listLp.splice(index,1);


      }
    })
    

  })
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('success', '', `The licence plate has been removed`));

    

 

      
    } catch (Error) {
      
      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));
    }
  

  }
    
    }))

  }


}
