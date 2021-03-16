import { Component, OnInit } from '@angular/core';
import { InterceptService } from 'src/app/services/intercept.service';

@Component({
  selector: 'btn-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  private obj: any = {};
  searchObj: any = {};
  listsFilter: Array<any> = [];
  lists: Array<any> = [];
  title: string;
  name: string;

  constructor(
    private interceptService: InterceptService
  ) {
    interceptService.searchShow$.subscribe(
      obj => {
        this.searchObj = obj;
        this.listsFilter = obj.data;
      }
    )
  }

  ngOnInit() {}

  onChange(e) {
    let val = e.target.value;
    this.listsFilter = this.lists.filter(
      x => {
        return (x.name.toLowerCase().indexOf(val.toLowerCase()) != -1);
      }
    )
  }

  onBack() {
    this.searchObj = {};
  }

  onClick(item) {
    this.searchObj.func(item.id, item.name);
    this.onBack();
  }

}
