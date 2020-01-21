/**
 * The starting point of the application.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

// Importing modules in the applications
const fetcher = require('./src/fetcher')
const transformData = require('./src/transformData')

// Global variables
let links = []

// Application start
const startLink = process.argv.slice(2)[1] || 'http://vhost3.lnu.se:20080/weekend'

async function scrapeLinks () {
  process.stdout.write(`Scraping links... `)
  links = fetcher.elementExtractor(await fetcher.HTMLfetcher(startLink))
  console.log(links)
  process.stdout.write(`OK\n`)
  scrapeDays()
}

async function scrapeDays () {
  process.stdout.write(`Scraping available days...`)
  const calendarLinks = fetcher.elementExtractor(await fetcher.HTMLfetcher(links[0].href))
  console.log(calendarLinks)
  const calendarHTML = [await fetcher.HTMLfetcher(links[0].href + calendarLinks[0].href), await fetcher.HTMLfetcher(links[0].href + calendarLinks[1].href), await fetcher.HTMLfetcher(links[0].href + calendarLinks[2].href)]
  const availableDays = transformData.checkDays(calendarHTML)
  console.log(availableDays)
  if (availableDays.length !== 0) {
    process.stdout.write(`OK\n`)
    scrapeCinema(availableDays)
  } else {
    process.stdout.write(`No available days\n`)
  }
}

async function scrapeCinema (availableDays) {
  process.stdout.write(`Scraping showtimes...`)

  let availableShowsRaw = []
  for (let i = 0; i < availableDays.length; i++) {
    for (let y = 1; y <= 3; y++) {
      availableShowsRaw.push(JSON.parse(await fetcher.HTMLfetcher(links[1].href + `/check?day=0${availableDays[i]}&movie=0${y}`)))
    }
  }
  const freeSeats = transformData.checkShows(availableShowsRaw)
  console.log(freeSeats)
  if (freeSeats.length !== 0) {
    process.stdout.write(`OK\n`)
    scrapeDinner(freeSeats)
  } else {
    process.stdout.write(`No available movies\n`)
  }
}

async function scrapeDinner (freeSeats) {
  process.stdout.write(`Scraping possible reservations...`)
  const dinnerOptions = fetcher.elementExtractor(await fetcher.loginDinner(links[2].href), 'input')
  const possibleChoices = transformData.checkReservations(dinnerOptions, freeSeats)
  console.log(possibleChoices)
  if (possibleChoices.length !== 0) {
    process.stdout.write(`OK\n`)
    process.stdout.write(`\n`)
    process.stdout.write(`Recommendations\n`)
    process.stdout.write(`===============\n`)
    let message = transformData.convertMessage(possibleChoices)
    message.forEach(element => {
      console.log(element)
    })
  } else {
    process.stdout.write(`No available reservations\n`)
  }
}

scrapeLinks()
