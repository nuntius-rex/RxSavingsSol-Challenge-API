const http = require("http");
const url = require('url');
const port=3001;
const fs = require('fs');
const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    database: "YOUR_DATABASE"
});

con.connect(function(error){
  if(error){
    console.log("Unable to connect");
  }else{
    console.log("Connected to database");
  }
});

http.createServer(function(req, res){

  //Process Parameters:
  const queryObj = url.parse(req.url,true).query;
  var lat=queryObj.lat;
  var lng=queryObj.lng;

  //If parameters are not empty proceed:
  if(lat!==undefined && lng!==undefined){

/*
      //An Approximate version in SQL (see notes.txt):
      let sql=`
          SELECT name, address, city, state, zip, latitude, longitude, SQRT(
          POW(69.1 * (latitude - ${lat}), 2) +
          POW(69.1 * (${lng} - longitude) * COS(latitude / 57.3), 2)) AS distance
          FROM pharmacies HAVING distance < 100 ORDER BY distance LIMIT 1;
      `;
*/
      //Great Circle Distance Formula in SQL:
      let sql=`
        SELECT name, address, city, state, zip, latitude, longitude,
        ( 3959 * acos( cos( radians(${lat}) ) * cos( radians( latitude ) )
        * cos( radians( longitude ) - radians(${lng}) )
        + sin( radians(${lat}) ) * sin(radians(latitude)) ) ) AS distance
        FROM pharmacies
        HAVING distance < 100
        ORDER BY distance
        LIMIT 1;
      `;

      //Run query and output:
      console.log("Running query:\n"+sql);
      con.query(sql, function(error, result, fields){
        if(error){
          console.log("Unable to get results");
        }else{
          console.log("Sending stringified result:\n"+JSON.stringify(result));
          res.end(JSON.stringify(result));
        }
      });

  }else{
    //Fail if parameters not defined:
    res.end(JSON.stringify({"error":"Sorry, your request must include lat and lng parameters in decimal degrees."}));
  }



}).listen(port);

console.log(`Listening on http://localhost:${port}
Sample Test: http://localhost:3000/?lat=38.887844&lng=-94.851011
`);
