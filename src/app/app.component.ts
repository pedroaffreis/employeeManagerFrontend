import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  public employees: Employee[] | undefined;
  public editEmployee: Employee | undefined | null;
  public deleteEmployee: Employee | undefined | null;

  constructor(private employeeService: EmployeeService){}


  title = 'employeemanagerapp';  

  ngOnInit(){
    this.getEmployees();
  }

  public getEmployees():void{
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) =>{
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  //Method to handle the addition of a new employee
  public onAddEmployee(addForm: NgForm): void{
    const addEmployeeForm = document.getElementById('add-employee-form');
    if(addEmployeeForm){
      addEmployeeForm.click();
    }
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) =>{
        console.log(response);
        this.getEmployees(); //Retrieve all employees after adding new one
        addForm.reset; //Reset the form after successfull addition
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
        addForm.reset();
      }
    )
  }

  //To handle updating existing employee
  public onUpdateEmployee(employee: Employee): void{
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }      
    )
  }

  public onDeleteEmployee(employeeId: number | undefined): void{
    if(employeeId == undefined){
      return;
    }
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }   
    )
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    // Method to handle modal window for adding, editing or deleting an employee
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee; // Assign the employee to be edited to the editEmployee object
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee; // Assign the employee to be deleted to the deleteEmployee object
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    if(container){
      container.appendChild(button);
    }
    button.click();
  }

  public searchEmployees(key: string): void {
    // Method to search for employees based on a keyword
    console.log(key);
    if (!this.employees) {
      return;
    }
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee); // Add the matching employees to the results array
      }
    }
    this.employees = results; // Replace the component's employees array with the results array
    if (results.length === 0 || !key) {
      this.getEmployees(); // Retrieve all employees if the keyword is empty or no results are found
    }
  }
}

