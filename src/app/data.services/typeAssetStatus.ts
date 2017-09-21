
import { AllDocsAbstract } from '../pouch.services/alldocs.abstract';
import { PouchService } from '../pouch.services/pouch.service';
import { NgZone} from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TypeAssetStatusDS
       extends AllDocsAbstract {

   constructor( pouchService: PouchService,
                ngZone: NgZone) {
      super(pouchService, ngZone);
   }

   TABLE_NAME: string = 'TypeAssetStatus_';

   getObservable(): Observable<any> {
    this.setData();
    return this.data$;
}

   myOptions(): any {
      return { 
         include_docs: true,
         startkey: this.TABLE_NAME,
         endkey: this.TABLE_NAME + '\uffff'
      };
   }   
}
