/**
 * Module for fetching information
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'
const rp = require('request-promise')

function HTMLfetcher (link) {
  return rp(link)
}

// Exports
module.exports = HTMLfetcher
