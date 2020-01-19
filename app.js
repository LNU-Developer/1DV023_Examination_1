/**
 * The starting point of the application.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

// Importing modules in the applications
const HTMLfetcher = require('./src/fetcher')
const JSDOM = require('jsdom').JSDOM
let links = []
// Application start
const startLink = process.argv.slice(2)[1] || 'http://vhost3.lnu.se:20080/weekend'

async function scrapeLinks () {
  process.stdout.write(`Scraping links... `)
  let html = await HTMLfetcher(startLink)
  let dom = new JSDOM(html)
  for (let i = 0; i < dom.window.document.getElementsByTagName('a').length; i++) {
    links[i] = dom.window.document.getElementsByTagName('a')[i].href
  }
  process.stdout.write(`OK\n`)
  scrapeDays()
}

async function scrapeDays () {
  process.stdout.write(`Scraping available days...`)
  let html = await HTMLfetcher(links[0])
  let dom = new JSDOM(html)
  let newLinks = []
  for (let i = 0; i < dom.window.document.getElementsByTagName('a').length; i++) {
    newLinks[i] = dom.window.document.getElementsByTagName('a')[i].href
  }

  process.stdout.write(`OK\n`)
  console.log(newLinks)
}

scrapeLinks()
