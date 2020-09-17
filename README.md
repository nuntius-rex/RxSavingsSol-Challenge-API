# RxSavingsSol-Challenge-API

Single Endpoint Lat-Lng API

>This repository contains two examples, a version using a simple JSON file as a data source and a version using MySQL as a data source.

>JSON File Example - This example is intended to show how a service could be setup for a small collection of data, like the one provided. The logic here for determining distance is done with JavaScript alone. This is probably not a best long-term solution in most cases, per best practice, especially if the data were to grow. In such case, a SQL database or No-SQL solution would be desired. Thus, my reasoning for providing a second example:

>MySQL Example - This example is intended to show how a service could be setup for a larger collection of data. The logic for determining distance here is done via the SQL statement.

>Notes: In the _requirements folder, I have included my notes, so that you can see a bit of my research.

## Base Install

In a directory desired, clone this repository and run the install using the command line:

```
git clone https://github.com/nuntius-rex/RxSavingsSol-Challenge-API.git
cd RxSavingsSol-Challenge-API
npm install
```

### Running the JSON File Version

The JSON File version will run without any additional steps with the following command:

```
node index_JSONFILE_version.js
```

It should then be viewable at http://localhost:3000.

Sample Test: http://localhost:3000/?lat=38.887844&lng=-94.851011

### Setting Up and Running the MySQL Version

Using a MySQL client, create a database and run the pharmacies.sql script from the _requirements folder to setup the relevant "pharmacies" table. In the index_MySQL_version.js file, you will need to change the credentials, such as the username, password and database name to match the database and your connection credentials. This will be located at the top of the index_MySQL_version.js script.

```
var con = mysql.createConnection({
    host: "localhost",
    user: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    database: "YOUR_DATABASE"
});
```

The "npm install" command you ran earlier will have installed the node mysql library. Run the following command to start the script:

```
node index_MySQL_version.js
```

It should then be viewable at http://localhost:3001 (ON A DIFFERENT PORT SHOULD YOU WISH TO COMPARE OUTPUT).

Sample Test: http://localhost:3001/?lat=38.887844&lng=-94.851011
