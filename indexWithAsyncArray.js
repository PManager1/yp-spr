
const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');


const baseURL = 'https://www.yellowpages.com';
const searchURL = '/search?search_terms=Medical%20Ambulance&geo_location_terms=Los%20Angeles%2C%20CA&page=2';

// Function
const getCompanies = async () => {
  console.log(' calling getCompanies'); 
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('a.business-name', html).map(async (i, e) => {

    const link = baseURL + e.attribs.href;
    const innerHtml = await rp(link);


    const emailAddress = cheerio('a.email-business', innerHtml).prop('href');
    const name = e.children[0].data;
    const phone = cheerio('p.phone', innerHtml).text();


    const name2 = cheerio('h1', innerHtml).text();  //do it the right way 
    // console.log('36- name2 = ', name2); 


    const bizName= link.substr(link.lastIndexOf('/') + 1);
    const companyName= bizName.substring(0, bizName.length - 10);


    return {
      emailAddress,
      link,
      name,
      phone,
      companyName,
    }
  })
  .get();
  return Promise.all(businessMap);
};


// Function
const getStreetAddress = async () => {
  console.log(' calling getStreetAddress'); 
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('div.street-address', html).map(async (i, e) => {

    // console.log('15-stree-address =', e.children[0].parent.children[0].data );
    const streetAddress = e.children[0].parent.children[0].data;

    return {
      streetAddress,
    }

  })
  .get();
  return Promise.all(businessMap);
};




function getData() {
  // the Fetch API returns a Promise
  getCompanies()
    .then((response) => {
      console.log('69--first result =', response); 
      // `.then()` is called after the request is complete
      // this is part of the Fetch API for handling JSON-encoded responses
      // return response.json();
    })
    .then((response) => {
      // We can do whatever we want with the data now!
      console.log('76--',response);
    })

    getStreetAddress()
    .then((response) => {
      console.log('81--result for getStreetAddress =', response); 
      // `.then()` is called after the request is complete
      // this is part of the Fetch API for handling JSON-encoded responses
      // return response.json();
    })


    .then((response) => {
      // We can do whatever we want with the data now!
      console.log(response);
    });
}
getData();



function runSerial() {
    var that = this;
    // task1 is a function that returns a promise (and immediately starts executing)
    // task2 is a function that returns a promise (and immediately starts executing)
    return Promise.resolve()
        .then(function() {
            return that.task1();
        })
        .then(function() {
            return that.task2();
        })
        .then(function() {
            console.log(" ---- done ----");
        });
}



// userProfileData(); 



// // CALLING EACH FUNCTIONS 
// getCompanies()
//   .then(result => {
//     // result from first 
//     console.log('first result =', result); 

//     // combine the results here // add to the object. 
//     //

//     // const transformed = new otcsv(result);
//     // return transformed.toDisk('./output4.csv');
//   }). then(
//   getStreetAddress()
//   .then(result => {
//     // result from first 
//     console.log('getStreetAddress result =', result); 

//     // combine the results here // add to the object. 

//     const transformed = new otcsv(result);
//     return transformed.toDisk('./output4.csv');
//   }))
//   .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE'));




















// sonole.log 