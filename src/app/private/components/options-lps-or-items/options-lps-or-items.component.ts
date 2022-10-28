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
  public listL:any[] = [];

  public testList: any[] = [];
  @Input() lists:any;
  @Input() No:any;

  constructor(  private modalCtrl: ModalController,  private general: GeneralService,private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {

    let checkbox = {testID: 0, testName: "", checked: false}
    this.listsT = this.lists;
    this.listsT.filter((lp, index) => {

    checkbox.testID = Number(index),
     checkbox.testName = `test${index}`
     checkbox.checked = false;
 
     this.testList.push(checkbox);
    checkbox = {testID: 0, testName: "", checked: false};
 
    });
    
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



  

  checkAll(ev){


    console.log(ev);
  switch(ev.detail.checked){
  
  case true:
  
 
  
    for(let i =0; i <= this.testList.length; i++) {
  
  
      this.testList[i].checked = true;
  
  
   
      }  
      console.log(this.testList);
   
  
    break;
  
    
    case false:
  
  
  
        for(let i =0; i <= this.testList.length; i++) {
          this.testList[i].checked = false;
  
  
          }
          console.log(this.testList);
       
  
        break;
  
  
  }
  
    
  }


  selectl(item:any,ev){


switch(ev.detail.checked){

 case true:
  
 
 


      this.listL.push(item);

      console.log(this.listL);


   
    break;

    case false:

      this.removel(item,ev);

      break;
    }

    //console.log(item);
  }

  


  remove(){


      this.listL = [];

      console.log(this.listL);



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


 removel(item:any,ev){





    this.listL.filter((lp, index) =>{


      if(lp.PLUNo === item.PLUNo){


        this.listL.splice(index,1);
      }
      
     
    })

  
      console.log(this.listL);
  }



  onSubmit(){



    this.modalCtrl.dismiss({data: this.listL});



  }

}
