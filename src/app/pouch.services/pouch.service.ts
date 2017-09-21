import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';


/* pouch.asset.service.ts ==============================================================================
   A service sitting on top of PouchDB hooked back into remote CouchDB.
   First pass based on https://www.joshmorony.com/offline-syncing-in-ionic-2-with-pouchdb-couchdb/
   Maintaining a local array of data synchronised to PouchDB which is in turn synced to CouchDB.
   
   What I don't know is why this intermediary is required, seems like it could introduce bugs.

   Our local operations sitting on Pouch REST ops take values from loca data and change Pouch which
   will propagate back around via the handleChange listener.

   Todo: Can we lose the intermediate data structure and sit service directly onto Pouch data?
===================================================================================================== */

@Injectable()
export class PouchService {

   db: any;
   changes: EventEmitter;

   /* constructor ======================================================================================
      Hook into (or create if not present) pouchdb and synchronise it with remote couchDB.
   ================================================================================================== */
   constructor() {
       this.db = new PouchDB('asset');   
       this.changes =
          this.db.changes (
             { live: true,
               since: 'now',
               include_docs: true }
          )
         .on('newListener', listener => console.log("New listener: " + listener))                       // Trace: can remove.
         .on('removeListener', listener => console.log("Removed listener: " + listener));               // Trace: can remove.

       const REMOTE: string  = 'http://localhost:5984/asset';   
       this.db.sync(REMOTE,
                   { live: true,
                     retry: true,
                     continuous: true});
   }


    /* create ===========================================================================================
      @param asset object to be written Pouch.

      DESIGN: The Josh Mohony example returned vois, just adding to the array. Something to be said for 
              that, do we even need to know anything other than success??
              Possibly so that we don't hang while it's saving. But, maybe that's a good thing, maybe
              we don't want to take them back to a page that doesn't actually show the thing they 
              just added? Good point.
   ================================================================================================== */
   post(asset): Promise <any> {
     return this.db.post(asset)
           .then(response => response);
   }


   /* update ===========================================================================================
      @param asset object from local array to be updated in Pouch. Identified by _id _rev.
      @warn  not yet handling revision conflict

      DESIGN: As for create, why do we need to return anything?
   ================================================================================================== */
   put(asset): Promise<any> {
     return this.db.put(asset)
           .then(response => response)
           .catch ( err => { console.log(err) } )
   }


   /* delete ===========================================================================================
      @param asset object from local array to be deleted fom Pouch. Identified by _id _rev.
      @warn  not yet handling revision conflict
   ================================================================================================== */
   remove(asset): Promise<any> {
      return this.db.remove(asset)
            .then(response => response)       
            .catch ( err => { console.log(err); } )
   }


   /* get ==============================================================================================
      @param _id PouchDB ID of the asset to retrieve
      @DESIGN This is definitely something that can fail if the item has just been deleted!!!!!!!!!!!
   ================================================================================================== */
   get(_id: string): Promise<any> {
      return this.db.get(_id)
     .then(doc => doc)
     .catch( err => console.log("Parrot:" + _id + err) );
   }
}