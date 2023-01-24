import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { Storage } from '@ionic/storage';
import { PopoverListSNComponent } from '../popover-list-sn/popover-list-sn.component';

@Component({
  selector: 'app-physical-no-count',
  templateUrl: './physical-no-count.component.html',
  styleUrls: ['./physical-no-count.component.scss'],
})
export class PhysicalNoCountComponent implements OnInit {

  public quantity = 0; 
  public list:any;
  public batch:any;
  public obj = [];
  public data = '';
  public objT = [];
  constructor(private storage: Storage,private intServ: InterceptService, public popoverController: PopoverController,private barcodeScanner: BarcodeScanner) { }

  async ngOnInit() {
    this.list = await this.storage.get('Nocount');
    let  list2 = await this.storage.get('Nocount');
   this.batch = await  this.storage.get('batch'); 
   let seriales = [];
   list2.map(async x => {
    
    this.list.map(obj => obj.PLULicensePlates ===  x.PLULicensePlates?seriales.push(obj): obj);
           
     x['seriales'] = seriales;
     x.QtyPhysInventory = seriales.length; 
     x.QtyCalculated = seriales.length;
     
     let line = this.obj.find(b => x.PLULicensePlates === b.PLULicensePlates);
      if(line === null || line === undefined)this.obj.push(x);
      seriales = [];   
      this.objT = this.obj;       
    
  });

  this.list.map(x => this.quantity+= x.QtyPhysInventory);
   // console.log(this.list);
    this.intServ.loadingFunc(false);
    console.log(this.obj);
  }

  async show(item:any){

    let list = [];
    if(item.seriales.length > 0 && item.PLULicensePlates != null && item.SerialNo != null){
  
      item.seriales.map(x => {x['proceded'] = false; list.push(x)});
  
      const popover = await this.popoverController.create({
        component: PopoverListSNComponent,
        cssClass: 'popoverListSNComponent-modal',
        componentProps: { list },
      });
      this.intServ.loadingFunc(false);
      await popover.present();
    }
  }

  public autoComplet(){
    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text.toUpperCase();
        this.data = code;
        this.onFilter('', this.data);
  
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  
  }
  
  onFilter(e, data:any = '') {
    
    switch(data){
  
      case '':
        let val = e.target.value;
      
        if (val === '') {
          this.obj = this.objT;
        } else {
          this.obj = this.objT.filter(
            x => {
              return (x.PLULicensePlates != null?x.PLULicensePlates.toLowerCase().includes(val.toLowerCase()):x.ItemNo.toLowerCase().includes(val.toLowerCase())
              ||  x.SerialNo != null?x.SerialNo.toLowerCase().includes(val.toLowerCase()):x ||  x.LotNo != null?x.LotNo.toLowerCase().includes(val.toLowerCase()):x);
            }
          )
        }
        
        break;
  
    default:
  
      this.obj = this.objT.filter(
        x => {
          
          return (x.PLULicensePlates != null?x.PLULicensePlates.toLowerCase().includes(data.toLowerCase()):x.ItemNo.toLowerCase().includes(data.toLowerCase()) 
          ||  x.SerialNo != null?x.SerialNo.toLowerCase().includes(data.toLowerCase()):x ||  x.LotNo != null?x.LotNo.toLowerCase().includes(data.toLowerCase()):x);
        }
      )
  
      break;
  
     } 
  }

}
