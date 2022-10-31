import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-popover-lp-empty',
  templateUrl: './popover-lp-empty.component.html',
  styleUrls: ['./popover-lp-empty.component.scss'],
})
export class PopoverLpEmptyComponent implements OnInit {


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

  ngOnInit() {

  
  }


 async onSubmit(){

    if (this.frm.valid) {



      this.intServ.loadingFunc(true);

      let obj = await this.jsonService.formToJson(this.frm);
    



     

      

      try {


        let res = await this.wmsService.GenerateEmptyLP( obj.ZoneCode,obj.LocationCode, "","Single");

     

        if(res.Error) throw Error(res.Error.Message);

        this.intServ.loadingFunc(false);

        Swal.fire(
          'Success!',
          'Generate License Plate',
          'success'
        )

    

        this.popoverController.dismiss({data: res, zone:  obj.ZoneCode });

        console.log(res);

      
        
      } catch (error) {
        

        console.log(error.message);

        this.intServ.loadingFunc(false);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  error.message,
          footer: ''
        })

       

        
      }


    

    
    }


  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }
}
