import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage implements OnInit {
  grid: boolean = false;
  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onGrid(b) {
    this.grid = b;
  }

  onSales() {
    this.router.navigate(['sales/sales-main']);
  }

}
