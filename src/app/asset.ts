export class Asset {
    assetID: number;
    serialNo: string;
    assetTypeID: number;
    assetStatusID: number;
}


export class AssetType {
    assetTypeID: number;
    name: string;
    desc: string;
}


export class AssetTransition {
   from: AssetStatus;
   to: AssetStatus;
}

export enum AssetStatus {
    working = 1,
    broken = 2,
    missing = 3,
    disposed = 4
}


export const ASSET_TRANSITIONS: AssetTransition [] = [
    {from: AssetStatus.working, to: AssetStatus.disposed},
    {from: AssetStatus.working, to: AssetStatus.missing},
    {from: AssetStatus.working, to: AssetStatus.broken},
    {from: AssetStatus.broken,  to: AssetStatus.disposed},
    {from: AssetStatus.missing, to: AssetStatus.disposed},
 ];
 