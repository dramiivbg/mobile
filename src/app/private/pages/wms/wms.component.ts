import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';
import { SalesService } from '@svc/Sales.service';
import { AuthService } from '@svc/auth.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { OfflineService } from '@svc/offline.service';

@Component({
  selector: 'app-wms',
  templateUrl: './wms.component.html',
  styleUrls: ['./wms.component.scss'],
})
export class WmsComponent implements OnInit {

  constructor(
     private js: JsonService
    , private router: Router
    , private intServ: InterceptService) {

     }

  ngOnInit() {

   // this.asyncNetwork();
  }


 /* private asyncNetwork(): void {
    Network.addListener('networkStatusChange', async status => {
      let msg =  'You do not have internet access, please log on';
      console.log('conexion =>',status.connected);   
      if (!status.connected) {
        
        this.intServ.alertFunc(this.js.getAlert('alert', '', msg , () => {
          this.router.navigate(['page/main/modules']);
          
        }));
      } 
    });
  }
  */

}
