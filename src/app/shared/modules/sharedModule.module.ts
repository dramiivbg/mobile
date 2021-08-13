import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { VerFooterComponent } from 'src/app/components/ver-footer/ver-footer.component';

@NgModule({
 imports:      [ CommonModule ],
 declarations: [ HeaderComponent, VerFooterComponent ],
 exports:      [ HeaderComponent, VerFooterComponent ],
 schemas:      [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }