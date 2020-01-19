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
  links = fetcher.linkExtractor(await fetcher.HTMLfetcher(startLink))
  console.log(links)
  process.stdout.write(`OK\n`)
  scrapeDays()
}

async function scrapeDays () {
  process.stdout.write(`Scraping available days...`)
  let calendarLinks = fetcher.linkExtractor(await fetcher.HTMLfetcher(links[0]))
  console.log(calendarLinks)
  let calendarHTML = [await fetcher.HTMLfetcher(links[0] + calendarLinks[0]), await fetcher.HTMLfetcher(links[0] + calendarLinks[1]), await fetcher.HTMLfetcher(links[0] + calendarLinks[2])]
  let availableDays = transformData.checkDays(calendarHTML)
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
      availableShowsRaw.push(JSON.parse(await fetcher.HTMLfetcher(links[1] + `/check?day=0${availableDays[i]}&movie=0${y}`)))
    }
  }
  let freeSeats = transformData.checkShows(availableShowsRaw)
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
  process.stdout.write(`OK\n`)
}

scrapeLinks()
