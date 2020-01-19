/**
 * The starting point of the application.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

// Importing modules in the applications
const fetcher = require('./src/fetcher')
const dayChecker = require('./src/dayChecker')

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
  let availableDays = dayChecker(calendarHTML)
  console.log(availableDays)
  if (availableDays.length !== 0) {
    process.stdout.write(`OK\n`)
    scrapeCinema(availableDays)
  } else {
    process.stdout.write(`No available days\n`)
  }
}

async function scrapeCinema (availableDays) {

}

scrapeLinks()
