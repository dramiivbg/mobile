import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-show-inventory',
  templateUrl: './popover-show-inventory.component.html',
  styleUrls: ['./popover-show-inventory.component.scss'],
})
export class PopoverShowInventoryComponent implements OnInit {

  @Input() counting:any;

  public countingNu:number = 0;

  public noCountingNu:number = 0;

  public listPictureC:any[] = [];
  public listPictureN:any[] = [];

  public loading:Boolean = true;

  @Input() NoCounting:any;

  public boolean:Boolean = false;

  public Nocount:Boolean = false;

  public count:Boolean = false;



  constructor(  private modalCtrl: ModalController, private wmsService: WmsService) { }

 async ngOnInit() {

   // console.log(this.counting, this.NoCounting);

    this.countingNu = this.counting.length;

    this.noCountingNu = this.NoCounting.length;


    this.counting.filter(async(x) => {

      let res =  await this.wmsService.GetItem(x.fields.ItemNo);

      if(!res.Error){

        let listI = await this.wmsService.listItem(res);
  
  
        listI.fields.Picture =  `data:image/jpeg;base64,${listI.fields.Picture}`;
    
        this.listPictureC.push(listI);
      }

     

    });


    this.NoCounting.filter(async(x) => {

      let res =  await this.wmsService.GetItem(x.fields.ItemNo);

      if(!res.Error){

        let listI = await this.wmsService.listItem(res);
  
  
        listI.fields.Picture =  `data:image/jpeg;base64,${listI.fields.Picture}`;
    
        this.listPictureN.push(listI);
      }
    });

    this.count = (this.countingNu > 0) ? true: false;

    this.Nocount = (this.noCountingNu > 0) ? true: false;


    this.loading = false;

    this.boolean = true;

    console.log(this.listPictureC, this,this.listPictureN);


   
  }

  enableC(){

    this.boolean = true;

  }

  enableN(){

    this.boolean = false;


  }

  exit(){


    this.modalCtrl.dismiss({});

    
  }
}
