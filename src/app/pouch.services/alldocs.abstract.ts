import { PouchService } from './pouch.service';
import { Injectable, NgZone} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { OnDestroy } from '@angular/core';

/* =====================================================================================================
   DESIGN: How does template know when ready to display if returning initial empty array from Subject?
           Maybe go to regular Subject or offer a method or variable that template can call.
   TODO:   A DataService shared among components will hit getObservable and rebuild entire thing
           as each hops in whenreally you'd want to do that once per life cycle.
===================================================================================================== */
@Injectable()
export abstract class AllDocsAbstract
                implements OnDestroy {

   /* query ====================================================================== protected abstract ==
      Concrete sub class needs to implement this function returning object containing PouchDB options
      for allDocs https://pouchdb.com/api.html#batch_fetch
      DESIGN: I find I have to compose everything within the function as this refed to abstract class.
              Seem to be ways around that, but nothing I could immediately comprehend.
   ================================================================================================== */
   protected abstract query(): any;

   
   /* filter ===================================================================== protected abstract ==
      Function filters changed documents letting through only those that would satisfy by query()
      Design: Is there a better way to do this or is it simply how you roll for allDocs?
   ================================================================================================== */
   protected abstract filter(doc: any): boolean;
   

   /* compose ============================================================================= protected ==
      Each document returned by query() is a JSON doc that needs to be mapped to a Java object to be
      placed in data array sitting under the Observable. Default implementation pushes JSON in unchanged.
   ================================================================================================== */
   protected compose(doc: any): any {
      return doc;
   }


   /* compare ============================================================================= protected ==
      taking two elements in data array and returning <0 if a<b, 0 leave order >1 b<a.
   ================================================================================================== */
   protected compare(a: any, b: any): number {
      return 0;
   }


   /* getObservable ========================================================================== public ==
      return: observable containing data for query defined in concrete class.
      usage:  call this from Component to set a local Observable that will update when data changed 
   ================================================================================================== */
   getObservable(): Observable<any> {
      this.setData();
      return this.data$;
   }


   // Maintain a private array of query results updated for any changes to PouchDB. 
   // Order can and will change as onChange updates this array.
   private data: any[];

   // Emits new data$ observable when we call it's next method.
   private subject = new BehaviorSubject<any[]>([]);

   // Consumers subscribe to this Observable, commonly via the async pipe in a template.
   private data$: Observable <any[]> = this.subject.asObservable();
   

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
   private setData(): void {
      this.pouchService.db.allDocs (                                                             // Fetch documents
        this.query()                                                              
      )
     .then (                                                                                     // store docs in local array
         result => {
           this.data = [];                                                                       // Initialise data array
           result.rows.map(
              row => {                                                                           // For each document (row)  
                 this.data.push(this.compose(row.doc));                                          // push it onto local data array.
              }
           );
           // ASSERT: instance data array populated with documents returned by allDocs(myOptions)

           this.pouchService.changes
               .on('change', this.onChange);                                                     // Design: removeListener failed when using arrow notation!
           // ASSERT: onChange(change) listening to Pouch changes
         }
      )
     .then (() => this.subject.next(this.data.sort(this.compare)))
      // ASSERT: Subject has emitted new Observable
     .catch(error => console.log(error));
   }


   /* onChange =========================================================================================
      change: event https://nodejs.org/api/events.html#events_class_eventemitter describing change to DB
      void:   update local data array to reflect change and trigger Subject to emits now Observable.
      DESIGN: What happens when multiple changes? Does the event cycle protect us?
   ================================================================================================== */
   private onChange(change): void {
      var index: number = this.data.findIndex(
         doc => doc._id === change.doc._id
      );
      // ASSERT: Have searched data for document that changed.
console.log("change.doc._id:" + change.doc._id);
this.data.forEach(doc => console.log(doc._id));
      if (index != -1) {
         this.data.splice(index, 1)
      };
      // ASSERT: changed document is not (or no longer) present in data

      // Add it back if not just deleted and passes test
      if (! change.deleted
        && this.filter(change.doc)) {
         this.data.push(this.compose(change.doc));
      }
      // ngZone means we refresh when change, but also probably means we are checking entire component
      // tree whenever a new data items comes in. 
      this.ngZone.run(() => this.subject.next(this.data.sort(this.compare)));
   }


   /* ngOnDestroy ======================================================================================
      Warning: Don't call this, ever. Angular's OnDestroy calls it because its a Service, if that stops 
               being true then you'll have a memory leak. 
   ================================================================================================== */
   ngOnDestroy(): void {
      this.pouchService.changes.removeListener('change',
                                               this.onChange);
   }
}
