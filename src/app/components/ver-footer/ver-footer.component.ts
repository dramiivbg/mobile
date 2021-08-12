import { Component, Input, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'PlureVersion',
  templateUrl: './ver-footer.component.html',
  styleUrls: ['./ver-footer.component.scss'],
})
export class VerFooterComponent implements OnInit {
  public version: string = '';
  @Input() showVersion: number;

  constructor(private appVersion: AppVersion
  ) { }

  ngOnInit() {
    this.getVersion();
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
