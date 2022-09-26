import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterEvent } from '@angular/router';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-list-pallet',
  templateUrl: './list-pallet.component.html',
  styleUrls: ['./list-pallet.component.scss'],
})
export class ListPalletComponent implements OnInit {

  private routExtras: any;

  private listPallet: any;

  private wareReceipts: any;
  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router) {

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
        this.router.navigate(['page/wms/wmsMain'], { replaceUrl: true });
      }
    });
   }

  async ngOnInit() {



    this.wareReceipts = this.routExtras.wareReceipts; 

    this.listPallet = this.routExtras.pallet;

    this.intServ.loadingFunc(false);



    console.log(this.wareReceipts, this.listPallet);

    



  }


  public onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }


  listLpOrItems(item:any){



   let listItem: any[] = []

   let listLp: any[] = [];
   let listP: any[] = [];


   item.fields.filter((lp, index) => {


    if(lp.PLUType == 'LP'){

      listLp.push(item.fields[index]);


    }else if(lp.PLUType == 'Item'){


      listItem.push(item.fields[index])


    }else{


      listP.push( item.fields[index]);

    }
   })


    let navigationExtras: NavigationExtras = {
      state: {
        listItem, 
        listLp,
        listP,
        new: false
      },
      replaceUrl: true
    };
    this.router.navigate(['page/wms/lists'], navigationExtras);

    


  }

}
