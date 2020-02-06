/**
 * The starting point of the application.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

// Importing modules in the applications
const fetcher = require('./src/Fetcher')
const transformData = require('./src/transformData')
const reservationBooker = require('./src/reservationBooker')

// Global variables
let links = []

// Application start
const startLink = process.argv.slice(2)[1] || 'http://vhost3.lnu.se:20080/weekend'

/**
 *Function to fetch starting links.
 *
 */
async function scrapeLinks () {
  process.stdout.write('Scraping links... ')
  links = fetcher.elementExtractor(await fetcher.HTMLfetcher(startLink))
  process.stdout.write('OK\n')
  scrapeDays()
}

/**
 *Function to scrape when all friends are available.
 *
 */
async function scrapeDays () {
  process.stdout.write('Scraping available days... ')
  const calendarLinks = fetcher.elementExtractor(await fetcher.HTMLfetcher(links[0].href))
  const calendarHTML = [await fetcher.HTMLfetcher(links[0].href + calendarLinks[0].href), await fetcher.HTMLfetcher(links[0].href + calendarLinks[1].href), await fetcher.HTMLfetcher(links[0].href + calendarLinks[2].href)]
  const availableDays = transformData.checkDays(calendarHTML)
  if (availableDays.length !== 0) {
    process.stdout.write('OK\n')
    scrapeCinema(availableDays)
  } else {
    process.stdout.write('No available days\n')
  }
}

/**
 *Function to scrape when there are free cinema seats based on the friends schedule.
 *
 * @param {Array} availableDays - All days when the friends are available at the same time.
 */
async function scrapeCinema (availableDays) {
  process.stdout.write('Scraping showtimes... ')

  const availableShowsRaw = []
  for (let i = 0; i < availableDays.length; i++) {
    for (let y = 1; y <= 3; y++) {
      availableShowsRaw.push(JSON.parse(await fetcher.HTMLfetcher(links[1].href + `/check?day=0${availableDays[i]}&movie=0${y}`)))
    }
  }
  const freeSeats = transformData.checkShows(availableShowsRaw)
  if (freeSeats.length !== 0) {
    process.stdout.write('OK\n')
    scrapeDinner(freeSeats)
  } else {
    process.stdout.write('No available movies\n')
  }
}

/**
 *Function to scrape when there is a free table based on when the friends have available seats and to show available options.
 *
 * @param {Array} freeSeats - Available cinema seats.
 */
async function scrapeDinner (freeSeats) {
  process.stdout.write('Scraping possible reservations... ')

  const obj = await fetcher.loginDinner(links[2].href).data
  const dinnerOptions = await fetcher.elementExtractor(obj, 'input')
  const cookie = await fetcher.loginDinner(links[2].href).cookie

  const possibleChoices = transformData.checkReservations(dinnerOptions, freeSeats)
  if (possibleChoices.length !== 0) {
    process.stdout.write('OK\n')
    process.stdout.write('\n')
    process.stdout.write('Recommendations\n')
    process.stdout.write('===============\n')
    const message = transformData.convertMessage(possibleChoices)
    message.forEach(element => {
      console.log(element)
    })
    process.stdout.write('\n')
    // bookReservation(possibleChoices, cookie)
  } else {
    process.stdout.write('No available reservations\n')
  }
  process.stdout.write('\n')
}

/**
 * Function to enable user to book a reservation based on input.
 *
 * @param {Array} possibleChoices - The array containing all possible userchoices.
 * @param {object} cookie - A secret session cookie to be used in further requests.
 */
function bookReservation (possibleChoices, cookie) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  readline.question('Which table option do you want to book? 0(none)/1/2...)', async (option) => {
    option = Number(option)
    if (possibleChoices.length >= option && option !== 0) {
      const dom = await reservationBooker.makeReservation(links[2].href, option, possibleChoices, cookie)
      const data = []
      for (let i = 0; i < dom.window.document.getElementsByTagName('h1').length; i++) {
        data[i] = dom.window.document.getElementsByTagName('h1')[i]
      }
      console.log(data[0].textContent)
    } else {
      console.log('Booking attempt canceled, or incorrect selection')
    }
    readline.close()
  })
}
scrapeLinks()
