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

function elementExtractor (html, element = 'a') {
  let data = []
  let dom = new JSDOM(html)
  for (let i = 0; i < dom.window.document.getElementsByTagName(element).length; i++) {
    data[i] = dom.window.document.getElementsByTagName(element)[i]
  }
  return data
}

function loginDinner (url) {
  let options = {
    method: 'POST',
    uri: url + '/login',
    simple: false,
    form: {
      'username': 'zeke',
      'password': 'coys',
      'submit': 'login'
    },
    followAllRedirects: true,
    jar: true
  }
  return rp(options)
}

// Exports
module.exports.HTMLfetcher = HTMLfetcher
module.exports.elementExtractor = elementExtractor
module.exports.loginDinner = loginDinner
