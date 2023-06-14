import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParkingUserComponent } from './parking-user/parking-user.component';
import { ParkingManagerComponent } from './parking-manager/parking-manager.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { CarparkService } from './carpark.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { CheckincheckoutComponent } from './checkincheckout/checkincheckout.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ParkingUserComponent, ParkingManagerComponent, PageNotFoundComponent, CheckincheckoutComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, MatExpansionModule, ReactiveFormsModule],
  providers: [CarparkService],
  bootstrap: [AppComponent],
})
export class AppModule {}
