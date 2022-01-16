// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const router = require('express-promise-router')();
const graph = require('../graph.js');
const addDays = require('date-fns/addDays');
const formatISO = require('date-fns/formatISO');
const startOfWeek = require('date-fns/startOfWeek');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const iana = require('windows-iana');
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const { createEvent } = require('../graph.js');
const db = require('../cockroach.js'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  let params = {
    active: { home: true }
  };
  res.locals.when2Meet = {};
  res.render('index', params);
});

// <PostEventFormSnippet>
/* POST / */
router.post('/', 
async function(req, res) {
  const params = {
    active: { when2Meet: true }
  };

    // Get the user
    const user = req.app.locals.users[req.session.userId];
    // Convert user's Windows time zone ("Pacific Standard Time")
    // to IANA format ("America/Los_Angeles")
    const timeZoneId = iana.findIana(user.timeZone)[0];
    //console.log(`Time zone: ${timeZoneId.valueOf()}`);

    // Calculate the start and end of the current week
    // Get midnight on the start of the current week in the user's timezone,
    // but in UTC. For example, for Pacific Standard Time, the time value would be
    // 07:00:00Z
    var weekStart = zonedTimeToUtc(startOfWeek(new Date()), timeZoneId.valueOf());
    var weekEnd = addDays(weekStart, 7);
    //console.log(`Start: ${formatISO(weekStart)}`);

    try {
      // Get the events
      const events = await graph.getCalendarView(
        req.app.locals.msalClient,
        req.session.userId,
        formatISO(weekStart),
        formatISO(weekEnd),
        user.timeZone);

      // Assign the events to the view parameters
      params.events = events.value;  
      //dbEvent = {name: 'please work 3', start: '2022-01-25 03:00:00', end: '2022-01-25 05:00:00'};
      // const res = db.createEvent(dbEvent);
      // const res = db.createEvent({name: 'please work 3', start: '2022-01-25 03:00:00', end: '2022-01-25 05:00:00'}); 
      //db.createEvent({name: 'please work 4', start: '2022-01-25 03:00:00', end: '2022-01-25 05:00:00'});
      // events.value.forEach(element => 
      //   db.createEvent({name: 'please work 4', start: '2022-01-25 03:00:00', end: '2022-01-25 05:00:00'})); 

      events.value.forEach(element => db.createEvent({name: element.subject, start: element.start.dateTime, end: element.end.dateTime})); 
      

    } catch (err) {
      req.flash('error_msg', {
        message: 'Could not fetch events',
        debug: JSON.stringify(err, Object.getOwnPropertyNames(err))
      });
    }

    const name = {
      input: req.body['when2Meet-name']
    }; 
    res.render('when2Meet', {name: req.body['when2Meet-name']}); 
});

module.exports = router;
// </IndexRouterSnippet>
