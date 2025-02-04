## Steps to run
### Add the .env file inside backend folder, it should contain the GROQ_API_KEY, MONGODB_URI, RECAPTCHA_SECRET_KEY
### Open 2 shell and cd into frontend and backend
### In both the shells, 1st do npm install and then npm run dev to start the react and node servers
### The website will be available at http://localhost:5173
---
### Assumed that only students.iiit.ac.in and research.iiit.ac.in are allowed
### I have created a review array for each user but since we were not told to retreive or update reviews anywhere, it is never accessed and always empty
### I am assuming emails will be unique for each user, thus I have directly used emails as User/Buyer/Seller ID
### For items, I have assumed no 2 items will have same name and category i.e. both these together act as a key
