const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');
// const $ = cheerio.load(html);


const baseURL = 'https://www.yellowpages.com';
const searchURL = '/search?search_terms=Medical%20Ambulance&geo_location_terms=marin%20county';


const getCityState = async () => {
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('div.locality', html).map(async (i, e) => {

  // let $ = cheerio.load('div.locality', html);
  let $ = cheerio.load(html);


  // console.log('i =', i );
  // if ( $('div.locality').length >0 ) {
  //   console.log('lengthv yes', $('div.locality').length );    
  // } else{
  //   console.log('No length' );    
  // }


  console.log('i =', i );
  if ( e.children[0].parent.children[0].data ) {
    console.log('value =', e.children[0].parent.children[0].data );    
  } else{
    console.log('No length' );    
  }
    

   // if ( div.locality has value ){
   //   return  the value
   // } else {
   //   return hyphen
   // }


   const City = e.children[0].parent.children[0].data; 

    return {
        City,
    }
  }).get();
  return Promise.all(businessMap);
};







getCityState()
  .then(result => {
    const transformed = new otcsv(result);
    return transformed.toDisk('./output3.csv');
  })
  .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE'));




