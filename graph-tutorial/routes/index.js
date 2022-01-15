// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <IndexRouterSnippet>
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let params = {
    active: { home: true }
  };
  res.locals.when2Meet = {};
  res.render('index', params);
});

// <PostEventFormSnippet>
/* POST /index */
router.post('/', function(req, res) {
    res.render('when2meet', {name: "this is my event name"}); 
});


module.exports = router;
// </IndexRouterSnippet>
