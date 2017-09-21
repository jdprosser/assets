import { PouchService } from './pouch.service';
import { Injectable} from '@angular/core';

/* StatusQueryService ==================================================================================
   Demonstrate retrieving a set of documents by their _id which we have composed as type name underscore
   https://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html feels wrong, but hey.
   Equivalent to Cherrywood type table. I'm not sure there's a place for these in a mobile app as its
   a codeset that influences program flow but some users will be on older versions. But they may be
   useful in a web SPA and I want to demonstrate the most straight forward data retrieval.

   Data immutable for life of service, we get it once and store it to array. So provide service at top
   of component tree to only get it once, or lower down if it may change in life of app session.

   DESIGN: Maybe declare as abstract with abstract method config return object and then our specific
           data services just extend this providing that function.
===================================================================================================== */
@Injectable()
export class AllDocs {

   data: any[];                                                                                         // Uninitialised so template shows loading msg until data available.      
   constructor(private pouchService: PouchService) {}


   /* getStaticData ====================================================================================
      I tried to do this in constructor, but Promises and Javascript event loop means your service is 
      returned before the data, so better to acknowledge that by offering a Promise method. 
     
      Design: This service offers a view of services as found when this method called.
   ================================================================================================== */
   getStaticData(config: any): Promise<any[]> {
      if (this.data) {
        return Promise.resolve(this.data);                                                              // Array already initiaised so return it.
      }
      // ASSERT: local this.data has not been initialised from PouchDB.
      return new Promise (
         resolve => {                                                                                   // Read in data and callback Promise resolve
            this.pouchService.db.allDocs (                                                              // Fetch AssetStatus documents
               config                                                                  
            )
           .then (                                                                                      // then store the data in local array
               result => {
                  this.data = [];                                                                       // Initialise data array
                  let docs = result.rows.map(                                                           // Erm, why declare docs?
                     row => {                                                                           // For each document (row)  
                        this.data.push(row.doc);                                                        // push it onto local data array.
                     }
                  );
                  // ASSERT: have initialised local data structure with PouchDB data.
                  resolve(this.data);                                                                   // callback Promise confirming resolved.
               }
            )
           .catch(error => console.log(error));
         }
      )
   }
}
