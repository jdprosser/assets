import { Injectable } from '@angular/core';
import { Asset,
         AssetStatus,
         ASSET_TRANSITIONS,
         AssetType } from './asset';
import { ASSETS,
         ASSETTYPE } from './mock.assets';

@Injectable()
export class AssetService {

    getAssets(): Promise<Asset[]> {
        return Promise.resolve(ASSETS);
    }
    
    getAssetTypes(): Promise<AssetType[]> {
        return Promise.resolve(ASSETTYPE);
    }
    
    getAsset(assetID: number): Promise <Asset> {
       return this.getAssets().then(assets => {return assets.find(asset => asset.assetID===assetID)});
    }

    /* getAssetType ====================================================================================
       How one manages relational approach with object with JSON? Don't know so trying stuff out.
       At this point objects looking good, Angular certainly not afraid to use them.
       design Have gone with promise as assetType might change? Geez, not too often I'd have thought.
       design must be most inneficient way to do this possible.
    ================================================================================================= */
    getAssetType(assetTypeID: number): Promise <string> {
       return this.getAssetTypes().then(assetTypes => assetTypes.find(assetType => assetType.assetTypeID===assetTypeID)
                                                                .name);
    }
    

    /* getActions ======================================================================================
       @param  assetStatus status moving from
       @return assetStatus [] array of valid status you can move to from
       @design the mapping table will not change so we should be able to go without promises?
    ================================================================================================= */
    getActions(from: AssetStatus): AssetStatus [] {
       return ASSET_TRANSITIONS.filter(tran => tran.from==from)
                               .map(trans => trans.to);
    }
}