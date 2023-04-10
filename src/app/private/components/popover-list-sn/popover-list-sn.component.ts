import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverOptionsComponent } from '../popover-options/popover-options.component';
import { Storage } from '@ionic/storage';
import { reverse } from 'dns';

@Component({
  selector: 'app-popover-list-sn',
  templateUrl: './popover-list-sn.component.html',
  styleUrls: ['./popover-list-sn.component.scss'],
})
export class PopoverListSNComponent implements OnInit {

  @Input() list:any;
  @Input() item:any;
  @Input() boolean = false;
  constructor(public popoverController: PopoverController,private wmsService: WmsService, 
    private jsonService: JsonService,  private intServ: InterceptService,private storage: Storage) { }

  ngOnInit() {

    console.log(this.list);
  }

 async opcions(item:any,index:any){

    const popover = await this.popoverController.create({
      component: PopoverOptionsComponent,
      cssClass: 'PopoverOptionsComponent',
      backdropDismiss: true,
      componentProps: this.listMenu(item)

    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    switch(data.action){

      case 'Delete':
        this.intServ.alertFunc(this.jsonService.getAlert('alert', '','Are you sure?', async() => {

          this.intServ.loadingFunc(true);
          try {

            let res = await this.wmsService.DeleteItemTrackingSpecificationOpen(item);
             console.log(res);
            if(res.Error) throw new Error(res.Error.Message);
            
            if(res.message) throw new Error(res.message);

            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.jsonService.getAlert('success','', `Serial ${item.SerialNo} has been successfully deleted`, async() => {

            let receive =  await this.storage.get(`${this.item.No} ${this.item.LineNo}`);

            receive -= item.Qty;


            let list = [
              {
                WarehouseReceiptLines: [
                  {
                    No: this.item.No,
                    SourceNo: this.item.SourceNo,
                    ItemNo: this.item.ItemNo,
                    LineNo: this.item.LineNo,
                    ZoneCode: this.item.ZoneCode,
                    LocationCode: this.item.LocationCode,
                    BinCode: this.item.BinCode,
                    QtyToReceive: receive
                  }
                ]
              }
            ]
            
          
  
             await this.wmsService.Update_WsheReceiveLine(list); 
  
            this.storage.set(`${this.item.No} ${this.item.LineNo}`,receive);
  
            this.list.splice(Number(index),1);

              this.popoverController.dismiss({data: "Delete", list:this.list});

            }));
            
            
          } catch (error) {
            
            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.jsonService.getAlert('error','', error.message))
            
          }
        }));

        
       break;

    }

  }

  
  private listMenu(item: any): any {
    return {
      options: {
        name: `Serial No. ${item.SerialNo}`,
        menu: [
          {
            id: 1,
            name: 'Update',
            icon: 'refresh-outline',
            obj: item
          },
          {
            id: 2,
            name: 'Delete',
            icon: 'trash-outline',
            obj: {}
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

  onClose(){
    this.popoverController.dismiss({list:this.list});
  }

  
  delete(index:any){

    let con = this.list.splice(Number(index),1);
    console.log(con);
    console.log(this.list);
  
    }
  

}
