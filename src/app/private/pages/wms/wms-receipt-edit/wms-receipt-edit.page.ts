import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { EMPTY, empty } from 'rxjs';

@Component({
  selector: 'app-wms-receipt-edit',
  templateUrl: './wms-receipt-edit.page.html',
  styleUrls: ['./wms-receipt-edit.page.scss'],
})
export class WmsReceiptEditPage implements OnInit {
  public lpsS: any = {}
  public list: any[] = [] 
  public listT: any[] = [] 

  public contador:number = 0;
   public lpsP: any = {}
  public scanLP: boolean = true;
  public scanBin: boolean = false;

  public bin:string = '';

  public listBin:any[] = [];

  public listsFilter: any[];
  public lists: any = [];
  public wareReceipts: any = {};

  constructor(private router: Router
    , private route: ActivatedRoute,private intServ: InterceptService, private barcodeScanner: BarcodeScanner, private js: JsonService, private wmsService: WmsService, private general: GeneralService) { 


      


    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.wareReceipts = this.router.getCurrentNavigation().extras.state.wareReceipts;
     //
      } else {
        this.router.navigate(['page/wms/wmsMain'], { replaceUrl: true })
      }
    });
  }

  onBack() {
    this.router.navigate(['page/wms/wmsMain']);
  }

  public async  onBarCode() {

    //console.log(this.wareReceipts);

    if(this.scanLP){

      let line:any = undefined;

    this.barcodeScanner.scan().then(
    async  (barCodeData) => {
        let code = barCodeData.text;




       
    for (const key in this.list) {
  

      if (this.list[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {line = this.list[key];this.intServ.loadingFunc(false); break; }

        
      }

      if (line === null || line === undefined) {
        this.intServ.alertFunc(this.js.getAlert('error', 'Error', `The item '${code}' does not exist on the receipt`));
        this.intServ.loadingFunc(false);
      } else {
        if(this.listsFilter != undefined){

          let find =   this.listsFilter.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() == code.toUpperCase());
   
          if(find == null || find ==undefined){
   
           this.listsFilter.push(line);
           this.listT.push(line);
          }else{
   
   
           this.intServ.alertFunc(this.js.getAlert('alert', 'alert ', `The item is already assigned`));
   
          }
         
           }else{

            this.listsFilter = []

            this.listsFilter.push(line);
            this.listT.push(line);

           }

       
      }

 
    
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }else{

    let line:any = undefined;

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
       
        
    if(code != ''){
    


      this.listsFilter.filter(
       lp => {


        let find =   this.scanBin[0].Bins.find(lp => lp.BinCode.toUpperCase() == code.toUpperCase());
   

        if(find != null || find !=undefined){


          lp.fields.PLUBinCode = code.toUpperCase();
        }else{


          this.intServ.alertFunc(this.js.getAlert('error', 'error', 'Bin code not allowed'));


        }


        
       }
     )

     this.intServ.loadingFunc(false);

   }else{


     this.intServ.alertFunc(this.js.getAlert('error', 'error', 'Bin code is Empty'));

     this.intServ.loadingFunc(false);

   }

      }
    
    ).catch(
      err => {
        console.log(err);
      }
    )


  }
  }

async onAdd(e) {
    let val = e.target.value;

  //  console.log('change =>',val);
   
switch(this.scanLP){


  
  
   case true:

   let line:any =  undefined;

   
  this.intServ.loadingFunc(true);

     if (val === '') {
  

      this.intServ.alertFunc(this.js.getAlert('error', 'error', 'No license plate is Empty'));

      this.intServ.loadingFunc(false);


   
    } else {

    


      for (const key in this.list) {

        if (this.list[key].fields.PLULPDocumentNo.toUpperCase() === val.toUpperCase()) {line = this.list[key]; this.intServ.loadingFunc(false); break;}
  
      }

      if (line === null || line === undefined) {
        this.intServ.alertFunc(this.js.getAlert('error', 'Error', `The item '${val}' does not exist on the receipt`));
        this.intServ.loadingFunc(false);
      } else {
        if(this.listsFilter != undefined){

          let find =   this.listsFilter.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() == val.toUpperCase());
   
          if(find == null || find ==undefined){
   
           this.listsFilter.push(line);
           this.listT.push(line);
          }else{
   
   
           this.intServ.alertFunc(this.js.getAlert('alert', 'alert ', `The item is already assigned`));
   
          }
         
           }else{

            this.listsFilter = []

            this.listsFilter.push(line);
            this.listT.push(line);

           }
      }

   


    



   




     } 

break;


   case false:

   console.log('false')


     if (val === '') {
  
      this.listsFilter = this.listT;



  

   
    } else {
   this.listsFilter =  this.listT.filter(
        lp => {


             return (lp.fields.PLULPDocumentNo.toUpperCase().includes(val.toUpperCase()) )

                       
      });

     } 
  
  }

 

    
  }

 async onSubmit(){


   
    if(this.scanLP){

      
      this.intServ.loadingFunc(true);

      this.scanBin = true;
      this.scanLP = false;

      this.intServ.loadingFunc(false);



        
        let bins = await this.wmsService.GetPossiblesBinFromWR(this.listsFilter[0].fields.PLULPDocumentNo);

        this.listBin.push(bins);

        console.log(this.listBin);

    



    }else{


      this.intServ.alertFunc(this.js.getAlert('alert', 'alert', 'Confirm WH PutAway?'));

      console.log(this.listsFilter);



/*
      this.intServ.loadingFunc(true);

      let res = await this.wmsService.Post_WarehouseReceipts(this.wareReceipts.No);

      console.log('error =>',res);

      if(!res.Error){

       this.intServ.loadingFunc(false);

       this.intServ.alertFunc(this.js.getAlert('sucess', 'sucess', ' warehouse Receipts successfully registered', () => this.router.navigate(['/page/wms/wmsMain'])))


      }else{

       this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error','error','There is nothing to publish, please create license plate'));

      }

      */
      

    }

    

    
  }

 async  ngOnInit() {




  let listLp = await this.wmsService.GetLicencesPlateInWR(this.wareReceipts.No);
  

  this.list = await this.wmsService.list(listLp);

  console.log(this.list);

   
  
  


  }


 public async onChangeBin(bin:any){


  


  console.log(bin);


    this.intServ.loadingFunc(true);


    if(bin != ''){
    

       this.listsFilter.filter(
        async(lp) => {



        


          lp.fields.PLUBinCode = bin.toUpperCase();
         
        }
      )

      this.intServ.loadingFunc(false);

    }else{


      this.intServ.alertFunc(this.js.getAlert('error', 'error', 'Bin code is Empty'));

      this.intServ.loadingFunc(false);

    }



  }


  onChangeBinOne(item:any,bin:any){



    this.listsFilter.filter(lp =>{


      if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){


        lp.fields.PLUBinCode = bin.toUpperCase();

      }
    });



  }





  }


