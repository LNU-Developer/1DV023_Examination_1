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
 *Function to make a reservation based on user choices.
 *
 * @param {Array} link - Array of links to scrape.
 * @param {number} option - User selection (0, 1, 2... Etc).
 * @param {Array} possibleChoices - All possible choices that when the friends can meet/perform activities.
 */
async function makeReservation (link, option, possibleChoices) {
  process.stdout.write(`\n`)
  if (possibleChoices.length >= option && option !== 0) {
    const jar = rp.jar()
    let options = {
      method: 'POST',
      uri: link + '/login',
      form: {
        'username': 'zeke',
        'password': 'coys',
        'submit': 'login'
      },
      followAllRedirects: true,
      jar: jar,
      simple: true
    }
    rp(options).then(async () => {
      const value = possibleChoices[option - 1].day.toLowerCase().substr(0, 3) + possibleChoices[option - 1].tableTime.substr(0, 2) + String(Number(possibleChoices[option - 1].tableTime.substr(0, 2)) + 2)
      const response = await rp({
        method: 'POST',
        uri: link + '/login/booking',
        form: {
          'group1': `${value}`
        },
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': 'Jishgeny6753ydiayYHSjay0918'
        }
      })
      let data = []
      let dom = new JSDOM(response)
      for (let i = 0; i < dom.window.document.getElementsByTagName('h1').length; i++) {
        data[i] = dom.window.document.getElementsByTagName('h1')[i]
      }
      console.log(data[0].textContent)
    })
  } else {
    console.log('Booking attempt canceled, or incorrect selection')
  }
}

// Exports
module.exports.makeReservation = makeReservation
