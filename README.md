# Notes
## 1.	How to run your application
Once the project is cloned from GitHub, the following steps ate to be taken in order to run the application:
* First step is to install the packages:
   ```console 
   npm install
   ```
   It is possible that some of the packages will not be installed after running this command above. In this case, please install individual package (those are not installed) with the following command:
   e.g. 
   ```console 
   npm install dotenv
   ```

* After install all the packages, the next step is to check the file database/connection.js. For running the apis or testing them with jest, the variable dbName will need to change.

   If running the apis, we use:
   ```console 
   let dbName = process.env.DATABASE_NAME || ‘’;
   ```

   If testing with jest, we use:
   ```console
   let dbName = ‘notes-test’;
   ```

* Once the changes are made accordingly,

   To run the apis, use the following command:
   ```console
   npm run start
   ```

   To run all the tests:
   ```console
   npm run test
   ```

## 2.	Instructions to the UX team (i.e., how to use your API)
The application implements Rest API. As well as creating endpoints for handling personal notes, there are also endpoints for the user. 
First, the document will talk about the methods and endpoints created for handling the users in the application:
-	POST http://localhost:3000/api/users/join
The api above is implemented for the purpose of the user to sign up and have their details saved in the database. To use this api, you will need to pass the following details in an object as key: name, password, passwordConfirmation and email. 

For example, the body of the request can look like this:
{name: ‘Joe’, password: ‘Something90’, passwordConfirmation: ‘Something90’, email: ‘joeDoe@something.com’}

-	POST http://localhost:3000/api/users/login
Use the api above for logging into the application. A request is made with an object containing email and password of the user. 

For example:
{email: ‘joeDoe@something.com’, password: ‘Something90’}

-	GET http://localhost:3000/api/users/logout
A request, here, does not need to have any values passed to it. The purpose of this api is to log the user out of the application.

As for the personal notes apis which is the focus of this assessment, the following methods/endpoints were created:
-	POST http://localhost:3000/api/notes
With the api above, the user can upload notes to the database. A request is made with an object containing note and, optionally, the status. Although, by default, the status is set to active (opposite of archive). 
For example:
{note: ‘some note…’ }

The note must be of at least 60 characters minimum before it is saved in the database.

-	PUT http://localhost:3000/api/notes/:noteId
This endpoint is used for updating saved notes. To use the api, an id of the note to be updated is passed to the endpoint in the place ‘:noteId’. Currently, to get the id, you can have a look at the database. The request is also made with a body containing note and status (optional). 

For example: 
{note: ‘some note…’}

-	DELETE http://localhost:3000/api/notes/:noteId
To delete a note, use this api with id (of the note to be deleted) passed as a parameter to the URI. As explained in the previous endpoint, one can obtain the id of the note to be delete from the database.

-	PATCH http://localhost:3000/api/notes/:status/:noteId
To update the status of a particular note, one should make use of this api with status and id (of the note to be updated) passed as parameters. The status passed to the URI will be status that the note retrieved will be changed to. It should also be mentioned that the status is active (unarchive note) or archive.

-	GET http://localhost:3000/api/notes/:status
Finally, to retrieve the notes that are either archived or not, make use of this api with the status passed as parameter in the URI. 
So:
o	For unarchive notes: http://localhost:3000/api/notes/active
o	For archive notes: http://localhost:3000/api/notes/archive 

## 3.	Your choice of technology and the reasons for using them (and any alternatives you considered)
The development is done with NodeJS (Typescript) and mongoDB for the database. As for the testing, the project makes use of jest with supertest. 
The reason for choosing NodeJS for the development is:
-	Familiarity with JavaScript. This made the implementation quicker since I didn’t have a to learn a lot from scratch
-	Easily scalable to accommodate more complex tasks that the application might require later. 
-	NodeJS also offers a great speed on its performance which is always plus sign.
As for MongoDB, the main reason for using this is first because the speed of querying. Another thing that I could mention is that MongoDB representation as JSON makes easy to use with NodeJS.

## 4.	If you were to spend more time on this task, what would you change and what other key features would you add.
-	I would have added the tests for the user apis, which something that I have not done with this one. 
-	Other great features:
    *	drafting a note
    *	group user notes (something like google docs where multiple people can type the notes)
    *	share notes with other users. The users that you have shared the notes can now have accessed to the note. 

