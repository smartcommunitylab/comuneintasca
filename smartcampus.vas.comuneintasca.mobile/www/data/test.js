#!/usr/local/bin/node
var jsonPath = require('JSONPath');

var trento = require('./trento.json');
console.log('version: '+trento.version);

Object.keys(trento.updated).forEach(function(k) {
	if (k=='eu.trentorise.smartcampus.comuneintasca.model.ConfigObject_OFF') {
		var config=trento.updated[k];
		console.log(JSON.stringify(config));
	} else if (k=='eu.trentorise.smartcampus.comuneintasca.model.EventObject') {
		var events=trento.updated[k];
		var eventsByID=[];
		for (idx in events) {
			eventsByID[events[idx].id]=events[idx];
		}
		for (idx in events) {
			var event=events[idx];
			if (event.parentEventId) {
        var parentEvent=event.parentEventId;
        if (typeof parentEvent == "string") {
          parentEvent=JSON.parse(parentEvent);
        }
        if (parentEvent.objectRemoteId) {
          var parentid=parentEvent.objectRemoteId;
          var parent=eventsByID[parentid];
          if (parent) {
            console.log(parent.title.it);
          } else {
            console.log('parent not found! id: '+parentid);
          }
        } else {
          console.log('unknown parent: '+parentEvent);
        }
			}
		}
	}
});

console.log('DONE');