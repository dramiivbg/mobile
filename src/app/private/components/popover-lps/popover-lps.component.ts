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
import { PopoverShowSerialesComponent } from '../popover-show-seriales/popover-show-seriales.component';



@Component({
  selector: 'app-popover-lps',
  templateUrl: './popover-lps.component.html',
  styleUrls: ['./popover-lps.component.scss'],
})
export class PopoverLpsComponent implements OnInit {

  
  private boolean: boolean = true;

  @Input() lps: any = {} ;

  public listLp: Array<Lp> = [];

  public listL: any[] = [];
  public listQ: any[] = [];
  public listD: any[] = [];

  public list: any[] = []


  public lp : Lp;
  
  
  constructor(public popoverController: PopoverController, private intServ: InterceptService, private jsonService: JsonService,
      private wmsService: WmsService, private sqlitePlureService: SqlitePlureService) { }

  ngOnInit() {

    console.log(this.lps);


  }



async option(item:any,ev){

switch(item.seriales.length === 0){

   case true:
      this.intServ.loadingFunc(true);

      this.intServ.loadingFunc(false);
       const popover = await this.popoverController.create({
        component: PopoverOpionsLpComponent,
        cssClass: 'popoverOptions',
        event: ev,
        componentProps: this.listMenu(item)
      });
      await popover.present();
    
      const { data } = await popover.onDidDismiss();
    
        switch(data.name) {
    
          case 'Edit':
    
          this.popoverController.dismiss({data: 'editado'});
      // this.onPopLicensePlate(ev, item);
      
         break;
    
         case 'Delete':
    
            let result = this.intServ.alertFunc(this.jsonService.getAlert('confirm',' ','Are you sure you want to remove it?', async() => {
    
    
              this.intServ.loadingFunc(true);
    
              try {
    
    
                 let lpD = await this.wmsService.DeleteLPSingle_FromWarehouseReceiptLine(item.PLULPDocumentNo);
    
                 if(lpD.Error) throw Error(lpD.Error.Message);
    
                 this.popoverController.dismiss({data: 'eliminado'});
                 this.intServ.loadingFunc(false);
                 this.intServ.alertFunc(this.jsonService.getAlert('success', '', `The license plate ${lpD.LPPallet_DocumentNo} has been successfully deleted`));
              
              } catch (error) {
                
                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.jsonService.getAlert('error', '', error.message))
              }
            }));
    
            break;
    
          }
      break;

      default:

      const popover1 = await this.popoverController.create({
        component: PopoverShowSerialesComponent,
        cssClass: 'popoverShowSerialesComponent',
        componentProps: {lps:item},
        backdropDismiss: false
      });
      this.intServ.loadingFunc(false);
      await popover1.present();   
      this.options(popover1);
        break;
  }
 
  }


  public async options(obj:any){

    const { data } = await obj.onDidDismiss();

    this.popoverController.dismiss({data:data.data});

  }

  public async onPopLicensePlate(ev: any, lp: any) {
    this.intServ.loadingFunc(true);

   let lstUoM = await this.wmsService.getUnitOfMeasure(lp.PLUDescription);

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
        name: `LP No. ${lp.PLULPDocumentNo}`,
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

  onClose(){
    this.popoverController.dismiss({});
  }
  


}
