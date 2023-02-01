import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverChildrensPalletComponent } from '../popover-childrens-pallet/popover-childrens-pallet.component';
import { PopoverCountingComponent } from '../popover-counting/popover-counting.component';
import { PopoverListLpComponent } from '../popover-list-lp/popover-list-lp.component';
import { PopoverListPalletComponent } from '../popover-list-pallet/popover-list-pallet.component';

@Component({
  selector: 'app-pague-inquiries',
  templateUrl: './pague-inquiries.component.html',
  styleUrls: ['./pague-inquiries.component.scss'],
})
export class PagueInquiriesComponent implements OnInit {

  public quantity = 0;
  public bin:any = '';
  public obj:any[] = [];
  public listBin:any;
  public viewBin = false;
  constructor(private barcodeScanner: BarcodeScanner,private intServ: InterceptService
    , private js: JsonService,private wmsService: WmsService, public popoverController: PopoverController) { }

  ngOnInit() {}


  async onBarCode(){

    this.barcodeScanner.scan().then(
     async barCodeData => {
        let code = barCodeData.text;
        switch(this.bin === ''){

          case true:
            this.obj = [];
          this.intServ.loadingFunc(true);
          try {
            let res = await this.wmsService.GetBinContent_LP(code.toUpperCase(),'WMS');

            if(res.Error) throw new Error(res.Error.Message);
            

            console.log(res);
          
            if(!res.Error){
              this.bin = code.toUpperCase();
              console.log(res);
              res.map(async x => {    
                console.log(x);
                let res = await this.wmsService.getLpNo(x.LPHeader);
                let obj = await this.wmsService.listSetup(res.LicensePlates.LicensePlatesHeaders);
                
                if(obj.PLULPDocumentType ===  'Single'){
                  let qty = 0;
                  obj['seriales'] = x.Lines;
                  x.Lines.map(x => qty+=x.Quantity);
                  obj['Quantity'] = qty; 
                  this.obj.push(obj);          
                 this.quantity+= qty;
               //  console.log(obj);
                }else
                if (obj.PLULPDocumentType === 'Pallet'){
  
               let childrens = [];
  
                 // console.log('x =>',x);
                 x.Lines.filter(async lp => {
                    console.log(lp);
                    let res2 = await this.wmsService.getLpNo(lp.No);
                    if(!res2.Error){
                      console.log('pallet hijo =>',res2);
                      let line = await this.wmsService.listSetup(res2.LicensePlates.LicensePlatesHeaders);
                      line['seriales'] = lp.Childs;
                      let qty = 0; 
                      lp.Childs.map(i => qty+= i.Quantity);
                      line['Quantity'] = qty;
                      childrens.push(line);
                      console.log(childrens);
                      this.quantity+= qty;
                      obj['childrens'] = childrens;
                      obj['Quantity'] = childrens.length;
                      
                    }else{
  
                      this.quantity+= lp.Quantity;
                      childrens.push(lp);
                      obj['childrens'] = childrens;
                      obj['Quantity'] = childrens.length;
                    }
                    
                 });
         
                this.obj.push(obj);
                }                           
              
              });
  
              console.log(this.obj);
         
              this.viewBin = true;
              this.intServ.loadingFunc(false);
            }else{

              
             // this.intServ.loadingFunc(false);
              //this.intServ.alertFunc(this.js.getAlert('error','', `The bin ${code.toUpperCase()}  does not exist`));
            }
            
          } catch (error) {

            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error','',error.message));
            
          }
        
         
          break;

          case false:

         let line = this.obj.find(x => x.PLULPDocumentNo === code.toUpperCase() || x.PLUItemNo === code.toUpperCase());
         if(line != undefined)this.PopoverCounting(line);
            break;

            

        }
      
       
        
      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }

  async PopoverCounting(obj:any){

    switch(obj.PLULPDocumentType){
      case 'Single':
        const popover = await this.popoverController.create({
          component: PopoverListLpComponent,
          cssClass: 'popoverCountingComponent',
          componentProps: {lp:obj},
          backdropDismiss: false
          
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();

      switch(data.action){

        case 'BintoBin':
  
    this.barcodeScanner.scan().then(
      async barCodeData => {
         let code = barCodeData.text;
         this.intServ.loadingFunc(true);
       
         try {
 
           let bins = await this.wmsService.GetBinByLocation(data.lp.PLULocationCode);
           this.listBin = bins;
 
           let line =   this.listBin.Bins.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase());
 
           if(line != undefined){
 
             let res = await this.wmsService.MoveBinToBin_LP(data.lp.PLULPDocumentNo,data.lp.PLUZoneCode,data.lp.PLUBinCode,line.BinCode,
              data.lp.PLULocationCode,data.lp.PLUItemNo,data.lp.Quantity,data.lp.PLUUnitofMeasure);
 
             if(res.Error) throw new Error(res.Error.Message);
 
             this.intServ.loadingFunc(false);
             this.intServ.alertFunc(this.js.getAlert('success','',`License plate ${data.lp.PLULPDocumentNo} moved from bin ${data.lp.PLUZoneCode} 
             to ${line.BinCode}`));         
 
           }else{
            // this.intServ.alertFunc(this.js.getAlert('error','',''))
 
           }
  
           console.log( this.listBin);
           
           
         } catch (error) {
 
           this.intServ.loadingFunc(false);
 
           this.intServ.alertFunc(this.js.getAlert('error','',error.message));
           
         }
       
       }
     ).catch(
       err => {
         console.log(err);
       }
     )

            break;
        }
    
        break;
  
      case 'Pallet':
  
      const popover1 = await this.popoverController.create({
        component: PopoverListPalletComponent,
        cssClass: 'popoverListPalletComponent',
        backdropDismiss:false,
        componentProps: { pallet:obj},
      });
      await popover1.present();
      console.log(popover1);
      this.action(popover1);

        break;
    }
   

    }

 async action(obj){

    const { data } = await obj.onDidDismiss();
    
    switch(data.action){

      case 'BintoBin':

  this.barcodeScanner.scan().then(
    async barCodeData => {
       let code = barCodeData.text;
       this.intServ.loadingFunc(true);
     
       try {

         let bins = await this.wmsService.GetBinByLocation(data.lp.PLULocationCode);
         this.listBin = bins;

         let line =   this.listBin.Bins.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase());

         if(line != undefined){

           let res = await this.wmsService.MoveBinToBin_LP(data.lp.PLULPDocumentNo,data.lp.PLUZoneCode,data.lp.PLUBinCode,line.BinCode,
            data.lp.PLULocationCode,data.lp.PLUItemNo,data.lp.Quantity,data.lp.PLUUnitofMeasure);

           if(res.Error) throw new Error(res.Error.Message);

           this.intServ.loadingFunc(false);
           this.intServ.alertFunc(this.js.getAlert('success','',`License plate ${data.lp.PLULPDocumentNo} moved from bin ${data.lp.PLUZoneCode} 
           to ${line.BinCode}`));         

         }else{
          // this.intServ.alertFunc(this.js.getAlert('error','',''))

         }

         console.log( this.listBin);
         
         
       } catch (error) {

         this.intServ.loadingFunc(false);

         this.intServ.alertFunc(this.js.getAlert('error','',error.message));
         
       }
     
     }
   ).catch(
     err => {
       console.log(err);
     }
   )

          break;
      }
  }

}
