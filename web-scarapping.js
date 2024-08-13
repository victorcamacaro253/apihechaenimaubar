const axios = require('axios');
const cheerio = require('cheerio');

// URL del sitio web que deseas raspar
const url = 'http://example.com';
async function scrapeData() {
  try {
    // Realiza una solicitud HTTP a la URL
    const { data } = await axios.get(url);
    
    // Carga el HTML en cheerio
    const $ = cheerio.load(data);

    // Extrae datos según sea necesario
    // Aquí estamos extrayendo todos los títulos de los elementos <h2>
    $('p').each((i, element) => {
      console.log($(element).text());
    });
  } catch (error) {
    console.error('Error al realizar el scraping:', error);
  }
}

scrapeData();