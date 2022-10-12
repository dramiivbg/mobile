import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { PopoverLpEmptyComponent } from '@prv/components/popover-lp-empty/popover-lp-empty.component';
import { InterceptService } from '@svc/intercept.service';

@Component({
  selector: 'app-wms-item-journal',
  templateUrl: './wms-item-journal.page.html',
  styleUrls: ['./wms-item-journal.page.scss'],
})
export class WmsItemJournalPage implements OnInit {




  constructor(public router: Router, public popoverController: PopoverController, private intServ: InterceptService) { }

  

  ngOnInit() {
  }


  back(){


    this.router.navigate(['page/main/modules']);
  }

 async newLP(ev){



  this.intServ.loadingFunc(true);

    const popover = await this.popoverController.create({
      component: PopoverLpEmptyComponent,
      cssClass: 'popoverLpEmptyComponent',
      event: ev,
      translucent: true,
    
      backdropDismiss: false
    });
   
    this.intServ.loadingFunc(false);
    
    await popover.present();
    const { data } = await popover.onDidDismiss();


  

  }

  newPallet(){


    console.log('new Pallet');

  }

  Details(){


    console.log('Details');

  }
}
