import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { IonicModule } from '@ionic/angular';
import { PublicComponent } from './public.component';
import { LoginPage } from './pages/login/login.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordPage } from './pages/change-password/change-password.page';
import { ChangeInstancePage } from './pages/change-instance/change-instance.page';
import { EnvironmentsPage } from './pages/environments/environments.page';


@NgModule({
  declarations: [
    PublicComponent,
    LoginPage,
    ChangePasswordPage,
    ChangeInstancePage,
    EnvironmentsPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
