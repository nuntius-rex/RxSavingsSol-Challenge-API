const http = require("http");
const url = require('url');
const port=3000;
var fs = require('fs');
http.createServer(function(req, res){

  //Process Parameters:
  const queryObj = url.parse(req.url,true).query;
  var userLat=queryObj.lat;
  var userLng=queryObj.lng;

  //If parameters are not empty proceed:
  if(userLat!==undefined && userLng!==undefined){

    //Response will be in JSON:
    res.writeHead(200, {'Content-Type':'application/json'});

    //Get All Pharmacy locations (a larger data set would require a database):
    let file='./json/pharmacies.json';
    let jsonData='';
    fs.readFile(file, 'utf8', function(error,data){
        if(error){
          console.error(error);
          res.end(JSON.stringify(error));
        }
        //jsonData=data;
        //console.log(data);
        let dataArray=JSON.parse(data);

        //Calculate the distance of each in the data set:
        let distMap = dataArray.map( function(item){
          //"Great Circle Distance Formula" in JavaScript (miles):
          let distance= 3963.0 * Math.acos(
           Math.sin(item.latitude/57.2958) * Math.sin(userLat/57.2958)
           + Math.cos(item.latitude/57.2958) * Math.cos(userLat/57.2958)
           * Math.cos(userLng/57.2958 -item.longitude/57.2958)
          );
          item.distance=distance;
          return item;
        });

        //Sort the array by distance:
        distMap.sort((a, b) => (a.distance > b.distance) ? 1 : -1)

        //Output the first element of the array:
        res.end(JSON.stringify(distMap[0]));
    });
    console.log("finished");
  }else{
    res.end(JSON.stringify({"error":"Sorry, your request must include lat and lng parameters."}));
  }



}).listen(port);

//console.log("Listening on http://localhost:"+port);
console.log(`Listening on http://localhost:${port}
Sample Test: http://localhost:3000/?lat=38.887844&lng=-94.851011`);
