import { Component,
         OnInit } from '@angular/core';
import { Asset } from './asset';
import { AssetService } from './asset.service';
import { PouchAssetService } from './pouch.asset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  providers: [AssetService,
              PouchAssetService]
})
export class AssetsComponent {

  assets: Asset [];
  pouchAssets: any [];

  // constructor =======================================================================================
  constructor(private assetService: AssetService,
              private pouchAssetService: PouchAssetService,
              private router: Router) {}

  
  ngOnInit(): void {
     this.getAssets();
     this.pouchAssetService.getAssets()
         .then(data => {
                  console.log("assets.component ngOnInit() then data => ");
                  this.pouchAssets = data;
                  this.tempLogPouchAssets(data);
               } 
         );
  }
  

tempLogPouchAssets(anArray: any[]): void { // DELETE ME
console.log("== trace array ================================================");
anArray.forEach(element => console.log(element));}


  getAssets(): void {
    this.assetService.getAssets().then(fullfilled => this.assets = fullfilled);
  }

  // navAsset ==========================================================================================
  navAsset(asset: Asset) {
     this.router.navigate(['asset/', asset.assetID]);
  }
  
  // addAsset ==========================================================================================
  addAsset(): void {
      this.router.navigate(['/addAsset']);
   }
}
