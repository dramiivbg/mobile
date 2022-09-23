import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Lp } from '@mdl/lp';
import { InterceptService } from '@svc/intercept.service';
import { Observable } from 'rxjs';

import {PopoverOpionsLpComponent} from '../popover-opions-lp/popover-opions-lp.component';
import {PopoverLpEditComponent} from '../popover-lp-edit/popover-lp-edit.component';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';



@Component({
  selector: 'app-popover-lps',
  templateUrl: './popover-lps.component.html',
  styleUrls: ['./popover-lps.component.scss'],
})
export class PopoverLpsComponent implements OnInit {

  
  private boolean: boolean = true;

  @Input() lps: any = {} ;

  private listLp: Array<Lp> = [];

  private listL: any[] = [];
  private listQ: any[] = [];
  private listD: any[] = [];

  private list: any[] = []


  private lp : Lp;
  
  
  constructor(public popoverController: PopoverController, private intServ: InterceptService, private jsonService: JsonService,
      private wmsService: WmsService, private sqlitePlureService: SqlitePlureService) { }

  ngOnInit() {

    console.log(this,this.lps);

    this.lp = new Lp();

    this.lps.filter((lp, index) =>{
  

      for (const i in lp.fields) {

       // console.log(i);

     //   this.listLp.push(lp.fields[key]);


        
     if(lp.fields[i].name === "PLULPDocumentNo"){


   
      this.listL.push(lp.fields[i].value);
       

       // this.lp.lp = lp.fields[i].value;


     

     }


     if(lp.fields[i].name === "PLUQuantity"){



      this.listQ.push(lp.fields[i].value.toFixed(1));
    

     // this.lp.qty = lp.fields[i].value;



     

     }


     if(lp.fields[i].name === "SystemCreatedAt"){


     let f  = new  Date(lp.fields[i].value);

    let fecha = f.getDate()+'/'+(f.getMonth()+1)+'/'+f.getFullYear();
    
    
    this.listD.push(fecha);



     

     }

    


      
      }


   



    });


  
   
  }



 


 async option(lpNo:any,qty:any,ev:any){

  let lp = await this.wmsService.GetLicencesPlate(lpNo);


  let listLp = await this.wmsService.ListLP(lp);

 //console.log(listLp);

  this.popoverController.dismiss();
   const popover = await this.popoverController.create({
    component: PopoverOpionsLpComponent,
    cssClass: 'popoverOptions',
    event: ev,
    translucent: true,
    componentProps: this.listMenu(listLp)
  });
  await popover.present();

  const { data } = await popover.onDidDismiss();
  if (data.name == 'Edit') {
   this.onPopLicensePlate(ev, listLp);

  

 //  console.log(data);
  }else
      if(data.name == 'Delete'){

        let result = this.intServ.alertFunc(this.jsonService.getAlert('confirm','confirm','Surely you want to eliminate it?', () => {

          console.log(data);
        }))

      }

  }




  public async onPopLicensePlate(ev: any, lp: any) {
    this.intServ.loadingFunc(true);


    
   let lstUoM = await this.wmsService.getUnitOfMeasure(lp.fields[0].PLUDescription);




      const popover = await this.popoverController.create({
        component: PopoverLpEditComponent,
        cssClass: 'popoverLpEdit',
        event: ev,
        translucent: true,
        componentProps: { options: {lp,lstUoM} },
        backdropDismiss: false
      });
      this.intServ.loadingFunc(false);
      await popover.present();  
      const { data } = await popover.onDidDismiss();
      console.log(data);
  
 
  }


  
  private listMenu(lp: any): any {
    return {
      options: {
        name: `LP No. ${lp.fields[0].PLULPDocumentNo}`,
        menu: [
          { 
            id: 1, 
            name: 'Edit', 
            icon: 'newspaper-outline',
            obj: lp
          },
          { 
            id: 1, 
            name: 'Delete', 
            icon: 'close-outline',
            obj: lp
          },
          { 
            id: 2, 
            name: 'Close', 
            icon: 'close-circle-outline' ,
            obj: {}
          }
        ]
      }
    };

  }
  


}
