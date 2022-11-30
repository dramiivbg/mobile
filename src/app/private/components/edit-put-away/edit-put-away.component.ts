import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2'
import { Storage } from '@ionic/storage';
import { PassThrough, Stream } from 'stream';
import { CssSelector } from '@angular/compiler';
import { ModalShowLpsComponent } from '../modal-show-lps/modal-show-lps.component';
import { empty } from 'rxjs';
import { ModalLpsConfirmComponent } from '../modal-lps-confirm/modal-lps-confirm.component';

@Component({
  selector: 'app-edit-put-away',
  templateUrl: './edit-put-away.component.html',
  styleUrls: ['./edit-put-away.component.scss'],
})
export class EditPutAwayComponent implements OnInit {
  public lpsS: any = {}
  public list: any[] = [] 
  public listT: any[] = [] 

  public lps:any[] = [];
  public boolean:boolean = true;

  public bins:any[] = [];
  public initV:any[] = [];


  public whsePutAway:any;

  public listPwL: any[] = [];
  public contador:number = 0;
   public lpsP: any = {}
  public scanLP: boolean = true;
  public scanBin: boolean = false;

  public groupItems:any[] = [];

  public split: any; 

  public listBins:any[] = [];
  public pallet:any;

  public pallet2:any;

  public items:any[] = [];

  public bin:string = '';

  public binCode: any = '';
  public listBin:any[] = [];

  public listsFilter: any[] = [];
  public lists: any = [];
  public warePW: any = {};

  public barcodeScannerOptions: BarcodeScannerOptions
  public warePY: any;

  public QtyTake:number = 0;

  public QtyTotal:number = 0;

  

  constructor(private router: Router
 ,private intServ: InterceptService, private barcodeScanner: BarcodeScanner, private js: JsonService, private wmsService: WmsService, 
 private general: GeneralService , private storage: Storage, private modalCtrl: ModalController) { 

  let objFunc = {
    func: () => {
      this.onBack();
    }
  };
  this.intServ.appBackFunc(objFunc);

  this.barcodeScannerOptions = {
    showTorchButton: true,
    showFlipCameraButton: true
  };
      
  }

  ngAfterViewInit(){

  
  }
  async  ngOnInit() {

    this.whsePutAway =  await this.storage.get('whsePutAway');

    this.warePW = await this.storage.get('setPutAway');

      this.listPwL = await this.wmsService.ListPutAwayL(this.warePW);
      console.log(this.whsePutAway, this.listPwL);
      this.warePY = await this.wmsService.ListPutAwayH(this.warePW);
    
      this.init();

      this.listsFilter = (await this.storage.get(this.whsePutAway.fields.No) != undefined ||  await this.storage.get(this.whsePutAway.fields.No) != null)?  await this.storage.get(this.whsePutAway.fields.No): [];
      console.log(await this.storage.get(this.whsePutAway.fields.No));
      this.listT = (await this.storage.get(this.whsePutAway.fields.No) != undefined ||  await this.storage.get(this.whsePutAway.fields.No) != null)?  await this.storage.get(this.whsePutAway.fields.No): [];
      this.lps =  (await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) != undefined ||
                  await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) != null)? await this.storage.get(`confirm ${this.whsePutAway.fields.No}`): [];
    
      this.listBins =  (await this.storage.get(`bins ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`bins ${this.whsePutAway.fields.No}`) != null)? await this.storage.get(`bins ${this.whsePutAway.fields.No}`): [];

    console.log(this.lps);
          
    let bin = (this.listsFilter.length > 0)? await this.wmsService.GetPossiblesBinFromPutAway(this.listsFilter[0].fields.PLULPDocumentNo): null;

    this.bins = bin.Bins;
      

    }
 
  public onBack(){


    this.router.navigate(['page/wms/wmsMain']);

 }


  public async onBarCodeChange(){

    let line = undefined;


    this.barcodeScanner.scan().then(
      async  (barCodeData) => {
       let code = barCodeData.text;
    
       this.intServ.loadingFunc(true);
    line =   this.bins.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase());


    if(line === null || line === undefined){

      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', ' ', `The Bin code ${code.toUpperCase()} does not exist`));
    
  }else{

  if(this.pallet != undefined && this.listsFilter.length != this.initV.length){
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error', ' ',`Please scan all license plate and pallet`));
    return;
  }

     this.listsFilter.filter( lp => {
      lp.fields.place = code.toUpperCase();

    });

    this.listT = this.listsFilter;
    this.storage.set(this.whsePutAway.fields.No, this.listsFilter);

    this.intServ.loadingFunc(false);
    }
    } ).catch(
        err => {
          console.log(err);
        }
      )

  }


  public async  onBarCode() {
       let line:any = undefined;
        this.barcodeScanner.scan().then(
        async  (barCodeData) => {
        
            let code = barCodeData.text;

        this.boolean = ( code === null || code === " ")? false: this.boolean;
           console.log(code);
        for (const key in this.initV) {
      
    
          if (this.initV[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {
            line = this.initV[key];
            this.intServ.loadingFunc(false);  
          
          }
    
          }
        
    
          switch(line) {
    
            case null || undefined:   
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error', ' ',`The license plate ${code.toUpperCase()} does not exist on the Put Away`));
          
             break;
    
           default:
    
            if(this.listsFilter.length > 0){
    
              let find =   this.listsFilter.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase());
              let find2 = this.lps.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase());
              switch(find){
             
                   case null || undefined:
                        if(find2 === null || find2 === undefined){

                          this.listsFilter.push(line);
                          this.listT.push(line);
                          this.QtyTake ++;
                          break;
                        }
                          
                          
                                     
                    default:
            
                      this.intServ.loadingFunc(false);
                      this.intServ.alertFunc(this.js.getAlert('alert', ' ',`The license plate is already assigned`));
                      break;
              }
             
               }else{
                this.listsFilter = [];

                let find2 = this.lps.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase());
               
                     if(find2 === null || find2 === undefined){

                      this.listsFilter.push(line);
                      this.listT.push(line);
                      this.QtyTake ++;

                     }
                        
                         
                    
                  }
               
    
    
                    this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
    
               let bin = await this.wmsService.GetPossiblesBinFromPutAway(this.listsFilter[0].fields.PLULPDocumentNo);
    
               this.bins = bin.Bins;
           
               break;
          }
          
      //   if(this.boolean){

      //      this.onBarCode();
       //   }
      
        }

       
            
        ).catch(
          err => {
            console.log(err);
          }
        )
      
    }

 async onSubmit(){
  
   if(this.initV.length !== this.listsFilter.length){

    let res:any[] = [];
      let qtyR = this.QtyTotal - this.QtyTake;

      this.initV.filter(Lp => {

        let line = this.listsFilter.find(lp => lp.fields.PLULPDocumentNo === Lp.fields.PLULPDocumentNo);
        let line2 = res.find(bin => bin === Lp.fields.place);

        if((line === null || line === undefined) && (line2 === null || line2 === undefined)){

          res.push(Lp.fields.place);
        }

      });

    //  console.log(res);
      
      this.intServ.alertFunc(this.js.getAlert('alert2', 'Are you sure?', `The LP remaining amount(${qtyR}) will go to the ${res.join(" ")} `, () => {
        var alert = setTimeout(() => {  
        
          this.submit();

        clearTimeout(alert);
      }, 100)
      }));

     

     }else{

      this.submit();
     } 

   

}


async submit(){

  this.intServ.alertFunc(this.js.getAlert('confirm', '','Confirm Whse. PutAway?', async() => {
    let request = {

    ActivityType: 1,
    No: "",
    ItemNo: "",
    LineNo: "",
    ZoneCode: "",
    LocationCode: "",
    BinCode: "",
    Quantity: 0,
    LP: ""
  }

  let line;



 this.intServ.loadingFunc(true);


  this.split = await this.wmsService.Prepare_WarehousePutAway(this.warePY.fields.No);

  console.log()

  this.split.WarehousePutAwayLines.filter(item => {


   if(this.items.length > 0){


    let line = this.items.find(Item => Item === item.ItemNo);

    if(line === null || line === undefined){

      this.items.push(item.ItemNo);
    }
   }else{

    this.items.push(item.ItemNo);

   }
  
  
  });


  let tempory:any[] = [];

  for (const key in this.items) {


    this.split.WarehousePutAwayLines.filter(Item => {

      if(Item.ItemNo ===  this.items[key]){

        tempory.push(Item);

      }
    });


    this.groupItems[this.items[key]] = tempory;

    tempory = [];
    
  }


  console.log('split put away =>',this.groupItems);

  console.log('put away =>',this.warePW);


  console.log('put away line =>',this.listPwL);


    for (const key in this.groupItems) {


    this.groupItems[key].filter(lp => {


        lp.BinCode = this.groupItems[key][0].BinCode;

    });
  }

    for (const key in this.groupItems) {


    this.groupItems[key].filter(Lp => {

   this.split.WarehousePutAwayLines.filter(lp => {


      if(lp.LP === Lp.LP){

        lp = Lp;
      }

    })
     
    });
 
  }

let list:any[] = [];


  this.listT.filter(Lp =>  {


    this.split.WarehousePutAwayLines.filter(lp => {


      if(Lp.fields.PLULPDocumentNo === lp.LP){


        lp.BinCode = Lp.fields.place;
      }

    })
  });

  console.log(this.split);

  this.split.WarehousePutAwayLines.filter(lp => {

    request.ActivityType = 1;
    request.BinCode = lp.BinCode;
    request.ItemNo = lp.ItemNo;
    request.LP = lp.LP;
    request.LineNo = lp.LineNo;
    request.LocationCode = lp.LocationCode;
    request.No = lp.No;
    request.Quantity = lp.Quantity;
    request.ZoneCode = lp.ZoneCode;

    list.push(request);

    request = {

      ActivityType: 1,
      No: "",
      ItemNo: "",
      LineNo: "",
      ZoneCode: "",
      LocationCode: "",
      BinCode: "",
      Quantity: 0,
      LP: ""
    }


  });



  let update = await this.wmsService.Update_Wsheput_Lines_V1(list);

  console.log(update);

if(!update.Error && !update.error){


let postAway = await this.wmsService.Post_WarehousePutAways(this.warePY.fields.No);


  
if(!postAway.Error){

this.intServ.loadingFunc(false);

this.intServ.alertFunc(this.js.getAlert('success', '',`The Put away ${this.warePY.fields.No} has been posted and generated a ${postAway.Registered_Whse_Activity}`, () => {

  
this.router.navigate(['page/wms/wmsMain']);
}));

}else{

this.intServ.loadingFunc(false);

this.intServ.alertFunc(this.js.getAlert('error', '',(postAway.Error === undefined) ? postAway.error.message: postAway.Error.Message ))


}

}else{
this.intServ.loadingFunc(false);

this.intServ.alertFunc(this.js.getAlert('error', '','An error occurred while serializing the json in Business Central'))

}

}));
}

async init(){

  let  listPallet;
    
    const lps = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, false);


    const pallets = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, true);


    console.log('ls =>', lps);
    console.log('pallet =>', pallets);

   

    if(!pallets.Error){

     const  listLp = await this.wmsService.ListLP(lps);

      this.pallet = await this.wmsService.ListLPallet(pallets);

      this.pallet2 = await this.wmsService.ListLPallet(pallets);
    
       for (const i in this.pallet) {
   
         for (const j in this.pallet2) {
   
   
           if (this.pallet[i] != undefined) {
   
             if (this.pallet[i].fields[0].PLUQuantity != null) {
   
               if (this.pallet[i].fields[0].PLULPDocumentNo === this.pallet2[j].fields[0].PLULPDocumentNo) {
   
                 if (j != i) {
   
   
   
                   let con = this.pallet.splice(Number(j), 1);
                   console.log(i, j);
                   console.log(con)
   
                 }
   
   
               }
             } else {
   
               this.pallet.splice(Number(i), 1);
   
             }
           }
         }
       }
   
     
       for (const i in this.pallet) {
   
         for (const j in this.pallet2) {
           if (this.pallet[i].fields[0].PLULPDocumentNo === this.pallet2[j].fields[0].PLULPDocumentNo) {
   
               let line = this.pallet[i].fields.find(lp => lp.PLUNo === this.pallet2[j].fields[0].PLUNo);
   
             if (line === null || line === undefined) {
   
               this.pallet[i].fields.push(this.pallet2[j].fields[0]);
   
               }
   
           }
         }
       
       }
   
    for (const i in this.pallet) {
     for (const j in this.pallet[i].fields) {
   
       let  line = listLp.find(lp => lp.fields.PLULPDocumentNo === this.pallet[i].fields[j].PLUNo);
      
       this.pallet[i].fields[j].PLUWhseLineNo  = (line != null || line != undefined)? line.fields.PLUWhseLineNo:  this.pallet[i].fields[j].PLUWhseLineNo;
   
    
     }
   
    }
   
  const  listPalletH  = await this.wmsService.ListPallets(pallets);
   
     for (const key in this.pallet) {
   
     this.pallet[key].fields.filter(lp => {
   
       let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.PLULPDocumentNo);
         lp.PLUBinCode = line.fields.PLUBinCode;
       lp.PLUItemNo = line.fields.PLUItemNo;
   
     })
   }
   
   
      listPallet = await this.wmsService.ListLP(pallets);
   

      listPallet.filter((lp,index) => {

        let  line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);   

        lp.fields.PLUBinCode = line.fields.PLUBinCode;
        lp.fields.PLUItemNo = line.fields.PLUItemNo;


        let find = this.initV.find(lpI => lpI.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);
      
        if(find === null || find === undefined){
  
          this.initV.push(lp);
          this.QtyTotal ++;
  
        }
  
      
    });

    }

    if(!lps.Error){


      let  listLp = await this.wmsService.ListLP(lps);

      let listLpH = await this.wmsService.ListLPH(lps);

     

        listLp.filter(lp => {
  
        let find2:any = undefined;
        for (const key in this.pallet) {

          find2 = this.pallet[key].fields.find(lpI => lpI.PLUNo === lp.fields.PLULPDocumentNo);
        }

        console.log(lp,this.pallet);


       if(find2 === undefined || find2 === null){

        let line = listLpH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

        lp.fields.PLUBinCode = line.fields.PLUBinCode;
        lp.fields.PLUItemNo = line.fields.PLUItemNo;

        this.listPwL.filter(
          x => {
           switch(x.fields.ActionType){
              case "Place":
                if(lp.fields.PLUNo === x.fields.ItemNo){
                  lp.fields.place = x.fields.BinCode;
                  this.initV.push(lp);
                  this.QtyTotal ++;
                  break;
                } 
            }
          }
        )
       }
   
      });

      let bin = await this.wmsService.GetPossiblesBinFromPutAway(this.initV[0].fields.PLULPDocumentNo);
    
      this.bins = bin.Bins;

     console.log(this.initV);

    }else{


      this.intServ.loadingFunc(false);
       this.intServ.alertFunc(this.js.getAlert('alert', '', 'The Whse. Put Away this void', () => {

        this.router.navigate(['page/wms/wmsMain']);
      }))

    }

  
this.intServ.loadingFunc(false);

}


 async  onScanAll(){

  this.intServ.loadingFunc(true);
       this.initV.filter(lp => {
        let find = this.listsFilter.find(lpE => lpE.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);
      
        let find2 = this.lps.find(lpF => lpF.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

        if((find === null || find === undefined) && (find2 === null || find2 === undefined)){
        
                    this.QtyTake ++;
                    this.listsFilter.push(lp);
                    this.listT.push(lp);          
  
        }

      });
    this.intServ.loadingFunc(false);

}


async show(lp:any){


 

    switch(lp.fields.PLULPDocumentType){

      case "Pallet":

         this.intServ.loadingFunc(true);
         let pallet = this.pallet.find(pallet => pallet.fields[0].PLULPDocumentNo === lp.fields.PLULPDocumentNo);
         let lps:any[] = [];
         pallet.fields.filter(async (lp, index) => {

          let res = await this.wmsService.getLpNo(lp.PLUNo);
    
          let p = await this.wmsService.ListLp(res);
    
          let pH = await this.wmsService.ListLpH(res);
    
          let resI = await this.wmsService.GetItem(p.fields.PLUNo);
    
          let img = await this.wmsService.listItem(resI);
    
          p.fields['image'] = `data:image/jpeg;base64,${img.fields.Picture}`;
          p.fields.PLUBinCode =  pH.fields.PLUBinCode;
          p.fields.PLULocationCode = pH.fields.PLULocationCode;
    
          this.listPwL.filter(
           x => {
            switch(x.fields.ActionType){
               case "Place":
                 if(p.fields.PLUNo === x.fields.ItemNo){
                   p.fields.place = x.fields.BinCode;
                   break;
                 } 
             }
           }
         )
          lps.push(p);
          
        });
        this.intServ.loadingFunc(false);
         const modal = await this.modalCtrl.create({
          component: ModalShowLpsComponent,
          componentProps: {lps, listPwL: this.listPwL, No: pallet.fields[0].PLULPDocumentNo}
        });
        modal.present();
    
        const { data, role } = await modal.onWillDismiss();
         
    }


}

  remove(item:any){


    this.listsFilter.filter((lp, index) => {


    if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){

        this.QtyTake -= 1;
        this.listsFilter.splice(index,1);
        this.listT.splice(index,1);
      }
    });
   

    if(this.listsFilter.length === 0) {

      this.storage.remove(this.whsePutAway.fields.No);

    }else{

      this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
    }

 
  }


  onRemoveAll(){


    this.listsFilter = [];
    this.list = [];
    this.listT = [];
    this.QtyTake = 0;
    this.storage.remove(this.whsePutAway.fields.No);
   // this.storage.remove(`bins ${this.whsePutAway.fields.No}`);

  }


  onBarCodeConfirm(){

  if(this.listsFilter.length > 0){
    this.barcodeScanner.scan().then(
      async  (barCodeData) => {

        let code = barCodeData.text;
    
        this.intServ.loadingFunc(true);
      this.listsFilter.map(lp => {

        if(lp.fields.place.toUpperCase() === code.toUpperCase()) this.lps.push(lp);

      });

      console.log(this.lps);

      if(this.lps.length > 0){

        this.listsFilter.map((lp,index) => {

          for (const key in this.lps) {
            if (lp.fields.PLULPDocumentNo === this.lps[key].fields.PLULPDocumentNo) {
               this.listsFilter.splice(index);             
            }
          }

        });
        this.intServ.loadingFunc(false);
       this.intServ.alertFunc(this.js.getAlert('success', ' ', `The bin ${code.toUpperCase()} has been successfully confirmed. `));
       this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);
       this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
       this.listT = await this.storage.get(this.whsePutAway.fields.No);


      }else{
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', ' ', `The bin ${code.toUpperCase()} is not in the list`));
      }
          
    
      
      
        }
      ).catch(
        err => {
          console.log(err);
        }
      )
     

    }else{

      this.intServ.alertFunc(this.js.getAlert('alert', '', 'Please scan LP'));
    }

  

  }


onChangeBinOne(item:any,bin:any){

switch(item.fields.PLULPDocumentType){

case 'Single': 


console.log('single.....');

  if(this.pallet != undefined){

    for (const key in this.pallet) {
      let line = this.pallet[key].fields.find(lp =>  lp.PLUNo === item.fields.PLULPDocumentNo);

      if(line != undefined || line != null){

       this.intServ.alertFunc(this.js.getAlert('error', '', `To change the bin must be done on the pallet ${this.pallet[key].fields[0].PLULPDocumentNo} `))
      
       return;

      }

    }

      this.listsFilter.filter(lp =>{

             if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){
    
          lp.fields.place = bin.toUpperCase();
    
        }});

      
    }else{

      this.listsFilter.filter(lp =>{

              if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){
    
          lp.fields.place = bin.toUpperCase();
    
              }
        });
    }
  
    this.listT = this.listsFilter;

    this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
 
    break;


    
case 'Pallet': 



for (const key in this.pallet) {
 
      let line = this.pallet[key].fields.find(lp =>  lp.PLULPDocumentNo === item.fields.PLULPDocumentNo);

  if(line != undefined || line != null){


  let tempory:any[] = [];

  let indice:any;

  this.pallet[key].fields.filter(async(Lp) => {

    let line = this.pallet[key].fields.find(lp => lp.PLUWhseLineNo != Lp.PLUWhseLineNo); 

    if(line === null || line === undefined){

      Lp.PLUBinCode =  bin.toUpperCase();
      this.listsFilter.filter(lp => {

        if(lp.fields.PLULPDocumentNo === Lp.PLUNo){

          lp.fields.place = bin.toUpperCase();
        }
      });

      
      let res = await this.wmsService.getLpNo(Lp.PLUNo);

      let lpL = await this.wmsService.ListLp(res);

      lpL.fields.place = bin.toUpperCase();

    //  this.modify.push(lpL); 
  
    }

 });

 // console.log(this.modify);
  
  } 
}
    

  }
   
}

async onModalConfirm(){

 let  lps = this.lps;
 this.lps.map(lp => {

  let find = this.listBins.find(bin => bin ===  lp.fields.place);

  if(find === null || find === undefined){

    this.listBins.push(lp.fields.place);
  }
 });

 this.storage.set(`bins ${this.whsePutAway.fields.No}`, this.listBins);
 
 let bins =  this.listBins;

 let whsePutAway = this.whsePutAway;
  const modal = await this.modalCtrl.create({
    component: ModalLpsConfirmComponent,
    componentProps: {lps,bins,whsePutAway}
  });
  modal.present();

  const { data} = await modal.onWillDismiss();

 this.lps  =  data.data; 
 this.listBin = data.bin;

}

  
  autoComplet(){
  
    this.barcodeScanner.scan().then(
       async  (barCodeData) => {

       
          let code = barCodeData.text;
     
           this.binCode = code;
 
 
           this.onFilter('', this.binCode);
           
     
       
         }
       ).catch(
         err => {
           console.log(err);
         }
       )
      
      }


  onFilter(e, binCode:any = ''){

   switch(binCode){
    case '':
        let val = e.target.value;

        console.log(val);
    
        if (val === '') {
          this.listsFilter = this.listT;
        } else {
          this.listsFilter = this.listT.filter(
            x => {
              return (x.fields.place.toLowerCase().includes(val.toLowerCase()));
            }
          )
        }
        break;
    
     default:
    
    
        this.listsFilter = this.listT.filter(
          x => {
            return (x.fields.place.toLowerCase().includes(binCode.toLowerCase()));
          }
        )
        console.log(this.listsFilter,binCode);

     break;
      }
    
  }
    
}
