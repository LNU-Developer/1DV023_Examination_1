/**
 * Module for fetching information
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'
const rp = require('request-promise')
const JSDOM = require('jsdom').JSDOM

function HTMLfetcher (link) {
  return rp(link)
}

function linkExtractor (html) {
  let links = []
  let dom = new JSDOM(html)
  for (let i = 0; i < dom.window.document.getElementsByTagName('a').length; i++) {
    links[i] = dom.window.document.getElementsByTagName('a')[i].href
  }
  return links
}

// Exports
module.exports.HTMLfetcher = HTMLfetcher
module.exports.linkExtractor = linkExtractor
