const router = require('express-promise-router')();
const graph = require('../graph.js');
const addDays = require('date-fns/addDays');
const formatISO = require('date-fns/formatISO');
const startOfWeek = require('date-fns/startOfWeek');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const iana = require('windows-iana');
const { body, validationResult } = require('express-validator');
const validator = require('validator');

// <GetRouteSnippet>
/* GET /when2Meet */
router.get('/when2Meet',
  async function(req, res) {
        if (!req.session.userId) {
        // Redirect unauthenticated requests to home page
        res.redirect('/')
        } else {
        const params = {
            active: { when2Meet: true }
        };

        // Get the user
        const user = req.app.locals.users[req.session.userId];
        // Convert user's Windows time zone ("Pacific Standard Time")
        // to IANA format ("America/Los_Angeles")
        const timeZoneId = iana.findIana(user.timeZone)[0];
        console.log(`Time zone: ${timeZoneId.valueOf()}`);

        // Calculate the start and end of the current week
        // Get midnight on the start of the current week in the user's timezone,
        // but in UTC. For example, for Pacific Standard Time, the time value would be
        // 07:00:00Z
        var weekStart = zonedTimeToUtc(startOfWeek(new Date()), timeZoneId.valueOf());
        var weekEnd = addDays(weekStart, 7);
        console.log(`Start: ${formatISO(weekStart)}`);

        const events = await graph.getCalendarView(
        req.app.locals.msalClient,
        req.session.userId,
        formatISO(weekStart),
        formatISO(weekEnd),
        user.timeZone);

        // Assign the events to the view parameters
        params.events = events.value;

        res.render('when2Meet', params);
    }
  }
);
// </GetRouteSnippet>

module.exports = router;