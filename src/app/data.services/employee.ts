
import { AllDocsAbstract } from '../pouch.services/alldocs.abstract';

export class EmployeeDS
       extends AllDocsAbstract {

   private TABLE_NAME: string = 'Employee_';

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

}
