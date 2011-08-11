/*******************************
 This script is the main JS file
 -------------------------------
 It will handle the connections
 and the interactions with the
 GUI (POST and GET requests).
 -------------------------------
 To make this work: 
 1. node npm install -g express
 2. node index.js (this file)
 3. visit http://localhost/get/23 
    (for instance)
 ******************************/
 
var cofetch = require('./fetch');
 
//Let's use express to handle GET and POST requests
var server = require('express').createServer();
var port = 8082;

server.get('/get/:id', function(req, res){
   /*
   //Mockup for faster debugging
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end('_cofetchcb({"ID":"4","Name":"Seahorse","Screenshot":"http://gdv.fh-erfurt.de/modeldb/media/model/Seahorse.jpg","CategoryPath":"Animal/Fish","Files":[{"Type":"Object3d","Name":"Seahorse","Tags":"","Extension":"3ds","Licence":"GPL","LicenceURL":"http://www.gnu.org/licenses/gpl-3.0.html","Author":"Unkown","Date":"2010-09-02 18:54:52","Size":1529344,"URL":"http://gdv.fh-erfurt.de/modeldb/media/model/Seahorse.max","Preview":"http://gdv.fh-erfurt.de/modeldb/media/model/Seahorse.jpg","Emotions":[],"Location":[],"Weather":{}},{"Type":"ImageType","Name":"Seahorse 5","Tags":["seahorse","aquarium","underwater","sealife","monterey","california","canon","karith","geo:lat=36618038","geo:lon=121901915","geotagged"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Karen","Date":"2009-07-17 09:51:05","Size":{"width":"640","height":415},"URL":"http://farm3.static.flickr.com/2585/3734040300_81be0484c3_z.jpg?zz=1","Preview":"http://farm3.static.flickr.com/2585/3734040300_81be0484c3_s.jpg","Emotions":[],"Location":[36.618038,-121.901915,0,0],"Weather":{"condition":"OVC","wind":1,"temperature":"12.2","humidity":93}},{"Type":"ImageType","Name":"Seahorse","Tags":["seahorse","diving","underwater"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Roland Bircher","Date":"2008-12-07 14:14:01","Size":{"width":"768","height":"1024"},"URL":"http://farm4.static.flickr.com/3080/3117107805_bba552e67a_b.jpg","Preview":"http://farm4.static.flickr.com/3080/3117107805_bba552e67a_s.jpg","Emotions":[],"Location":[-34.069524,151.110967,0,0],"Weather":{}},{"Type":"ImageType","Name":"Seahorse","Tags":["underwater","marinelife","diving","caribbean","dutchcaribbean","bonaire","seahorse","canon5dmkii","bonairereef","coralreef","reeffish","scubadiving"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Andre de Molenaar","Date":"2010-06-15 00:00:00","Size":{"width":"683","height":"1024"},"URL":"http://farm6.static.flickr.com/5216/5396578854_c22e0ef45e_b.jpg","Preview":"http://farm6.static.flickr.com/5216/5396578854_c22e0ef45e_s.jpg","Emotions":[],"Location":[12.165504,-68.288612,0,0],"Weather":{"condition":"Unknown","wind":4,"temperature":"28.0","humidity":79}},{"Type":"ImageType","Name":"Seahorse & Teardrop Crab","Tags":["underwater","marinelife","diving","caribbean","dutchcaribbean","bonaire","seahorse","canon5dmkii","bonairereef","coralreef","reeffish","scubadiving"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Andre de Molenaar","Date":"2010-06-15 00:00:00","Size":{"width":"683","height":"1024"},"URL":"http://farm6.static.flickr.com/5127/5309528758_9f50ddf151_b.jpg","Preview":"http://farm6.static.flickr.com/5127/5309528758_9f50ddf151_s.jpg","Emotions":[],"Location":[12.165504,-68.288612,0,0],"Weather":{"condition":"Unknown","wind":4,"temperature":"28.0","humidity":79}},{"Type":"ImageType","Name":"Seahorse","Tags":["australia","diving","lillipilli","seahorse","macro","underwater","scuba"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Roland Bircher","Date":"2008-04-26 11:53:37","Size":{"width":"1024","height":"768"},"URL":"http://farm3.static.flickr.com/2366/2447667901_eb6f227668_b.jpg","Preview":"http://farm3.static.flickr.com/2366/2447667901_eb6f227668_s.jpg","Emotions":[],"Location":[-34.069467,151.110935,0,0],"Weather":{}},{"Type":"ImageType","Name":"Seahorse","Tags":["bostonnewenglandaquarium","seahorse","underwater"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"David Schook","Date":"2009-06-29 10:25:25","Size":{"width":"1024","height":"685"},"URL":"http://farm3.static.flickr.com/2461/3728609403_34044929a1_b.jpg","Preview":"http://farm3.static.flickr.com/2461/3728609403_34044929a1_s.jpg","Emotions":[],"Location":[42.358892,-71.050118,0,0],"Weather":{"condition":"RA","wind":3,"temperature":"19.0","humidity":94}},{"Type":"ImageType","Name":"Seahorse ","Tags":["seahorse","mathesonsbay","newzealand","underwater"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Simon Franicevic","Date":"2009-11-21 15:36:39","Size":{"width":"640","height":428},"URL":"http://farm3.static.flickr.com/2653/4122975215_5ac2ecf5b7_z.jpg?zz=1","Preview":"http://farm3.static.flickr.com/2653/4122975215_5ac2ecf5b7_s.jpg","Emotions":[],"Location":[-36.302191,174.799175,0,0],"Weather":{}},{"Type":"ImageType","Name":"Seahorse","Tags":["fish","indonesia","seahorse","underwater"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Elias Levy","Date":"2010-04-25 02:22:55","Size":{"width":"1024","height":"683"},"URL":"http://farm4.static.flickr.com/3363/4593386711_b0e7982b9c_b.jpg","Preview":"http://farm4.static.flickr.com/3363/4593386711_b0e7982b9c_s.jpg","Emotions":[],"Location":[1.585262,124.747696,0,0],"Weather":{"condition":"FEW","wind":1,"temperature":"25.0","humidity":94}},{"Type":"ImageType","Name":"Seahorse","Tags":["tipointwharf","seahorse","newzealand","underwater","whangateauharbour"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Simon Franicevic","Date":"2009-02-06 14:54:15","Size":{"width":428,"height":"640"},"URL":"http://farm4.static.flickr.com/3465/3256860885_edb77a2ef0_z.jpg?zz=1","Preview":"http://farm4.static.flickr.com/3465/3256860885_edb77a2ef0_s.jpg","Emotions":[],"Location":[-36.317476,174.782009,0,0],"Weather":{}},{"Type":"ImageType","Name":"Seahorse","Tags":["seahorse","newzealand","underwater","tipoint","whangateau"],"Extension":"jpg","Licence":"All Rights Reserved","LicenceURL":"","Author":"Simon Franicevic","Date":"2011-04-08 10:31:09","Size":{"width":"686","height":"1024"},"URL":"http://farm6.static.flickr.com/5265/5600110370_c57b79499e_b.jpg","Preview":"http://farm6.static.flickr.com/5265/5600110370_c57b79499e_s.jpg","Emotions":[],"Location":[-36.317476,174.782009,0,0],"Weather":{}},{"Type":"VideoType","Name":"Sea Pathfinder","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"sedentary7m","Date":"2011-08-10T07:59:17.000Z","Size":"","URL":"https://www.youtube.com/watch?v=1qTgb8ylRMA","Preview":"http://i.ytimg.com/vi/1qTgb8ylRMA/default.jpg","Dimensions":[],"Length":"61","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Wondes of the sea speedpaint","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"KometLuffs","Date":"2011-08-06T11:23:36.000Z","Size":"","URL":"https://www.youtube.com/watch?v=TzxOvRBRZhA","Preview":"http://i.ytimg.com/vi/TzxOvRBRZhA/default.jpg","Dimensions":[],"Length":"198","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Wild Ocean Mane w/ Lyrics: Luna Taylor","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"lunamodule","Date":"2011-08-01T07:34:09.000Z","Size":"","URL":"https://www.youtube.com/watch?v=IwTI-_186ho","Preview":"http://i.ytimg.com/vi/IwTI-_186ho/default.jpg","Dimensions":[],"Length":"321","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Seahorse at rye pier 1080P Blurfix UR-pro CY filter","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"martcerv","Date":"2011-07-28T15:24:13.000Z","Size":"","URL":"https://www.youtube.com/watch?v=zoSc_kMYnG0","Preview":"http://i.ytimg.com/vi/zoSc_kMYnG0/default.jpg","Dimensions":[],"Length":"33","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Hot Rocks Sangeang Volcano","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"All4DivingIndonesia","Date":"2011-07-19T08:01:14.000Z","Size":"","URL":"https://www.youtube.com/watch?v=R3gvJuoMlEk","Preview":"http://i.ytimg.com/vi/R3gvJuoMlEk/default.jpg","Dimensions":[],"Length":"102","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"caballito.wmv","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"silentworlddivers","Date":"2011-07-17T15:35:42.000Z","Size":"","URL":"https://www.youtube.com/watch?v=J6c4GG4-BRk","Preview":"http://i.ytimg.com/vi/J6c4GG4-BRk/default.jpg","Dimensions":[],"Length":"94","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Tauchabenteuer Papua Neu Guinea - M/V Golden Dawn - Eastern Fields, Ashmore, Portlock und Boot Reef","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"LoesekeVideo","Date":"2011-07-09T13:44:00.000Z","Size":"","URL":"https://www.youtube.com/watch?v=hBuhY0C2UPg","Preview":"http://i.ytimg.com/vi/hBuhY0C2UPg/default.jpg","Dimensions":[],"Length":"247","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Diving the Seahorse Gardens - Nelson Bay","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"daveharasti","Date":"2011-07-06T04:56:51.000Z","Size":"","URL":"https://www.youtube.com/watch?v=dT67_qbJgTY","Preview":"http://i.ytimg.com/vi/dT67_qbJgTY/default.jpg","Dimensions":[],"Length":"357","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Heidi Daus Sea-Phisticated Seahorse Crystal-Accented Ring","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"HSN","Date":"2011-07-02T09:35:26.000Z","Size":"","URL":"https://www.youtube.com/watch?v=WVX1lioi7No","Preview":"http://i.ytimg.com/vi/WVX1lioi7No/default.jpg","Dimensions":[],"Length":"147","Emotions":[],"Location":[],"Weather":{}},{"Type":"VideoType","Name":"Underwater baby photoshoot","Extension":"","Licence":"All right reserved","LicenceURL":"http://www.youtube.com","Author":"BabaSeahorse","Date":"2011-06-29T21:54:58.000Z","Size":"","URL":"https://www.youtube.com/watch?v=3Lyl8zjQbEE","Preview":"http://i.ytimg.com/vi/3Lyl8zjQbEE/default.jpg","Dimensions":[],"Length":"69","Emotions":[],"Location":[],"Weather":{}}]})')
   */
   
   //Fetch the CO
   cofetch.get(req.params.id, function(blablaWillBeNul, data){
      
     var responseString = JSON.stringify(data);
     console.log("Success! Here is the CO: ");
     console.log(responseString);
     
     //Write the data back
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('_cofetchcb(\'' + responseString + '\')');
   });
   
 });
 
server.post('/save', function(request, response){
  //Here is the JSON data
  console.log(request.body.json);
  
  //TODO: store the data
  
});

//Run the server on port #8082
server.listen(port);