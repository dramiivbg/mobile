import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';


@Component({
  selector: 'app-popover-log-lp',
  templateUrl: './popover-log-lp.component.html',
  styleUrls: ['./popover-log-lp.component.scss'],
})
export class PopoverLogLpComponent implements OnInit {

  @Input() listLogs:any;

  @Input() listLogsFilter:any;
 
  constructor( private intServ: InterceptService, private modalCtrl: ModalController) { 

  }

  ngOnInit() {

}

  exit(){

    this.modalCtrl.dismiss({});

  }

  onChange(e){

    let val = e.target.value;

    if (val === '') {
      this.listLogsFilter = this.listLogs;
     } else {
       this.listLogsFilter = this.listLogs.filter(
         x => {
           return (x.BinCode.toLowerCase().includes(val.toLowerCase()) || x.Document.toLowerCase().includes(val.toLowerCase()) || x.DocumentNo.toLowerCase().includes(val.toLowerCase())
           || x.EntryType.toLowerCase().includes(val.toLowerCase()) || x.LicensePlateStatus.toLowerCase().includes(val.toLowerCase()) || x.LocationCode.toLowerCase().includes(val.toLowerCase())
            || x.PostingDate.toLowerCase().includes(val.toLowerCase()) || x.Quantity.toLowerCase().includes(val.toLowerCase()) || x.UnitofMeasure.toLowerCase().includes(val.toLowerCase())
             || x.UserName.toLowerCase().includes(val.toLowerCase()));
         }
       )
     }

  }

}
