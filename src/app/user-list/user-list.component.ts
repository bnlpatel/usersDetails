import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userList = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getUserList();
    this.userList.paginator = this.paginator;
    this.userList.sort = this.sort;
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });
  }

  getUserList() {
    this.userService.getUsers().subscribe((data: any) => {
      this.userList.data = data;
    });
  }

  editUser(id: any) {
    this.router.navigate(['/edit-user', id]);
  }

  deleteUser(id: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.userList.data = this.userList.data.filter(user => user.id !== id);
      });
    }
  }

  addUsers() {
    this.router.navigate(['/add-user']);
  }
}
