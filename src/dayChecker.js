/**
 * Compare the available days
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'
// Importing modules in the applications
const JSDOM = require('jsdom').JSDOM

function checkDays (html) {
  let dom = []
  let tds = []
  let availableDays = []

  for (let i = 0; i < html.length; i++) {
    dom[i] = new JSDOM(html[i])
  }

  for (let i = 0; i < dom.length; i++) {
    for (let y = 0; y < dom[i].window.document.getElementsByTagName('td').length; y++) {
      tds.push(dom[i].window.document.getElementsByTagName('td')[y].innerHTML)
    }
  }

  for (let i = 0; i < tds.length; i++) {
    tds[i] = tds[i].toUpperCase()
  }

  if (tds[0] === 'OK' && tds[3] === 'OK' && tds[6] === 'OK') {
    availableDays.push(5)
  }

  if (tds[1] === 'OK' && tds[4] === 'OK' && tds[7] === 'OK') {
    availableDays.push(6)
  }
  if (tds[2] === 'OK' && tds[5] === 'OK' && tds[8] === 'OK') {
    availableDays.push(7)
  }

  let available = []

  return available
}

module.exports = checkDays
