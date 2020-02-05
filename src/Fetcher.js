/**
 * Module for fetching information.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

// Importing modules in the applications
const rp = require('request-promise')
const JSDOM = require('jsdom').JSDOM

/**
 *Function to fetch HTTP from a link.
 *
 * @param {string} link - Link that the function should fetch http from.
 * @returns {string} - HTML string.
 */
function HTMLfetcher (link) {
  return rp(link)
}

/**
 *Function to fetch a specific element from a HTML string.
 *
 * @param {string} html - HTML where an element shall be extracted.
 * @param {string} [element='a'] - The type of element to be extracted (if none is selected then a is extraced).
 * @returns {Array} - Returns the an array of the specific node.
 */
function elementExtractor (html, element = 'a') {
  const data = []
  const dom = new JSDOM(html)
  for (let i = 0; i < dom.window.document.getElementsByTagName(element).length; i++) {
    data[i] = dom.window.document.getElementsByTagName(element)[i]
  }
  return data
}

/**
 * Function to log in to HTTP page using a form and automatically redirect to get the HTML of the redirect.
 *
 * @param {string} url - Link to the login page.
 * @returns {string} - Returns a HTML of the redirected page after login.
 */
function loginDinner (url) {
  const jar = rp.jar()
  const options = {
    method: 'POST',
    uri: url + '/login',
    simple: false,
    form: {
      username: 'zeke',
      password: 'coys',
      submit: 'login'
    },
    followAllRedirects: true,
    jar: jar
  }
  return { data: rp(options), cookie: jar }
}

// Exports
module.exports.HTMLfetcher = HTMLfetcher
module.exports.elementExtractor = elementExtractor
module.exports.loginDinner = loginDinner
