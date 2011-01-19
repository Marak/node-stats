var eyes = require('eyes'),
    request = require('request'),
    fs = require('fs'),
    options = {
      "logSource" : "http://nodejs.debuggable.com/",
      "startTime" : new Date('11/23/2009').getTime(),
      "endTime"   : new Date().getTime()
};

eyes.inspect(options);

for(loopTime = options.startTime; loopTime < options.endTime; loopTime += 86400000)
{
  var date = new Date(loopTime),
  year  = date.getFullYear(),
  month = (date.getMonth()+1).toString(),
  day   = date.getDate().toString();
  
  if(month.length==1){
    month = "0" + month;
  }

  if(day.length==1){
    day = "0" + day;
  }
  
  var str = year + '-' + month + '-' + day + '.txt';
  
  // check if we already have a log file for this entry
  (function(str){
   fs.stat('./logs/' + str, function(err, result){
     if(err == null){
       return;
     }
     console.log('trying to get ' + options.logSource + str);
     request({
       uri: options.logSource + str,
       method: 'GET',
       headers: {
       }}, 
       function (err, response, body) {
        if(err){
          console.log('bad request');
          return false;
        }
      fs.writeFile('./logs/' + str, body, function(err, result){
        if(err){
          console.log('file NOT created ' + str);
          console.log(err);
        }

        console.log('file created ' + str);
      });
     });
   });
})(str)

}

