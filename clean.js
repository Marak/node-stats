var eyes = require('eyes'),
    request = require('request'),
    fs = require('fs'),
    options = {
      "logSource" : "http://nodejs.debuggable.com/",
      "startTime" : new Date('11/23/2009').getTime(),
      "endTime"   : new Date().getTime()
};







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
  //var str = date.getYear().toString() + date.getDay().toString() + date.getMonth().toString();
//  console.log(str);
  
  
  // check if we already have a log file for this entry
  
  (function(str){
  
    fs.readFile('./logs/' + str, function(err, data){
      
      if(err){
        console.log(err);
        return;
      }

      data = data.toString().split('\n')

      for(var x = 0; x < data.length; x ++){
        var item = data[x];
        console.log(item.search(': '));
        if(item.search(': ') == -1){
          item = '';
        }
        else{
          // find the first space
          item = item.replace(' ', ' <');

          // first he first colon
          item =  item.replace(': ', '> ');
          data[x] = item
          // add < and > around names, remove colon
          //console.log(item);

        }
      }


      fs.writeFile('./logs/clean/' + str, data.join('\n'), function(err, rsp){


      });

    });

  
       })(str)




}














