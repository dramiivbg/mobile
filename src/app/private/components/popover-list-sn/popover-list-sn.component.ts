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
  @Input() checkbox = false;
  public del = true;
  public select = [];
  public testListL: any[] = [];
  constructor(public popoverController: PopoverController,private wmsService: WmsService, 
    private jsonService: JsonService,  private intServ: InterceptService,private storage: Storage) { }

  ngOnInit() {

    console.log(this.list);

    let checkboxL = {testID: 0, testName: "", checked: false}

    for (const index in  this.list) {
      checkboxL.testID = Number(index),
      checkboxL.testName = `test${index}`
      checkboxL.checked = false;
      this.testListL.push(checkboxL);
     checkboxL = {testID: 0, testName: "", checked: false};
     }

  }

 

  onClose(){
    this.popoverController.dismiss({list:this.list});
  }


    onDelete(){

      let process = [];

      this.select.map((x,index) => x.proceded === false?this.list.splice(Number(index),1): process.push(x));
      
      this.del = true;

      if(process.length > 0){

        this.intServ.alertFunc(this.jsonService.getAlert('alert', '','Are you sure?', async() => {

          this.intServ.loadingFunc(true);
          try {


            let receive =  await this.storage.get(`${this.item.No} ${this.item.LineNo}`);

            process.map(x => receive-= x.Qty);
           
            this.storage.set(`${this.item.No} ${this.item.LineNo}`,receive);

            let res = await this.wmsService.DeleteItemTrackingSpecificationOpenV2(this.item,process);
             console.log(res);
            if(res.Error) throw new Error(res.Error.Message);
            
            if(res.error) throw new Error(res.error.message);

            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.jsonService.getAlert('success','', `Has been successfully deleted`, async() => {
  
            process.map(p => {

              this.list.map((x,index) => x.SerialNo == p.SerialNo && x.LotNo == p.LotNo?this.list.splice(Number(index),1):x);

            });
       

              this.popoverController.dismiss({data: "Delete", list:this.list});

            }));
            
            
          } catch (error) {
            
            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.jsonService.getAlert('error','', error.message))
            
          }
        }));
      }

    }


    
  checkAll(ev){

    console.log(ev);

  switch(ev.detail.checked){
  
  case true:
 
    for(let i = 0; i < this.testListL.length; i++) {
  
  
      this.testListL[i].checked = true;

      }  
      this.del = false; 
      console.log(this.testListL);
       
    break;
  
    
    case false:
    
        for(let i =0; i < this.testListL.length; i++) {
          this.testListL[i].checked = false;
  
          }
          this.del = true; 
          console.log(this.testListL);
      
  
        break;
  
  }
  
  }


  selectl(item:any,ev){


    switch(ev.detail.checked){
    
     case true:
      
   
          this.select.push(item);
    
          console.log(this.select);
   
          this.del = false; 
       
        break;
    
        case false:
    
          this.removel(item);

          this.del = true; 
    
          break;
        }
          //console.log(item);
      }


    removel(item:any){    
    
          this.select.filter((i, index) =>{
     
            if(i.SerialNo === item.SerialNo && i.LotNo === item.LotNo){
    
    
              this.select.splice(index,1);
            }
                     
          });
        
            console.log(this.select);
               
      }
  
}
