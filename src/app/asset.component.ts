import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Asset, AssetStatus } from './asset';
import { AssetService } from './asset.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'asset',
  templateUrl: './asset.component.html',
  styleUrls: [],
  providers: [AssetService]
})
export class AssetComponent
       implements OnInit {

   assetStatus = AssetStatus;                                                                           // https://stackoverflow.com/questions/35835984/how-to-use-a-typescript-enum-value-in-an-angular2-ngswitch-statement
   asset: Asset;
   assetTypeName: string;
   actions: AssetStatus [];

   constructor(private route: ActivatedRoute,
               private assetService: AssetService) {}

   ngOnInit() {
     this.route
         .paramMap
         .switchMap((params: ParamMap) => this.assetService.getAsset(+params.get('id')))
         .subscribe(asset => {this.asset = asset;
                              this.actions = this.assetService.getActions(this.asset.assetStatusID);
                              // OK, so next line works but if things running slow does it just mean no title for a bit?
                              this.assetService.getAssetType(this.asset.assetTypeID)
                                  .then(name => this.assetTypeName = name)});
   }
}
