import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-wms-item-journal',
  templateUrl: './wms-item-journal.page.html',
  styleUrls: ['./wms-item-journal.page.scss'],
})
export class WmsItemJournalPage implements OnInit {




  constructor(public router: Router) { }

  

  ngOnInit() {
  }


  back(){


    this.router.navigate(['page/main/modules']);
  }

  newLP(){


    console.log('new Lp');
  }

  newPallet(){


    console.log('new Pallet');

  }

  Details(){


    console.log('Details');

  }
}
