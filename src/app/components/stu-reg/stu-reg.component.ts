import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { StudentService } from '../services/student.service';
import { contactNoLKR, emailValidator, fullNameValidator, lankanNicValidator } from 'src/app/shared/data/customRegex (1)';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stu-reg',
  templateUrl: './stu-reg.component.html',
  styleUrls: ['./stu-reg.component.css']
})
export class StuRegComponent implements OnInit {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> | undefined;
  submitted: boolean = false;
  studentList: any[] = [];

  stu_regForm!: FormGroup;
  stuList: any[] = [];
  isUpdate: boolean = false;
  // selectId:string | undefined;

  get f() {
    return this.stu_regForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loading$ = this.loading.asObservable();
    this.initForm();
    this.getList();

  }
  getList(): void {
    this.studentService.getAll().subscribe(res  => {
      this.studentList = Object.values(res).map((data:any)=>{ 
        return data
      })
      console.log("this.studentList");
      console.log(this.studentList);

      
    })
  }
  // validations
  initForm(): void {
    this.stu_regForm = this.fb.group({
      fname: ['', [Validators.required,fullNameValidator]],
      lname: ['', [Validators.required,fullNameValidator]],
      email: ['', [Validators.required, Validators.email,Validators. maxLength,emailValidator]],
      contactNo: ['', [Validators.required,contactNoLKR]],
      id: ['', [Validators.required,lankanNicValidator]],
      gender: ['', [Validators.required]],
      course: ['', [Validators.required]],
      Address:['',],
      lane:[''],
      town:[''],
      city:['']
    })
  }

  // To Submit
  Onsubmit(): void {
  
    this.submitted = true;
    // console.log(this.stu_regForm);
    if (this.stu_regForm.valid) {

      this.studentService.create(this.stu_regForm.value).subscribe(res => {
        console.log("Record Inserted");
        // alert("Data Add succesfully");
        Swal.fire({
          text:'Data Added Succesfully',
          icon:'success'
      
        }); 
        // location.reload();
        this.getList();
      })
      console.log(this.stu_regForm.value);
    this.stu_regForm.reset();
    }else{
      this.stu_regForm.reset;
    }
    // console.log("alert"); 
  }


//   updateRecord():void{
// this.studentService.update(this.studentList.).subscribe(res=>{
//   alert("Data Update Succusfully")
// })
  // }


  // To delete
  onDelete(id: string): void {
    let isConfirm: boolean = confirm('Are You want to delete this record')
    if (isConfirm) {
      this.studentService.delete(id).subscribe(res => {
        console.log(res);
        // this.getList();
        Swal.fire({
          text:'Delete Succesfully',
          icon:'success'
      
        });
      });
    }
  }

  onUpdate(student: any ,el: HTMLElement): void {
    this.isUpdate = true;
    //  this.selectedId= student.id;

    this.stu_regForm.patchValue({
      fname: student.fname,
      lname: student.lname,
      email: student.email,
      contactNo: student.contactNo,
      id: student.id,
      gender:student.gender,
      course:student.course,
      Address:student.Address,
      lane:student.lane,
      town:student.town,
      city:student.city,
    })
    el.scrollIntoView();
  }


  updateData(){

    if (this.stu_regForm.valid) {
     this.studentService.update(this.stu_regForm.value,this.stu_regForm.value.id).subscribe(res => {
        console.log(res);
        this.getList();
        // alert("Data Update Succusfully")

        Swal.fire({
          text:'Update Succesfully',
          icon:'success'
      
        });  
      });
    }
  }
 

  // To cleare Form
  clearForm(): void {
    this.submitted = false;
    this.stu_regForm.clearValidators;

  }
  logout():void{
    this.router.navigate(['/welcome'])
  }

}

