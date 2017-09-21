import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AssetsComponent } from './assets.component';
import { EmployeesComponent } from './employees.component';
import { AssetComponent } from './asset.component';
import { StatusComponent } from './status.component';
import { AddAssetComponent } from './add-asset.component';

import { AppRoutingModule } from './app.routing.module';

import { PouchService } from './pouch.services/pouch.service';
import { AllDocs }           from './pouch.services/alldocs';

@NgModule({
  declarations: [
    AppComponent,
    AssetsComponent,
    EmployeesComponent,
    AssetComponent,
    StatusComponent,
    AddAssetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ PouchService,
               AllDocs
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
