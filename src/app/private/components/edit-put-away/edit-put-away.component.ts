import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2'
import { Storage } from '@ionic/storage';
import { PassThrough, Stream } from 'stream';
import { CssSelector } from '@angular/compiler';
import { ModalShowLpsComponent } from '../modal-show-lps/modal-show-lps.component';
import { empty, UnsubscriptionError, zip } from 'rxjs';
import { ModalLpsConfirmComponent } from '../modal-lps-confirm/modal-lps-confirm.component';
import { PopoverSplitItemComponent } from '../popover-split-item/popover-split-item.component';
import { lutimes, truncateSync } from 'fs';
import { utf8Encode } from '@angular/compiler/src/util';
import { time, timeEnd } from 'console';
import { EROFS } from 'constants';
import { PopoverSerialesLpComponent } from '../popover-seriales-lp/popover-seriales-lp.component';

import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-edit-put-away',
  templateUrl: './edit-put-away.component.html',
  styleUrls: ['./edit-put-away.component.scss'],
})
export class EditPutAwayComponent implements OnInit {
  public lpsS: any = {}
  public list: any[] = []
  public listT: any[] = []

  public active = false;
  public lps: any[] = [];
  public boolean: boolean = true;

  public bins: any[] = [];
  public initV: any[] = [];

  public take: any;

  public QtyI: number = 0;
  public whsePutAway: any;

 
  public binDefault: any;
  public listPwL: any[] = [];
  public contador: number = 0;
  public lpsP: any = {}
  public scanLP: boolean = true;
  public scanBin: boolean = false;

  public confirm: boolean;
  public itemsG: any[];
  public groupItems: any[] = [];

  public binItem: any[] = [];
  public contadorT: number = 0;
  public split: any;

  public listBins: any[] = [];
  public pallet: any;

  public pallet2: any;

  public itemsL: any[] = [];

  public items: any[] = [];

  public listI: any[] = [];
  public bin: string = '';

  public binCode: any = '';
  public listBin: any[] = [];

  public listsFilter: any[] = [];
  public lists: any = [];
  public warePW: any = {};

  public initItem: any[] = [];

  public listItems: any[] = [];
  public listItemsT: any[] = [];
  public barcodeScannerOptions: BarcodeScannerOptions
  public warePY: any;

  public QtyTake: number = 0;

  public QtyTotal: number = 0;

  public obj = {

    ActivityType: 1,
    No: "",
    ItemNo: "",
    LineNo: "",
    ZoneCode: "STO",
    LocationCode: "",
    BinCode: " ",
    Quantity: 0

  }


  public listPut: any[] = [];
  constructor(private router: Router
    , private intServ: InterceptService, private barcodeScanner: BarcodeScanner, private js: JsonService, private wmsService: WmsService,
    private general: GeneralService, private storage: Storage, private modalCtrl: ModalController, public popoverController: PopoverController) {


  }

  async ngOnInit() {

    this.intServ.loadingFunc(true);
    this.whsePutAway = await this.storage.get('whsePutAway');
 
    this.warePW = await this.storage.get('setPutAway');

   // this.storage.remove(`init ${this.whsePutAway.fields.No}`);

    this.listPwL = this.warePW.WarehousePutAways.WarehousePutAwayLines;

    this.listPut = this.warePW.WarehousePutAways.WarehousePutAwayLines;
    console.log(this.whsePutAway, this.listPwL);


    this.listI = (await this.storage.get(`listI ${this.whsePutAway.fields.No}`) != undefined &&
      await this.storage.get(`listI ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`listI ${this.whsePutAway.fields.No}`) : []
    this.itemsL = (await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) != undefined &&
      await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) : [];

    this.listItems = (await this.storage.get(`items ${this.whsePutAway.fields.No}`) != undefined &&
      await this.storage.get(`items ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`items ${this.whsePutAway.fields.No}`) : [];

      this.listItemsT = (await this.storage.get(`items ${this.whsePutAway.fields.No}`) != undefined &&
      await this.storage.get(`items ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`items ${this.whsePutAway.fields.No}`) : [];


    this.initItem = (await this.storage.get(`init item ${this.whsePutAway.fields.No}`) != undefined &&
      await this.storage.get(`init item ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`init item ${this.whsePutAway.fields.No}`) : [];

    this.initV = (await this.storage.get(`init ${this.whsePutAway.fields.No}`) != undefined
      && await this.storage.get(`init ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`init ${this.whsePutAway.fields.No}`) : [];

   console.log('init =>',this.initV);

   if(this.initV.length === 0){this.init()};
    
    if (this.initV.length > 0) {
      this.QtyTotal = this.initV.length;
    }
    this.listsFilter = (await this.storage.get(this.whsePutAway.fields.No) != undefined && await this.storage.get(this.whsePutAway.fields.No) != null) ? await this.storage.get(this.whsePutAway.fields.No) : [];
    console.log(await this.storage.get(this.whsePutAway.fields.No));
    this.listT = (await this.storage.get(this.whsePutAway.fields.No) != undefined && await this.storage.get(this.whsePutAway.fields.No) != null) ? await this.storage.get(this.whsePutAway.fields.No) : [];
    this.lps = (await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) != undefined &&
      await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) : [];

    this.listBins = (await this.storage.get(`bins ${this.whsePutAway.fields.No}`) != undefined &&
      await this.storage.get(`bins ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`bins ${this.whsePutAway.fields.No}`) : [];

    console.log(this.lps);

    if (this.listsFilter.length > 0) this.QtyTake = this.lps.length + this.listsFilter.length;

    this.bins = (await this.storage.get(`bin ${this.whsePutAway.fields.No}`) != undefined && await this.storage.get(`bin ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`bin ${this.whsePutAway.fields.No}`) : [];

   this.active = (this.listItems.length > 0 && this.listsFilter.length === 0) || (this.listItems.length === 0 && this.listsFilter.length > 0)?true:false;
  
   this.intServ.loadingFunc(false);
  }

  
  public onBack() {


    this.router.navigate(['page/wms/wmsMain']);

  }

  public async onBarCodeChange() {

    let line = undefined;


    this.barcodeScanner.scan().then(
      async (barCodeData) => {
        let code = barCodeData.text;

        this.intServ.loadingFunc(true);
        line = this.bins.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase());


        if (line === null || line === undefined) {

          this.intServ.loadingFunc(false);
          this.intServ.alertFunc(this.js.getAlert('error', ' ', `The Bin code ${code.toUpperCase()} does not exist`));

        } else {

      
          this.listsFilter.filter(lp => {
            if(lp.fields.PLULPDocumentType != 'Pallet'){
              lp.fields.place = code.toUpperCase();
              lp.seriales.map(x => x.fields.place = code.toUpperCase());
            }
           
          });


          this.listT = this.listsFilter;
          this.storage.set(this.whsePutAway.fields.No, this.listsFilter);


          this.intServ.loadingFunc(false);
        }
      }).catch(
        err => {
          console.log(err);
        }
      )

  }


  order(){

    let ascendent = [];
    let descendent = [];
  
        for (let index = (this.listsFilter.length > 0)? this.listsFilter.length - 1: this.listItems.length - 1; index >= 0; index--) {
       
          
          if(this.listItems.length > 0){
            ascendent.push(this.listItems[index]);

          }else{
            ascendent.push(this.listsFilter[index]);
          }
          
        }

        if(this.listItems.length > 0){
          this.listItems = ascendent;

        }else{
          this.listsFilter = ascendent;
        }
 

  }


  public async onBarCode() {
    this.initItem = (this.initItem.length === 0) ? await this.storage.get(`init item ${this.whsePutAway.fields.No}`) : this.initItem;
    let line: any = undefined;
    let lineI: any = undefined
    this.barcodeScanner.scan().then(
      async (barCodeData) => {

        let code = barCodeData.text;

        this.boolean = (code === null || code === " ") ? false : this.boolean;
        console.log(code);
        for (const key in this.initV) {

          if (this.initV[key].LPDocumentNo.toUpperCase() === code.toUpperCase()) {
            line = this.initV[key];
            this.intServ.loadingFunc(false);

          }
        }

        let identifier = await this.wmsService.GetItemIdentifier(code);

        for (const key in this.initItem) {
          if (this.initItem[key].ItemNo === code.toUpperCase()) {
            lineI = this.initItem[key];
            this.intServ.loadingFunc(false);

          }
        }


        let boolean = false;

        console.log(identifier);

        if (!identifier.Error) {
          boolean = true;
          console.log(this.initItem);
          for (const key in identifier.ItemIdentifier) {
            
            this.initItem.filter(item => {
              switch (identifier.ItemIdentifier[key].VariantCode === item.VariantCode && identifier.ItemIdentifier[key].ItemNo === item.ItemNo) {
                case true:
                  let line = this.listItems.find(x => x.LineNo === item.LineNo);
                  let line2 = this.itemsL.find(x => x.LineNo === item.LineNo);

                  if ((line === undefined ) && (line2 === undefined)) {
                    this.listItems.push(item);
                    this.listItemsT.push(item);
                  }

                  break;
              }
            });

          }

          this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
        }

        if (lineI === undefined) {


          switch (line) {

            case undefined:
              this.intServ.loadingFunc(false);
              this.intServ.alertFunc(this.js.getAlert('error', ' ', `The license plate ${code.toUpperCase()} does not exist on the Put Away`));

              break;

            default:

              if (this.listsFilter.length > 0 || this.listItems.length > 0) {

                let find = this.listsFilter.find(lp => lp.LPDocumentNo.toUpperCase() === code.toUpperCase());
                let find2 = this.lps.find(lp => lp.LPDocumentNo.toUpperCase() === code.toUpperCase());
                switch (find) {

                  case undefined:
                    if (find2 === undefined) {

                      this.listsFilter.push(line);
                      this.listT.push(line);
                      this.QtyTake++;
                    } else {
                      this.intServ.alertFunc(this.js.getAlert('alert', ' ', `The license Plate ${code.toUpperCase()}  has already been confirmed`));
                    }
                    break;

                  default:
                    this.intServ.loadingFunc(false);
                    this.intServ.alertFunc(this.js.getAlert('alert', ' ', `The license plate is already assigned`));

                    break;
                }

              } 
              else {
                this.listsFilter = [];


                let find2 = this.lps.find(lp => lp.LPDocumentNo.toUpperCase() === code.toUpperCase());

                if (find2 === null || find2 === undefined) {

                  this.listsFilter.push(line);
                  this.listT.push(line);
                  this.QtyTake++;

                } else {
                  this.intServ.alertFunc(this.js.getAlert('alert', ' ', `The license Plate ${code.toUpperCase()}  has already been confirmed`));
                }

              }

              this.storage.set(this.whsePutAway.fields.No, this.listsFilter);

              break;
          }
          this.intServ.loadingFunc(false);
        } else {

    

              let line = this.listItems.find(x => x.LineNo === lineI.LineNo);
              let line2 = this.itemsL.find(x => x.LineNo === lineI.LineNo);

              if ((line === undefined) && (line2 === undefined)) {
                this.listItems.push(lineI);
                this.listItemsT.push(lineI);
              }




            this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);

            this.intServ.loadingFunc(false);

          

        }

        this.active = (this.listItems.length > 0 && this.listsFilter.length === 0) || (this.listItems.length === 0 && this.listsFilter.length > 0)?true:false;
  

      }

    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  async onSubmit() {

    console.log(this.itemsG);
    this.initV = (await this.storage.get(`init ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`init ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`init ${this.whsePutAway.fields.No}`) : [];

    this.listI = (await this.storage.get(`listI ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`listI ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`listI ${this.whsePutAway.fields.No}`) : []

    if (this.initV.length !== this.lps.length || this.listI.length !== this.itemsL.length) {
      let cantidad = 0;
      let res: any[] = [];
      let qtyR = this.QtyTotal - this.lps.length;
      let qtyI = this.listI.length - this.itemsL.length;
      cantidad = qtyR + qtyI;

      let lpR: any[] = [];

      for (const key in this.initV) {               
        let find = this.lps.find(lpC => lpC.LPDocumentNo === this.initV[key].LPDocumentNo);
        let line = res.find(bin => bin === this.initV[key].place);
        if ((find === null || find === undefined) && (line === null || line === undefined)) {
          res.push(this.initV[key].place);

        }
      }

      for (const key in this.listI) {
        let find = this.itemsL.find(itemC => itemC.LineNo === this.listI[key].LineNo);
        let line = res.find(bin => bin === this.listI[key].place);
        if ((find === null || find === undefined) && (line === null || line === undefined)) {
         res.push(this.listI[key].place);

        }
      }

   
      console.log(res);
      console.log(this.initV);

      this.intServ.alertFunc(this.js.getAlert('alert2', 'Are you sure?', `The LP or Items (${cantidad}) will go to the ${res.join(" ")} `, () => {
        var alert = setTimeout(() => {

          this.submit();

          clearTimeout(alert);
        }, 100)
      }));



    } else {

      this.submit();
    }



  }


  async submit() {

    this.intServ.alertFunc(this.js.getAlert('confirm', '', 'Confirm Whse. PutAway?', async () => {
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

      console.log(this.initV);
      
      this.intServ.loadingFunc(true);
      this.split = (this.initV.length > 0) ? await this.wmsService.Prepare_WarehousePutAway(this.whsePutAway.fields.No) : this.split;
      let contador = 0;

      console.log(this.split);

      try {

        if(this.split.Error) throw new Error(this.split.Error.Message);
        if(this.split.error) throw new Error(this.split.error.message);
        if(this.split.message) throw new Error(this.split.message);

       if(this.itemsG.length > 0){
        for (const key in this.itemsG) {      
            for (const i in this.itemsG[key]) {

              let listItem: any[] = [];
              let item = {
                ActivityType: 1,
                No: '',
                ItemNo: '',
                LineNo: '',
                ZoneCode: "STO",
                LocationCode: '',
                BinCode: '',
                Quantity: 0
              }

            if(this.itemsG[key][i].Quantity > 1){
              console.log(this.itemsG);

              let listI = {

                No: "",
                LocationCode: "",
                LineNo: "",
                ItemNo: "",
                BinCode: " ",
                QtyToHandle: " ",
              }

              if (Number(i) === 0) {

                listI.No = this.itemsG[key][i].No,
                  listI.LocationCode = this.itemsG[key][i].LocationCode;
                listI.LineNo = this.itemsG[key][i].LineNo;
                listI.ItemNo = this.itemsG[key][i].ItemNo;
                listI.BinCode = this.binItem[this.itemsG[key][i].ItemNo];
                listI.QtyToHandle = this.itemsG[key][i].Quantity;



              } else {
                listI.No = this.obj.No;
                listI.LocationCode = this.obj.LocationCode;
                listI.LineNo = this.obj.LineNo;
                listI.ItemNo = this.obj.ItemNo;
                listI.BinCode = this.obj.BinCode;
                listI.QtyToHandle = this.itemsG[key][i].Quantity;


                this.obj = {

                  ActivityType: 1,
                  No: "",
                  ItemNo: "",
                  LineNo: "",
                  ZoneCode: "STO",
                  LocationCode: "",
                  BinCode: "",
                  Quantity: 0

                }



              }

              console.log('list =>', listI);
              console.log('items =>', this.binItem)


              let res = await this.wmsService.SplitPutAwayLine(listI);

              console.log('res =>', res);
              if (res.Error) throw new Error(res.Error.Message);

              if (res.error) throw new Error(res.error.message);

              if (res.message) throw new Error(res.message);

               listItem = [];

               item = {
                ActivityType: 1,
                No: res.WarehousePutAwayLines[0].No,
                ItemNo: res.WarehousePutAwayLines[0].ItemNo,
                LineNo: res.WarehousePutAwayLines[0].LineNo,
                ZoneCode: "STO",
                LocationCode: res.WarehousePutAwayLines[0].LocationCode,
                BinCode: this.itemsG[key][i].place,
                Quantity: res.WarehousePutAwayLines[0].Quantity
              }

              listItem.push(item);

              item = {
                ActivityType: 1,
                No: "",
                ItemNo: "",
                LineNo: " ",
                ZoneCode: "",
                LocationCode: "",
                BinCode: "",
                Quantity: 0
              }


             

              item = {
                ActivityType: 1,
                No: res.WarehousePutAwayLines[1].No,
                ItemNo: res.WarehousePutAwayLines[1].ItemNo,
                LineNo: res.WarehousePutAwayLines[1].LineNo,
                ZoneCode: "STO",
                LocationCode: res.WarehousePutAwayLines[1].LocationCode,
                BinCode: this.binItem[this.itemsG[key][i].ItemNo],
                Quantity: res.WarehousePutAwayLines[1].Quantity
              }
              listItem.push(item);
            }else{

              listItem = [];

              item.No = this.itemsG[key][i].No,
              item.LocationCode = this.itemsG[key][i].LocationCode;
              item.LineNo = this.itemsG[key][i].LineNo;
              item.ItemNo = this.itemsG[key][i].ItemNo;
              item.BinCode = this.itemsG[key][i].place;
              item.Quantity = this.itemsG[key][i].Quantity;

              listItem.push(item);

            }

              //console.log(listI);

              let updateI = await this.wmsService.Update_Wsheput_Lines_V2(listItem);

              console.log('update =>', updateI);
              if (updateI.Error) throw new Error(updateI.Error.Message);
              if(updateI.error) throw new Error(updateI.error.message);
              if (updateI.message) throw new Error(updateI.message);

              this.obj.ActivityType = 1;
              this.obj.No = item.No;
              this.obj.ItemNo = item.ItemNo;
              this.obj.LineNo = item.LineNo;
              this.obj.ZoneCode = "STO";
              this.obj.LocationCode = item.LocationCode;
              this.obj.BinCode = item.BinCode;
              this.obj.Quantity = item.Quantity;

              console.log('obj =>', this.obj);

              item = {
                ActivityType: 1,
                No: "",
                ItemNo: "",
                LineNo: " ",
                ZoneCode: "",
                LocationCode: "",
                BinCode: "",
                Quantity: 0
              }

              listItem = [];

            }
          }
        }

        console.log(this.split);

        let list: any[] = [];
        if (this.initV.length > 0) {
          this.initV.filter(Lp => {

          //  if (Lp.LPDocumentType !== "Pallet") {

              let l = this.lps.find(lp => lp.LPDocumentNo === Lp.LPDocumentNo);

              if (l !== undefined) {
                Lp.LPLines = l.LPLines;
              }
              console.log(Lp);

              this.split.WarehousePutAwayLines.filter(lp => {

                switch(Lp.LPDocumentType){
                  case "Single":
                    if (Lp.LPDocumentNo === lp.LP) {

                      Lp.LPLines.map(x => {
                        request.ActivityType = 1;
                        request.BinCode = x.place;
                        request.ItemNo = lp.ItemNo;
                        request.LP = lp.LP;
                        request.LineNo = lp.LineNo;
                        request.LocationCode = lp.LocationCode;
                        request.No = lp.No;
                        request.Quantity = lp.Quantity;
                        request.ZoneCode = lp.ZoneCode;
    
                        list.push(request);
                        console.log(list);
                        
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
                         
                  }
                    break;

                  default:

                  Lp.LPLines.map(x => {
                    if(x.PLULPDocumentNo === lp.LP){
                      request.ActivityType = 1;
                      request.BinCode = x.place;
                      request.ItemNo = lp.ItemNo;
                      request.LP = lp.LP;
                      request.LineNo = lp.LineNo;
                      request.LocationCode = lp.LocationCode;
                      request.No = lp.No;
                      request.Quantity = lp.Quantity;
                      request.ZoneCode = lp.ZoneCode;
  
                      list.push(request);
                      console.log(list);
                      
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

                    }
                 
                  });

                    break;
                }

              });
          //  }

          });
        }
       // const binPallet = await this.wmsService.GetDefaultBin1();
/*
      if(this.split != undefined ){
        for (const i in this.pallet) {
          for (const j in this.pallet[i].fields) {
           this.split.WarehousePutAwayLines.filter(lp => {
             if ( this.pallet[i].fields[j].PLUNo === lp.LP) {
 
                   lp.BinCode = binPallet.Default_Bin;
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
                    
             }
           });
          }
         }
 
      }

      */
       
        

        if (this.initV.length > 0 && this.split != undefined) {

          let update = await this.wmsService.Update_Wsheput_Lines_V1(list);

          console.log(update);

          if (update.Error || update.error) throw new Error('An error occurred while serializing the json in Business Central');

        }

        let postAway = await this.wmsService.Post_WarehousePutAways(this.whsePutAway.fields.No);

        console.log('post away =>', postAway);

        if (postAway.Error) throw new Error(postAway.Error.Message);
        if (postAway.error) throw new Error(postAway.error.message);
       // if (postAway.message) throw new Error(postAway.message);
        

        this.intServ.loadingFunc(false);

        this.intServ.alertFunc(this.js.getAlert('success', '', `The Put away ${this.whsePutAway.fields.No} has been posted and generated a ${postAway.Registered_Whse_Activity}`, () => {

          this.storage.remove(`listI ${this.whsePutAway.fields.No}`);
          this.storage.remove(`itemsL ${this.whsePutAway.fields.No}`);
          this.storage.remove(`items ${this.whsePutAway.fields.No}`);
          this.storage.remove(`init item ${this.whsePutAway.fields.No}`);
          this.storage.remove(`init ${this.whsePutAway.fields.No}`);
          this.storage.remove(this.whsePutAway.fields.No);
          this.storage.remove(`confirm ${this.whsePutAway.fields.No}`);
          this.storage.remove(`bins ${this.whsePutAway.fields.No}`);
          this.storage.remove(`bin ${this.whsePutAway.fields.No}`);
          this.storage.remove('whsePutAway');
          this.storage.remove('setPutAway');

          this.router.navigate(['page/wms/wmsMain']);
        }));

      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', error.message));

      }

    }));
  }


  async init() {

    let take = [];
    let place = [];

    for (const key in this.listPwL) {
      if (this.listPwL[key].ActionType === "Place") {
       place.push(this.listPwL[key]);
        
      }else{
        take.push(this.listPwL[key]);
      }
    }
   
     place.map(x => {

      switch(x.Managed_by_PlurE){
        case true:

          take.forEach(y => {
            
            if(y.SourceLineNo === x.SourceLineNo){

              x.LPArray.LicensePlates.map(lp => {
                lp['take'] = y.BinCode; 
                lp['place'] = x.BinCode;
                lp.LPLines.map(i => {
                  i['place'] = x.BinCode;
                  i['take'] = y.BinCode;
                });
                
                lp['serial']  =  (x.ItemTrackingCode != "")? true:false;
               let find = this.initV.find(i => i.LPDocumentNo === lp.LPDocumentNo);
                if(find === undefined)this.initV.push(lp);
              });

            
            }
          });


          break;

        case false:

         take.forEach(z => {

          if(z.SourceLineNo === x.SourceLineNo){

            x['take'] = z.BinCode;
            x['place'] = x.BinCode;

          }
        
         });

         this.initItem.push(x);
          
          break;
      }

     });

      this.bins = (await this.wmsService.GetPossiblesBinFromPutAway(this.whsePutAway.fields.No)).Bins;

      console.log('bins =>',this.bins);

      this.storage.set(`bin ${this.whsePutAway.fields.No}`, this.bins);
 
      const lpsP = await this.wmsService.GetLicencesPlateInPW(this.whsePutAway.fields.No, true);

      if(lpsP.Error === undefined){

        for (const key in lpsP.LicensePlates) {
       
        let LpLines =  await this.wmsService.listTraking(lpsP.LicensePlates[key].LPLines);

        LpLines.map(x => {
          x['take'] = lpsP.LicensePlates[key].BinCode;
          x['place'] = "FLOOR";
      
        });

        lpsP.LicensePlates[key].LPLines = LpLines;
        lpsP.LicensePlates[key]['take'] = lpsP.LicensePlates[key].BinCode;
        lpsP.LicensePlates[key]['place'] = "FLOOR";

        this.initV.push(lpsP.LicensePlates[key]);
        }
       
      }


      console.log(this.initV);
      console.log(this.initItem);

  this.QtyTotal = this.initV.length;
   this.storage.set(`init ${this.whsePutAway.fields.No}`, this.initV);
    this.intServ.loadingFunc(false);


  }





  public async filter(num: any) {

    let listT = await this.storage.get(this.whsePutAway.fields.No);;
    let listI = await this.storage.get(`items ${this.whsePutAway.fields.No}`);;

    switch (num) {

      case 1:
        this.listItems = [];
        this.listsFilter = listT.filter(
          x => {
            return (x.LPDocumentType === "Single");
          }
        )
        this.active = true;

        break;

      case 2:
        this.listItems = [];
        this.listsFilter = listT.filter(
          x => {
            return (x.LPDocumentType === "Pallet");
          }
        )
        this.active = true;
        break;
      case 3:
        this.listsFilter = [];
        this.listItems = listI;
        this.active = true;
        break;

      case 4:
        this.listItems = listI;
        this.listsFilter = listT;
        this.active = false;
        break;

    }
  }

  public descendent() {



  }

  async onScanAll() {

    this.intServ.loadingFunc(true);
  if(this.initV.length > 0){

    this.initV.filter(lp => {
      let find = this.listsFilter.find(lpE => lpE.LPDocumentNo === lp.LPDocumentNo);

      let find2 = this.lps.find(lpF => lpF.LPDocumentNo === lp.LPDocumentNo);

      if ((find === null || find === undefined) && (find2 === null || find2 === undefined)) {

        this.QtyTake++;
        this.listsFilter.push(lp);
        this.listT.push(lp);

      }

    });
  }
  


    
    if(this.init.length > 0){

      this.initItem.filter(item => {

        let line = this.listItems.find(x => x.LineNo === item.LineNo);
        let line2 = this.itemsL.find(x => x.LineNo === item.LineNo);

        if ((line === undefined || line === null) && (line2 === undefined || line2 === null)) {
          this.listItems.push(item);
          this.listItemsT.push(item);

        }


      });
    }

  


    this.active = (this.listItems.length > 0 && this.listsFilter.length === 0) || (this.listItems.length === 0 && this.listsFilter.length > 0)?true:false;
  
    this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
    console.log(this.listItems);
    console.log(this.listsFilter);
    this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
    this.intServ.loadingFunc(false);

  }


  async onChangeBinI(Item: any, bin: any) {

    this.listItems.filter(item => {

      if (Item.ItemNo === item.ItemNo) item.ItemNo = bin;

    });


  }


  async show(lp: any) {

    switch (lp.LPDocumentType) {

      case "Pallet":

        let lps: any[] = [];
        for (const key in lp.LPLines) {
        
          let p;
          let img;
          let l = lp.LPLines[key];
      
          //  let resI = await this.wmsService.GetItem(l.PLUNo);
  
          //  img = await this.wmsService.listItem(resI);

         //   l['image'] = `data:image/jpeg;base64,${img.fields.Picture}`;          
         
            lps.push(l);

          }    
            
        

        this.intServ.loadingFunc(false);
        const modal = await this.modalCtrl.create({
          component: ModalShowLpsComponent,
          componentProps: { lps:lp.LPLines, No: lp.LPDocumentNo }
        });
        modal.present();

         break;

        case "Single":

              if(lp.serial){

                const popoverI = await this.popoverController.create({
                  component: PopoverSerialesLpComponent,
                  cssClass: 'popoverSerialesLpComponent',
                  backdropDismiss: false,
                  componentProps: {seriales:lp.LPLines},
                });
                await popoverI.present();
            
              }
              
              
             break
    }


  }

  async splitItem(item: any) {

    this.intServ.loadingFunc(false);
    const popoverI = await this.popoverController.create({
      component: PopoverSplitItemComponent,
      cssClass: 'popoverSplitItemComponent',
      backdropDismiss: false,
      componentProps: { item },
    });
    await popoverI.present();

    const { data } = await popoverI.onWillDismiss();

    if (data.qty != null) {


      this.intServ.loadingFunc(true);


      switch (data.qty < data.item.Quantity && data.qty > 0) {

        case true:

          let itemR = {

            take: data.item.take,
            BinTypeCode: data.item.BinTypeCode,
            Description: data.item.Description,
            DueDate: data.item.DueDate,
            ExpirationDate: data.item.ExpirationDate,
            ItemNo: data.item.ItemNo,
            LocationCode: data.item.LocationCode,
            LotNo: data.item.LotNo,
            No: data.item.No,
            Quantity: data.item.Quantity - data.qty,
            SerialNo: data.item.SerialNo,
            SourceNo: data.item.SourceNo,
            place: data.item.place,
            ZoneCode: "STO",
            LineNo: data.item.LineNo,
            VariantCode: data.item.VariantCode
          }

          this.listItems.filter((x, index) => {

            if (x.LineNo === data.item.LineNo) this.listItems.splice(index, 1);
          });

          this.listItems.push(itemR);


          let itemC = {

            take: data.item.take,
            BinTypeCode: data.item.BinTypeCode,
            Description: data.item.Description,
            DueDate: data.item.DueDate,
            ExpirationDate: data.item.ExpirationDate,
            ItemNo: data.item.ItemNo,
            LocationCode: data.item.LocationCode,
            LotNo: data.item.LotNo,
            No: data.item.No,
            Quantity: data.qty,
            SerialNo: data.item.SerialNo,
            SourceNo: data.item.SourceNo,
            place: data.updateBin,
            ZoneCode: "STO",
            LineNo: data.item.LineNo,
            VariantCode: data.item.VariantCode

          }


          this.itemsL.push(itemC);

          this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);

          this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemsL);

          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('success', '', `The bin ${data.updateBin} has been confirmed with the Quantity ${data.qty}`))

          break;

        default:

          if (data.qty === data.item.Quantity) {


            item = {
              ActivityType: 1,
              No: data.item.No,
              ItemNo: data.item.ItemNo,
              LineNo: data.item.LineNo,
              ZoneCode: "STO",
              LocationCode: data.item.LocationCode,
              BinCode: data.updateBin,
              Quantity: data.item.Quantity,
              LotNo: data.item.LotNo,
              SerialNo: data.item.SerialNo
            }




            let itemC = {

              take: data.item.take,
              BinTypeCode: item.BinTypeCode,
              Description: item.Description,
              DueDate: item.DueDate,
              ExpirationDate: item.ExpirationDate,
              ItemNo: item.ItemNo,
              LocationCode: item.LocationCode,
              LotNo: item.LotNo,
              No: item.No,
              Quantity: item.Quantity,
              SerialNo: item.SerialNo,
              SourceNo: item.SourceNo,
              place: data.updateBin,
              ZoneCode: item.ZoneCode,
              LineNo: item.LineNo,
              VariantCode: data.item.VariantCode

            }


            this.itemsL.push(itemC);

            this.listItems.filter((x, index) => {

              if (x.LineNo === item.LineNo) this.listItems.splice(index, 1);
            });

            this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);

            this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemsL);

            this.intServ.loadingFunc(false);

            this.intServ.alertFunc(this.js.getAlert('success', '', `The bin ${data.updateBin} has been confirmed with the Quantity ${data.qty}`));
            break;
          } else if (data.qty === 0) {
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error', '', `The quantity must be greater than zero `));
            break;
          } else {
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error', '', `The quantity ${data.qty} is greater than the Item ${item.ItemNo}`));
            break;
          }

      }


    }

  }


  remove(item: any) {


    this.listsFilter.filter((lp, index) => {


      if (lp.LPDocumentNo === item.LPDocumentNo) {

        this.QtyTake -= 1;
        this.listsFilter.splice(index, 1);
        this.listT.splice(index, 1);
      }
    });


    if (this.listsFilter.length === 0) {

      this.storage.remove(this.whsePutAway.fields.No);

    } else {

      this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
    }

    this.active = (this.listItems.length > 0 && this.listsFilter.length === 0) || (this.listItems.length === 0 && this.listsFilter.length > 0)?true:false;
  


  }


 async onRemoveAll() {


    this.listsFilter = [];
    this.list = [];
    this.listT = [];
    this.QtyTake = 0;
    this.listItems = [];
    this.listI = [];
    this.storage.remove(`items ${this.whsePutAway.fields.No}`)
    this.storage.remove(this.whsePutAway.fields.No);
    // this.storage.remove(`bins ${this.whsePutAway.fields.No}`);
    this.storage.remove(`listI ${this.whsePutAway.fields.No}`)

    this.initItem = await this.storage.get(`init item ${this.whsePutAway.fields.No}`);

    this.initV =  await this.storage.get(`init ${this.whsePutAway.fields.No}`);


  }


  onBarCodeConfirm() {

    if (this.listsFilter.length > 0 || this.listItems.length > 0) {
      this.barcodeScanner.scan().then(
        async (barCodeData) => {
          let code = barCodeData.text;

          let boolean = false;

          if (code != '') {

            let confirmBin = this.lps.find(lp => lp.place === code.toUpperCase());
            this.intServ.loadingFunc(true);
            this.listsFilter.filter(lp => {

              if (lp.place.toUpperCase() === code.toUpperCase()) {
                this.lps.push(lp);
                boolean = true;
              }

            });


            console.log(this.lps);

            if (this.lps.length > 0) {

              this.lps.filter((lpC) => {

                this.listsFilter.filter((lp, index) => {

                  if (lpC.LPDocumentNo === lp.LPDocumentNo) {
                    this.listsFilter.splice(index, 1);
                  }
                });

              });


              if ((confirmBin === undefined || confirmBin === null) && boolean) {

                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.js.getAlert('success', ' ', `The bin ${code.toUpperCase()} has been successfully confirmed. `));
                this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);
                this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
                this.listT = await this.storage.get(this.whsePutAway.fields.No);


              } else if ((confirmBin != undefined) && boolean) {

                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.js.getAlert('success', ' ', `The bin ${code.toUpperCase()} has been successfully confirmed. `));
                this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);
                this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
                this.listT = await this.storage.get(this.whsePutAway.fields.No);


              } else {

                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.js.getAlert('error', '', `The bin ${code.toUpperCase()} does not exist in the list`));
              }

            }else{
              this.intServ.loadingFunc(false);
              this.intServ.alertFunc(this.js.getAlert('alert', '', `Bin ${code.toUpperCase()} does not exist in the list`));
            }
          }
        }
      ).catch(
        err => {
          console.log(err);
        }
      )


    } else {

      this.intServ.alertFunc(this.js.getAlert('alert', '', 'Please scan LP'));
    }

  }

  removeI(item: any) {

    console.log(item);
    this.listItems.filter(
      (x, index) => {

        if (x.LineNo === item.LineNo){
          this.listItems.splice(index, 1);
          this.listItemsT.splice(index,1);
        }

      }
    );

    if (this.listItems.length === 0) {
      this.storage.remove(`items ${this.whsePutAway.fields.No}`);
    } else {
      this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
    }

    this.active = (this.listItems.length > 0 && this.listsFilter.length === 0) || (this.listItems.length === 0 && this.listsFilter.length > 0)?true:false;
  

  }


  onChangeBinOne(item: any, bin: any) {


          this.listsFilter.filter(lp => {

            if (lp.LPDocumentNo === item.LPDocumentNo) {

              lp.place = bin.toUpperCase();
              lp.LPLines.map(x => x['place'] = bin.toUpperCase());
              console.log(lp);

            }
          });
  

        this.listT = this.listsFilter;

        this.storage.set(this.whsePutAway.fields.No, this.listsFilter);

              

  }

  async onModalConfirm() {

    let lps = this.lps;
    this.itemsL.map(item => {

      let find = this.listBins.find(bin => bin === item.place);

      if (find === null || find === undefined) {

        this.listBins.push(item.place);
      }

    });
    this.lps.map(lp => {

      let find = this.listBins.find(bin => bin === lp.place);

      if (find === null || find === undefined) {

        this.listBins.push(lp.place);
      }
    });

    this.storage.set(`bins ${this.whsePutAway.fields.No}`, this.listBins);

    let bins = this.listBins;

    let itemsL = this.itemsL;

    let whsePutAway = this.whsePutAway;
    const modal = await this.modalCtrl.create({
      component: ModalLpsConfirmComponent,
      componentProps: { lps, bins, whsePutAway, itemsL }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    console.log(data);
    if (data.delete.length > 0) {

      this.listItems.filter(item => {

        data.delete.filter(itemD => {

          if (itemD.ItemNo === item.ItemNo && itemD.LineNo === item.LineNo) {
            item.Quantity += itemD.Quantity;
          } else {

            this.listItems.push(itemD);
          }


        });

      });

      this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
    }


      this.lps = data.data;
      this.listBin = data.bin;
      this.itemsL = data.items;
      this.lps = data.data;
      this.QtyTake -=  data.qtyR;
    if (data.action !== undefined) {
      this.itemsG = data.itemsG;
      this.onSubmit();
    }

  }


  autoComplet() {

    this.barcodeScanner.scan().then(
      async (barCodeData) => {


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


  onFilter(e, binCode: any = '') {

    switch (binCode) {
      case '':
        let val = e.target.value;

        console.log(val);

        if (val === '') {
          this.listsFilter = this.listT;
          this.listItems =   this.listItemsT;
        } else {
          this.listsFilter = this.listT.filter(
            x => {
              return (x.place.toLowerCase().includes(val.toLowerCase()) || x.LPDocumentNo.toLowerCase().includes(val.toLowerCase()));
            }
          )

          this.listItems = this.listItemsT.filter(
            x => {
              return (x.place.toLowerCase().includes(val.toLowerCase()) || x.ItemNo.toLowerCase().includes(val.toLowerCase()) || 
              x.SerialNo.toLowerCase().includes(val.toLowerCase()) || x.VariantCode.toLowerCase().includes(val.toLowerCase()) || 
              x.LotNo.toLowerCase().includes(val.toLowerCase()));
            }
          )
        }
        break;

      default:


        this.listsFilter = this.listT.filter(
          x => {
            return (x.place.toLowerCase().includes(binCode.toLowerCase()) || x.LPDocumentNo.toLowerCase().includes(binCode.toLowerCase()));
          }
        )

        this.listItems = this.listItemsT.filter(
          x => {
            return (x.place.toLowerCase().includes(binCode.toLowerCase()) || x.ItemNo.toLowerCase().includes(binCode.toLowerCase()) || 
             x.SerialNo.toLowerCase().includes(binCode.toLowerCase()) || x.VariantCode.toLowerCase().includes(binCode.toLowerCase()) || 
             x.LotNo.toLowerCase().includes(binCode.toLowerCase()));
          }
        )
        //console.log(this.listsFilter, binCode);

        break;
    }

  }

}
