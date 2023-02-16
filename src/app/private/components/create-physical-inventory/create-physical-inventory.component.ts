import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-physical-inventory',
  templateUrl: './create-physical-inventory.component.html',
  styleUrls: ['./create-physical-inventory.component.scss'],
})
export class CreatePhysicalInventoryComponent implements OnInit {


  public frm: FormGroup;
  constructor(public popoverController: PopoverController, private intServ: InterceptService,  private formBuilder: FormBuilder, 
    private jsonService: JsonService, private wmsService: WmsService) { 

      
    this.frm = this.formBuilder.group(
      {
        ZoneCode: [' ', Validators.required],
        LocationCode: [' ', Validators.required],
      }
    )
    }

  ngOnInit() {}

  async onSubmit(data:any = ""){


    if (this.frm.valid) {


      let obj = await this.jsonService.formToJson(this.frm);

      console.log(obj);


      let month:any;

      let day:any;

      if(data === "")  data = Math.floor(Math.random() * 1000000000); 

      

      let date = new Date();

      if((date.getMonth()+1) < 9) {
        month = '0'+ (date.getMonth()+1)
    }else{

      month = (date.getMonth()+1);
    }


    if(date.getDate() <= 9) {
      day = '0'+ date.getDate();
  }else{

    day = date.getDate();
  }


      let fecha = date.getFullYear() +'-'+month+'-'+day;

      this.popoverController.dismiss({zone: obj.ZoneCode, locationCode: obj.LocationCode, fecha, data});

   }
 }

  public async closePopover() {
    this.popoverController.dismiss({data: null});
  }

}
