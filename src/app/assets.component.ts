import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssetDS } from './data.services/asset';


@Component({
  selector: 'assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  providers: [AssetDS]
})
export class AssetsComponent {


  // constructor =======================================================================================
  constructor(private router: Router,
              private assetDS: AssetDS) { }


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
