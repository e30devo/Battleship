# Battleship

## Authentication
### Validation
Basic validation is being applied when signing in or logging in. Regex is used to figure out if an email is valid and rudementary checks are in place for the password validation
#### Email
Here is the expression used to validate an email
```javascript
/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
```
A breakdown of what is being done.
```javascript
.test(email)
```
The test function takes an email arguement and checks it against the Regex. The test function returns a boolean value



```javascript
/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
```
* The first and last `/` are escape characters, required for the Regex to work
* `^` asserts position at the start of the string
* `\w` matches any word combination with numerical, capital or lowercase letters; `+` matches between 1 and infinite times
* ```([\.-]?\w+)*``` Matches the `.` and `.` character literally and matches between zero and one times; `\w+` matches any word character (equal to [a-zA-Z0-9_]) 
* ```(\.\w{2,3})``` Checks for anything starting with a `.` and will accept any combination of text that is either 2 or 3 characters long

#### Password
* On Sign up passwords must match and be greater than 7 characters long.
#### Error Handling
* Accounted for human errors are being checked for and prompted to the modal.
* Firebase auth errors are handled with switch statements
