const express = require('express'),
    db = require('../db'),
    posts = express.Router();

/**
 * Nothing here for now.
 * I felt like having both posts and subtidders was kind of redundant.
 * I was sometimes confused as to in which one to put an API call.
 * Will probably use this in the future, so it's here to stay.
 */

module.exports = posts;
