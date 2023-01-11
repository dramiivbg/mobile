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


@Component({
  selector: 'app-edit-put-away',
  templateUrl: './edit-put-away.component.html',
  styleUrls: ['./edit-put-away.component.scss'],
})
export class EditPutAwayComponent implements OnInit {
  public lpsS: any = {}
  public list: any[] = []
  public listT: any[] = []

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

  public itemsG: any[] = [];
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

  ngAfterViewInit() {

  }
  async ngOnInit() {

    this.whsePutAway = await this.storage.get('whsePutAway');

    this.warePW = await this.storage.get('setPutAway');

    this.listPwL = await this.wmsService.ListPutAwayL(this.warePW);
    this.listPut = await this.wmsService.ListPutAwayL(this.warePW);
    console.log(this.whsePutAway, this.listPwL);
    this.warePY = await this.wmsService.ListPutAwayH(this.warePW);
    this.pallet = await this.storage.get(`pallet ${this.pallet}`);
    this.take = (await this.storage.get(`take ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`take ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`take ${this.whsePutAway.fields.No}`) : null;

    this.binItem = (await this.storage.get(`bin Item ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`bin Item ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`bin Item ${this.whsePutAway.fields.No}`) : [];

    this.listI = (await this.storage.get(`listI ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`listI ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`listI ${this.whsePutAway.fields.No}`) : []
    this.itemsL = (await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) : [];

    this.listItems = (await this.storage.get(`items ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`items ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`items ${this.whsePutAway.fields.No}`) : [];

    this.initItem = (await this.storage.get(`init item ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`init item ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`init item ${this.whsePutAway.fields.No}`) : [];

    this.initV = [];

    this.initV = (await this.storage.get(`init ${this.whsePutAway.fields.No}`) != undefined
      || await this.storage.get(`init ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`init ${this.whsePutAway.fields.No}`) : [];

    if (this.initV.length === 0) this.init();

    if (this.listItems.length === 0) this.initI();

    if (this.initV.length > 0) {
      this.QtyTotal = this.initV.length;
    }
    this.listsFilter = (await this.storage.get(this.whsePutAway.fields.No) != undefined || await this.storage.get(this.whsePutAway.fields.No) != null) ? await this.storage.get(this.whsePutAway.fields.No) : [];
    console.log(await this.storage.get(this.whsePutAway.fields.No));
    this.listT = (await this.storage.get(this.whsePutAway.fields.No) != undefined || await this.storage.get(this.whsePutAway.fields.No) != null) ? await this.storage.get(this.whsePutAway.fields.No) : [];
    this.lps = (await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`confirm ${this.whsePutAway.fields.No}`) : [];

    this.listBins = (await this.storage.get(`bins ${this.whsePutAway.fields.No}`) != undefined ||
      await this.storage.get(`bins ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`bins ${this.whsePutAway.fields.No}`) : [];

    console.log(this.lps);

    if (this.listsFilter.length > 0) this.QtyTake = this.lps.length + this.listsFilter.length;

    let bin = (await this.storage.get(`bin ${this.whsePutAway.fields.No}`) != undefined || await this.storage.get(`bin ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`bin ${this.whsePutAway.fields.No}`) : null;

    if (bin != undefined) this.bins = bin.Bins;

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

          if (this.pallet != undefined && this.listsFilter.length != this.initV.length) {
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error', ' ', `Please scan all license plate and pallet`));
            return;
          }

          this.listsFilter.filter(lp => {
            lp.fields.place = code.toUpperCase();

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


          if (this.initV[key].fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase()) {
            line = this.initV[key];
            this.intServ.loadingFunc(false);

          }
        }

        let identifier = await this.wmsService.GetItemIdentifier(code);

        for (const key in this.initItem) {
          if (key === code.toUpperCase()) {
            lineI = key;
            this.intServ.loadingFunc(false);

          }
        }


        let boolean = false;

        console.log(identifier);

        if (!identifier.Error) {
          boolean = true;
          console.log(this.initItem);
          for (const key in identifier.ItemIdentifier) {

            this.initItem[identifier.ItemIdentifier[key].ItemNo].filter(item => {
              switch (identifier.ItemIdentifier[key].VariantCode === item.VariantCode) {
                case true:
                  let line = this.listItems.find(x => x.LineNo === item.LineNo);
                  let line2 = this.itemsL.find(x => x.LineNo === item.LineNo);

                  if ((line === undefined || line === null) && (line2 === undefined || line === null)) {
                    this.listItems.push(item);
                    this.listItemsT.push(item);
                  }

                  break;
              }
            });

          }

          this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
        }



        if ((lineI === undefined || lineI === null) && boolean === false) {


          switch (line) {

            case null || undefined:
              this.intServ.loadingFunc(false);
              this.intServ.alertFunc(this.js.getAlert('error', ' ', `The license plate ${code.toUpperCase()} does not exist on the Put Away`));

              break;

            default:

              if (this.listsFilter.length > 0 || this.listItems.length > 0) {

                let find = this.listsFilter.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase());
                let find2 = this.lps.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase());
                switch (find) {

                  case null || undefined:
                    if (find2 === null || find2 === undefined) {

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

              } else {
                this.listsFilter = [];


                let find2 = this.lps.find(lp => lp.fields.PLULPDocumentNo.toUpperCase() === code.toUpperCase());

                if (find2 === null || find2 === undefined) {

                  this.listsFilter.push(line);
                  this.listT.push(line);
                  this.QtyTake++;

                } else {
                  this.intServ.alertFunc(this.js.getAlert('alert', ' ', `The license Plate ${code.toUpperCase()}  has already been confirmed`));
                }

              }



              this.storage.set(this.whsePutAway.fields.No, this.listsFilter);

              let bin = await this.wmsService.GetPossiblesBinFromPutAway(this.listsFilter[0].fields.PLULPDocumentNo);

              this.bins = bin.Bins;

              break;
          }
        } else {

          if (lineI != undefined || lineI != null && boolean === false) {

            this.initItem[lineI].filter(item => {

              let line = this.listItems.find(x => x.LineNo === item.LineNo);
              let line2 = this.itemsL.find(x => x.LineNo === item.LineNo);

              if ((line === undefined || line === null) && (line2 === undefined || line === null)) {
                this.listItems.push(item);
                this.listItemsT.push(item);
              }

            });


            this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);


          }

        }

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
      let qtyI = this.itemsL.length - this.listI.length;
      cantidad = qtyR + qtyI;

      let lpR: any[] = [];

      this.initV.filter(lp => {

        let find = this.lps.filter(lpC => lpC.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

        let line = res.find(bin => bin === lp.fields.place);

        if ((find === null || find === undefined) && (line === null || line === undefined)) {

          res.push(lp.fields.place);

        }
      });

      this.listI.filter(item => {

        let find = this.itemsL.filter(itemC => itemC.LineNo === item.LineNo);

        let line = res.find(bin => bin === item.place);

        if ((find === null || find === undefined) && (line === null || line === undefined)) {

          res.push(item.place);

        }

      });

      let update = {

        ActivityType: 1,
        No: "",
        ItemNo: "",
        LineNo: "",
        ZoneCode: "",
        LocationCode: "",
        BinCode: "",
        Quantity: 0
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
      this.split = (this.initV.length > 0) ? await this.wmsService.Prepare_WarehousePutAway(this.warePY.fields.No) : [];
      let contador = 0;

      try {


        console.log(this.itemsG);

        for (const key in this.itemsG) {

          if (this.itemsG[key].length > 0) {

            for (const i in this.itemsG[key]) {


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

              let listItem: any[] = [];

              let item = {
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
              listItem.push(item)
              //console.log(listI);

              let updateI = await this.wmsService.Update_Wsheput_Lines_V2(listItem);

              console.log('update =>', updateI);
              if (updateI.Error || updateI.error) throw new Error((updateI.Error !== undefined) ? updateI.Error.Message : updateI.error.message);

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


        let list: any[] = [];
        if (this.initV.length > 0) {

          this.initV.filter(Lp => {

            if (Lp.fields.PLULPDocumentType !== "Pallet") {

              let l = this.lps.find(lp => lp.fields.PLULPDocumentNo === Lp.fields.PLULPDocumentNo);

              if (l !== undefined) {
                Lp.fields.place = l.fields.place;
              }

              this.split.WarehousePutAwayLines.filter(lp => {


                if (Lp.fields.PLULPDocumentNo === lp.LP) {


                  lp.BinCode = Lp.fields.place;

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

          });
        }

        if (this.initV.length > 0) {

          let update = await this.wmsService.Update_Wsheput_Lines_V1(list);

          console.log(update);

          if (update.Error || update.error) throw new Error('An error occurred while serializing the json in Business Central');

        }

        let postAway = await this.wmsService.Post_WarehousePutAways(this.warePY.fields.No);

        console.log('post away =>', postAway);

        if (postAway.Error || postAway.error) throw new Error((postAway.Error === undefined) ? postAway.error.message : postAway.Error.Message);

        this.intServ.loadingFunc(false);

        this.intServ.alertFunc(this.js.getAlert('success', '', `The Put away ${this.warePY.fields.No} has been posted and generated a ${postAway.Registered_Whse_Activity}`, () => {

          this.router.navigate(['page/wms/wmsMain']);
        }));

      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', error.message));

      }

    }));
  }


  async init() {

    let listPallet;

    const lps = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, false);

    const pallets = await this.wmsService.GetLicencesPlateInPW(this.warePY.fields.No, true);

    const binPallet = await this.wmsService.GetDefaultBin1();
      console.log('ls =>', lps);
    // console.log('pallet =>', pallets);
    // console.log('bin Default =>', binPallet);

    if (!pallets.Error) {

      const listLp = await this.wmsService.ListLP(lps);

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

          let line = listLp.find(lp => lp.fields.PLULPDocumentNo === this.pallet[i].fields[j].PLUNo);

          this.pallet[i].fields[j].PLUWhseLineNo = (line != null || line != undefined) ? line.fields.PLUWhseLineNo : this.pallet[i].fields[j].PLUWhseLineNo;
        }

      }

      const listPalletH = await this.wmsService.ListPallets(pallets);

      for (const key in this.pallet) {

        this.pallet[key].fields.filter(lp => {

          let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.PLULPDocumentNo);
          lp.PLUBinCode = line.fields.PLUBinCode;
          lp.PLUItemNo = line.fields.PLUItemNo;
          //  lp.fields.place = binPallet.Default_Bin;
        });
      }

      listPallet = await this.wmsService.ListLP(pallets);

      listPallet.filter((lp, index) => {

        let line = listPalletH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

        lp.fields.PLUBinCode = line.fields.PLUBinCode;
        lp.fields.PLUItemNo = line.fields.PLUItemNo;
        lp.fields.place = binPallet.Default_Bin;
        console.log(binPallet.Default_Bin);
        let find = this.initV.find(lpI => lpI.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

        if (find === null || find === undefined) {

          this.initV.push(lp);
          this.QtyTotal++;
        }

      });

    }

    if (!lps.Error) {
      let listLp = await this.wmsService.ListLP(lps);
      let listLpH = await this.wmsService.ListLPH(lps);
      listLp.filter(lp => {
        let find2: any = undefined;
        for (const key in this.pallet) {

          find2 = this.pallet[key].fields.find(lpI => lpI.PLUNo === lp.fields.PLULPDocumentNo);
        }
        console.log(lp, this.pallet);
        if (find2 === undefined || find2 === null) {
          let line = listLpH.find(lpH => lpH.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);
          lp.fields.PLUBinCode = line.fields.PLUBinCode;
          lp.fields.PLUItemNo = line.fields.PLUItemNo;

          this.listPwL.filter(
            x => {
              switch (x.fields.ActionType) {
                case "Place":
                  if (lp.fields.PLUNo === x.fields.ItemNo) {
                    lp.fields.place = x.fields.BinCode;
                    this.initV.push(lp);
                    this.QtyTotal++;
                    break;
                  }
              }
            }
          )
        }

      });

      let bin = await this.wmsService.GetPossiblesBinFromPutAway(this.initV[0].fields.PLULPDocumentNo);

      this.storage.set(`init ${this.whsePutAway.fields.No}`, this.initV);

      this.storage.set(`bin ${this.whsePutAway.fields.No}`, bin);

      this.storage.set(`pallet ${this.pallet}`, this.pallet);

      this.bins = bin.Bins;

      console.log(this.initV);

    }

    this.intServ.loadingFunc(false);

  }


  public initI() {


    for (const i in this.listPut) {

      for (const j in this.listPwL) {


        if (this.listPut[i] != undefined) {

          if (this.listPut[i].fields.ItemNo === this.listPwL[j].fields.ItemNo) {

            if (j != i) {

              let con = this.listPut.splice(Number(j), 1);
              console.log(i, j);
              console.log(con)

            }
          }
        } else {
          this.listPut.splice(Number(i), 1);
        }
      }
    }

    console.log('ordenada =>', this.listPut);



    let place;
    let zoneCode;
    let list: any[] = [];
    console.log(this.listPwL);

    let item = {

      take: '',
      BinTypeCode: "",
      Description: "",
      DueDate: "",
      ExpirationDate: null,
      ItemNo: "",
      LocationCode: "",
      LotNo: null,
      No: " ",
      Quantity: 0,
      SerialNo: null,
      SourceNo: "",
      place: '',
      ZoneCode: "",
      LineNo: "",
      VariantCode: "",
    }

    for (const key in this.listPut) {

      this.initItem[this.listPut[key].fields.ItemNo] = [];

    }


    let length = this.listPwL.length;
    this.listPut.filter(async (items) => {
      let res = await this.wmsService.GetItemInfo(items.fields.ItemNo);
      switch (res.Managed_by_PlurE) {
        case false:
          this.listPwL.filter(async (Item, index) => {

            if (Item.fields.ItemNo === items.fields.ItemNo) {


              if (Item.fields.ActionType === "Take") {
                this.take = Item.fields.BinCode;

              }


              if (Item.fields.ActionType === "Place") {
                item.take = this.take;
                item.place = Item.fields.BinCode;
                item.Description = Item.fields.Description;
                item.BinTypeCode = Item.fields.BinTypeCode;
                item.DueDate = Item.fields.DueDate;
                item.ItemNo = Item.fields.ItemNo;
                item.LineNo = String(Item.fields.LineNo);
                item.LocationCode = Item.fields.LocationCode;
                item.No = Item.fields.No;
                item.ExpirationDate = Item.fields.ExpirationDate;
                item.Quantity = Number(Item.fields.Quantity);
                item.SerialNo = Item.fields.SerialNo;
                item.SourceNo = Item.fields.SourceNo;
                item.ZoneCode = Item.fields.ZoneCode;
                item.VariantCode = Item.fields.VariantCode;
                item.LotNo = Item.fields.LotNo;

                let line = this.listI.find(x => x.ItemNo === item.ItemNo);
                if (line === null || line === undefined) this.listI.push(Item);

                this.list.push(item);

                this.initItem[items.fields.ItemNo] = this.list;
                this.binItem[items.fields.ItemNo] = item.place;


                item = {

                  take: "",
                  BinTypeCode: "",
                  Description: "",
                  DueDate: "",
                  VariantCode: "",
                  ExpirationDate: null,
                  ItemNo: "",
                  LocationCode: "",
                  LotNo: null,
                  No: " ",
                  Quantity: 0,
                  SerialNo: null,
                  SourceNo: "",
                  place: "",
                  ZoneCode: "",
                  LineNo: "",
                }
              }
            }
          });

          this.list = [];

          break;

      }

    });

    console.log(this.initItem);
    console.log(this.binItem);

    this.storage.set(`init item ${this.whsePutAway.fields.No}`, this.initItem);
    this.storage.set(`listI ${this.whsePutAway.fields.No}`, this.listI);
    this.storage.set(`take ${this.whsePutAway.fields.No}`, this.take);
    this.storage.set(`bin Item ${this.whsePutAway.fields.No}`, this.binItem);
    this.intServ.loadingFunc(false);

  }


  public ascendant() {



  }

  public async filter(num: any) {

    let listT = await this.storage.get(this.whsePutAway.fields.No);;
    let listI = await this.storage.get(`items ${this.whsePutAway.fields.No}`);;

    switch (num) {

      case 1:
        this.listItems = [];
        this.listsFilter = listT.filter(
          x => {
            return (x.fields.PLULPDocumentType === "Single");
          }
        )

        break;

      case 2:
        this.listItems = [];
        this.listsFilter = listT.filter(
          x => {
            return (x.fields.PLULPDocumentType === "Pallet");
          }
        )
        break;
      case 3:
        this.listsFilter = [];
        this.listItems = listI;
        break;

      case 4:
        this.listItems = listI;
        this.listsFilter = listT;
        break;

    }
  }

  public descendent() {



  }

  async onScanAll() {

    this.initItem = (this.initItem.length === 0) ? await this.storage.get(`init item ${this.whsePutAway.fields.No}`) : this.initItem;

    this.intServ.loadingFunc(true);
    this.initV.filter(lp => {
      let find = this.listsFilter.find(lpE => lpE.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

      let find2 = this.lps.find(lpF => lpF.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

      if ((find === null || find === undefined) && (find2 === null || find2 === undefined)) {

        this.QtyTake++;
        this.listsFilter.push(lp);
        this.listT.push(lp);

      }

    });



    for (const key in this.initItem) {

      this.initItem[key].filter(item => {

        let line = this.listItems.find(x => x.LineNo === item.LineNo);
        let line2 = this.itemsL.find(x => x.LineNo === item.LineNo);

        if ((line === undefined || line === null) && (line2 === undefined || line2 === null)) {
          this.listItems.push(item);
          this.listItemsT.push(item);

        }


      });

    }

    this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
    console.log(this.listItems);
    console.log(this.initItem);
    this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
    this.intServ.loadingFunc(false);

  }


  async onChangeBinI(Item: any, bin: any) {

    this.initItem.filter(item => {

      if (Item.ItemNo === item.ItemNo) item.ItemNo = bin;

    });


  }


  async show(lp: any) {

    switch (lp.fields.PLULPDocumentType) {

      case "Pallet":

        this.intServ.loadingFunc(true);
        let pallet = this.pallet.find(pallet => pallet.fields[0].PLULPDocumentNo === lp.fields.PLULPDocumentNo);
        let lps: any[] = [];
        pallet.fields.filter(async (lp, index) => {

          let res = await this.wmsService.getLpNo(lp.PLUNo);

          let p = await this.wmsService.ListLp(res);

          let pH = await this.wmsService.ListLpH(res);

          let resI = await this.wmsService.GetItem(p.fields.PLUNo);

          let img = await this.wmsService.listItem(resI);

          p.fields['image'] = `data:image/jpeg;base64,${img.fields.Picture}`;
          p.fields.PLUBinCode = pH.fields.PLUBinCode;
          p.fields.PLULocationCode = pH.fields.PLULocationCode;

          this.listPwL.filter(
            x => {
              switch (x.fields.ActionType) {
                case "Place":
                  if (p.fields.PLUNo === x.fields.ItemNo) {
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
          componentProps: { lps, listPwL: this.listPwL, No: pallet.fields[0].PLULPDocumentNo }
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

    }


  }

  async splitItem(item: any) {

    this.intServ.loadingFunc(false);
    const popoverI = await this.popoverController.create({
      component: PopoverSplitItemComponent,
      cssClass: 'popoverSplitItemComponent',
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


      if (lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo) {

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


  }


  onRemoveAll() {


    this.listsFilter = [];
    this.list = [];
    this.listT = [];
    this.QtyTake = 0;
    this.listItems = [];
    this.take = ''
    this.listI = [];
    this.storage.remove(`items ${this.whsePutAway.fields.No}`)
    this.storage.remove(this.whsePutAway.fields.No);
    // this.storage.remove(`bins ${this.whsePutAway.fields.No}`);
    this.storage.remove(`take ${this.whsePutAway.fields.No}`);
    this.storage.remove(`listI ${this.whsePutAway.fields.No}`)

  }


  onBarCodeConfirm() {

    if (this.listsFilter.length > 0 || this.listItems.length > 0) {
      this.barcodeScanner.scan().then(
        async (barCodeData) => {
          let code = barCodeData.text;

          let boolean = false;

          if (code != '') {

            let confirmBin = this.lps.find(lp => lp.fields.place === code.toUpperCase());
            this.intServ.loadingFunc(true);
            this.listsFilter.filter(lp => {

              if (lp.fields.place.toUpperCase() === code.toUpperCase()) {
                this.lps.push(lp);
                boolean = true;
              }

            });


            console.log(this.lps);

            if (this.lps.length > 0) {

              this.lps.filter((lpC) => {

                this.listsFilter.filter((lp, index) => {

                  if (lpC.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo) {
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

        if (x.LineNo === item.LineNo) this.listItems.splice(index, 1);

        if (this.listItems.length === 0) {
          this.storage.remove(`items ${this.whsePutAway.fields.No}`);
        } else {
          this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
        }
      }
    )

  }


  onChangeBinOne(item: any, bin: any) {

    switch (item.fields.PLULPDocumentType) {

      case 'Single':


        console.log('single.....');

        if (this.pallet != undefined) {

          for (const key in this.pallet) {
            let line = this.pallet[key].fields.find(lp => lp.PLUNo === item.fields.PLULPDocumentNo);

            if (line != undefined || line != null) {

              this.intServ.alertFunc(this.js.getAlert('error', '', `To change the bin must be done on the pallet ${this.pallet[key].fields[0].PLULPDocumentNo} `))

              return;

            }

          }

          this.listsFilter.filter(lp => {

            if (lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo) {

              lp.fields.place = bin.toUpperCase();

            }
          });





        } else {

          this.listsFilter.filter(lp => {

            if (lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo) {

              lp.fields.place = bin.toUpperCase();

            }
          });


        }

        this.listT = this.listsFilter;

        this.storage.set(this.whsePutAway.fields.No, this.listsFilter);


        break;



      case 'Pallet':



        for (const key in this.pallet) {

          let line = this.pallet[key].fields.find(lp => lp.PLULPDocumentNo === item.fields.PLULPDocumentNo);

          if (line != undefined || line != null) {


            let tempory: any[] = [];

            let indice: any;

            this.pallet[key].fields.filter(async (Lp) => {

              let line = this.pallet[key].fields.find(lp => lp.PLUWhseLineNo != Lp.PLUWhseLineNo);

              if (line === null || line === undefined) {

                Lp.PLUBinCode = bin.toUpperCase();
                this.listsFilter.filter(lp => {

                  if (lp.fields.PLULPDocumentNo === Lp.PLUNo) {

                    lp.fields.place = bin.toUpperCase();
                  }
                });


                let res = await this.wmsService.getLpNo(Lp.PLUNo);

                let lpL = await this.wmsService.ListLp(res);

                lpL.fields.place = bin.toUpperCase();


              }

            });

          }
        }


    }

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

      let find = this.listBins.find(bin => bin === lp.fields.place);

      if (find === null || find === undefined) {

        this.listBins.push(lp.fields.place);
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
    if (data.delete != undefined) {

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

    if (data.action === undefined) {

      this.lps = data.data;
      // this.QtyTake = this.listsFilter.length - this.lps.length;
      this.listBin = data.bin;
      this.itemsL = data.items;
    } else if (data.action === 'register') {
      this.lps = data.data;
      this.itemsG = data.items;
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
              return (x.fields.place.toLowerCase().includes(val.toLowerCase()) || x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
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
            return (x.fields.place.toLowerCase().includes(binCode.toLowerCase()) || x.fields.PLULPDocumentNo.toLowerCase().includes(binCode.toLowerCase()));
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
