# devtinder api's

## authRouter
POST /auth/signup //creating new urer
POST /auth/login //logging in 
POST /auth/logout //logging out

## profileRouter
GET /profile/view //viewing the profile info
PATCH /profile/edit //editing the profile data
PATCH /profile/password //forgot password
DELETE /profile/delete //delete an user profile


## requestRouter
status: interested,ignorned,accept,reject

POST /request/send/interested/:userId //sending connection request to another user by right swiping the profile on feed 
POST /request/send/ignored/:userId  //ignoring a profile by swiping the profile left on the feed
POST /request/review/accepted/:requestId //accepting a request
POST /request/review/rejected/:requestId //rejecting a request

## userRequestRouter
GET /user/connetions //getting all the connections
GET /user/requests //checking the received requests
GET /user/feed gets you the profile of other users