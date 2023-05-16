import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WmsRoutingModule } from './wms-routing.module';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WmsMainPage } from './wms-main/wms-main.page';
import { WmsComponent } from './wms.component';
import { WmsReceiptPage } from './wms-receipt/wms-receipt.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverOptionsComponent } from '@prv/components/popover-options/popover-options.component';
import { LicensePlatesComponent } from './license-plates/license-plates.component';
import { PopoverLpsComponent} from '../../components/popover-lps/popover-lps.component';
import {AlertController} from '@ionic/angular';
import { EditPutAwayComponent } from '../../components/edit-put-away/edit-put-away.component';
import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { ListPItemsComponent } from '@prv/components/list-pitems/list-pitems.component';

import { BinToBinPage } from './bin-to-bin/bin-to-bin.page';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { WmsMovementPage } from './wms-movement/wms-movement.page';
import { WmsItemJournalPage } from './wms-item-journal/wms-item-journal.page';
import { WhitemReclassificationPage } from './whitem-reclassification/whitem-reclassification.page';
import { PopoverLpEmptyComponent } from '@prv/components/popover-lp-empty/popover-lp-empty.component';
import { WmsSplitMergePage } from './wms-split-merge/wms-split-merge.page';
import { PopoverMergeComponent } from '@prv/components/popover-merge/popover-merge.component';
import { PopoverSplitComponent } from '@prv/components/popover-split/popover-split.component';
import { PopoverOpionsLpComponent } from '@prv/components/popover-opions-lp/popover-opions-lp.component';
import { PopoverLpEditComponent } from '@prv/components/popover-lp-edit/popover-lp-edit.component';

import { PopoverLogLpComponent } from '@prv/components/popover-log-lp/popover-log-lp.component';
import { OptionsLpsOrItemsComponent } from '@prv/components/options-lps-or-items/options-lps-or-items.component';
import { SplitItemComponent } from '@prv/components/split-item/split-item.component';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';
import { PopoverShowInventoryComponent } from '@prv/components/popover-show-inventory/popover-show-inventory.component';
import { PopoverLocateComponent } from '@prv/components/popover-locate/popover-locate.component';
import { ModalShowLpsComponent } from '@prv/components/modal-show-lps/modal-show-lps.component';
import { ModalLpsConfirmComponent } from '@prv/components/modal-lps-confirm/modal-lps-confirm.component';
import { UpdateItemComponent } from '@prv/components/update-item/update-item.component';
import { PopoverSplitItemComponent } from '@prv/components/popover-split-item/popover-split-item.component';
import { PopoverItemTrakingComponent } from '@prv/components/popover-item-traking/popover-item-traking.component';
import { PopoverListSNComponent } from '@prv/components/popover-list-sn/popover-list-sn.component';
import { PopoverConfigurationCodeComponent } from '@prv/components/popover-configuration-code/popover-configuration-code.component';
import { PhysicalInventoryPage } from './physical-inventory/physical-inventory.page';
import { PopoverListSerialLpComponent } from '@prv/components/popover-list-serial-lp/popover-list-serial-lp.component';
import { PopoverSerialesLpComponent } from '@prv/components/popover-seriales-lp/popover-seriales-lp.component';
import { PopoverAddItemTrakingComponent } from '@prv/components/popover-add-item-traking/popover-add-item-traking.component';
import { PopoverCountingComponent } from '@prv/components/popover-counting/popover-counting.component';
import { PopoverShowSerialesComponent } from '@prv/components/popover-show-seriales/popover-show-seriales.component';
import { PhysicalCountComponent } from '@prv/components/physical-count/physical-count.component';
import { PhysicalNoCountComponent } from '@prv/components/physical-no-count/physical-no-count.component';
import { PopoverChildrensPalletComponent } from '@prv/components/popover-childrens-pallet/popover-childrens-pallet.component';
import { PopoverListLpComponent } from '@prv/components/popover-list-lp/popover-list-lp.component';
import { PopoverListPalletComponent } from '@prv/components/popover-list-pallet/popover-list-pallet.component';
import { PagueInquiriesComponent } from '@prv/components/pague-inquiries/pague-inquiries.component';
import { PopoverSelectPalletComponent } from '@prv/components/popover-select-pallet/popover-select-pallet.component';
import { PopoverSettingComponent } from '@prv/components/popover-setting/popover-setting.component';
import { SelectPalletItemComponent } from '@prv/components/select-pallet-item/select-pallet-item.component';





@NgModule({
    declarations: [
        WmsComponent,
        WmsMainPage,
        WmsReceiptPage,
        PopoverOptionsComponent,
        LicensePlatesComponent,
        PopoverLpsComponent,
        PopoverNewPalletComponent,
        ListPItemsComponent,
        OptionsLpsOrItemsComponent,
        WmsMovementPage,
        WmsItemJournalPage,
        WhitemReclassificationPage,
        PopoverLpEmptyComponent,
        PopoverLpEmptyComponent,
        WmsSplitMergePage,
        EditPutAwayComponent,
        PopoverMergeComponent,
        PopoverSplitComponent,
        PopoverOpionsLpComponent,
        PopoverLpEditComponent,
        PopoverLogLpComponent,
        SplitItemComponent,
        BinToBinPage,
        ListPalletComponent,
        PopoverShowInventoryComponent,
        PopoverLocateComponent,
        ModalShowLpsComponent,
        ModalLpsConfirmComponent,
        UpdateItemComponent,
        PopoverSplitItemComponent,
        PopoverItemTrakingComponent,
        PopoverListSNComponent,
        PopoverConfigurationCodeComponent,
        PhysicalInventoryPage,
        PopoverListSerialLpComponent,
        PopoverSerialesLpComponent,
        PopoverAddItemTrakingComponent,
        PopoverCountingComponent,
        PopoverShowSerialesComponent,
        PhysicalCountComponent,
        PhysicalNoCountComponent,
        PopoverChildrensPalletComponent,
        PopoverListLpComponent,
        PopoverListPalletComponent,
        PagueInquiriesComponent,
        PopoverSelectPalletComponent,
        PopoverSettingComponent,
        OptionsLpsOrItemsComponent,
        SelectPalletItemComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        WmsRoutingModule,
        SharedModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        BarcodeScanner,
        AlertController
    ]
})
export class WmsModule { }
