var fs = require('fs');

// node json_to_template.js templateFile jsonDataFile

fs.readFile(__dirname + "/" + process.argv[2], function(err, data) {
  if(err) {
    throw err;
  }
  var template = data.toString();

  fs.readFile(__dirname + "/" + process.argv[3], function(err, data) {
    if(err) {
      throw err;
    }
    var json = JSON.parse(data);

    var res = json.reduce(function(allEventsHtml, event) {
      return allEventsHtml + "\n" + Object.keys(event).reduce(function(singleEventHtml, key) {
        var re = RegExp("\{\{event\." + key + "\}\}", "g");
        return singleEventHtml.replace(re, event[key]);
      }, template);
    }, "");

    console.log(res);
  });
});
