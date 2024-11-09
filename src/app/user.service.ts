import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL = 'assets/user.json';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseURL);
  }

  addUser(user: { name: string, email: string, role: string }): Observable<any> {
    return this.http.get<any[]>(this.baseURL).pipe(
      map(users => {
        const newUser = { ...user, id: users.length + 1 };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
      })
    );
  }


  updateUser(id: number, user: any): Observable<any> {
    return this.http.get<any[]>(this.baseURL).pipe(
      map(users => {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...user };
          this.saveUsers(users);
          return users[userIndex];
        }
        return null;
      })
    );
  }


  deleteUser(id: number): Observable<any> {
    return this.http.get<any[]>(this.baseURL).pipe(
      map(users => {
        const filteredUsers = users.filter(user => user.id !== id);
        this.saveUsers(filteredUsers);
        return { id };
      })
    );
  }

  private saveUsers(users: any[]): void {
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const fileReader = new FileReader();
    fileReader.readAsText(blob);
    fileReader.onload = () => {
      const jsonString = fileReader.result as string;
      this.http.post(this.baseURL, JSON.parse(jsonString)).subscribe();
    };
  }
}
