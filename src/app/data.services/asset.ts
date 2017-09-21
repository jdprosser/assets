
import { AllDocsAbstract } from '../pouch.services/alldocs.abstract';
import { PouchService } from '../pouch.services/pouch.service';
import { NgZone} from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AssetDS
       extends AllDocsAbstract {
      
   constructor( pouchService: PouchService,
                ngZone: NgZone ) {
      super(pouchService,
            ngZone);
      this.setData();
   }

   getObservable(): Observable<any> {
       return this.data$;
   }
   
   TABLE_NAME: string = 'Asset_';

   myOptions(): any {
       
      return { 
         include_docs: true,
         startkey: this.TABLE_NAME,
         endkey: this.TABLE_NAME + '\uffff'
      };
   }
}
