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

@Component({
  selector: 'app-edit-put-away',
  templateUrl: './edit-put-away.component.html',
  styleUrls: ['./edit-put-away.component.scss'],
})
export class EditPutAwayComponent implements OnInit {
  public lpsS: any = {}
  public list: any[] = [] 
  public listT: any[] = [] 

  public modify:any[] = [];

  public modifyP:any[] = [];

  @Input() whsePutAway:any;


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
 ,private intServ: InterceptService, private barcodeScanner: BarcodeScanner, private js: JsonService, private wmsService: WmsService, private general: GeneralService , private modalController: ModalController) { 


  let objFunc = {
    func: () => {
      this.onBack();
    }
  };
  this.intServ.appBackFunc(objFunc);


        
  }

  exit(){

    this.modalController.dismiss({});
  }


  back(){


         
    this.scanLP = true;
    this.scanBin = false;


    
  }

  async  ngOnInit() {

    this.warePW = this.wmsService.getPutAway();

  

    if(this.warePW.WarehousePutAways){


      this.listPwL = await this.wmsService.ListPutAwayL(this.warePW);
      console.log(this.whsePutAway, this.listPwL);
      this.warePY = await this.wmsService.ListPutAwayH(this.warePW);
    }else{
    this.warePY =  this.warePW;
    }


    
    this.split = await this.wmsService.Prepare_WarehousePutAway(this.warePY.fields.No);


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


   
  }


  public onBack(){


    this.modalController.dismiss({});

 }


  public async onBarCodeChange(){

    let line = undefined;
     
    this.barcodeScanner.scan().then(
      async  (barCodeData) => {
       let code = barCodeData.text;
    
    line =   this.listBin[0].Bins.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase())
  

    console.log(this.listBin);


    if(line === null || line === undefined){

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `The Bin code ${code.toUpperCase()} does not exist`,
        footer: ''
      })

    }else{
     this.listsFilter.filter( lp => {
  

      lp.fields.PLUBinCode = code.toUpperCase();

    })
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




    if(lps.Error){
      this.modalController.dismiss({});

      Swal.fire({
        title: 'The Whse Put Away this void',
        text: 'Please choose another put away',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['page/wms/wmsMain']);
         
        }
      })
      
      return;

    } 

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

   this.pallet = await this.wmsService.ListLPallet(pallets);

   this.pallet2 = await this.wmsService.ListLPallet(pallets);


   listPallet = await this.wmsService.ListLP(pallets);


  

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

   const  listPalletH  = await this.wmsService.ListPallets(pallets);


for (const key in this.pallet) {

  this.pallet[key].fields.filter(lp => {


    let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.PLULPDocumentNo);


    lp.PLUBinCode = line.fields.PLUBinCode;
    lp.PLUItemNo = line.fields.PLUItemNo;

  })
}


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

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `The license plate '${code.toUpperCase()}' does not exist on the Put Away`,
          footer: ''
        })
      
        this.intServ.loadingFunc(false);
      } else {


        console.log('length =>',this.listsFilter.length);
        
        if(this.listsFilter.length > 0){

          let find =   this.listsFilter.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() == code.toUpperCase());
   
          if(find == null || find ==undefined){
   
           this.listsFilter.push(line);
           this.listT.push(line);
          }else{
   

            Swal.fire({
              title: `The license plate is already assigned`,
              text: 'Please choose another license plate',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
               
               
              }
            })
   
         
   
          }
         
           }else{

            this.listsFilter = [];

            

            this.listsFilter.push(line);
            this.listT.push(line);


            this.scanLP  = true;



           }

       
      }

    }
  
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

  

async onAdd(e) {

  this.intServ.loadingFunc(true);
    let val = e.target.value;

    
    let listPallet;

    let  listLp; 


    const lps = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, false);


    const pallets = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, true);


    console.log('ls =>', lps);
    console.log('pallet =>', pallets);

   

    if(!pallets.Error){

  
      this.pallet = await this.wmsService.ListLPallet(pallets);

      this.pallet2 = await this.wmsService.ListLPallet(pallets);
   
   
      listPallet = await this.wmsService.ListLP(pallets);
   
   
     
   
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


   const  listPalletH  = await this.wmsService.ListPallets(pallets);

     listPallet.filter(lp => {


      let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

      lp.fields.PLUBinCode = line.fields.PLUBinCode;
      lp.fields.PLUItemNo = line.fields.PLUItemNo;
      
    });


    for (const key in this.pallet) {

      this.pallet[key].fields.filter(lp => {
    
    
        let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.PLULPDocumentNo);
    
    
        lp.PLUBinCode = line.fields.PLUBinCode;
        lp.PLUItemNo = line.fields.PLUItemNo;
    
      })
    }

    }


    if(!lps.Error){

      const listLpH = await this.wmsService.ListLPH(lps)

     listLp = await this.wmsService.ListLP(lps);

    
      listLp.filter(lp => {
  
  
        let line = listLpH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);
  
        lp.fields.PLUBinCode = line.fields.PLUBinCode;
        lp.fields.PLUItemNo = line.fields.PLUItemNo;
      });


      console.log('lps =>', listLp);

    }else{


      this.modalController.dismiss({});

      Swal.fire({
        title: 'The Whse Put Away this void',
        text: 'Please choose another put away',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['page/wms/wmsMain']);
         
        }
      })
      
      return;

    }
  


      
  

    console.log('pallets =>', this.pallet);
   
   // console.log('pallets =>', listPallet);

  
 

   
switch(this.scanLP){


  
  
   case true:

   let line:any =  undefined;

   
 

     if (val !== '') {



    

      let line:any = undefined;


  
 if(!lps.Error){
       
    for (const key in listLp) {
  

      if (listLp[key].fields.PLULPDocumentNo.toUpperCase() === val.toUpperCase()) {
        line = listLp[key];
        this.intServ.loadingFunc(false);  
      
      }

        
      }

      if(!pallets.Error){
        for (const key in listPallet) {
  

          if (listPallet[key].fields.PLULPDocumentNo.toUpperCase() === val.toUpperCase()) {
            line = listPallet[key];
            this.intServ.loadingFunc(false);  
          
          }
    
            
          }

      }

    



    

      if (line === null || line === undefined) {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `The license plate '${val.toUpperCase()}' does not exist on the Put Away`,
          footer: ''
        })
  
        this.intServ.loadingFunc(false);
      } else {

        
        if(this.listsFilter.length > 0){

          let find =   this.listsFilter.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() == val.toUpperCase());
   
          if(find == null || find ==undefined){
   
           this.listsFilter.push(line);
           this.listT.push(line);
          }else{
   

            Swal.fire({
              title: `The license plate is already assigned`,
              text: 'Please choose another license plate',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
               
               
              }
            })
            
   
   
          }
         
           }else{

            this.listsFilter = []

            

            this.listsFilter.push(line);
            this.listT.push(line);


            this.scanLP  = true;



           }

       
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



        
        let bins = await this.wmsService.GetPossiblesBinFromPutAway(this.listsFilter[0].fields.PLULPDocumentNo);

        this.listBin.push(bins);

        console.log(this.listBin);

    



    }else{


      console.log(this.listsFilter);

      Swal.fire({
        title: 'Confirm WH PutAway?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, post it!'
      }).then(async(result) => {
        if (result.isConfirmed) {


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


      //    console.log(this.split);



          this.modify.filter(

            (lp,index) => {
              if(lp.fields.PLUBinCode.startsWith('REC')){

                this.modify.splice(index,1);

              } 
            }
          )


          
        //  console.log(this.modify);

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



          let update = await this.wmsService.Update_WarehousePutAway_Lines(list);
        
          console.log(update);

   if(!update.Error){


    let postAway = await this.wmsService.Post_WarehousePutAways(this.warePY.fields.No);


          
    if(!postAway.Error){


     
        this.modalController.dismiss({});

      

        this.router.navigate(['page/wms/wmsMain']);
     

        Swal.fire(
          'Success!',
          `The Put away ${this.warePY.fields.No} has been posted`,
          'success'
        )
      
    }else{

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `The Put away ${this.warePY.fields.No} has been posted`,
        footer: ''
      })
    }
    
   }else{

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: update.Error.Message,
      footer: ''
    })
   }
        

       

      
    }

  
        
      })

     



    
    
      

    }

    

    
  }



 async  onScanAll(){


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

      if(find == null || find === undefined){

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

        if(find == null || find === undefined){
  
          this.listsFilter.push(lp);
          this.listT.push(lp);
        }
      });

    }else{


      
      this.modalController.dismiss({});

      Swal.fire({
        title: 'The Whse Put Away this void',
        text: 'Please choose another put away',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['page/wms/wmsMain']);
         
        }
      })
      
      return;
    }
  




    this.select = false;



  }


  remove(item:any){


    this.listsFilter.filter((lp, index) => {


      if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo){

        this.listsFilter.splice(index,1);
      }
    })


  }


  onRemoveAll(){


    this.listsFilter = [];

    this.select = true;




  }





  onChangeBinOne(item:any,bin:any){


    let type: any[] = [];

   type = item.recordId.split(',')
  
switch(type[1]){

case 'Single': 


console.log('single.....');

  if(this.pallet != undefined){

    for (const key in this.pallet) {
      let line = this.pallet[key].fields.find(lp =>  lp.PLUNo === item.fields.PLULPDocumentNo);

      if(line != undefined || line != null){


        Swal.fire({
          icon: 'error',
          title: 'Unable to change bin',
          text: `To change the bin must be done on the pallet ${this.pallet[key].fields[0].PLULPDocumentNo} `,
          footer: ''
        });

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
  
  


    console.log('modify =>', this.modify);
   // console.log('pallet =>', this.pallet);

  //  console.log('filter =>',this.listsFilter);
  
  
    break;


    
case 'Pallet': 



    for (const key in this.pallet) {
      let line = this.pallet[key].fields.find(lp =>  lp.PLULPDocumentNo=== item.fields.PLULPDocumentNo);

      if(line != undefined || line != null){


   this.listsFilter.filter(lp =>{


    if( lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo)

      lp.fields.PLUBinCode = bin.toUpperCase();

   });


  let tempory:any[] = [];

  let indice:any;

  this.pallet[key].fields.filter(Lp => {

    Lp.PLUBinCode =  bin.toUpperCase();

   tempory.push(Lp);

   this.listsFilter.filter(lp => {

    if(Lp.PLUNo === lp.fields.PLULPDocumentNo){

      lp.fields.PLUBinCode = bin.toUpperCase();

    }
   })

  
  });


  this.modifyP[this.pallet[key].fields[0].PLULPDocumentNo] = tempory;

  console.log(this.modifyP);

  tempory = [];

  
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
