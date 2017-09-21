
import { AllDocsAbstract } from '../pouch.services/alldocs.abstract';
import { PouchService } from '../pouch.services/pouch.service';
import { NgZone} from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()
export class EmployeeDS
       extends AllDocsAbstract {
   
   constructor( pouchService: PouchService,
                ngZone: NgZone ) {
      super(pouchService,
            ngZone);
      this.setData();
   }

   TABLE_NAME: string = 'Employee_';

   myOptions(): any {
      return { 
         include_docs: true,
         startkey: this.TABLE_NAME,
         endkey: this.TABLE_NAME + '\uffff'
      };
   }
}
