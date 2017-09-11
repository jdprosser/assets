import { Component,
         OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'assets',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [EmployeeService]
})
export class EmployeesComponent {

  employees: Employee [];
  selected: Employee;  // NO LONGER USED?

  constructor(private employeeService: EmployeeService,
              private router: Router) {}

  ngOnInit(): void {
     this.getEmployees();
  }
  
  getEmployees(): void {
    this.employeeService.getEmployees().then(fullfilled => this.employees = fullfilled);
  }

  navEmployee(employee: Employee) {
     this.router.navigate(['employee/', employee.employeeNo]);
  }
}
