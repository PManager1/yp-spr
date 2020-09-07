
const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');


const baseURL = 'https://www.yellowpages.com';
const searchURL = '/search?search_terms=Medical%20Ambulance&geo_location_terms=marin%20county';


const getCompanies = async () => {
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('div.street-address', html).map(async (i, e) => {

    // console.log('15-businessMap =', cheerio('a.business-name', html) ); // original

    // console.log('15-stree-address =', e.children[0].parent.children[0].data );

  

    console.log('i =', i );
    console.log(' each length = ', e.children[0].parent.children[0].data.length ); 
    
  if ( e.children[0].parent.children[0].data.length > 0 ) {
    console.log('value =', e.children[0].parent.children[0].data );    
  } else{
    console.log('======= No length' );    
  }


    return {
      // emailAddress,
      // link,
      // name,
      // phone,
      // companyName,
      // address,
    }
  }).get();
  return Promise.all(businessMap);
};

getCompanies()
  .then(result => {
    const transformed = new otcsv(result);
    return transformed.toDisk('./output3.csv');
  })
  .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE'));




