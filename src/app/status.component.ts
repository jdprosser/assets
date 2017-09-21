import { Component,  ChangeDetectionStrategy} from '@angular/core';
import { TypeAssetStatusDS } from './data.services/TypeAssetStatus';
import { Observable } from 'rxjs/Observable';

/* StatusComponent =====================================================================================
   DESIGN: async in template not detecting changes. I'd like to resolve that id I can but for now
===================================================================================================== */
@Component({
  template:
  `<div> <!-- not loading.... yet -->
      <h2>Status codes A</h2>
      <h2>Concrete</h2>
      <ul class="assets">
      <li *ngFor="let subject of data | async">
         <span class="badge">{{subject.Name}}</span> {{subject._id}}
      </li>
   </ul>
   </div>`
  ,
  styleUrls: [],
  providers: [TypeAssetStatusDS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
   
  data: Observable<any> = this.typeAssetStatusDS.getObservable();

   constructor ( private typeAssetStatusDS: TypeAssetStatusDS ) {

    }

}
