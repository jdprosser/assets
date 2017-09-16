/* Continuation of testing approaches. 
   This one based on http://blog.angular-university.io/onpush-change-detection-how-it-works/ 
   and I'm hoping it's enoough to get us going for Workforce app.

*/
import { Injectable,
         OnInit } from '@angular/core';
import { PouchAssetService } from './pouch.asset.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ObsAssetService {

    private assets = new BehaviorSubject<any>({what:"the hell"});
    assets$: Observable<any> = this.assets.asObservable();

    constructor (private pouchAssetService: PouchAssetService){}
       
    ngOnInit(): void {
       console.log("ObsAssetService ngOnInit");
    }

    getAssets(): Promise <any[]> {
        return this.pouchAssetService.getAssets();
      }
}