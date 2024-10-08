import  get  from 'axios';
import { load } from 'cheerio';

// URL del sitio web que deseas raspar
const url = 'https://www.laliga.com/es-GB/laliga-easports/clasificacion';
async function scrapeData() {
  try {
    // Realiza una solicitud HTTP a la URL
    const { data } = await get(url);
    
    // Carga el HTML en cheerio
    const $ = load(data);

    // Extrae datos según sea necesario
    // Aquí estamos extrayendo todos los títulos de los elementos <h2>
    $('.styled__StandingTabHeader-sc-e89col-7').each((i, element) => {
      console.log($(element).text());
    });


    $('.styled__ContainerAccordion-sc-e89col-11 ').each((i, elements) => {
      console.log($(elements).text());
    });

  } catch (error) {
    console.error('Error al realizar el scraping:', error);
  }
}

scrapeData();