import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-popover-item-traking',
  templateUrl: './popover-item-traking.component.html',
  styleUrls: ['./popover-item-traking.component.scss'],
})
export class PopoverItemTrakingComponent implements OnInit {


  public frm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.frm = this.formBuilder.group(
      {
        Qty: ['0', Validators.required],
        requestedDeliveryDate: ['', Validators.required],
        TotalToReceive: [0, Validators.required],
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        QtyBase: [0, Validators.required],
        QtyHandleBase: [0, Validators.required],




      }
    )
  }

  ngOnInit() { }


  calendar() {


  }


}
