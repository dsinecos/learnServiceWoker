var express = require('express');
var app = express();
var webPush = require('web-push');
var bodyParser = require('body-parser')


app.set('port', 5000);
app.use(express.static(__dirname + '/'));

app.use(bodyParser.json())

// webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);

const vapidKeys = {
  publicKey: "BOeUa0nA3wGgRmBPaoIU7HFyFMq1fS-mrnN8dfU9MP4a9klwSklGu0jwh7Sfj70knFBbjSwiMcna4j23I_aVawQ",
  privateKey: "B9bDED7isjPRwCBcp1Wn0T5n8UQPzvoQ4MGgnyQv2H0"
}

webPush.setVapidDetails(
  'mailto:ghoda@mailinator.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

app.post('/register', function (req, res) {
  // A real world application would store the subscription info.
  // console.log("This is the endpoint " + req.body.endpoint);
  // res.setHeader('Content-Type', 'application/json');
  // res.send(JSON.stringify({ data: { success: true } }));

  console.log(req.body);
  // var pushSubscription = JSON.parse(req.body);
  // res.status(200).send("User registered for push notification");

  var notification = {
    title: "Title",
    body: "Body",
  }

  webPush.sendNotification(req.body, JSON.stringify(notification))
    .then(function (response) {
      console.log(response);
    })

});

app.post('/sendNotification', function (req, res) {

  console.log(req.body)

  webPush.sendNotification(req.body.endpoint, {
    payload: JSON.stringify({
      'title': req.body.title,
      'icon': req.body.icon,
      'body': req.body.body,
      'url': req.body.link
    })
  })
    .then(function () {
      console.log("sent push")
      res.sendStatus(201);
    }, function (err) {
      console.log('Hoye Hoye', err);

    });

});


app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});