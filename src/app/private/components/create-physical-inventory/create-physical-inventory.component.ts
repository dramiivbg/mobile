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
  public boolean:Boolean = true;

  public loading:Boolean = false;

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

      this.boolean = false;
      this.loading = true;


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

      console.log(fecha)


      try {

        let res = await this.wmsService.Create_WarehouseInvPhysicalCount(obj.ZoneCode,"",obj.LocationCode,fecha,data);

        console.log(res);

        if(res.Error) throw new Error(res.Error.Message);

        if(res.error) throw new Error(res.error.message);


        this.popoverController.dismiss({data: res, locate: obj.LocationCode });
        
        
      } catch (error) {
        
        
      this.loading = false;
      this.boolean = true;

      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:  error.message,
        footer: ''
      });

      
        
      }
    }


  }

  public async closePopover() {
    this.popoverController.dismiss({data: null});
  }

}
