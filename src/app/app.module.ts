import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, LocationStrategy,
  NgFor,
  NgIf,
  PathLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {  RouterModule } from '@angular/router';

import { NgbAlertModule, NgbDropdown, NgbModule, NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';


import { NavigationComponent } from './shared/header/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { LoginSignInComponent } from './LoginSignInComponent/login-sign-in/login-sign-in.component';
import { AuthInterceptor } from './intercepteur/auth.interceptor';
import { NgbdAlertBasicComponent } from "./component/alert/alert.component";
import { authenticationGuard } from './guard/authentication.guard';
import { NgbdDropdownBasicComponent } from './component/dropdown-collapse/dropdown-collapse.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPaginationModule } from 'ngx-pagination';
import { ForgetPasswordComponent } from './LoginSignInComponent/forget-password/forget-password.component';
import { InitiatePasswordComponent } from './LoginSignInComponent/initiate-password/initiate-password.component';
import { NotfoundComponent } from './404NotFound/notfound/notfound.component';
import { BadgeComponent } from './component/badge/badge.component';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent,
        LoginSignInComponent,
        NgbdDropdownBasicComponent,
        ForgetPasswordComponent,
        InitiatePasswordComponent,

        NotfoundComponent

    ],
    providers: [authenticationGuard,
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,

        },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        QRCodeModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        RouterModule.forRoot(Approutes, { useHash: false }),
        FullComponent,
        NavigationComponent,
        SidebarComponent,
        NgbdAlertBasicComponent,NgbPaginationModule,
        NgIf,NgFor,NgbDropdown,NgbAlertModule,NgxPaginationModule,FullCalendarModule
    ]
})
export class AppModule { }
