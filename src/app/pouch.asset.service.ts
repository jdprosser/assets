import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { DataView } from './data.view';


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
export class PouchAssetService {

   db: any;
   data: any [];

   dataViews: DataView[] = [];


   /* constructor ======================================================================================
      Hook into (or create if not present) pouchdb and synchronise it with remote couchDB.
   ================================================================================================== */
   constructor() {
       this.db = new PouchDB('asset');   

       const REMOTE: string  = 'http://localhost:5984/asset';   
       let options = {
           live: true,
           retry: true,
           continuous: true
       };
       this.db.sync(REMOTE,
                    options);
   }


   /* getAssets ========================================================================================
      Initialize local data structure with PouchDB data and set up listener to maintain consistency.
      This allows us to present components with a synchronous view of asynchronous data?
      ResolvedCND: this.data populated with PouchDB documents
                   any subsequent changes are handled by listener handleChange()
      warn: could a CouchDB update could slip through the getAssets crack between all & listener?
      design: would it be better to push this work into constructor or initializer?
   ================================================================================================== */
   getAssets(): Promise <any[]> {
      if (this.data) {
      return Promise.resolve(this.data); }                                                              // Array already initiaised so return it.

      // ASSERT: local this.data has not been initialised from PouchDB.
      return new Promise (
         resolve => {                                                                                   // Read in data and callback Promise resolve
            this.db.allDocs (                                                                           // Fetch all PouchDB documents
               { include_docs: true }                                                                   // Whole document (not just id) Tons other options.
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
                  this.db.changes({ live:true,
                                    since: 'now',
                                    include_docs: true })
                 .on('change', change => this.handleChange(change));
                 // ASSERT: Have registered listener to keep this.data consistent with Pouch changes.
               }
            )
           .catch(error => console.log(error));
         }
      )
   }





   /* handleChange =====================================================================================
      callback listener handles node change event generated by PouchDB.
      @param  change PouchDB object describing the change to the DB.
      @return void anything you return will be ignored as per design of node events.
      @design triggered by changes we make to PouchDB and changes sychronised in from CouchDB.
      @see: https://nodejs.org/api/events.html
            https://pouchdb.com/guides/changes.html
      @warn surely this is the most inneficient way possible to do this. Would appear to process entire
            local data array every time anything changes. That can't be good.
      @warn Can we be certain that the index position we find is the same when we come to delete?
   ================================================================================================== */
   handleChange(change): void {
      // Locate document changed in loca data array if exists
      let changedDoc = null;
      let changedIndex = null;
      this.data.forEach(
         (doc,
          index) => {
            if (doc._id === change.id) {
               changedDoc = doc;
               changedIndex = index;
            }
         }
      );
      // Now propagate the change
      if (change.deleted) {
          this.data.splice(changedIndex, 
                           1);
      }
      else {
          if (changedDoc) {
              this.data[changedIndex] = change.doc;
          }
          else {
             // ASSERT: A document has been added
             this.data.push(change.doc);
   }  }  }


   /* view =============================================================================================
      Don't really know what I'm doing. I want to be able to return View objects that provide an array
      that is maintaned by this class and allows (or disallows) CRUD.
   ================================================================================================== */
   view(name: string): Promise<DataView> { 
      var data: any[] = [];
      var view: DataView;

      return new Promise (
         resolve => {                                                                                   // Read in data and callback Promise resolve
            this.db.allDocs (                                                                           // Fetch all PouchDB documents
               { include_docs: true }                                                                   // Whole document (not just id) Tons other options.
            )
           .then (                                                                                      // then store the data in local array
               result => {
                  let docs = result.rows.map(                                                           // Erm, why declare docs?
                     row => {                                                                           // For each document (row)  
                        data.push(row.doc);                                                             // push it onto local data array.
                     }
                  );
                  // ASSERT: have initialised data array with PouchDB data.
                  view = new DataView(name,
                                      data);
                  this.dataViews.push(view);
                  resolve(view);                                                                        // callback Promise confirming resolved.
                  this.db.changes({ live:true,
                                    since: 'now',
                                    include_docs: true })
                 .on('change', change => this.viewHandleChange(change));
                 // ASSERT: Have registered listener to keep this.data consistent with Pouch changes.
               }
            )
           .catch(error => console.log(error));
         }
      )
   }
   
   // WARN: Going to be synchronisation issues?
   // Still 98% inefficient
   viewHandleChange(change): void {
      this.dataViews.forEach(
        view => {
           console.log(change.id + " : " + change.seq + " : " + change.changes.length + " : " + change.doc._id);
           // Delete current old version if is one.

           var index: number = view.data.findIndex(doc => {
            console.log("Compare:"+doc._id +":"+change.doc._id);
            return doc._id === change.doc._id;
           }
          );
           if (index != -1) {console.log("found index:" + index);
                                         view.data.splice(index,
                                                          1)};
           // Add it back if not just deleted and passes test
           if (! change.deleted) {view.data.push(change.doc);}
        }
      );
   }

    /* create ===========================================================================================
      @param asset object to be written Pouch.

      DESIGN: The Josh Mohony example returned vois, just adding to the array. Something to be said for 
              that, do we even need to know anything other than success??
              Possibly so that we don't hang while it's saving. But, maybe that's a good thing, maybe
              we don't want to take them back to a page that doesn't actually show the thing they 
              just added? Good point.
   ================================================================================================== */
   create(asset): Promise <any> {
     return this.db.post(asset)
    .then(response => response);
   }


   /* update ===========================================================================================
      @param asset object from local array to be updated in Pouch. Identified by _id _rev.
      @warn  not yet handling revision conflict

      DESIGN: As for create, why do we need to return anything?
   ================================================================================================== */
   update(asset): Promise<any> {
     return this.db.put(asset)
     .then(response => response)
     .catch ( err => { console.log(err) } )
   }


   /* delete ===========================================================================================
      @param asset object from local array to be deleted fom Pouch. Identified by _id _rev.
      @warn  not yet handling revision conflict
   ================================================================================================== */
   delete(asset) {
      this.db.remove(asset)
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