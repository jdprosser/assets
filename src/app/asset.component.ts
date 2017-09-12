import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Asset, AssetStatus } from './asset';
import { AssetService } from './asset.service';
import { PouchAssetService } from './pouch.asset.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'asset',
  templateUrl: './asset.component.html',
  styleUrls: [],
  providers: [AssetService,
              PouchAssetService]
})
export class AssetComponent
       implements OnInit {

   asset: any;
   assetStatus = AssetStatus;                                                                           // https://stackoverflow.com/questions/35835984/how-to-use-a-typescript-enum-value-in-an-angular2-ngswitch-statement
   assetTypeName: string;
   actions: AssetStatus [];
   
   // controller =======================================================================================
   constructor(private route: ActivatedRoute,
               private assetService: AssetService,
               private pouchAssetService: PouchAssetService) {}

   // ngOnInit =========================================================================================
   ngOnInit() {
     this.route
         .paramMap
         .switchMap((params: ParamMap) => this.pouchAssetService.get(params.get('id')))
         .subscribe(asset => {
                       // set controller variables for selected asset
                       this.actions = this.assetService.getActions(asset.assetStatusID);
                       this.assetService.getAssetType(asset.assetTypeID)
                           .then(name => this.assetTypeName = name);
                       this.asset = asset;                                                              // Do this last as template displays once has value
                    });
   }
}
