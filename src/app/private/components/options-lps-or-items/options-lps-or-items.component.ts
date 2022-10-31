import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';

@Component({
  selector: 'app-options-lps-or-items',
  templateUrl: './options-lps-or-items.component.html',
  styleUrls: ['./options-lps-or-items.component.scss'],
})
export class OptionsLpsOrItemsComponent implements OnInit {

  public boolean: Boolean = true;

  public no:any = '';
  public listsT:any;


 
  @Input() lists:any;
  @Input() No:any;

  constructor(  private modalCtrl: ModalController,  private general: GeneralService,private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {

   
    
  }



 


  onChange(e, lpNo:any = ''){

    if(lpNo === ''){


      let val = e.target.value;

      if (val === '') {
       this.lists = this.listsT;
      } else {
        this.lists = this.listsT.filter(
          x => {
            return (x.PLUNo.toLowerCase().includes(val.toLowerCase()));
          }
        )
      }

    }else{


        this.lists = this.listsT.filter(
          x => {
            return (x.PLUNo.toLowerCase().includes(lpNo.toLowerCase()));
          }
        )
      
    }


 
   
  }



  



  select(item:any,ev){



  
 
 
    this.modalCtrl.dismiss({data: item});

    //console.log(item);
  }

  


 




  autoComplet(){
  
    this.barcodeScanner.scan().then(
      async  (barCodeData) => {
          let code = barCodeData.text;
    
    
  
          this.no = code;


          this.onChange('', this.no);
          
    
      
        }
      ).catch(
        err => {
          console.log(err);
        }
      )
 }


 



}
