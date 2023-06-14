import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CheckincheckoutComponent } from './checkincheckout/checkincheckout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ParkingManagerComponent } from './parking-manager/parking-manager.component';
import { ParkingUserComponent } from './parking-user/parking-user.component';

const routes: Routes = [
  { path: '', component: ParkingUserComponent },
  { path: 'checkin', component: CheckincheckoutComponent},
  { path: 'admin', component: ParkingManagerComponent, canActivate: [AuthGuard]},
  { path: 'checkincheckout', component: CheckincheckoutComponent},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }