import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
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

  public listsC:any;

  public listsN:any;

  public loading:Boolean = true;

  public codeC:any = '';

  public codeN:any = '';

  @Input() NoCounting:any;

  public boolean:Boolean = false;

  public Nocount:Boolean = false;

  public count:Boolean = false;



  constructor(  private modalCtrl: ModalController, private wmsService: WmsService, private barcodeScanner: BarcodeScanner,) { }

 async ngOnInit() {

   // console.log(this.counting, this.NoCounting);

    this.countingNu = this.counting.length;

    this.noCountingNu = this.NoCounting.length;

    this.listsC = this.counting;

    this.listsN = this.NoCounting;


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


  
  autoComplet(){


    if(this.boolean){
 
 
     
     this.barcodeScanner.scan().then(
       async  (barCodeData) => {
           let code = barCodeData.text;
     
     
   
           this.codeC = code;
 
 
           this.onChangeC('', this.codeC);
           
     
       
         }
       ).catch(
         err => {
           console.log(err);
         }
       )
    }else{
 
 
     
     this.barcodeScanner.scan().then(
       async  (barCodeData) => {
           let code = barCodeData.text;
     
     
   
           this.codeN = code;
 
 
           this.onChangeN('', this.codeN);
           
     
       
         }
       ).catch(
         err => {
           console.log(err);
         }
       )
    }
 
   }


   
  onChangeN(e, codeN:any = ''){

    if(codeN === ''){
    let val = e.target.value;

    if (val === '') {
      this.NoCounting = this.listsN;
    } else {
      this.NoCounting = this.listsN.filter(
        x => {
          return (x.fields.PLULicensePlates.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }

  }else{


    this.NoCounting = this.listsN.filter(
      x => {
        return (x.fields.PLULicensePlates.toLowerCase().includes(codeN.toLowerCase()));
      }
    )
  }




  }



   
  onChangeC(e, codeC:any = ''){

    if(codeC === ''){
    let val = e.target.value;

    if (val === '') {
      this.counting = this.listsC;
    } else {
      this.counting = this.listsC.filter(
        x => {
          return (x.fields.PLULicensePlates.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }

  }else{


    this.counting = this.listsC.filter(
      x => {
        return (x.fields.PLULicensePlates.toLowerCase().includes(codeC.toLowerCase()));
      }
    )
  }




  }


}
