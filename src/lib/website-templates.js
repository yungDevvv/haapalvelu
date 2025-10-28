// Pre-built wedding website templates with complete designs

export const websiteTemplates = [
  {
    id: 'laskuri',
    name: 'Laskuri',
    type: 'Hääsivu',
    description: 'Elegantti ja harmoninen sivupohja yhdellä yhtenäisellä taustalla',
    thumbnail: '/templates/laskuri.jpg',
    theme: {
      name: 'lavender',
      colors: {
        primary: '#6b5b7b',
        secondary: '#9b8bb0',
        accent: '#c8b8d8'
      },
      fonts: {
        heading: 'font-serif',
        body: 'font-sans'
      }
    },
    // Global style settings - единые для всего сайта
    globalStyles: {
      background: {
        color: '#e8dff5' // Единый светлый лавандовый фон для ВСЕГО сайта
      },
      textBlock: {
        color: '#4a4a4a',
        font: 'lato',
        size: 16,
        bold: false,
        italic: false
      },
      largeHeadings: {
        color: '#6b5b7b',
        font: 'amatic-sc',
        size: 64,
        bold: true,
        italic: false
      },
      mediumHeadings: {
        color: '#6b5b7b',
        font: 'montserrat',
        size: 32,
        bold: true,
        italic: false
      },
      smallHeadings: {
        color: '#6b5b7b',
        font: 'montserrat',
        size: 20,
        bold: true,
        italic: false
      },
      links: {
        color: '#9b8bb0',
        font: 'lato',
        size: 16,
        bold: false,
        italic: false,
        underline: true
      }
    },
    // ВАЖНО: Все блоки используют один и тот же фон!
    blockDefaults: {
      hero: {
        titleFont: 'amatic-sc',
        subtitleFont: 'montserrat',
        backgroundColor: '#e8dff5',
        titleColor: '#6b5b7b',
        subtitleColor: '#6b5b7b',
        paddingY: 140,
        paddingX: 24,
        overlay: false,
        overlayOpacity: 0
      },
      heading: {
        font: 'amatic-sc',
        color: '#6b5b7b',
        backgroundColor: '#e8dff5',
        paddingY: 20,
        paddingX: 24,
        alignment: 'center'
      },
      text: {
        titleFont: 'amatic-sc',
        contentFont: 'lato',
        titleColor: '#6b5b7b',
        contentColor: '#4a4a4a',
        backgroundColor: '#e8dff5',
        paddingY: 20,
        paddingX: 24,
        alignment: 'center'
      },
      program: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#e8dff5',
        titleColor: '#6b5b7b',
        descriptionColor: '#6b5b7b',
        cardColor: '#ffffff',
        accentColor: '#9b8bb0',
        paddingY: 0,
        paddingX: 24
      },
      countdown: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#e8dff5',
        titleColor: '#6b5b7b',
        descriptionColor: '#6b5b7b',
        paddingY: 20,
        paddingX: 24
      },
      rsvp: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#e8dff5',
        titleColor: '#6b5b7b',
        descriptionColor: '#6b5b7b',
        buttonColor: '#9b8bb0',
        paddingY: 20,
        paddingX: 24
      },
      gallery: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#e8dff5',
        titleColor: '#6b5b7b',
        paddingY: 80,
        paddingX: 24
      },
      divider: {
        backgroundColor: '#e8dff5',
        color: '#b19cd9',
        width: 250,
        paddingY: 10
      },
      spacer: {
        backgroundColor: '#e8dff5',
        height: 40
      }
    },
    blocks: [
      // Hero Block
      {
        id: '1',
        type: 'hero',
        data: {
          title: 'Anna & Mikael',
          subtitle: 'Vietämme yhteisen elämämme',
          date: '20.07.2025',
          location: 'Helsinki, Suomi',
          titleFont: 'amatic-sc',
          subtitleFont: 'montserrat',
          backgroundColor: '#e8dff5',
          backgroundImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070',
          paddingY: 160,
          paddingX: 24,
          overlay: true,
          overlayOpacity: 0.4
        }
      },
      // Countdown section heading
      {
        id: '22',
        type: 'spacer',
        data: {
          height: 40,
          backgroundColor: '#e8dff5'
        }
      },
      {
        id: '2a',
        type: 'heading',
        data: {
          text: 'Laskuri',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#6b5b7b',
          backgroundColor: '#e8dff5',
          paddingY: 20,
          paddingX: 24
        }
      },
      // Countdown section description
      {
        id: '2b',
        type: 'text',
        data: {
          content: 'Kuinka kauan elämämme kauneimpaan päivään',
          contentFont: 'lato',
          contentColor: '#6b5b7b',
          backgroundColor: '#e8dff5',
          alignment: 'center',
          paddingY: 20,
          paddingX: 24
        }
      },
      // Countdown Block
      {
        id: '2c',
        type: 'countdown',
        data: {
          targetDate: '2025-07-20T15:00:00',
          backgroundColor: '#e8dff5',
          titleColor: '#6b5b7b',
          styleVariant: 'cards',
          paddingY: 20,
          paddingX: 24
        }
      },
      // Divider Block 1
      {
        id: '2.5',
        type: 'divider',
        data: {
          dividerStyle: '4',
          backgroundColor: '#e8dff5',
          color: '#b19cd9',
          width: 450,
          paddingY: 40
        }
      },
      // Heading Block - Story title
      {
        id: '3a',
        type: 'heading',
        data: {
          text: 'Meidän Tarinamme',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#6b5b7b',
          backgroundColor: '#e8dff5'
        }
      },
      // Text Block - Story content
      {
        id: '3b',
        type: 'text',
        data: {
          content: '<p>Tapasimme ensimmäisen kerran viisi vuotta sitten yliopiston kirjastossa. Anna oli ujo opiskelija, Mikael rohkea keskustelun aloittaja.</p><p>Vuosien varrella rakastumme kasvoi syvemmäksi. Yhteiset illat kahvilassa, pitkät kävelyt kaupungilla ja lukemattomat naurut yhdistivät meidät.</p><p><em>"Jokainen hetki kanssasi on lahja. Haluan viettää loppuelämäni sinun kanssasi."</em></p>',
          contentFont: 'lato',
          contentColor: '#4a4a4a',
          backgroundColor: '#e8dff5',
          alignment: 'center'
        }
      },
      // Divider Block 2
      {
        id: '3.5',
        type: 'divider',
        data: {
          dividerStyle: '4',
          backgroundColor: '#e8dff5',
          color: '#b19cd9',
          width: 450,
          paddingY: 40
        }
      },
      // Program section heading moved out of Program block
      {
        id: '3.6',
        type: 'heading',
        data: {
          text: 'Päivän Ohjelma',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#6b5b7b',
          backgroundColor: '#e8dff5'
        }
      },
      {
        id: '3.7',
        type: 'text',
        data: {
          content: 'Liity mukaan juhlimaan kanssamme',
          contentFont: 'lato',
          contentColor: '#6b5b7b',
          backgroundColor: '#e8dff5',
          alignment: 'center'
        }
      },

      // Program Block
      {
        id: '4',
        type: 'program',
        data: {
          title: '',
          description: '',
          titleFont: 'amatic-sc',
          descriptionFont: 'lato',
          backgroundColor: '#e8dff5',
          titleColor: '#6b5b7b',
          descriptionColor: '#6b5b7b',
          cardColor: '#ffffff',
          accentColor: '#9b8bb0',
          events: [
            {
              time: '14:00',
              title: 'Tervetuloa',
              description: 'Vieraiden saapuminen ja kahvit',
              location: 'Juhlasali'
            },
            {
              time: '15:00',
              title: 'Vihkiminen',
              description: 'Vihkiseremonia kappelissa',
              location: 'Kappeli'
            },
            {
              time: '16:00',
              title: 'Vastaanotto',
              description: 'Kuohuviini ja onnittelut',
              location: 'Juhlasali'
            },
            {
              time: '17:30',
              title: 'Illallinen',
              description: 'Hääillallinen ja puheet',
              location: 'Juhlasali'
            },
            {
              time: '20:00',
              title: 'Häävalssı',
              description: 'Ensimmäinen tanssimme',
              location: 'Tanssılattia'
            },
            {
              time: '21:00',
              title: 'Tanssiaiset',
              description: 'Musiikkia ja juhlintaa',
              location: 'Tanssılattia'
            }
          ]
        }
      },
      // RSVP section heading
      {
        id: '88',
        type: 'divider',
        data: {
          dividerStyle: '4',
          backgroundColor: '#e8dff5',
          color: '#b19cd9',
          width: 450,
          paddingY: 40
        }
      },
      {
        id: '5a',
        type: 'heading',
        data: {
          text: 'RSVP',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#6b5b7b',
          backgroundColor: '#e8dff5',
          paddingY: 20,
          paddingX: 24
        }
      },
      // RSVP section description
      {
        id: '5b',
        type: 'text',
        data: {
          content: 'Vahvista osallistumisesi viimeistään 01.06.2025',
          contentFont: 'lato',
          contentColor: '#6b5b7b',
          backgroundColor: '#e8dff5',
          alignment: 'center',
          paddingY: 20,
          paddingX: 24
        }
      },
      // RSVP Block
      {
        id: '5c',
        type: 'rsvp',
        data: {
          backgroundColor: '#e8dff5',
          buttonColor: '#9b8bb0',
          styleVariant: 'cards',
          paddingY: 20,
          paddingX: 24
        }
      },
      // Gallery section heading
      {
        id: '89',
        type: 'divider',
        data: {
          dividerStyle: '4',
          backgroundColor: '#e8dff5',
          color: '#b19cd9',
          width: 450,
          paddingY: 40
        }
      },
      {
        id: '6a',
        type: 'heading',
        data: {
          text: 'Muistoja',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#6b5b7b',
          backgroundColor: '#e8dff5',
          paddingY: 20,
          paddingX: 24
        }
      },
      // Gallery section description
      {
        id: '6b',
        type: 'text',
        data: {
          content: 'Yhteisiä hetkiämme',
          contentFont: 'lato',
          contentColor: '#6b5b7b',
          backgroundColor: '#e8dff5',
          alignment: 'center',
          paddingY: 20,
          paddingX: 24
        }
      },
      // Gallery Block
      {
        id: '6c',
        type: 'gallery',
        data: {
          backgroundColor: '#e8dff5',
          paddingY: 20,
          paddingX: 24,
          images: [
            { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070', caption: 'Romanttinen hetki' },
            { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2070', caption: 'Yhdessä' },
            { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=2071', caption: 'Rakkaus' },
            { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070', caption: 'Onnelliset' },
            // { url: 'https://images.unsplash.com/photo-1529634118570-e5aa47071e0d?q=80&w=2069', caption: 'Sormukset' },
            // { url: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=2070', caption: 'Juhla' }
          ]
        }
      },
      // Spacer block
      {
        id: '7',
        type: 'spacer',
        data: {
          height: 60,
          backgroundColor: '#e8dff5'
        }
      }
    ]
  },

  {
    id: 'yopiminen',
    name: 'Yöpiminen',
    type: 'Hääsivu',
    description: 'Tumma ja elegantti sivupohja yhtenäisellä taustalla',
    thumbnail: '/templates/yopiminen.jpg',
    theme: {
      name: 'midnight',
      colors: {
        primary: '#1a4d5e',
        secondary: '#2d6b7f',
        accent: '#4a8a9f'
      },
      fonts: {
        heading: 'font-serif',
        body: 'font-sans'
      }
    },
    // Global style settings - темный единый фон
    globalStyles: {
      background: {
        color: '#1a4d5e' // Темный teal/navy фон для ВСЕГО сайта
      },
      textBlock: {
        color: '#e8f4f8',
        font: 'lato',
        size: 16,
        bold: false,
        italic: false
      },
      largeHeadings: {
        color: '#ffffff',
        font: 'amatic-sc',
        size: 56,
        bold: true,
        italic: false
      },
      mediumHeadings: {
        color: '#ffffff',
        font: 'montserrat',
        size: 32,
        bold: true,
        italic: false
      },
      smallHeadings: {
        color: '#e8f4f8',
        font: 'montserrat',
        size: 20,
        bold: true,
        italic: false
      },
      links: {
        color: '#4a8a9f',
        font: 'lato',
        size: 16,
        bold: false,
        italic: false,
        underline: true
      }
    },
    // Все блоки используют один темный фон
    blockDefaults: {
      hero: {
        titleFont: 'amatic-sc',
        subtitleFont: 'montserrat',
        backgroundColor: '#1a4d5e',
        titleColor: '#ffffff',
        subtitleColor: '#e8f4f8',
        paddingY: 140,
        paddingX: 24,
        overlay: false,
        overlayOpacity: 0
      },
      heading: {
        font: 'amatic-sc',
        color: '#ffffff',
        backgroundColor: '#1a4d5e',
        paddingY: 20,
        paddingX: 24,
        alignment: 'center'
      },
      text: {
        titleFont: 'amatic-sc',
        contentFont: 'lato',
        titleColor: '#ffffff',
        contentColor: '#e8f4f8',
        backgroundColor: '#1a4d5e',
        paddingY: 20,
        paddingX: 24,
        alignment: 'center'
      },
      program: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#1a4d5e',
        titleColor: '#ffffff',
        descriptionColor: '#e8f4f8',
        cardColor: '#2d6b7f',
        accentColor: '#4a8a9f',
        paddingY: 80,
        paddingX: 24
      },
      countdown: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#1a4d5e',
        titleColor: '#ffffff',
        descriptionColor: '#e8f4f8',
        paddingY: 80,
        paddingX: 24
      },
      rsvp: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#1a4d5e',
        titleColor: '#ffffff',
        descriptionColor: '#e8f4f8',
        buttonColor: '#4a8a9f',
        paddingY: 80,
        paddingX: 24
      },
      gallery: {
        titleFont: 'amatic-sc',
        descriptionFont: 'lato',
        backgroundColor: '#1a4d5e',
        titleColor: '#ffffff',
        paddingY: 80,
        paddingX: 24
      },
      divider: {
        backgroundColor: '#1a4d5e',
        color: '#4a8a9f',
        width: 250,
        paddingY: 10
      },
      spacer: {
        backgroundColor: '#1a4d5e',
        height: 40
      }
    },
    blocks: [
      // Hero Block
      {
        id: '1',
        type: 'hero',
        data: {
          title: 'Yöpiminen ja Majoitus',
          subtitle: 'Tervetuloa viettämään viikonloppu kanssamme',
          date: '15-16.08.2025',
          location: 'Häämökki, Järvenpää',
          titleFont: 'amatic-sc',
          subtitleFont: 'montserrat',
          backgroundColor: '#1a4d5e',
          backgroundImage: '/editor/placeholder_images/hero_1.jpg',
          paddingY: 160,
          paddingX: 24,
          overlay: true,
          overlayOpacity: 0.5
        }
      },
      // Heading Block - Info title
      {
        id: '2a',
        type: 'heading',
        data: {
          text: 'Yöpiminen ja Majoitus',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#ffffff',
          backgroundColor: '#1a4d5e'
        }
      },
      // Text Block - Info content
      {
        id: '2b',
        type: 'text',
        data: {
          content: '<p>Toivomme, että mahdollisimman moni pystyy jäämään kanssamme viettämään auringonlaskun aikaan. Sen vuoksi tarjoamme hääpaikalla yöpymismahdollisuuksia.</p><p>Mikäli suunnitteletеkin jäämänne linjailemaan, ilmoittakaamme myös pysyttytä oman teltan kanssa tai vuokrattavana on tilassa seuraavia vaihtoehtoja:</p>',
          contentFont: 'lato',
          contentColor: '#e8f4f8',
          backgroundColor: '#1a4d5e',
          alignment: 'center'
        }
      },
      // Divider Block 1
      {
        id: '2.5',
        type: 'divider',
        data: {
          dividerStyle: '4',
          backgroundColor: '#1a4d5e',
          color: '#5eb8d4',
          width: 250,
          paddingY: 40
        }
      },
      // Program Block
      {
        id: '3',
        type: 'program',
        data: {
          title: 'Ohjelma',
          description: 'Toivomme, että saavutte paikalle ehkällä kauneimpa päivään vaatteissanne.',
          titleFont: 'amatic-sc',
          descriptionFont: 'lato',
          backgroundColor: '#1a4d5e',
          titleColor: '#ffffff',
          descriptionColor: '#e8f4f8',
          cardColor: '#2d6b7f',
          accentColor: '#4a8a9f',
          events: [
            {
              time: '14:00',
              title: 'Vihkiminen',
              description: 'Ulkoilmaseremonia ja juhlavieraatся keskästä. Seremonia järjestetään ulkona - ehkälle juhlаvaattoinen tai Kesätossu.',
              location: 'Puutarha'
            },
            {
              time: '17:00',
              title: 'Illallinen',
              description: 'Toivotainen Illallista kahdella aikaisemmin antaalla tilaisuudella. Vastaanotto tilaisuus toinen sisällä.',
              location: 'Suuri sali'
            },
            {
              time: '21:00',
              title: 'Tanssit',
              description: 'Viihtyvää musiikkia ja tunnelmaa yöhön',
              location: 'Tanssilattia'
            }
          ]
        }
      },
      // Divider Block 2
      {
        id: '3.5',
        type: 'divider',
        data: {
          dividerStyle: '4',
          backgroundColor: '#1a4d5e',
          color: '#5eb8d4',
          width: 250,
          paddingY: 40
        }
      },
      // Heading Block - Additional info title
      {
        id: '4a',
        type: 'heading',
        data: {
          text: 'Muuta',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#ffffff',
          backgroundColor: '#1a4d5e'
        }
      },
      // Text Block - Additional info content
      {
        id: '4b',
        type: 'text',
        data: {
          content: '<p>Juhlapaikalla ei alkussa suurilla asummaista. Suurestaan juhlimisessa ja yhteisen kohtaamassa vietetyssä ajasta. Tilа tarjoaa parhauden illansuoksen suomalaista tauluissa, jossa kaikkilla vierailla mahdollinen tutustua ja virkua.</p>',
          contentFont: 'lato',
          contentColor: '#e8f4f8',
          backgroundColor: '#1a4d5e',
          alignment: 'center'
        }
      },
      // RSVP section heading
      {
        id: '5a',
        type: 'heading',
        data: {
          text: 'RSVP',
          level: 'h2',
          alignment: 'center',
          font: 'amatic-sc',
          color: '#ffffff',
          backgroundColor: '#1a4d5e',
          paddingY: 20,
          paddingX: 24
        }
      },
      // RSVP section description
      {
        id: '5b',
        type: 'text',
        data: {
          content: 'Vahvista osallistumisesi viimeistään 01.07.2025',
          contentFont: 'lato',
          contentColor: '#e8f4f8',
          backgroundColor: '#1a4d5e',
          alignment: 'center',
          paddingY: 20,
          paddingX: 24
        }
      },
      // RSVP Block
      {
        id: '5c',
        type: 'rsvp',
        data: {
          backgroundColor: '#1a4d5e',
          buttonColor: '#4a8a9f',
          styleVariant: 'cards',
          paddingY: 20,
          paddingX: 24
        }
      },
      // Gallery Block
      // {
      //   id: '6',
      //   type: 'gallery',
      //   data: {
      //     title: 'Muistoja',
      //     description: 'Yhteisiä hetkiämme',
      //     titleFont: 'amatic-sc',
      //     descriptionFont: 'lato',
      //     backgroundColor: '#1a4d5e',
      //     titleColor: '#ffffff',
      //     images: [
      //       { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070', caption: 'Romanttinen hetki' },
      //       { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2070', caption: 'Yhdessä' },
      //       { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=2071', caption: 'Rakkaus' },
      //       { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070', caption: 'Onnelliset' },
      //       { url: 'https://images.unsplash.com/photo-1529634118570-e5aa47071e0d?q=80&w=2069', caption: 'Sormukset' },
      //       { url: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=2070', caption: 'Juhla' }
      //     ]
      //   }
      // }
      // Spacer block
      {
        id: '7',
        type: 'spacer',
        data: {
          height: 60,
          backgroundColor: '#1a4d5e'
        }
      }
    ]
  }
];

// Function to get template by ID
export function getTemplateById(id) {
  return websiteTemplates.find(template => template.id === id);
}

// Function to get all templates
export function getAllTemplates() {
  return websiteTemplates;
}
