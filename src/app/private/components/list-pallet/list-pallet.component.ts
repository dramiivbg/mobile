import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterEvent } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverOptionsComponent } from '../popover-options/popover-options.component';

@Component({
  selector: 'app-list-pallet',
  templateUrl: './list-pallet.component.html',
  styleUrls: ['./list-pallet.component.scss'],
})
export class ListPalletComponent implements OnInit {

  private routExtras: any;

  private listPallet: any;

  public lpsNo: any[] = [];

  public lps: any[] = [];

  private wareReceipts: any;
  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router, private popoverController: PopoverController,private barcodeScanner: BarcodeScanner) {

    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.routExtras = this.router.getCurrentNavigation().extras.state;

      
        
      } else {
        this.router.navigate(['page/wms/wmsReceipt'], { replaceUrl: true });
      }
    });
   }

  async ngOnInit() {



    this.wareReceipts = this.routExtras.wareReceipts; 

    this.listPallet = this.routExtras.pallet;


    console.log('pallet =>',this.listPallet);

    this.intServ.loadingFunc(false);



    this.listPallet.filter(lp => {



      let f  = new  Date(lp.fields[0].SystemCreatedAt);

      let fecha = f.getDate()+'/'+(f.getMonth()+1)+'/'+f.getFullYear();
      
      
    lp.fields[0].SystemCreatedAt = fecha;
   
   
    
   
     
     



    })
    



    this.intServ.loadingFunc(false);



    



  }


  public onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }


  listLpOrItems(item:any){


    console.log(item);


   let listItem: any[] = []

   let listLp: any[] = [];
   let listP: any[] = [];



   console.log('LP =>',item)


   item.fields.filter((lp, index) => {


    if(lp.PLUType == 'LP'){

      listLp.push(item.fields[index]);


    }else if(lp.PLUType == 'Item'){


      listItem.push(item.fields[index]);


    }else{


      listP.push( item.fields[index]);

    }
   })


   let pallet = item;

   let pallets = this.listPallet;

   let wareReceipts = this.wareReceipts;

    let navigationExtras: NavigationExtras = {
      state: {
        listItem, 
        listLp,
        listP,
        pallet,
        wareReceipts,
        pallets,
        new: false
      },
      replaceUrl: true
    };
    this.router.navigate(['page/wms/lists'], navigationExtras);

    


  }


  delete(item:any){


    let line:any = undefined;
    this.intServ.alertFunc(this.js.getAlert('confirm', '', `You are sure to delete the Pallet ${item.fields[0].PLULPDocumentNo} `, async() => {


      this.intServ.loadingFunc(true);

  

      let res = await this.wmsService.DeleteLPPallet_FromWarehouseReceiptLine(item.fields[0].PLULPDocumentNo);

      if(!res.Error){

        this.listPallet.filter((pallet,index) => {


          if(pallet.fields[0].PLULPDocumentNo === item.fields[0].PLULPDocumentNo){



            this.listPallet.splice(index,1);


          }
        })
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `The pallet ${item.fields[0].PLULPDocumentNo} has been removed correctly`));
      
      }else{

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', res.Error.Message));
      }
    }));


  }


 async add(item:any,ev){



    
    const popover = await this.popoverController.create({
      component: PopoverOptionsComponent,
      cssClass: 'popoverOptions',
      event: ev,
      translucent: true,
      componentProps: this.listMenu(item)
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    if (data.action === 'Add Manual' ) {

      this.intServ.loadingFunc(true);
    
      let lps = await this.wmsService.Calcule_Possible_LPChilds_From_WR(item.fields[0].PLULPDocumentNo);
    
      let items = await this.wmsService.Calcule_Possible_ItemChilds_From_WR(item.fields[0].PLULPDocumentNo);
  

      if(lps.Possible_LPChilds != ''){
        this.lpsNo = lps.Possible_LPChilds.split("|");


      
        this.lpsNo.filter(async(no) => {
    
          let lps = await this.wmsService.getLpNo(no);
    
          console.log('lps =>', lps);
          let lp = await this.wmsService.ListLp(lps);
        
  
        
         this.lps.push(lp);
          
        });
      }



      lps = this.lps;


     let wareReceipts = this.wareReceipts;

      console.log('items =>', items);



      let navigationExtras: NavigationExtras = {
        state: {
          lps, 
          items,
          pallet:item,
          wareReceipts,
          
          new: false
        },
        replaceUrl: true
      };
      this.router.navigate(['page/wms/AddLists'], navigationExtras);
  

    
    }else{

    


     
    
    this.intServ.loadingFunc(true);

    
  let listaL: any[] = [];

  let line:any = undefined;



  let boolean:Boolean = false;

  let lps = await this.wmsService.Calcule_Possible_LPChilds_From_WR(item.fields[0].PLULPDocumentNo);
    
  let items = await this.wmsService.Calcule_Possible_ItemChilds_From_WR(item.fields[0].PLULPDocumentNo);


  
  this.lpsNo = lps.Possible_LPChilds.split("|");

  let objL = {

    LP_Pallet_Child_No: ""
  }

  let listLP: any[] = [];

      
  this.lpsNo.filter(async(no) => {

    let lps = await this.wmsService.getLpNo(no);

    let lp = await this.wmsService.ListLp(lps);
  
    listaL.push(lp);
    
  });




  this.barcodeScanner.scan().then(
  async  (barCodeData) => {
      let code = barCodeData.text;


      console.log(item);


     
  for (const key in listaL) {


    if (listaL[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {
      this.intServ.loadingFunc(false); 

      boolean = true;
      line = listaL[key];

      objL.LP_Pallet_Child_No = line.fields.PLULPDocumentNo;

      listLP.push(objL);
    
     
    }
    
  }
  
  


      for (const key in items.Possible_ItemsChilds) {
        if (items.Possible_ItemsChilds[key].ItemNo === code) {


          line = items.Possible_ItemsChilds[key];
          boolean = false;
          this.intServ.loadingFunc(false); 
          
          
        }
      }

     

    

      
  

    if (line === null || line === undefined ) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', `  The license plate '${code}' is not available `));
      this.intServ.loadingFunc(false);
    } else {

      if(boolean){


      
        
        let lp = await  this.wmsService.Assign_LPChild_to_LP_Pallet_From_WR( this.wareReceipts.No,item.fields[0].PLULPDocumentNo,listLP );
      

        if(lp.IsProcessed){

          this.intServ.loadingFunc(false);
          this.intServ.alertFunc(this.js.getAlert('success', '', `  The license place '${code}' has been assigned correctly `));
         }

      }

      else{


        let listsI:any[] = [];
        let listItem =   {
          Item_Child_No: "",
          Qty: "",
          WarehouseReceipt_LineNo: ""
        }

        listItem.Item_Child_No = line.ItemNo;
        listItem.Qty = line.Qty;
        listItem.WarehouseReceipt_LineNo = line.LineNo;

        listsI.push(listItem);

       
       let items = await this.wmsService.Assign_ItemChild_to_LP_Pallet_From_WR(item.fields[0].PLULPDocumentNo,line.No,listsI);

       if(items.IsProcessed){

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `  The  item '${code}' has been assigned correctly `));
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

  }


  
  private listMenu(item: any): any {
    return {
      options: {
        name: `Pallet No. ${item.fields[0].PLULPDocumentNo}`,
        menu: [
          { 
            id: 1, 
            name: 'Add Manual', 
            icon: 'add-circle',
            obj: item
          },
          { 
            id: 2, 
            name: 'Add Scan', 
            icon: 'scan-circle-outline',
            obj: item
          },
          { 
            id: 3, 
            name: 'Close', 
            icon: 'close-circle-outline' ,
            obj: {}
          }
        ]
      }
    };

  }



}
