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
    const name = {
      input: req.body['when2Meet-name']
    }; 
    res.render('when2meet', {name: req.body['when2Meet-name']}); 
});


module.exports = router;
// </IndexRouterSnippet>
