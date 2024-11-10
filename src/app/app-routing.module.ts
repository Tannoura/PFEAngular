import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginSignInComponent } from './LoginSignInComponent/login-sign-in/login-sign-in.component';
import { ModuleComponent } from './component/moduleComponent/module/module.component';
import { authenticationGuard } from './guard/authentication.guard';
import { ForgetPasswordComponent } from './LoginSignInComponent/forget-password/forget-password.component';
import { InitiatePasswordComponent } from './LoginSignInComponent/initiate-password/initiate-password.component';
import { NotfoundComponent } from './404NotFound/notfound/notfound.component';

export const Approutes: Routes = [
{path: 'loginRegister', component: LoginSignInComponent

},



  {
    path: '',

    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' ,},
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule),
      }
    ]
  },
   { path: 'modules',component: ModuleComponent},
   { path: 'forgetPassword',component: ForgetPasswordComponent},
   { path: 'initiatePassword',component: InitiatePasswordComponent},
   { path: '**',component: NotfoundComponent},


];
