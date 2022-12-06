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
import { empty, UnsubscriptionError } from 'rxjs';
import { ModalLpsConfirmComponent } from '../modal-lps-confirm/modal-lps-confirm.component';
import { PopoverSplitItemComponent } from '../popover-split-item/popover-split-item.component';

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


  public whsePutAway: any;

  public listPwL: any[] = [];
  public contador: number = 0;
  public lpsP: any = {}
  public scanLP: boolean = true;
  public scanBin: boolean = false;

  public groupItems: any[] = [];

  public split: any;

  public listBins: any[] = [];
  public pallet: any;

  public pallet2: any;

  public itemsL:any[] = [];

  public items: any[] = [];

  public bin: string = '';

  public binCode: any = '';
  public listBin: any[] = [];

  public listsFilter: any[] = [];
  public lists: any = [];
  public warePW: any = {};

  public initItem:any[] = [];

  public listItems:any[] = [];
  public barcodeScannerOptions: BarcodeScannerOptions
  public warePY: any;

  public QtyTake: number = 0;

  public QtyTotal: number = 0;



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
    console.log(this.whsePutAway, this.listPwL);
    this.warePY = await this.wmsService.ListPutAwayH(this.warePW);
    this.pallet = await  this.storage.get(`pallet ${this.pallet}`);
    this.itemsL = (await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) != undefined ||
          await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`) != null)? await this.storage.get(`itemsL ${this.whsePutAway.fields.No}`):[];

   this.listItems =  (await this.storage.get(`items ${this.whsePutAway.fields.No}`) != undefined || 
   await this.storage.get(`items ${this.whsePutAway.fields.No}`) != null)?  await this.storage.get(`items ${this.whsePutAway.fields.No}`): [];

   this.initItem = ( await this.storage.get(`init item ${this.whsePutAway.fields.No}`) != undefined ||
            await this.storage.get(`init item ${this.whsePutAway.fields.No}`) != null)? await this.storage.get(`init item ${this.whsePutAway.fields.No}`):[];
    this.initV = (await this.storage.get(`init ${this.whsePutAway.fields.No}`) != undefined
      || await this.storage.get(`init ${this.whsePutAway.fields.No}`) != null) ? await this.storage.get(`init ${this.whsePutAway.fields.No}`) : [];

    if (this.initV.length === 0) this.init();

    if (this.initV.length > 0) {
      this.QtyTotal = this.initV.length;   
    }
    this.intServ.loadingFunc(false);
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

    if(bin != undefined) this.bins = bin.Bins;
    


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
    let line: any = undefined;
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


        switch (line) {

          case null || undefined:
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('error', ' ', `The license plate ${code.toUpperCase()} does not exist on the Put Away`));

            break;

          default:

            if (this.listsFilter.length > 0) {

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

        

      }



    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  async onSubmit() {

    this.initV = await this.storage.get(`init ${this.whsePutAway.fields.No}`);

    if (this.initV.length !== this.lps.length) {

      let res: any[] = [];
      let qtyR = this.QtyTotal - this.lps.length;


      let lpR: any[] = [];

      this.initV.filter(lp => {

        let find = this.lps.filter(lpC => lpC.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo);

        let line = res.find(bin => bin === lp.fields.place);

        if ((find === null || find === undefined) && (line === null || line === undefined)) {

          res.push(lp.fields.place);

        }

      });




      console.log(res);
      console.log(this.initV);

      this.intServ.alertFunc(this.js.getAlert('alert2', 'Are you sure?', `The LP remaining (${qtyR}) will go to the FLOOR `, () => {
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
      this.split = await this.wmsService.Prepare_WarehousePutAway(this.warePY.fields.No);

      let list: any[] = [];

      this.initV.filter(Lp => {

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
      });

      try {

        let update = await this.wmsService.Update_Wsheput_Lines_V1(list);

        console.log(update);

        if (update.Error || update.error) throw new Error('An error occurred while serializing the json in Business Central');

        let postAway = await this.wmsService.Post_WarehousePutAways(this.warePY.fields.No);

        if (postAway.Error) throw new Error((postAway.Error === undefined) ? postAway.error.message : postAway.Error.Message);

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
  //  console.log('ls =>', lps);
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

        })
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

    let item = {

      take: "",
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
      place: "",
      ZoneCode: "",
      LineNo: "",


    }

    console.log(this.listPwL);

    this.listPwL.filter(async (items,index) =>  {

      //console.log(items);
      if(items.fields.ActionType === "Take"){

        item.take = items.fields.BinCode;
        item.BinTypeCode = items.fields.BinTypeCode;
        item.Description = items.fields.Description;
        item.DueDate = items.fields.DueDate;
        item.ExpirationDate = items.fields.ExpirationDate;
        item.ItemNo = items.fields.ItemNo;
        item.LocationCode = items.fields.LocationCode;
        item.LotNo = items.fields.LotNo;
        item.No = items.fields.No;
        item.Quantity = items.fields.Quantity;
        item.SerialNo = items.fields.SerialNo;
        item.SourceNo = items.fields.SourceNo;
        //item.place = 'STO-1';

        item.place = this.listPwL[index+1].fields.BinCode;
        item.ZoneCode = this.listPwL[index+1].fields.ZoneCode;
        item.LineNo = this.listPwL[index+1].fields.LineNo;

        let plure = await this.wmsService.GetItemInfo(item.ItemNo);
       let qty = await this.wmsService.GetItem(item.ItemNo);
        console.log('qty =>',qty);
        console.log(plure);
        if(plure.Managed_by_PlurE === false) this.initItem.push(item);

      //  console.log(this.listItems);

        item = {    
          take: "",
          BinTypeCode: "",
          Description: "",
          DueDate: "",
          ExpirationDate: null,
          ItemNo: "",
          LocationCode: "",
          LotNo: null,
          No: "",
          Quantity: 0,
          SerialNo: null,
          SourceNo: "",
          place: "",
          ZoneCode: "",
          LineNo: "",
         }
        
      }

      

    });

  
      this.storage.set(`init item ${this.whsePutAway.fields.No}`, this.initItem);


    this.intServ.loadingFunc(false);

  }


  public ascendant(){

    let aux;
 
  }

  public descendent(){


  }

  async onScanAll() {

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


     this.listItems = this.initItem;
      
    this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
    console.log(this.listItems);
    this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
    this.intServ.loadingFunc(false);

  }


  async onChangeBinI(Item:any,bin:any){

    this.initItem.filter(item => {

      if(Item.ItemNo === item.ItemNo) item.ItemNo = bin;

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
    this.storage.remove(`items ${this.whsePutAway.fields.No}`) 
    this.storage.remove(this.whsePutAway.fields.No);
    // this.storage.remove(`bins ${this.whsePutAway.fields.No}`);
    this.storage.remove(`init ${this.whsePutAway.fields.No}`);

  }


  onBarCodeConfirm() {

    if (this.listsFilter.length > 0 || this.listItems.length > 0) {
      this.barcodeScanner.scan().then(
        async (barCodeData) => {
          let code = barCodeData.text;

          let boolean = false;

          if (code != '') {

          let confirmBin = this.lps.find(lp => lp.fields.place === code.toUpperCase());
          let confirmBinI = this.itemsL.find(item => item.place === code.toUpperCase());
          this.intServ.loadingFunc(true);
          this.listsFilter.filter(lp => {

              if (lp.fields.place.toUpperCase() === code.toUpperCase()){
                this.lps.push(lp);
                boolean = true;
              }

            });

            this.initItem.filter(async item => {

              if (item.place.toUpperCase() === code.toUpperCase()){

                this.intServ.loadingFunc(false);
                const popoverI = await this.popoverController.create({
                  component: PopoverSplitItemComponent,
                  cssClass: 'popoverSplitItemComponent',
                  componentProps: {item},
                });
                await popoverI.present();
                boolean = true;

                const { data} = await popoverI.onWillDismiss();

                if(data.qty != null){

                  this.intServ.loadingFunc(true);
                  console.log(data);
                  try {


                    let list = {

                      No: data.item.No,
                      LocationCode: data.item.LocationCode,
                      LineNo:data.item.LineNo,
                      ItemNo: data.item.ItemNo,
                      BinCode: data.item.place,
                      QtyToHandle: data.qty

                    }

                    let res = await this.wmsService.SplitPutAwayLine(list);

                     list = {

                      No: "",
                      LocationCode: "",
                      LineNo:"",
                      ItemNo:"",
                      BinCode: "",
                      QtyToHandle:0

                    }
                    if(res.Error) throw new Error(res.Error.Message);

                    if(res.error) throw new Error(res.error.message);

                    if(res.message) throw new Error(res.message);

                   console.log('res =>',res);

                    let obj = [{

                      ActivityType: 1,
                      No: data.item.No,
                      ItemNo: data.item.ItemNo,
                      LineNo: data.item.LineNo,
                      ZoneCode: data.item.ZoneCode,
                      LocationCode: data.item.LocationCode,
                      BinCode: data.item.place,
                      Quantity: res.WarehousePutAwayLines[1].Quantity
                    }];


                    let update = await this.wmsService.Update_Wsheput_Lines_V2(obj);
                    
                    if(update.Error) throw new Error(update.Error.Message);
                    if(update.error) throw new Error(update.error.message);
                    if(update.message) throw new Error(update.message);
                    
                        this.listItems.filter((Item, index) => {
      
                        if (Item.ItemNo === data.item.ItemNo) {
                          this.listItems.splice(index, 1);
                        }
                      });
      

                    data.item.Quantity = res.WarehousePutAwayLines[0].Quantity;

                    this.itemsL.push(data.item);

                    data.item.Quantity = res.WarehousePutAwayLines[1].Quantity;

                    this.listItems.push(data.item);

                    this.storage.set(`items ${this.whsePutAway.fields.No}`, this.listItems);
                    this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemsL); 

                       console.log('update',update);


                    
                  } catch (error) {

                    this.intServ.loadingFunc(false);
                    this.intServ.alertFunc(this.js.getAlert('error',' ', error.message));
                    
                  }
                }
              }

            });

            console.log(this.itemsL);

            console.log(this.lps);

            console.log(this.listItems);

            if (this.lps.length > 0 || this.itemsL.length > 0) {

              this.lps.filter((lpC) => {

                this.listsFilter.filter((lp, index) => {

                  if (lpC.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo) {
                    this.listsFilter.splice(index, 1);
                  }
                });

              });
            

              if (((confirmBin === undefined || confirmBin === null) || (confirmBinI === undefined || confirmBinI === null)) && boolean ) {

                this.intServ.loadingFunc(false);
                this.intServ.alertFunc(this.js.getAlert('success', ' ', `The bin ${code.toUpperCase()} has been successfully confirmed. `));
                this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);
                this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
                this.listT = await this.storage.get(this.whsePutAway.fields.No);
              

            }else if((confirmBin != undefined ||  confirmBinI != undefined) &&  boolean){

              this.intServ.loadingFunc(false);
              this.intServ.alertFunc(this.js.getAlert('success', ' ', `The bin ${code.toUpperCase()} has been successfully confirmed. `));
              this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);
              this.storage.set(this.whsePutAway.fields.No, this.listsFilter);
              this.listT = await this.storage.get(this.whsePutAway.fields.No);
            }
              else if((confirmBin != undefined || confirmBinI != undefined ) && !boolean){
              this.intServ.loadingFunc(false);
              this.intServ.alertFunc(this.js.getAlert('alert', '', `The bin ${code.toUpperCase()} has been confirmed`));
            }else{

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
    if (data.action === undefined) {

      this.lps = data.data;
     // this.QtyTake = this.listsFilter.length - this.lps.length;
      this.listBin = data.bin;
      this.itemsL = data.items;
    } else if (data.action === 'register') {

      this.onSubmit();
      this.lps = data.data;
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
        console.log(this.listsFilter, binCode);

        break;
    }

  }

}
