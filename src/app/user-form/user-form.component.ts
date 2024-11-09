import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  addUserForm: FormGroup;
  userId: any;
  userList: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserData(this.userId);
    }
  }

  getUserData(id: any) {
    this.userService.getUsers().subscribe((users: any[]) => {
      console.log('Users from API:', users);
  
      const user = users.find(u => {
        console.log('User ID:', u.id);
        console.log('Comparing with ID:', id);
        return +u.id === +id; 
      });
  
      console.log('User found:', user);
      
      if (user) {
        this.addUserForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role
        });
        console.log('Form patched:', this.addUserForm.value);
      } else {
        console.log('User not found');
      }
    });
  }
  
  
  

  onSubmit() {
    if (this.addUserForm.valid) {
      const user = this.addUserForm.value;
      if (this.userId) {
        this.userService.updateUser(this.userId, user).subscribe({
          next: () => {
            this.addUserForm.reset();
            this.router.navigate(['/users']);
          },
          error: () => {
            // Handle error if needed
          }
        });
      } else {
        this.userService.addUser(user).subscribe({
          next: (addedUser) => {
            this.addUserForm.reset();
            
            this.router.navigate(['/users'])
            this.userList.push(addedUser);
            this.userList = [...this.userList]; 
          },
          error: () => {
            // Handle error if needed
          }
        });
      }
    }
  }
  
  

  goBack() {
    this._location.back();
  }
  

}
