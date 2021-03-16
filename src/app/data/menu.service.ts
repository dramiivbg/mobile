import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {

  constructor() { }
  
  permissions() {};

  // Return menu.
  menuData(): any {
    return [
      {
        title: 'Inbox',
        url: '/folder/Inbox',
        icon: 'mail'
      },
      {
        title: 'Outbox',
        url: '/folder/Outbox',
        icon: 'paper-plane'
      },
      {
        title: 'Favorites',
        url: '/folder/Favorites',
        icon: 'heart'
      },
      {
        title: 'Archived',
        url: '/folder/Archived',
        icon: 'archive'
      },
      {
        title: 'Trash',
        url: '/folder/Trash',
        icon: 'trash'
      },
      {
        title: 'Spam',
        url: '/folder/Spam',
        icon: 'warning'
      }
    ];
  }

}
