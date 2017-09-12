import { Asset,
         AssetStatus,
         AssetTransition,
         AssetType } from './asset';

export const ASSETS: Asset [] = [
   {assetID: 100,
    assetTypeID: 1000,
    serialNo: "MS-34345454",
    assetStatusID: AssetStatus.working
   },
   {assetID: 101,
    assetTypeID: 1000,
    serialNo: "MS-3434555",
    assetStatusID: AssetStatus.working
   },
   {assetID: 102,
    assetTypeID: 1000,
    serialNo: "MS-34345456",
    assetStatusID: AssetStatus.missing
   },
   {assetID: 103,
    assetTypeID: 1001,
    serialNo: "IPH-4545444",
    assetStatusID: AssetStatus.working
   },
   {assetID: 104,
    assetTypeID: 1002,
    serialNo: "DEL-454541",
    assetStatusID: AssetStatus.working
   },
   {assetID: 105,
    assetTypeID: 1002,
    serialNo: "DEL-454542",
    assetStatusID: AssetStatus.broken
   },
   {assetID: 106,
    assetTypeID: 1002,
    serialNo: "DEL-454543",
    assetStatusID: AssetStatus.disposed
   }
];


export const ASSETTYPE: AssetType[] = [
   {assetTypeID: 1000,
    name: "MS Surface Pro 4",
    desc: "Laptop including docking station"
   },
   {assetTypeID: 1001,
    name: "iPhone 8",
    desc: ""
   },
   {assetTypeID: 1002,
    name: "Dell 24 U2412M",
    desc: "UHD 24 inch monitor"
   }
];