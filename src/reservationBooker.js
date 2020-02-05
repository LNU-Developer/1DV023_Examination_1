/**
 * Module to make reservations.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

// Importing modules in the applications
const rp = require('request-promise')
const JSDOM = require('jsdom').JSDOM

/**
 * Function to make a reservation based on user choices.
 *
 * @param {Array} link - Array of links to scrape.
 * @param {number} option - User selection (0, 1, 2... Etc).
 * @param {Array} possibleChoices - All possible choices that when the friends can meet/perform activities.
 * @param {object} cookie - A secret session cookie to be used in further requests.
 */
async function makeReservation (link, option, possibleChoices, cookie) {
  process.stdout.write('\n')

  const value = possibleChoices[option - 1].day.toLowerCase().substr(0, 3) + possibleChoices[option - 1].tableTime.substr(0, 2) + String(Number(possibleChoices[option - 1].tableTime.substr(0, 2)) + 2)
  const response = await rp({
    method: 'POST',
    uri: link + '/login/booking',
    form: {
      group1: `${value}`
    },
    jar: cookie,
    headers: {
      'X-CSRF-TOKEN': 'Jishgeny6753ydiayYHSjay0918'
    }
  })
  return new JSDOM(response)
}

// Exports
module.exports.makeReservation = makeReservation
