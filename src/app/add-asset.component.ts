import 'rxjs/add/operator/switchMap';
import { Component } from '@angular/core';
import { Asset,
         AssetStatus } from './asset';
import { PouchAssetService } from './pouch.asset.service';
import { Location } from '@angular/common';

@Component({
  templateUrl: './add-asset.component.html',
  styleUrls: []
})
export class AddAssetComponent {
   
   asset: Asset = new Asset();

   constructor (private location: Location,
                private pouchAssetService: PouchAssetService) {}
  

   /* save =============================================================================================
      Saving the new asset into PouchDB. Presently using Promises but what does that actually mean
      in a practical sense? Since we are storing to local maybe we just go with writing it to Pouch
      and then going back to location once done. Struggle to see the difference at this point, it's not
      like the Pouch is going to take a long time.
   ================================================================================================== */
   save(): void {
     this.asset.assetStatusID = AssetStatus['working'];
     this.pouchAssetService
         .create(this.asset)
         .then(() => this.location.back())
   }
}