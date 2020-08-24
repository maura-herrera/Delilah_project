# Delilah_project

A REST API to provide delivery food services, managing CRUD products and orders usign Node.js, MySQL, and JavaScript.

You will need to install the next apps:

Node.js
Express
MySQL
CORS
JWT
Sequelize
Nodemon
Postman

Do you want to run it locally?
You need to make sure you have a web server running, the easiest way to achieve this is with XAMPP otherwise this project isn't going to work in your local.

Clone the repository:
git clone https://github.com/maura-herrera/Delilah_project.git

Install the required dependencies
Run the following command, make sure you are in the root folder.

If you are using NPM
npm install

If you are using Yarn
yarn install

Setup the database
You need to edit the file sequelize.js and change the data there to match your config, remember the structure (mysql://user:password@host:port/database), then export the file/script delilah.sql in your database manager.

Run the server!
Make sure you are in the root of the folder (in this case, it is 'server'), then simply run

npm start

and that's all! Begins to experience...

