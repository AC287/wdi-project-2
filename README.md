# wdi-project-2

Heroku deployment: https://glacial-lowlands-92714.herokuapp.com/

### Goal
* Create administrative page for teachers and students.
* Determine the role of user through class id input.
* Teachers can view all student data.
* Teachers can edit student data.
* Student can view their own data.

### Wireframe and ERD
![wireframe erd](./wdi-project-2_vF.png)

### Steps
* User info is recorded once entered.
* Javascript will determine role of user based on Class ID:
 * i.e. if class id has the word ```p & t```, the role is teacher.
 * i.e. else user role is student.
* Once role is determined, user info is stored in database table called ```users```.
* Logging in will direct users to appropriate route.
 * Teacher route can view student lists and can edit/delete.
 * Teacher can add assignments and assignments will assign to users with student role with corresponding class id. ```implementation in process```
 * Student route can only view their own profile.
 
---
