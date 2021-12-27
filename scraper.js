const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require('request-promise');
const Road = require('./models/roadModel');

async function scraper() {
  const result = await request.get(
    'https://drogi.gddkia.gov.pl/informacje-drogowe/lista-utrudnien?odcinek=&odcinek_id=&od=&do=&woj=&nr=&rodzaj='
  );
  const $ = cheerio.load(result);
  $(
    '#page_106 > div.main-content > div.mode.container > div > div > div.z-content-box-8 > div.table-box > table > tbody > tr'
  ).each(async (index, element) => {
    console.log($(element).text());
    const tds = $(element).find('td');
    const droga = $(tds[0]).text();
    const odcinek = $(tds[1]).text();
    const wojewodztwo = $(tds[2]).text();
    const rodzaj = $(tds[3]).text();
    const rozpoczecie = $(tds[5]).text();
    const zakonczenie = $(tds[6]).text();
    const scrapedRow = new Road({
      droga: droga,
      odcinek: odcinek,
      wojewodztwo: wojewodztwo,
      rodzaj: rodzaj,
      rozpoczecie: rozpoczecie,
      zakonczenie: zakonczenie,
    });
    scrapedRow.save();
  });
}
async function main() {
  await scraper();
}
module.exports = { main };
