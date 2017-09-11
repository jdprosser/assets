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
