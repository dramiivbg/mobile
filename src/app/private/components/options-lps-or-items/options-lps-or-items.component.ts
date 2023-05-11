import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-options-lps-or-items',
  templateUrl: './options-lps-or-items.component.html',
  styleUrls: ['./options-lps-or-items.component.scss'],
})
export class OptionsLpsOrItemsComponent implements OnInit {

  public boolean: Boolean = true;

  public no:any = '';
  public listsT:any;
  public testListL: any[] = [];

  public lps = [];
  public items = [];
 
  @Input() lists:any;
  @Input() No:any;

  constructor(  private modalCtrl: ModalController,  private general: GeneralService,private barcodeScanner: BarcodeScanner,
    private popoverController: PopoverController
    ) { }

  ngOnInit() {

   this.listsT = this.lists;

   let checkboxL = {testID: 0, testName: "", checked: false}

          
   for (const index in this.lists) {
          

    checkboxL.testID = Number(index),
    checkboxL.testName = `test${index}`
    checkboxL.checked = false;

    this.testListL.push(checkboxL);
   checkboxL = {testID: 0, testName: "", checked: false};
   
   }
   
    
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
  
    for(let i in this.testListL) {
      this.testListL[i].checked = true;
   
      }
      
      this.lists.map(x => x.PLUType == 'LP'?this.lps.push(cloneDeep(x)):this.items.push(cloneDeep(x)))
      console.log(this.testListL);
 
  
    break;
  
    case false:
  
        for(let i in this.testListL) {
          this.testListL[i].checked = false;
          }
          this.lps = [];
          this.items = [];

          console.log(this.testListL);
         
      break;
  }
  
 }
  


  select(obj:any,ev){

    switch(ev.detail.checked){

      case true:  
       
        obj.PLUType == 'LP'?this.lps.push(obj):this.items.push(obj);
        
         console.log(this.lps, this.items);
          
      break;
      
      case false:
      
         this.lps.filter((obj2, index) => {
      
            if(obj2.PLUNo === obj.PLUNo){
               this.lps.splice(index,1);
            }
          });

          this.items.filter((obj2, index) => {
      
            if(obj2.PLUNo === obj.PLUNo){
               this.items.splice(index,1);
            }
          });
      
      
       console.log('Delete =>',this.lps,this.items);
      
       break;
        }
  }

  


 
  exit(){

    this.modalCtrl.dismiss({});

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

 onSubmit(){

  this.popoverController.dismiss({items:this.items,lps:this.lps});
  console.log(this.lps,this.items);
 }

 async  closePopover(){

  this.popoverController.dismiss({items:[],lps:[]});
 }


}
