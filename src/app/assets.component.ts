import { Component,
         OnInit } from '@angular/core';
import { Asset } from './asset';
import { AssetService } from './asset.service';
import { DataView } from './data.view';
import { PouchAssetService } from './pouch.asset.service';
import { ObsAssetService } from './obs.asset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  providers: [AssetService,
              PouchAssetService,
              ObsAssetService]
})
export class AssetsComponent {

  assets: Asset [];
  pouchAssets: any [];

  dataView: any [];

  // constructor =======================================================================================
  constructor(private assetService: AssetService,
              private pouchAssetService: PouchAssetService,
              private obsAssetService: ObsAssetService,
              private router: Router) {
     console.log("AssetsComponent constructor");
  }

  
  ngOnInit(): void {
     console.log("AssetsComponent ngOnInit");
     this.getAssets();
     this.obsAssetService.getAssets()
         .then(data => { this.pouchAssets = data; } 
         );
     this.pouchAssetService.view("assets")
         .then(view => { this.dataView = view.data; }
         );
  }
  

tempLogPouchAssets(anArray: any[]): void {
   anArray.forEach(element => console.log(element))
}


  getAssets(): void {
    this.assetService.getAssets().then(fullfilled => this.assets = fullfilled);
  }

  /* navAsset ==========================================================================================
     DESIGN: can we got to point where dewaling with an Asset rather than any?
  =================================================================================================== */
  navAsset(_id: string) {
     this.router.navigate(['asset/', _id]);
  }
  
  // addAsset ==========================================================================================
  addAsset(): void {
      this.router.navigate(['/addAsset']);
   }
}
