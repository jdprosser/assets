import { PouchAssetService } from './pouch.asset.service';
import { Injectable,
         OnInit } from '@angular/core';

/* StatusQueryService ==================================================================================
   Demonstrate retrieving a set of documents by their _id which we have composed as type name underscore
   https://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html feels wrong, but hey.
   Equivalent to Cherrywood type table. I'm not sure there's a place for these in a mobile app as its
   a codeset that influences program flow but some users will be on older versions. But they may be
   useful in a web SPA and I want to demonstrate the most straight forward data retrieval.

   Data immutable for life of service, we get it once and store it to array. So provide service at top
   of component tree to only get it once, or lower down if it may change in life of app session.
===================================================================================================== */
@Injectable()
export class StatusQueryService 
       implements OnInit {

   readonly TABLE_NAME: string = 'TypeAssetStatus_';                                                    // Documents with _id beginning with this string are codeset.

   data: any[];                                                                                         // Uninitialised so template shows loading msg until data available.
        
   constructor(private pouchAssetService: PouchAssetService) {}

   ngOnInit() {
       this.pouchAssetService.db.allDocs(
          { include_docs: true,
            startkey: this.TABLE_NAME,
            endkey: this.TABLE_NAME + '\uffff'}                                                         // https://github.com/pouchdb-community/pouchdb-quick-search#autosuggestions-and-prefix-search 
       )
       .then (                                                                                          // then store the data in local array
           result => {
              this.data = [];                                                                           // Initialise data array
              let docs = result.rows.map(                                                               // Erm, why declare docs?
                 row => {                                                                               // For each document (row)  
                    this.data.push(row.doc);                                                            // push it onto local data array.
                 }
              );                  
           }
        )
       .catch(error => console.log(error));
  }
}
