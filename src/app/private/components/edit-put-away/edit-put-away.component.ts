import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2'
import { Storage } from '@ionic/storage';
import { PassThrough } from 'stream';

@Component({
  selector: 'app-edit-put-away',
  templateUrl: './edit-put-away.component.html',
  styleUrls: ['./edit-put-away.component.scss'],
})
export class EditPutAwayComponent implements OnInit {
  public lpsS: any = {}
  public list: any[] = [] 
  public listT: any[] = [] 

  public initV:any[] = [];
  public modify:any[] = [];

  public modifyP:any[] = [];

  public whsePutAway:any;
  public loading:Boolean = false;

  public select: Boolean = true;
  public listPwL: any[] = [];
  public contador:number = 0;
   public lpsP: any = {}
  public scanLP: boolean = true;
  public scanBin: boolean = false;

  public groupItems:any[] = [];

  public split: any; 

  public pallet:any;

  public pallet2:any;

  public items:any[] = [];

  public bin:string = '';

  public binCode: any = '';
  public listBin:any[] = [];

  public listsFilter: any[] = [];
  public lists: any = [];
  public warePW: any = {};

  public warePY: any;



  constructor(private router: Router
 ,private intServ: InterceptService, private barcodeScanner: BarcodeScanner, private js: JsonService, private wmsService: WmsService, 
 private general: GeneralService , private storage: Storage) { 

  let objFunc = {
    func: () => {
      this.onBack();
    }
  };
  this.intServ.appBackFunc(objFunc);

       
  }

  async  ngOnInit() {

    this.get();

    this.warePW = await this.storage.get('setPutAway');

      this.listPwL = await this.wmsService.ListPutAwayL(this.warePW);
      console.log(this.whsePutAway, this.listPwL);
      this.warePY = await this.wmsService.ListPutAwayH(this.warePW);
    
      this.init();
    this.intServ.loadingFunc(false);

    }

 async get(){

  this.whsePutAway =  await this.storage.get('whsePutAway');

  console.log(this.whsePutAway);
    }


  back(){


         
    this.scanLP = true;
    this.scanBin = false;


    
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
    line =   this.listBin[0].Bins.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase());
    console.log(this.listBin);


    if(line === null || line === undefined){

      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', ' ', `The Bin code ${code.toUpperCase()} does not exist`));
    
  }else{

  if(this.pallet != undefined && this.select != false){
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error', ' ',`Please scan all license plate and pallet`));
    return;
  }

     this.listsFilter.filter( lp => {
      lp.fields.PLUBinCode = code.toUpperCase();

    });

    this.modify = [];

    this.modify = this.listsFilter;

    this.intServ.loadingFunc(false);
    }
    } ).catch(
        err => {
          console.log(err);
        }
      )

  }


  public async  onBarCode() {

    //console.log(this.wareReceipts);

    this.intServ.loadingFunc(true);
  let listPallet;


  let listLp;

  let  listLpH;


    const lps = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, false);
  const pallets = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, true);

    console.log('ls =>', lps);
    console.log('pallet =>', pallets);

    if(!lps.Error){


       listLp = await this.wmsService.ListLP(lps);

       listLpH = await this.wmsService.ListLPH(lps);

        
    listLp.filter(lp => {


      let line = listLpH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

      lp.fields.PLUBinCode = line.fields.PLUBinCode;
      lp.fields.PLUItemNo = line.fields.PLUItemNo;
    });
    }

  
    if(!pallets.Error){

  const  listPalletH  = await this.wmsService.ListPallets(pallets);

  listPallet = await this.wmsService.ListLP(pallets);

     listPallet.filter(lp => {


      let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

      lp.fields.PLUBinCode = line.fields.PLUBinCode;
      lp.fields.PLUItemNo = line.fields.PLUItemNo;
      
    });

    }
   

    console.log('palletsM =>', this.pallet);
   
   // console.log('pallets =>', listPallet);

    console.log('lps =>', listLp);

      let line:any = undefined;
      this.intServ.loadingFunc(false);
    this.barcodeScanner.scan().then(
    async  (barCodeData) => {
        let code = barCodeData.text;

        this.intServ.loadingFunc(true);

 if(!lps.Error){
       
    for (const key in listLp) {
  

      if (listLp[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {
        line = listLp[key];
        this.intServ.loadingFunc(false);  
      
      }

        
      }

    


      if(!pallets.Error){


        for (const key in listPallet) {
  

          if (listPallet[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {
            line = listPallet[key];
            this.intServ.loadingFunc(false);  
          
          }
    
            
          }

      }

  
      if (line === null || line === undefined) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', ' ',`The license plate '${code.toUpperCase()}' does not exist on the Put Away`));
      
      } else {


        console.log('length =>',this.listsFilter.length);
        
        if(this.listsFilter.length > 0){

          let find =   this.listsFilter.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() == code.toUpperCase());
   
          if(find == null || find ==undefined){
            this.listPwL.filter(
              x => {
               switch(x.fields.ActionType){
                  case "Place":
                    if(line.fields.PLUNo === x.fields.ItemNo){
                      line.fields.place = x.fields.BinCode;
                      this.listsFilter.push(line);
                      this.listT.push(line);
                      break;
                    } 
                }
              }
            )
          
           
          }else{
   
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('alert', ' ',`The license plate is already assigned`));
          }
         
           }else{
            this.listsFilter = [];
            this.listPwL.filter(
              x => {
                switch(x.fields.ActionType){
                  case "Place":
                    if(line.fields.PLUNo === x.fields.ItemNo){
                      line.fields.place = x.fields.BinCode;
                      this.listsFilter.push(line);
                      this.listT.push(line);
                      break;
                    } 
                }
              }
            )
          
           this.scanLP  = true;



           }

       
      }

   

    }
    this.intServ.loadingFunc(false);
  
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  

    }


    onChangeBinItem(item:any,bin:any){
     
      console.log(item,bin);


    }

  


 async onSubmit(){

if(this.scanLP){

    this.intServ.loadingFunc(true);
      let bins = await this.wmsService.GetPossiblesBinFromPutAway(this.listsFilter[0].fields.PLULPDocumentNo);

        this.listBin.push(bins);

        console.log(this.listBin);
        this.scanLP = false;
        this.scanBin = true;

        this.intServ.loadingFunc(false);

  
    }else{


      this.intServ.alertFunc(this.js.getAlert('confirm', ' ','Confirm Whse. PutAway?', async() => {
        
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




      if(this.modify.length !== this.initV.length){

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

          })
       
        }

      


          
        for (const key in this.groupItems) {

      
          this.groupItems[key].filter(Lp => {


            
          this.split.WarehousePutAwayLines.filter(lp => {


            if(lp.LP === Lp.LP){


              lp = Lp;
            }

          })
           

          })
       
        }



      let list:any[] = [];


        this.modify.filter(Lp =>  {


          this.split.WarehousePutAwayLines.filter(lp => {


            if(Lp.fields.PLULPDocumentNo === lp.LP){


              lp.BinCode = Lp.fields.PLUBinCode;
            }

          })
        })



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
            
      }else{


       this.intServ.loadingFunc(true);

        let list:any[] = [];
        let listP:any[] = [];

        this.listPwL.filter(lp => {


          if(lp.fields.ActionType === 'Place'){

            list.push(lp);


          }
        });


        console.log(list);


       let request2 = {

          ActivityType: 1,
          No: "",
          ItemNo: "",
          LineNo: "",
          ZoneCode: "",
          LocationCode: "",
          BinCode: "",
          Quantity: 0,
         
       }


    


    if(this.modify[0].fields.PLUBinCode.startsWith('REC')){

      list.filter(lp => {

        request2.ActivityType = 1;
        request2.No = lp.fields.No;
        request2.ItemNo = lp.fields.ItemNo;
        request2.LineNo = lp.fields.LineNo;
        request2.ZoneCode = lp.fields.ZoneCode;
        request2.LocationCode = lp.fields.LocationCode;
        request2.BinCode =   lp.fields.BinCode;
        request2.Quantity = lp.fields.Quantity;
      

        listP.push(request2);

        request2 = {

          ActivityType: 1,
          No: "",
          ItemNo: "",
          LineNo: "",
          ZoneCode: "",
          LocationCode: "",
          BinCode: "",
          Quantity: 0,
        
        }


      });






    }else{

  

      list.filter(lp => {

        request2.ActivityType = 1;
        request2.No = lp.fields.No;
        request2.ItemNo = lp.fields.ItemNo;
        request2.LineNo = lp.fields.LineNo;
        request2.ZoneCode = lp.fields.ZoneCode;
        request2.LocationCode = lp.fields.LocationCode;
        request2.BinCode =  this.modify[0].fields.PLUBinCode;
        request2.Quantity = lp.fields.Quantity;
        

        listP.push(request2);

        request2 = {

          ActivityType: 1,
          No: "",
          ItemNo: "",
          LineNo: "",
          ZoneCode: "",
          LocationCode: "",
          BinCode: "",
          Quantity: 0,
         
        }


      });


      
   
      
    }


    let update = await this.wmsService.Update_Wsheput_Lines_V2(listP);
    
    console.log(update);

if(!update.Error && !update.error){


let postAway = await this.wmsService.Post_WarehousePutAways(this.warePY.fields.No);


console.log('post =>',  postAway);
    
if(!postAway.Error && !postAway.error){

  this.intServ.loadingFunc(false);

  this.intServ.alertFunc(this.js.getAlert('success', '', `The Put away ${this.warePY.fields.No} has been posted and generated a ${postAway.Registered_Whse_Activity}`, () => {

    this.router.navigate(['page/wms/wmsMain']);
  }));

}else{


this.intServ.loadingFunc(false);
this.intServ.alertFunc(this.js.getAlert('error', '', (postAway.Error === undefined) ? postAway.error.message: postAway.Error.Message))

}

}else{

this.intServ.loadingFunc(false);
this.intServ.alertFunc(this.js.getAlert('error', '', 'An error occurred while serializing the json in Business Central'))


}
      } 

      }));

     }

}

async init(){

  let  listPallet;
    
    const lps = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, false);


    const pallets = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, true);


    console.log('ls =>', lps);
    console.log('pallet =>', pallets);

   

    if(!pallets.Error){

     let  listLp = await this.wmsService.ListLP(lps);

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
   
   
   
       console.log('despues =>', this.pallet);
       console.log('despues =>', this.pallet2);
   
   
   
   
   
   
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
  
        }
  
      
    });




    }

    if(!lps.Error){


      const listLp = await this.wmsService.ListLP(lps);

      const listLpH = await this.wmsService.ListLPH(lps)

   

    
      listLp.filter(lp => {
  
        
  
        let line = listLpH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

        lp.fields.PLUBinCode = line.fields.PLUBinCode;
        lp.fields.PLUItemNo = line.fields.PLUItemNo;

       
        this.initV.push(lp);
      
      
    });

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
 let  listPallet;
    
    const lps = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, false);


    const pallets = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, true);
    console.log('ls =>', lps);
   console.log('pallet =>', pallets);

  if(!pallets.Error){

  listPallet = await this.wmsService.ListLP(pallets);
   

   const  listPalletH  = await this.wmsService.ListPallets(pallets);

     listPallet.filter(lp => {


      let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

      lp.fields.PLUBinCode = line.fields.PLUBinCode;
      lp.fields.PLUItemNo = line.fields.PLUItemNo;

      let find = this.listsFilter.find(lpE => lpE.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);
     
      if(find === null || find === undefined){

        this.listsFilter.push(lp);

        this.listT.push(lp);

      }


});

   }

    if(!lps.Error){


      const listLp = await this.wmsService.ListLP(lps);

      const listLpH = await this.wmsService.ListLPH(lps)

       listLp.filter(lp => {
  
  
        let line = listLpH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);
  
        lp.fields.PLUBinCode = line.fields.PLUBinCode;
        lp.fields.PLUItemNo = line.fields.PLUItemNo;

        let find = this.listsFilter.find(lpE => lpE.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);
      
        if(find === null || find === undefined){
          this.listPwL.filter(
            x => {
              switch(x.fields.ActionType){
                case "Place":
                  if(lp.fields.PLUNo === x.fields.ItemNo){

                    lp.fields.place = x.fields.BinCode;
                    this.listsFilter.push(lp);
                    this.listT.push(lp);
                    break;
                  } 
              }
            }
          )
  
        }

      });

    }

    this.intServ.loadingFunc(false);
  
  this.select = false;
}


  remove(item:any){


    this.listsFilter.filter((lp, index) => {


    if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){

        this.listsFilter.splice(index,1);
      }
    });


   this.modify.filter((lp, index) => {


      if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){

        this.modify.splice(index,1);
      }
    });

    if(this.listsFilter.length === 0){

      this.select = true;
    
    }


  }


  onRemoveAll(){


    this.listsFilter = [];
    this.modify = [];
    this.list = [];

    this.select = true;




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
    
          lp.fields.PLUBinCode = bin.toUpperCase();
    
        }});

      
    }else{

      this.listsFilter.filter(lp =>{

              if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){
    
          lp.fields.PLUBinCode = bin.toUpperCase();
    
        }
          
    let LpExist = this.modify.find(lpE => lpE.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

    if((LpExist != null || LpExist != undefined) && LpExist.fields.PLUBinCode != lp.fields.PLUBinCode){

    LpExist.fields.PLUBinCode = lp.fields.PLUBinCode;

       }else if(LpExist === null || LpExist === undefined){

      this.modify.push(lp);

       }
      
      });
    }
  
  
    this.modify.filter(

      (lp,index) => {
        if(lp.fields.PLUBinCode.startsWith('REC')){

          this.modify.splice(index,1);

        } 
      }
    )


   
    console.log('modify =>', this.modify);
   // console.log('pallet =>', this.pallet);

  //  console.log('filter =>',this.listsFilter);
  
  
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

          lp.fields.PLUBinCode = bin.toUpperCase();
        }
      });

      
      let res = await this.wmsService.getLpNo(Lp.PLUNo);

      let lpL = await this.wmsService.ListLp(res);

      lpL.fields.PLUBinCode = bin.toUpperCase();

      this.modify.push(lpL); 
  
    }

 });

  console.log(this.modify);
  
  } 
}
    

  }
   
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


        console.log(binCode);

        if(binCode === ''){
        let val = e.target.value;

        console.log(val);
    
        if (val === '') {
          this.listsFilter = this.listT;
        } else {
          this.listsFilter = this.listT.filter(
            x => {
              return (x.fields.PLUBinCode.toLowerCase().includes(val.toLowerCase()));
            }
          )
        }
    
      }else{
    
    
        this.listsFilter = this.listT.filter(
          x => {
            return (x.fields.PLUBinCode.toLowerCase().includes(binCode.toLowerCase()));
          }
        )
      }
    
  }
    
}
