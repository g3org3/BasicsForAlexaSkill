exports.handler = (event, context, callback) => {
  console.log('--------------- Event ----------------------');
  console.log(event);
  console.log('-------------- Context ---------------------');
  console.log(context);
  console.log('--------------------------------------------');

  try {
    if (event.session.new) {
      console.log('NEW SESSION');
    }
    switch (event.request.type) {
      case 'LaunchRequest':
        console.log('> LAUNCHREQUEST');
        return context.succeed(alexaResponse("Welcome to an Alexa Skill, this is running on a lambda aws function"));
      case 'IntentRequest':
        console.log('> IntentRequest');
        return context.succeed(alexaResponse("Intent Request Found"));
    }
  } catch (e) {
    context.succeed(alexaResponse('Could not find with this information'));
  }
};

function alexaResponse(message, notEndSession) {
  return {
    "vesion": "1.0",
    "sessionAttributes": {},
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": message
      },
      "shouldEndSEssion": !notEndSession
    }
  }
}


function Request(config, cb) {
  const https = require('https');
  
  if (!config.host || !config.url) {
    return cb(new Error("Missing params, config: { host, url, }"));
  }

  const method = config.method? config.method : 'GET';
  const headers = config.headers? config.headers : {};
  
  var options = {
    hostname: config.host,
    port: 443,
    path: config.url,
    method: method,
    headers: headers,
    agent: false
  };
  
  var data = '';
  var req = https.request(options, (res) => {
    res.on('data', (d) => {
      data += d;
    });
    res.on('end', () => {
      cb(null, data)
    })
  });
  req.on('error', (e) => {
    cb(e)
  });
  req.write(config.payload)
  req.end();
}
