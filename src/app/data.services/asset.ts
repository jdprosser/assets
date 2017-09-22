
import { AllDocsAbstract } from '../pouch.services/alldocs.abstract';

export class AssetDS
       extends AllDocsAbstract {
   
   private TABLE_NAME: string = 'Asset_';

   protected query(): any {
      return { 
         include_docs: true,
         startkey: this.TABLE_NAME,
         endkey: this.TABLE_NAME + '\uffff'
      };
   }


   // filter ===========================================================================================
   protected filter(doc: any): boolean {
      return doc._id.slice(this.TABLE_NAME.length)==this.TABLE_NAME;
   }

}
