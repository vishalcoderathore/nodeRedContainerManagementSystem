const userAuth = require('./UserAuthenticationAPI');
const restify = require('restify');
const errors = require('restify-errors');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const axios = require('axios');
var sys = require('util');
const exec = require('child_process').exec;
let child;
let child2;
let copySettingsJS;

module.exports = server => {
  getContainerId = apiResponse => {
    let containers = [];
    if (apiResponse.stdout !== '') {
      containers = JSON.parse(apiResponse.stdout);
      containers.forEach(element => {
        element.Name = JSON.parse(
          JSON.stringify(element.Name).replace('/', '')
        );
      });
    }
    return containers;
  };

  //Create a container
  server.post('/api/createContainer', (req, res, next) => {
    const userName = JSON.parse(req.body).userName;
    const contName = userName + '_' + JSON.parse(req.body).containerName;
    child = exec(`docker-compose run -d --name=${contName} node_red`, () => {
      child2 = exec(
        "docker inspect $(docker ps -l -f 'ancestor=nodered/node-red-docker' -q)",
        function(error, stdout, stderr) {
          let response = { stdout: stdout, stderr: stderr, error: error };
          let contSpec = getContainerId(response);
          let contId = contSpec.length === 1 ? contSpec[0].Id : '';
          if (contSpec.length) {
            copySettingsJS = exec(
              `docker cp settings.js ${contId}:/data`,
              (error, stdout, stderr) => {
                if (error) throw error;
                console.log(`Passing userName : ${userName}`);
                let hashedPass = userAuth.getHashedPassword(userName);
                console.log(`Hashed passowrd for ${userName} : ${hashedPass}`);
              }
            );
          }
          res.send(response);
          next();
        }
      );
    });
  });

  //Stop a Container
  server.post('/api/stopAContainer', (req, res, next) => {
    child = exec(`docker stop ${req.body}`, (error, stdout, stderr) => {
      res.send({ stdout: stdout, stderr: stderr, error: error });
      next();
    });
  });

  //Stop All Containers
  server.post('/api/stopAllContainers', (req, res, next) => {
    const userName = JSON.parse(req.body).userName;
    child = exec(
      `docker stop $(docker ps --filter 'ancestor=nodered/node-red-docker' -f name=${userName} --no-trunc -q)`,
      function(error, stdout, stderr) {
        res.send({ stdout: stdout, stderr: stderr, error: error });
        next();
      }
    );
  });

  //Restart a Container
  server.post('/api/restartAContainer', (req, res, next) => {
    child = exec(`docker restart ${req.body}`, (error, stdout, stderr) => {
      res.send({ stdout: stdout, stderr: stderr, error: error });
      next();
    });
  });

  //Delete A Container
  server.post('/api/deleteAContainer', (req, res, next) => {
    child = exec(`docker stop ${req.body}`, () => {
      child2 = exec(`docker rm ${req.body}`, (error, stdout, stderr) => {
        res.send({ stdout: stdout, stderr: stderr, error: error });
        next();
      });
    });
  });

  //Delete All Containers (first stop all containers and then delete them)
  server.post('/api/deleteAllContainers', (req, res, next) => {
    const userName = JSON.parse(req.body).userName;
    child = exec(
      `docker stop $(docker ps --filter 'ancestor=nodered/node-red-docker' -f name=${userName} --no-trunc -q)`,
      () => {
        child2 = exec(
          `docker rm $(docker ps -a --filter 'ancestor=nodered/node-red-docker' -f name=${userName} --no-trunc -q)`,
          function(error, stdout, stderr) {
            res.send({ stdout: stdout, stderr: stderr, error: error });
            next();
          }
        );
      }
    );
  });

  //Get All Containers
  server.post('/api/getContainers', (req, res, next) => {
    const userName = JSON.parse(req.body).userName;
    child = exec(
      `docker inspect  $(docker ps -a -f 'ancestor=nodered/node-red-docker' -f name=${userName} -q)`,
      function(error, stdout, stderr) {
        res.send({ stdout: stdout, stderr: stderr, error: error });
        next();
      }
    );
  });

  //Access Container
  /*
   *
   *Note : DOES NOT WORK, NOT USED ANYWHERE
   *
   */
  server.post('/api/viewContainer', async (req, res, next) => {
    const containerName = JSON.parse(req.body);
    var URL = `http://localhost/${containerName}/nodered/dashboard/`;
    console.log(`Server says: ${containerName}`);
    var jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTQ4MDA4MTQ3fQ.54pZOv5CWVtArELBmvzJyrxoJoHO_tuQKnG5Al4huhc';

    function jwtRequest(url, token) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var reqStatus = req.status;
          if ((reqStatus >= 200 && reqStatus < 300) || reqStatus === 204) {
            // var doc = document.implementation.createHTMLDocument("doc");
            // doc.documentElement.innerHTML = request.responseText;
            // console.log(doc);
            console.log('requst status');
            console.log(req.status);
            console.log('Resoponse XML');
            console.log(req.responseXML);
            res.status(200);
            res.send({
              stdout: JSON.stringify(req.responseText),
              stderr: '',
              error: ''
            });
            next();
          } else {
            console.log(`Request Status Bad : ${reqStatus}`);
          }
        }
      };
      req.open('get', url, true);
      // If specified, responseType must be empty string or "document"
      req.responseType = 'document';
      // overrideMimeType() can be used to force the response to be parsed as XML
      //req.overrideMimeType('/text/xml');
      //req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      req.setRequestHeader('Authorization', 'Bearer ' + token);

      req.send(null);
    }

    jwtRequest(URL, jwt);
    // let config = {
    //   "Content-Type": "application/json",
    //   Authorization: "Bearer " + jwt,
    //   withCredentials: true
    // };
    // const response = await axios.get(URL, {}, config);
    // const body = await response.json();
    // console.log(body);
    // return JSON.parse(body);
  });
};
