/**
 * Module to transform data.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

// Importing modules in the applications
const JSDOM = require('jsdom').JSDOM

/**
 *Function to check the HTML pages and scrape when the specific person is available.
 *
 * @param {string} html - HTML string of the page to be scraped.
 * @returns {Array} - Returns an array of available days.
 */
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

  return availableDays
}

/**
 *Function to scrape which possible shows can be watched by all friends.
 *
 * @param {Array} availableShowsRaw - Array of available shows on a specific day.
 * @returns {Array} - Array of shows that the friends can watch together.
 */
function checkShows (availableShowsRaw) {
  let availableShows = []
  let freeSeats = []
  for (let i = 0; i < availableShowsRaw.length; i++) {
    availableShows.push(availableShowsRaw[i].pop())
    availableShows.push(availableShowsRaw[i].pop())
    availableShows.push(availableShowsRaw[i].pop())
  }

  availableShows.forEach(element => {
    if (element.status === 1) {
      freeSeats.push(element)
    }
  })

  return freeSeats
}

/**
 *Function to get all available options based on available reservations and available cinema seats.
 *
 * @param {string} dinnerOptions - Extracted input elements of available reservations.
 * @param {Array} freeSeats - Extracted array of available seats.
 * @returns {Array} - Returns an array of possible choices.
 */
function checkReservations (dinnerOptions, freeSeats) {
  let possibleChoices = []
  let cleanDinnerOptions = []

  for (let i = 0; i < dinnerOptions.length; i++) {
    cleanDinnerOptions[i] = { day: dinnerOptions[i].value.substr(0, 3), time: dinnerOptions[i].value.substr(3) }
  }
  for (let i = 0; i < dinnerOptions.length; i++) {
    if (cleanDinnerOptions[i].day === 'fri') {
      cleanDinnerOptions[i].day = '05'
    } else if (cleanDinnerOptions[i].day === 'sat') {
      cleanDinnerOptions[i].day = '06'
    } else if (cleanDinnerOptions[i].day === 'sun') {
      cleanDinnerOptions[i].day = '07'
    }
    cleanDinnerOptions[i].time = cleanDinnerOptions[i].time.substr(0, 2) + ':' + '00'
  }

  for (let i = 0; i < cleanDinnerOptions.length; i++) {
    for (let y = 0; y < freeSeats.length; y++) {
      if (cleanDinnerOptions[i].day === freeSeats[y].day && Number(freeSeats[y].time.substr(0, 2)) + 2 <= Number(cleanDinnerOptions[i].time.substr(0, 2))) {
        possibleChoices.push({ day: freeSeats[y].day, movieTime: freeSeats[y].time, movie: freeSeats[y].movie, tableTime: cleanDinnerOptions[i].time })
      }
    }
  }
  return possibleChoices
}

/**
 *Function to convert array of possible choice to correct format for reporting to user.
 *
 * @param {Array} possibleChoices - Possible choices in raw format.
 * @returns {Array} - Returns possible choices in correct format for reporting to user.
 */
function convertMessage (possibleChoices) {
  let message = []
  possibleChoices.forEach(element => {
    if (element.day === '05') {
      element.day = 'Friday'
    } else if (element.day === '06') {
      element.day = 'Saturday'
    } else if (element.day === '07') {
      element.day = 'Sunday'
    }
    if (element.movie === '01') {
      element.movie = 'The Flying Deuces'
    } else if (element.movie === '02') {
      element.movie = 'Keep Your Seats, Please'
    } else if (element.movie === '03') {
      element.movie = 'A Day at the Races'
    }
    message.push(`* On ${element.day} the movie "${element.movie}" starts at ${element.movieTime} and there is a free table between ${element.tableTime}-${Number(element.tableTime.substr(0, 2)) + 2}:00.`)
  })
  return message
}

// Exports
module.exports.checkDays = checkDays
module.exports.checkShows = checkShows
module.exports.checkReservations = checkReservations
module.exports.convertMessage = convertMessage
