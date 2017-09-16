import { NgModule } from '@angular/core';
import { Routes,
         RouterModule } from '@angular/router';

import { EmployeesComponent } from './employees.component';
import { AssetsComponent } from './assets.component';
import { AssetComponent } from './asset.component';
import { StatusComponent } from './status.component';
import { AddAssetComponent } from './add-asset.component';

const routes: Routes = [
   { path: 'assets',
     component: AssetsComponent
   },
   { path: 'asset/:id',
     component: AssetComponent
   },
   { path: 'employees',
     component: EmployeesComponent
   },
   { path: 'status',
   component: StatusComponent
 },
   { path: '',
     redirectTo: 'assets',
     pathMatch: 'full'
   },
   { path: "addAsset",
     component: AddAssetComponent
    }
];

@NgModule({
   imports: [ RouterModule.forRoot(routes)  ],
   exports: [RouterModule]
})
export class AppRoutingModule {}
