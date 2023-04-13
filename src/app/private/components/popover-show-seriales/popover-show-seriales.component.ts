import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-show-seriales',
  templateUrl: './popover-show-seriales.component.html',
  styleUrls: ['./popover-show-seriales.component.scss'],
})
export class PopoverShowSerialesComponent implements OnInit {

  @Input() lps:any;
  constructor(public popoverController: PopoverController, private intServ: InterceptService, private jsonService: JsonService,
    private wmsService: WmsService) { }

  ngOnInit() {}

 async delete(){

    this.intServ.alertFunc(this.jsonService.getAlert('confirm','','Are you sure?',async() => {

      this.intServ.loadingFunc(true);
    
      try {

         let lpD = await this.wmsService.DeleteLPSingle_FromWarehouseReceiptLine(this.lps.LPDocumentNo);

         if(lpD.Error) throw new Error(lpD.Error.Message);
         if(lpD.error) throw new  Error(lpD.error.message);
         if(lpD.message) throw new Error(lpD.message);
         
         this.popoverController.dismiss({data: 'eliminado'});
         this.intServ.loadingFunc(false);
         this.intServ.alertFunc(this.jsonService.getAlert('success', '', `The license plate ${this.lps.LPDocumentNo} has been successfully deleted`, () => {

          this.popoverController.dismiss({data:'eliminado'});
         }));
      
      } catch (error) {
        
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.jsonService.getAlert('error', '', error.message))
      }

    }));

  }

  onClose(){
    this.popoverController.dismiss({});
  }

}
