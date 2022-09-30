import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  
  private listItem: any[] = []

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
 

    //console.log(listL);

    
    this.listP  = this.routExtras.listP;

   console.log(this.listItem, this.listLp, this.listP);
   }


  public onBack() {
    this.router.navigate(['page/main/listPallet'], { replaceUrl: true });
  }


  async opcionL(item:any,ev){


      const popover = await this.popoverController.create({
        component: PopoverOptionsComponent,
        cssClass: 'popoverOptions',
        event: ev,
        translucent: true,
        componentProps: this.listMenuL(item)
      });
      await popover.present();
    
      const { data } = await popover.onDidDismiss();
      if (data.action === 'Delete' ) {


      this.intServ.alertFunc(this.js.getAlert('confirm', '', `Are you sure to remove the license plate '${item.PLUNo}' ?`, async() =>{

        console.log(item);

        try {

          this.intServ.loadingFunc(true);

          let Delete = await this.wmsService.Delete_LPChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo,item.PLUNo);
  
          console.log(Delete);
  
      if(Delete.Error) throw Error(`The License plate ${item.PLUNo} was not removed correctly`)
  
      this.listLp.filter((lp,index) => {


        if(lp.PLUNo === item.PLUNo){



          this.listLp.splice(index,1);


        }
      })
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `The licence plate ${item.PLUNo} has been removed`));
  
        
  
     
  
          
        } catch (Error) {
          
          this.intServ.loadingFunc(false);
  
          this.intServ.alertFunc(this.js.getAlert('error', '', Error.Message));
        }
      

      }))

      
      }else{

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
    
        if(Delete.Error) throw Error(`The License plate ${item.PLUNo} was not removed correctly`)
    
        this.listLp.filter((lp,index) => {
  
  
          if(lp.PLUNo === item.PLUNo){
  
  
  
            this.listLp.splice(index,1);
  
  
          }
        })
         

      let listl:any[] = [];
        
        let objL = {

          LP_Pallet_Child_No: ""
        }

     
        objL.LP_Pallet_Child_No =    item.PLUNo;
        
        listl.push(objL);
             
      let lp = await  this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR( this.wareReceipts.No,pallet.fields[0].PLULPDocumentNo,listl );
    

      if(lp.IsProcessed){

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `  The license place '${ item.PLUNo}' has been assigned correctly `));
       }
          
    
       
    
            
          } catch (Error) {
            
            this.intServ.loadingFunc(false);
    
            this.intServ.alertFunc(this.js.getAlert('error', '', Error.Message));
          }
    

   



        }, false, 3,);
        this.intServ.searchShowFunc(obj);

        console.log(this.pallets);

  
       




      }
    


  }

  
 async  opcionI(item:any,ev){


    
    const popover = await this.popoverController.create({
      component: PopoverOptionsComponent,
      cssClass: 'popoverOptions',
      event: ev,
      translucent: true,
      componentProps: this.listMenuI(item)
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    if (data.action === 'Delete' ) {


    
      this.intServ.alertFunc(this.js.getAlert('confirm', '', `Are you sure to remove the Item '${item.PLUNo}' ?`, async() =>{




    try {

      
    this.intServ.loadingFunc(true);

      let Delete = await this.wmsService.Delete_ItemChild_to_LP_Pallet_From_WR(item.PLULPDocumentNo,item.PLUWhseDocumentNo, item.PLUWhseLineNo, item.PLUQuantity,item.PLUNo);


      console.log(Delete);

      if(Delete.Error) throw Error(`The Item ${item.PLUNo} was not removed correctly`)
          
      this.listItem.filter((Item,index) => {


        if(Item.item.PLUNo === item.PLUNo){



          this.listItem.splice(index,1);


        }
      })

      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('success', '', `The Item ${item.PLUNo} has been removed`));

   

    }

  
          
         catch (Error) {


          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('error', '', Error.message));

          //console.log(error);
          
        }



      }))


    
    }else{

      console.log(data.action);

    }
  

  }


  private listMenuL(item: any): any {
    return {
      options: {
        name: `LP No. ${item.PLUNo}`,
        menu: [
          { 
            id: 1, 
            name: 'Delete', 
            icon: 'trash-outline',
            obj: item
          },
          { 
            id: 2, 
            name: 'Move', 
            icon: 'arrow-redo-outline',
            obj: item
          },
          { 
            id: 3, 
            name: 'Close', 
            icon: 'close-circle-outline' ,
            obj: {}
          }
        ]
      }
    };

  }


  private listMenuI(item: any): any {
    return {
      options: {
        name: `Item No. ${item.PLUNo}`,
        menu: [
          { 
            id: 1, 
            name: 'Delete', 
            icon: 'trash-outline',
            obj: item
          },
          { 
            id: 2, 
            name: 'Move', 
            icon: 'arrow-redo-outline',
            obj: item
          },
          { 
            id: 3, 
            name: 'Close', 
            icon: 'close-circle-outline' ,
            obj: {}
          }
        ]
      }
    };

  }

}
