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

      let sql=`
        SELECT name, address, city, state, zip, latitude, longitude,
        ( 3963.0 * acos(
          sin(latitude/57.2958) * sin(${lat}/57.2958)
          +cos(latitude/57.2958) * cos(${lat}/57.2958)
          *cos(${lng}/57.2958 -longitude/57.2958)
        ) ) AS distance
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
          //Note: Even though the result is a single item,
          //just send the first element result[0]
          console.log("Sending stringified result:\n"+JSON.stringify(result[0]));
          res.end(JSON.stringify(result[0]));
        }
      });

  }else{
    //Fail if parameters not defined:
    res.end(JSON.stringify({"error":"Sorry, your request must include lat and lng parameters in decimal degrees."}));
  }



}).listen(port);

console.log(`Listening on http://localhost:${port}
Sample Test: http://localhost:3001/?lat=38.887844&lng=-94.851011
`);
