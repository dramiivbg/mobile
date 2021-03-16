import { Component, EventEmitter, OnDestroy, OnInit, Output, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { InterceptService } from '../services/intercept.service';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss']
})

export class FolderPage implements OnInit, OnDestroy {
  public folder: string;
  private subscription: Subscription;

  mission = '<no mission announced>';
  confirmed = false;
  announced = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private interceptService: InterceptService,
  ) { 
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnDestroy() {
    console.log('ONDESTRY')
    this.subscription.unsubscribe();
  }

  onClick() {
    let menu: any = [
      {
        title: 'JuanchoTest',
        url: '/folder/Inbox',
        icon: 'mail'
      }
    ];
    this.interceptService.modifyMenu(menu);
  }
}
