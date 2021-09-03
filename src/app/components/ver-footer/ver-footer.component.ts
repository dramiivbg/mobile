import { Component, Input, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InterceptService } from '@svc/intercept.service';

@Component({
  selector: 'PlureVersion',
  templateUrl: './ver-footer.component.html',
  styleUrls: ['./ver-footer.component.scss'],
})
export class VerFooterComponent implements OnInit {
  public version: string = '';
  public showFooter: boolean = true;
  @Input() showVersion: number;

  constructor(private appVersion: AppVersion
    , private intServ: InterceptService
  ) { }

  ngOnInit() {
    this.getVersion();
    // this.intServ.showFooter$.subscribe(
    //   (bool) => {
    //     console.log(bool);
    //     this.showFooter = bool;
    //   }
    // )
  }

  getVersion(): void {
    this.appVersion.getVersionNumber().then(
      res => {
        this.version = `v${res}`;
      }
    ).catch(
      err => this.version = `v0.0`
    );
  }
}
