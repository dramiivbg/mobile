import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HeaderComponent } from '@prv/components/header/header.component';
import { SearchComponent } from '@prv/components/search/search.component';
import { VerFooterComponent } from 'src/app/components/ver-footer/ver-footer.component';

@NgModule({
 imports:      [ CommonModule ],
 declarations: [ HeaderComponent, VerFooterComponent,SearchComponent ],
 exports:      [ HeaderComponent, VerFooterComponent,SearchComponent],
 schemas:      [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }