
import { AllDocsAbstract } from '../pouch.services/alldocs.abstract';

export class TypeAssetStatusDS
       extends AllDocsAbstract {

   private TABLE_NAME: string = 'TypeAssetStatus_';

   // query ============================================================================================
   protected query(): any {
      return { 
         include_docs: true,
         startkey: this.TABLE_NAME,
         endkey: this.TABLE_NAME + '\uffff'
      };
   }


   // filter ===========================================================================================
   protected filter(doc: any): boolean {
      return doc._id.slice(0, this.TABLE_NAME.length) == this.TABLE_NAME;
   }


   // compose ==========================================================================================
   protected compose(doc: any) {
      return {_id: doc._id,
              _rev: doc._rev,
              Name: doc.Name};
   }


   // compare ==========================================================================================
   protected compare(a: any, b: any): number {
      if (a.Name < b.Name) return -1;
      if (a.Name > b.Name) return 1;
      return 0;
   }

}
