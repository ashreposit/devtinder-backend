# devtinder api's

## authRouter ----> completed
POST /auth/signup //creating new urer
POST /auth/login //logging in 
POST /auth/logout //logging out

## profileRouter ----> completed
GET /profile/view //viewing the profile info
PATCH /profile/edit //editing the profile data
PATCH /profile/password //forgot password
DELETE /profile/delete //delete an user profile


## requestRouter ----> completed
status: interested,ignorned,accept,reject

POST /request/send/interested/:userId //sending connection request to another user by right swiping the profile on feed 
POST /request/send/ignored/:userId  //ignoring a profile by swiping the profile left on the feed

POST /request/send/:status/:userId //combined api for sending connection request to another user.

POST /request/review/accepted/:requestId //accepting a request
POST /request/review/rejected/:requestId //rejecting a request

POST /request/review/:status/:requestId //combined api for receiving a connection request from another user only when the status of the connection request is interested

## userRequestRouter -----> in progress
GET /user/connetions/received //getting all the pending received connections 
GET /user/requests //getting all the accepted requests
GET /user/feed //gets you the profile of other users

feed api 

user should see all the user cards except :
1. his own card 
2. cards of the user which he/she has sent request to 
3. cards of the user which he/she has connected with
4. cards of the user which he/she has ignored/rejected.

skip = (page-1)*10