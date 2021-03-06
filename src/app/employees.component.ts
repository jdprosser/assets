import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDS } from './data.services/employee';
import { Employee } from './employee';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [EmployeeDS]
})
export class EmployeesComponent {


  data$: Observable<any> = this.employeeDS.getObservable();

  // constructor =======================================================================================
  constructor(private router: Router,
              private employeeDS: EmployeeDS) { }


  /* navEmployee =======================================================================================
     Lets see how it goes composing and workin with Objects
  =================================================================================================== */
  navEmployee(employee: Employee) {
     this.router.navigate(['employee/', employee.employeeNo]);
  }

  // addAsset ==========================================================================================
  addEmployee(): void {
      this.router.navigate(['/addEmployee']);
   }

}
