import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LecServiceService } from '../services/lec-service.service';
import { contactNoLKR, emailValidator, fullNameValidator, lankanNicValidator, lecidValidator } from 'src/app/shared/data/customRegex (1)';


@Component({
  selector: 'app-lec-add',
  templateUrl: './lec-add.component.html',
  styleUrls: ['./lec-add.component.css']
})
export class LecAddComponent implements OnInit {


  submitted: boolean = false;
  lecList: any[] = [];
  lec_regForm!: FormGroup;
  isUpdate: boolean = false;
  lectureList: any[] = [];
  loading$: any;
  customerService: any;
  customerList: any;
  selectedId: any;

  get f() {
    return this.lec_regForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private lecservice: LecServiceService,
    private router:Router
  ) {

  }
  ngOnInit(): void {
    this.loading$ = this.asObservable();
    this.initForm();
    this.getList();
  }
  asObservable(): any {

  }

  // Get all details -- error occured

  getList(): void {
    this.lecservice.getAll().subscribe((res: any) => {
      this.lecList = Object.values(res).map((lecdata:any)=>{
        return lecdata;
      })
      console.log("this.lecList");
      console.log(this.lecList);
    });
  }


  initForm(): void {
    this.lec_regForm = this.fb.group({
      firstName: ['', [Validators.required,fullNameValidator]],
      lecId: ['', [Validators.required,lecidValidator]],
      email: ['', [Validators.required, Validators.email,emailValidator]],
      contactNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),contactNoLKR]],
      id: ['', [Validators.required,lankanNicValidator]],
      gender: ['', [Validators.required]],
      course: ['', [Validators.required]],
      address: ['', [Validators.required]],
      lane:[''],
      town:[''],
      city:[''],
      Deg: ['',[]],
      HD:['',[]],
      DIP:[''],
      AL:[''],
      // education:['']
 
    });
  }
  // To Submit

  Onsubmit(): void {

    this.submitted = true;
    console.log(this.lec_regForm.valid);
    if (this.lec_regForm.valid) {

      if(this.lec_regForm.value.Deg == 'null'||this.lec_regForm.value.Deg == ''){
        this.lec_regForm.get('Deg')?.setValue(false);
        this.lec_regForm.get('Deg')?.updateValueAndValidity()
      }
      if(this.lec_regForm.value.HD == 'null'||this.lec_regForm.value.HD == ''){
        this.lec_regForm.get('HD')?.setValue(false);
        this.lec_regForm.get('HD')?.updateValueAndValidity()
      }
      if(this.lec_regForm.value.DIP == 'null'||this.lec_regForm.value.DIP == ''){
        this.lec_regForm.get('DIP')?.setValue(false);
        this.lec_regForm.get('DIP')?.updateValueAndValidity()
      }
      if(this.lec_regForm.value.AL == 'null'||this.lec_regForm.value.AL == ''){
        this.lec_regForm.get('AL')?.setValue(false);
        this.lec_regForm.get('AL')?.updateValueAndValidity()
      }
      
      this.lecservice.create(this.lec_regForm.value).subscribe(res => {
        console.log("Record Inserted");
        alert("Data Add succesfully");
        this.getList();

      })
      // console.log(this.lec_regForm.value);
            this.lec_regForm.reset();
    }else{
      this.lec_regForm.reset;
      // this.lec_regForm.clearValidators;
    }
    console.log("alert"); 
  }
  // to update
  onUpdate(lec: any): void {
    this.isUpdate = true;
    this.selectedId = lec.id;
    let data:object;
    this.lec_regForm.patchValue({
      firstName: lec.firstName,
      lecId: lec.lecId,
      email: lec.email,
      id: lec.id,
      gender: lec.gender,
      course: lec.course,
      address: lec.address,
      lane:lec.lane,
      town:lec.town,
      city:lec.city,
      Deg: lec.Deg,
      HD:lec.HD,
      DIP:lec.DIP,
      AL:lec.AL,
      contactNo:lec.contactNo
    })
    this.getList();
  
  }
  // to delete
  onDelete(id: string): void {
    let isConfirm: boolean = confirm('Are You want to delete this record')
    if (isConfirm) {
      this.lecservice.delete(id).subscribe(res => {
        console.log(res);        
        this.getList();

      });
    }
  }
  // to cleare
  clearForm(): void {
    this.submitted = false;
    this.lec_regForm.clearValidators;
    this.lec_regForm.reset;
  }

  logout():void{
    this.router.navigate(['/welcome'])
  }
}