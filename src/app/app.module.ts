import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AssetsComponent } from './assets.component';
import { EmployeesComponent } from './employees.component';
import { AssetComponent } from './asset.component';
import { AddAssetComponent } from './add-asset.component';

import { AppRoutingModule } from './app.routing.module';

import { PouchAssetService } from './pouch.asset.service';

@NgModule({
  declarations: [
    AppComponent,
    AssetsComponent,
    EmployeesComponent,
    AssetComponent,
    AddAssetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [PouchAssetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
