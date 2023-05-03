import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { JsonService } from '@svc/json.service';

@Component({
  selector: 'app-popover-setting',
  templateUrl: './popover-setting.component.html',
  styleUrls: ['./popover-setting.component.scss'],
})
export class PopoverSettingComponent implements OnInit {

  public frm: UntypedFormGroup;
  public edit = false;

  private session:any;

  constructor(private formBuilder: UntypedFormBuilder,private popoverController: PopoverController
             ,private barcodeScanner: BarcodeScanner,private storage: Storage, private jsonService: JsonService) {

    this.frm = this.formBuilder.group(
      {
        print: ['', Validators.required],
        single: [false, Validators.required],
        pallet: [false, Validators.required],
        item: [false, Validators.required]
       
      }
    );

   }

 async ngOnInit() {

  this.session = (await this.jsonService.getSession()).login;

    let print  = (await this.storage.get(`print ${this.session.userId}`) != null && await this.storage.get(`print ${this.session.userId}`) != undefined)?await this.storage.get(`print ${this.session.userId}`): '';

    let single  = (await this.storage.get(`single ${this.session.userId}`) != null && await this.storage.get(`single ${this.session.userId}`) != undefined)?await this.storage.get(`single ${this.session.userId}`): false;
    
    let item  = (await this.storage.get(`item ${this.session.userId}`) != null && await this.storage.get(`item ${this.session.userId}`) != undefined)?await this.storage.get(`item ${this.session.userId}`): false;
    
    let pallet  = (await this.storage.get(`pallet ${this.session.userId}`) != null && await this.storage.get(`pallet ${this.session.userId}`) != undefined)?await this.storage.get(`pallet ${this.session.userId}`): false;

    this.frm.patchValue({
      print,
      single,
      pallet,
      item

    });
    
  }

  closePopover(){
    this.popoverController.dismiss({});
  }

 async  onSubmit(){

    let obj = await this.jsonService.formToJson(this.frm);

    if(this.frm.valid){

      this.storage.set(`print ${this.session.userId}`, obj.print);
      this.storage.set(`single ${this.session.userId}`, obj.single);
      this.storage.set(`item ${this.session.userId}`, obj.item);
      this.storage.set(`pallet ${this.session.userId}`, obj.pallet);

      console.log(obj);
    }

    
  }


  Edit(){

    this.edit = !this.edit;

  }

  delete(){

    this.storage.remove(`print ${this.session.userId}`);
    this.storage.remove(`single ${this.session.userId}`);
    this.storage.remove(`item ${this.session.userId}`);
    this.storage.remove(`pallet ${this.session.userId}`);

  }
}
