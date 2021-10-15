import { Component, OnInit } from '@angular/core';
import { SalesService } from '@svc/Sales.service';

@Component({
  selector: 'app-posted-sales',
  templateUrl: './posted-sales.component.html',
  styleUrls: ['./posted-sales.component.scss'],
})
export class PostedSalesComponent implements OnInit {

  constructor(private salesService: SalesService
  ) { }

  public async ngOnInit() {}

  public async get() {

  }

  private async getPosted() {
    
  }

}
