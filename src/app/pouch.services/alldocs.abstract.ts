import { PouchService } from './pouch.service';
import { Injectable, NgZone} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { OnDestroy } from '@angular/core';

/* =====================================================================================================
   DESIGN: How does template know when ready to display if returning initial empty array from Subject?
           Maybe go to regular Subject or offer a method or variable that template can call.
===================================================================================================== */
@Injectable()
export abstract class AllDocsAbstract
                implements OnDestroy {

   /* myOptions ============================================================================ abstract ==
      Concrete sub class needs to implement this function returning object containing PouchDB options
      for allDocs https://pouchdb.com/api.html#batch_fetch
      DESIGN: I find I have to compose everything within the function as this refed to abstract class.
              Seem to be ways around that, but nothing I could immediately comprehend.
   ================================================================================================== */
   abstract myOptions(): any;

   // Maintain a private array of query results updated for any changes to PouchDB. 
   // Order can and will change as onChange updates this array.
   private data: any[];

   // Emits new data$ observable when we call it's next method.
   private subject = new BehaviorSubject<any[]>([]);

   // Consumers subscribe to this Observable, commonly via the async pipe in a template.
   data$: Observable <any[]> = this.subject.asObservable();
   

   /* constructor ======================================================================================
      Warning: setData calls abstract myOptions() which I would? fail if occured before constructor 
               returned. If I'm right it's only the asynchronous code pushing onto event stack saving us.
      Design:  Consider concrete classes passing config into constructor. That will mean also passing
               in PouchService so consider whether this gives up benefits of Angular DI. It may
               not as each query would be DI PouchService and then passing on.
   ================================================================================================== */
   constructor(private pouchService: PouchService,
               private ngZone: NgZone) {
     this.onChange = this.onChange.bind(this);                                                          // Maintain this refernce to this instance in event emitter

     //this.data$.subscribe(value => console.log('data$ received new Subject value'));
   }


   /* setData ==========================================================================================
      Retrieve documents conforming to config supplied by myOptions() and write them to local data.
      Hook up onChange to any changes emitted by PouchDB.
   ================================================================================================== */
   protected setData(): void {
      this.pouchService.db.allDocs (                                                             // Fetch documents
        this.myOptions()                                                              
      )
     .then (                                                                                     // store docs in local array
         result => {
           this.data = [];                                                                       // Initialise data array
           result.rows.map(
              row => {                                                                           // For each document (row)  
                 this.data.push(row.doc);                                                        // push it onto local data array.
              }
           );
           // ASSERT: instance data array populated with documents returned by allDocs(myOptions)

           this.pouchService.changes
               .on('change', this.onChange);                                                     // Design: removeListener failed when using arrow notation!
           // ASSERT: onChange(change) listening to Pouch changes
         }
      )
     .then (() => this.subject.next(this.data))
      // ASSERT: Subject has emitted new Observable
     .catch(error => console.log(error));
   }


   /* onChange =========================================================================================
      change: event https://nodejs.org/api/events.html#events_class_eventemitter describing change to DB
      void:   update local data array to reflect change and trigger Subject to emits now Observable.
      DESIGN: What happens when multiple changes? Does the event cycle protect us?
   ================================================================================================== */
   onChange(change): void {
      var index: number = this.data.findIndex(
         doc => doc._id === change.doc._id
      );
      // ASSERT: Have searched data for document that changed.

      if (index != -1) {
         this.data.splice(index, 1)
      };
      // ASSERT: changed document is not present in data

      // Add it back if not just deleted and passes test
      if (! change.deleted) {
         this.data.push(change.doc);
      }
      // ngZone means we refresh when change, but also probably means we are checking entire component
      // tree whenever a new data items comes in. 
      this.ngZone.run(() => this.subject.next(this.data));
   }


   /* ngOnDestroy ======================================================================================
      Warning: refactor this class as something other than a service & you'll introduce a memory leak.
   ================================================================================================== */
   ngOnDestroy(): void {
      this.pouchService.changes.removeListener('change',
                                               this.onChange);
   }
}
