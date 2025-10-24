"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save, Eye, Code, Trash2, RotateCcw } from "lucide-react";

export function WeddingSiteBuilder({ fullscreen = false }) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const editorInstance = grapesjs.init({
      container: '#gjs-editor',
      height: '100%',
      width: 'auto',
      plugins: [gjsBlocksBasic, gjsPresetWebpage],
      storageManager: {
        id: 'wedding-site-',
        type: 'local',
        autosave: true,
        autoload: true,
        storeComponents: true,
        storeStyles: true,
        storeHtml: true,
        storeCss: true,
      },
      deviceManager: {
        devices: [
          {
            id: 'desktop',
            name: 'Työpöytä',
            width: '',
          },
          {
            id: 'tablet',
            name: 'Tabletti',
            width: '768px',
          },
          {
            id: 'mobile',
            name: 'Mobiili',
            width: '320px',
          },
        ]
      },
      pluginsOpts: {
        'grapesjs-blocks-basic': {
          flexGrid: true,
          category: 'Basic',
        },
        'grapesjs-preset-webpage': {
          blocks: ['link-block', 'quote', 'text-basic'],
          modalImportTitle: 'Tuo koodi',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Liitä HTML/CSS</div>',
          modalImportContent: function(editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          },
        },
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
        ]
      },
      i18n: {
        locale: 'fi',
        detectLocale: false,
        messages: {
          fi: {
            assetManager: {
              addButton: 'Lisää kuva',
              inputPlh: 'http://polku/kuvaan.jpg',
              modalTitle: 'Valitse kuva',
              uploadTitle: 'Pudota tiedostot tähän tai klikkaa ladataksesi',
            },
            blockManager: {
              labels: {
                // Basic blocks
                'column1': '1 Sarake',
                'column2': '2 Saraketta',
                'column3': '3 Saraketta',
                'column3-7': '2 Saraketta 3/7',
                'text': 'Teksti',
                'link': 'Linkki',
                'image': 'Kuva',
                'video': 'Video',
                'map': 'Kartta',
                // Preset webpage blocks
                'link-block': 'Linkkilohko',
                'quote': 'Lainaus',
                'text-basic': 'Perus teksti',
                'sect100': 'Osio 100%',
                'sect50': 'Osio 50/50',
                'sect30': 'Osio 30/70',
                'sect37': 'Osio 3 saraketta',
                'button': 'Painike',
                'divider': 'Erottaja',
                'text-section': 'Tekstiosio',
                'header': 'Ylätunniste',
                'paragraph': 'Kappale',
                'list-items': 'Listakohdat',
                'grid-items': 'Ruudukkokohdat',
                'form': 'Lomake',
                'input': 'Syöttökenttä',
                'textarea': 'Tekstialue',
                'select': 'Valintavalikko',
                'checkbox': 'Valintaruutu',
                'radio': 'Radiopainike',
                'label': 'Merkintä',
                'table': 'Taulukko',
                'navbar': 'Navigointipalkki',
                'countdown': 'Lähtölaskenta',
                'tabs': 'Välilehdet',
                'tooltip': 'Työkaluvihje',
              },
              categories: {
                'Basic': 'Perus',
                'Extra': 'Lisää',
                'Forms': 'Lomakkeet',
                'Hääblokit': 'Hääblokit',
              }
            },
            domComponents: {
              names: {
                '': 'Laatikko',
                wrapper: 'Sisältö',
                text: 'Teksti',
                comment: 'Kommentti',
                image: 'Kuva',
                video: 'Video',
                label: 'Merkintä',
                link: 'Linkki',
                map: 'Kartta',
                tfoot: 'Taulukon alatunniste',
                tbody: 'Taulukon runko',
                thead: 'Taulukon ylätunniste',
                table: 'Taulukko',
                row: 'Taulukon rivi',
                cell: 'Taulukon solu',
              }
            },
            deviceManager: {
              device: 'Laite',
              devices: {
                desktop: 'Työpöytä',
                tablet: 'Tabletti',
                mobileLandscape: 'Mobiili vaaka',
                mobilePortrait: 'Mobiili pysty',
              }
            },
            panels: {
              buttons: {
                titles: {
                  preview: 'Esikatselu',
                  fullscreen: 'Koko näyttö',
                  'sw-visibility': 'Näytä komponentit',
                  'export-template': 'Näytä koodi',
                  'open-sm': 'Avaa tyylienhallinta',
                  'open-tm': 'Asetukset',
                  'open-layers': 'Avaa tasohallinta',
                  'open-blocks': 'Avaa lohkot',
                }
              }
            },
            selectorManager: {
              label: 'Luokat',
              selected: 'Valittu',
              emptyState: '- Tila -',
              states: {
                hover: 'Osoitus',
                active: 'Klikkaus',
                'nth-of-type(2n)': 'Parilliset/Parittomat',
              }
            },
            styleManager: {
              empty: 'Valitse elementti ennen tyylinhallinnan käyttöä',
              layer: 'Taso',
              fileButton: 'Kuvat',
              sectors: {
                general: 'Yleinen',
                layout: 'Asettelu',
                typography: 'Typografia',
                decorations: 'Koristeet',
                extra: 'Lisää',
                flex: 'Flex',
                dimension: 'Mitat',
              },
              properties: {
                // Dimension
                'width': 'Leveys',
                'height': 'Korkeus',
                'max-width': 'Maks leveys',
                'max-height': 'Maks korkeus',
                'min-width': 'Min leveys',
                'min-height': 'Min korkeus',
                // Margin & Padding
                'margin': 'Reunus',
                'margin-top': 'Yläreunus',
                'margin-right': 'Oikea reunus',
                'margin-bottom': 'Alareunus',
                'margin-left': 'Vasen reunus',
                'margin-top-sub': 'Ylä',
                'margin-right-sub': 'Oikea',
                'margin-bottom-sub': 'Ala',
                'margin-left-sub': 'Vasen',
                'padding': 'Sisennys',
                'padding-top': 'Yläsisennys',
                'padding-right': 'Oikea sisennys',
                'padding-bottom': 'Alasisennys',
                'padding-left': 'Vasen sisennys',
                'padding-top-sub': 'Ylä',
                'padding-right-sub': 'Oikea',
                'padding-bottom-sub': 'Ala',
                'padding-left-sub': 'Vasen',
                // Position & Display
                'display': 'Näyttö',
                'position': 'Sijainti',
                'top': 'Ylä',
                'right': 'Oikea',
                'bottom': 'Ala',
                'left': 'Vasen',
                'float': 'Kellutus',
                'clear': 'Tyhjennä',
                'z-index': 'Z-indeksi',
                'overflow': 'Ylivuoto',
                'overflow-x': 'Ylivuoto X',
                'overflow-y': 'Ylivuoto Y',
                // Typography
                'font-family': 'Fontti',
                'font-size': 'Fonttikoko',
                'font-weight': 'Fonttipaino',
                'font-style': 'Fonttityyli',
                'letter-spacing': 'Kirjainväli',
                'line-height': 'Rivikorkeus',
                'text-align': 'Tekstin tasaus',
                'text-decoration': 'Tekstin koristelu',
                'text-transform': 'Tekstin muunnos',
                'text-shadow': 'Tekstin varjo',
                'text-shadow-h': 'X',
                'text-shadow-v': 'Y',
                'text-shadow-blur': 'Sumennus',
                'text-shadow-color': 'Väri',
                'color': 'Väri',
                'vertical-align': 'Pystytasaus',
                'white-space': 'Välilyönti',
                'word-spacing': 'Sanaväli',
                // Background
                'background': 'Tausta',
                'background-color': 'Taustaväri',
                'background-image': 'Taustakuva',
                'background-repeat': 'Toista tausta',
                'background-position': 'Taustan sijainti',
                'background-attachment': 'Taustan kiinnitys',
                'background-size': 'Taustan koko',
                'background-image-sub': 'Kuva',
                'background-repeat-sub': 'Toista',
                'background-position-sub': 'Sijainti',
                'background-attachment-sub': 'Kiinnitys',
                'background-size-sub': 'Koko',
                // Border
                'border': 'Reunaviiva',
                'border-width': 'Reunaviivan leveys',
                'border-style': 'Reunaviivan tyyli',
                'border-color': 'Reunaviivan väri',
                'border-radius': 'Kulman pyöreys',
                'border-top-left-radius': 'Ylä vasen pyöreys',
                'border-top-right-radius': 'Ylä oikea pyöreys',
                'border-bottom-left-radius': 'Ala vasen pyöreys',
                'border-bottom-right-radius': 'Ala oikea pyöreys',
                'border-width-sub': 'Leveys',
                'border-style-sub': 'Tyyli',
                'border-color-sub': 'Väri',
                'border-top-left-radius-sub': 'Ylä vasen',
                'border-top-right-radius-sub': 'Ylä oikea',
                'border-bottom-right-radius-sub': 'Ala oikea',
                'border-bottom-left-radius-sub': 'Ala vasen',
                // Box Shadow
                'box-shadow': 'Laatikon varjo',
                'box-shadow-h': 'X',
                'box-shadow-v': 'Y',
                'box-shadow-blur': 'Sumennus',
                'box-shadow-spread': 'Levitys',
                'box-shadow-color': 'Väri',
                'box-shadow-type': 'Tyyppi',
                // Transform
                'transform': 'Muunnos',
                'transform-rotate-x': 'Kierrä X',
                'transform-rotate-y': 'Kierrä Y',
                'transform-rotate-z': 'Kierrä Z',
                'transform-scale-x': 'Skaalaa X',
                'transform-scale-y': 'Skaalaa Y',
                'transform-scale-z': 'Skaalaa Z',
                // Transition
                'transition': 'Siirtymä',
                'transition-property': 'Siirtymän ominaisuus',
                'transition-duration': 'Siirtymän kesto',
                'transition-timing-function': 'Siirtymän ajoitus',
                'transition-property-sub': 'Ominaisuus',
                'transition-duration-sub': 'Kesto',
                'transition-timing-function-sub': 'Ajoitus',
                // Flex
                'flex-direction': 'Flex-suunta',
                'flex-wrap': 'Flex-kääre',
                'justify-content': 'Tasaus sisältö',
                'align-items': 'Kohdista kohteet',
                'align-content': 'Kohdista sisältö',
                'order': 'Järjestys',
                'flex-basis': 'Flex-perusta',
                'flex-grow': 'Flex-kasvu',
                'flex-shrink': 'Flex-kutistus',
                'align-self': 'Kohdista itse',
                // Others
                'opacity': 'Läpinäkyvyys',
                'cursor': 'Kursori',
                'pointer-events': 'Osoitintapahtumat',
                'list-style': 'Listan tyyli',
                'list-style-type': 'Listan tyypin tyyppi',
                'visibility': 'Näkyvyys',
              },
              // Translate option values
              options: {
                float: {
                  none: 'Ei mitään',
                  left: 'Vasen',
                  right: 'Oikea',
                },
                display: {
                  none: 'Ei mitään',
                  block: 'Lohko',
                  inline: 'Rivissä',
                  'inline-block': 'Rivissä lohko',
                  flex: 'Flex',
                  'inline-flex': 'Rivissä flex',
                  grid: 'Ruudukko',
                  'inline-grid': 'Rivissä ruudukko',
                },
                position: {
                  static: 'Staattinen',
                  relative: 'Suhteellinen',
                  absolute: 'Absoluuttinen',
                  fixed: 'Kiinteä',
                  sticky: 'Tahmea',
                },
                'text-align': {
                  left: 'Vasen',
                  center: 'Keskitetty',
                  right: 'Oikea',
                  justify: 'Tasattu',
                },
                'font-weight': {
                  normal: 'Normaali',
                  bold: 'Lihavoitu',
                  lighter: 'Kevyempi',
                  bolder: 'Lihavampi',
                },
                'font-style': {
                  normal: 'Normaali',
                  italic: 'Kursiivi',
                  oblique: 'Vino',
                },
                'text-decoration': {
                  none: 'Ei mitään',
                  underline: 'Alleviivaus',
                  overline: 'Yläviiva',
                  'line-through': 'Yliviivaus',
                },
                'text-transform': {
                  none: 'Ei mitään',
                  capitalize: 'Alkukirjain iso',
                  uppercase: 'Isot kirjaimet',
                  lowercase: 'Pienet kirjaimet',
                },
                'background-repeat': {
                  repeat: 'Toista',
                  'repeat-x': 'Toista X',
                  'repeat-y': 'Toista Y',
                  'no-repeat': 'Älä toista',
                  space: 'Väli',
                  round: 'Pyöristä',
                },
                'background-position': {
                  left: 'Vasen',
                  center: 'Keski',
                  right: 'Oikea',
                  top: 'Ylä',
                  bottom: 'Ala',
                },
                'background-attachment': {
                  scroll: 'Vieritä',
                  fixed: 'Kiinteä',
                  local: 'Paikallinen',
                },
                'background-size': {
                  auto: 'Automaattinen',
                  cover: 'Peitä',
                  contain: 'Sisällytä',
                },
                'border-style': {
                  none: 'Ei mitään',
                  solid: 'Yhtenäinen',
                  dotted: 'Pisteviiva',
                  dashed: 'Katkoviiva',
                  double: 'Kaksoisviiva',
                  groove: 'Ura',
                  ridge: 'Harja',
                  inset: 'Sisennys',
                  outset: 'Ulonnys',
                },
                cursor: {
                  auto: 'Automaattinen',
                  default: 'Oletus',
                  pointer: 'Osoitin',
                  text: 'Teksti',
                  move: 'Siirrä',
                  'not-allowed': 'Ei sallittu',
                  crosshair: 'Ristikko',
                  'zoom-in': 'Lähennä',
                  'zoom-out': 'Loitonna',
                },
                overflow: {
                  visible: 'Näkyvä',
                  hidden: 'Piilotettu',
                  scroll: 'Vieritä',
                  auto: 'Automaattinen',
                },
                'flex-direction': {
                  row: 'Rivi',
                  'row-reverse': 'Rivi käänteinen',
                  column: 'Sarake',
                  'column-reverse': 'Sarake käänteinen',
                },
                'flex-wrap': {
                  nowrap: 'Ei käärrettä',
                  wrap: 'Kääre',
                  'wrap-reverse': 'Kääre käänteinen',
                },
                'justify-content': {
                  'flex-start': 'Flex alku',
                  'flex-end': 'Flex loppu',
                  center: 'Keskitetty',
                  'space-between': 'Väli välissä',
                  'space-around': 'Väli ympäri',
                  'space-evenly': 'Väli tasaisesti',
                },
                'align-items': {
                  'flex-start': 'Flex alku',
                  'flex-end': 'Flex loppu',
                  center: 'Keskitetty',
                  baseline: 'Perusviiva',
                  stretch: 'Venytä',
                },
              }
            },
            traitManager: {
              empty: 'Valitse elementti ennen ominaisuuksien hallinnan käyttöä',
              label: 'Komponentin asetukset',
              traits: {
                labels: {},
                attributes: {
                  id: { placeholder: 'esim. teksti-tassa' },
                  alt: { placeholder: 'esim. Teksti tässä' },
                  title: { placeholder: 'esim. Teksti tässä' },
                  href: { placeholder: 'esim. https://google.com' },
                },
                options: {
                  target: {
                    false: 'Tämä ikkuna',
                    _blank: 'Uusi ikkuna',
                  },
                },
              }
            },
            storageManager: {
              recover: 'Haluatko palauttaa tallentamattomat muutokset?',
            },
          }
        }
      }
    });

    addWeddingBlocks(editorInstance);
    setEditor(editorInstance);

    return () => {
      editorInstance?.destroy();
    };
  }, []);

  return (
    <div className={fullscreen ? "h-full" : "space-y-4"}>
      {!fullscreen && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Hääsivun Rakentaja
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Tallenna
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Lataa HTML
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Tyhjennä
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div 
        id="gjs-editor" 
        ref={editorRef} 
        className={fullscreen ? "h-full" : "border rounded-lg overflow-hidden"} 
        style={fullscreen ? { height: '100%' } : {}}
      />
    </div>
  );

  function handleSave() {
    if (editor) {
      editor.store();
      alert('Sivu tallennettu!');
    }
  }

  function handleExport() {
    if (!editor) return;
    const html = editor.getHtml();
    const css = editor.getCss();
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hääsivu</title>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-site.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    if (editor && confirm('Haluatko varmasti tyhjentää koko sivun?')) {
      editor.DomComponents.clear();
      editor.CssComposer.clear();
      localStorage.removeItem('wedding-site-components');
      localStorage.removeItem('wedding-site-styles');
    }
  }
}

function addWeddingBlocks(editor) {
  const blockManager = editor.BlockManager;
  
  // Wedding Hero Block
  blockManager.add('wedding-hero', {
    label: '💒 Hää Hero',
    content: `
      <div style="text-align: center; padding: 80px 20px; background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);">
        <h1 style="font-size: 3em; color: white; margin-bottom: 20px;">Anna & Mikael</h1>
        <p style="font-size: 1.5em; color: white; margin-bottom: 30px;">15.07.2024</p>
        <p style="font-size: 1.2em; color: white;">Suomenlinna, Helsinki</p>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Timeline Block
  blockManager.add('wedding-timeline', {
    label: '📅 Aikataulu',
    content: `
      <div style="padding: 60px 20px; max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 40px; color: #e91e63;">Päivän Ohjelma</h2>
        <div style="border-left: 3px solid #e91e63; padding-left: 30px;">
          <div style="margin-bottom: 30px;">
            <h3 style="color: #e91e63; font-size: 1.5em;">15:00 - Vihkiseremonia</h3>
            <p>Kirkko, Helsinki</p>
          </div>
          <div style="margin-bottom: 30px;">
            <h3 style="color: #e91e63; font-size: 1.5em;">17:00 - Juhla alkaa</h3>
            <p>Juhlatila, Suomenlinna</p>
          </div>
          <div style="margin-bottom: 30px;">
            <h3 style="color: #e91e63; font-size: 1.5em;">20:00 - Tanssi</h3>
            <p>DJ ja bändi</p>
          </div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Gallery Block
  blockManager.add('wedding-gallery', {
    label: '🖼️ Galleria',
    content: `
      <div style="padding: 60px 20px;">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 40px; color: #9c27b0;">Kuvagalleria</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto;">
          <div style="aspect-ratio: 1; background: #f0f0f0; border-radius: 8px;"></div>
          <div style="aspect-ratio: 1; background: #f0f0f0; border-radius: 8px;"></div>
          <div style="aspect-ratio: 1; background: #f0f0f0; border-radius: 8px;"></div>
          <div style="aspect-ratio: 1; background: #f0f0f0; border-radius: 8px;"></div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // RSVP Block
  blockManager.add('wedding-rsvp', {
    label: '✉️ RSVP',
    content: `
      <div style="padding: 60px 20px; background: #fce4ec; text-align: center;">
        <h2 style="font-size: 2.5em; margin-bottom: 30px; color: #e91e63;">Vahvista Osallistumisesi</h2>
        <form style="max-width: 500px; margin: 0 auto;">
          <input type="text" placeholder="Nimesi" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e91e63; border-radius: 8px; font-size: 1em;">
          <input type="email" placeholder="Sähköposti" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e91e63; border-radius: 8px; font-size: 1em;">
          <select style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e91e63; border-radius: 8px; font-size: 1em;">
            <option>Tulen</option>
            <option>En voi tulla</option>
          </select>
          <button type="submit" style="background: #e91e63; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer;">Lähetä</button>
        </form>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Location Map Block
  blockManager.add('wedding-location', {
    label: '📍 Sijainti',
    content: `
      <div style="padding: 60px 20px;">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 40px; color: #00bcd4;">Sijaintimme</h2>
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="background: #e0f7fa; padding: 40px; border-radius: 12px; text-align: center;">
            <h3 style="font-size: 1.8em; color: #00838f; margin-bottom: 15px;">Juhlatila Suomenlinna</h3>
            <p style="font-size: 1.2em; color: #006064; margin-bottom: 10px;">Suomenlinna B 22</p>
            <p style="font-size: 1em; color: #00838f;">00190 Helsinki</p>
          </div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Gift Registry Block
  blockManager.add('wedding-gifts', {
    label: '🎁 Lahjat',
    content: `
      <div style="padding: 60px 20px; background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); text-align: center;">
        <h2 style="font-size: 2.5em; margin-bottom: 30px; color: #d63031;">Lahjatoiveet</h2>
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px;">
          <p style="font-size: 1.2em; color: #2d3436; line-height: 1.8;">
            Paras lahja meille on läsnäolosi juhlassamme! Jos kuitenkin haluat antaa lahjan, 
            rahalahjat ovat tervetulleita ja auttavat meitä häämatkamme rahoittamisessa.
          </p>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Wedding Party Block
  blockManager.add('wedding-party', {
    label: '👥 Häävieraat',
    content: `
      <div style="padding: 60px 20px; background: #f8f9fa;">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 50px; color: #6c5ce7;">Hääjuhlan vierat</h2>
        <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
          <div style="text-align: center; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="width: 120px; height: 120px; background: #dfe6e9; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 3em;">👰</div>
            <h3 style="color: #2d3436; margin-bottom: 10px;">Morsiamen nimi</h3>
            <p style="color: #636e72; font-style: italic;">Morsian</p>
          </div>
          <div style="text-align: center; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="width: 120px; height: 120px; background: #dfe6e9; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 3em;">🤵</div>
            <h3 style="color: #2d3436; margin-bottom: 10px;">Sulhasen nimi</h3>
            <p style="color: #636e72; font-style: italic;">Sulhanen</p>
          </div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Countdown Timer Block
  blockManager.add('wedding-countdown', {
    label: '⏰ Lähtölaskenta',
    content: `
      <div style="padding: 80px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
        <h2 style="font-size: 2.5em; color: white; margin-bottom: 40px;">Aikaa Häihin</h2>
        <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; max-width: 600px; margin: 0 auto;">
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; min-width: 120px;">
            <div style="font-size: 3em; color: white; font-weight: bold;">120</div>
            <div style="color: rgba(255,255,255,0.8); margin-top: 10px;">Päivää</div>
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; min-width: 120px;">
            <div style="font-size: 3em; color: white; font-weight: bold;">15</div>
            <div style="color: rgba(255,255,255,0.8); margin-top: 10px;">Tuntia</div>
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; min-width: 120px;">
            <div style="font-size: 3em; color: white; font-weight: bold;">30</div>
            <div style="color: rgba(255,255,255,0.8); margin-top: 10px;">Minuuttia</div>
          </div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Love Story Block
  blockManager.add('wedding-story', {
    label: '💕 Tarinамme',
    content: `
      <div style="padding: 60px 20px;">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 50px; color: #fd79a8;">Rakkaustarinamme</h2>
        <div style="max-width: 900px; margin: 0 auto;">
          <div style="display: grid; gap: 40px;">
            <div style="display: flex; gap: 30px; align-items: center;">
              <div style="min-width: 100px; height: 100px; background: #fab1a0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2em;">❤️</div>
              <div>
                <h3 style="color: #d63031; margin-bottom: 10px; font-size: 1.5em;">2018 - Ensitapaaminen</h3>
                <p style="color: #2d3436; line-height: 1.6;">Tapasimme ensimmäisen kerran ystävien järjestämissä juhlissa. Oli rakkaus ensisilmäyksellä!</p>
              </div>
            </div>
            <div style="display: flex; gap: 30px; align-items: center;">
              <div style="min-width: 100px; height: 100px; background: #fab1a0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2em;">💍</div>
              <div>
                <h3 style="color: #d63031; margin-bottom: 10px; font-size: 1.5em;">2023 - Kosinta</h3>
                <p style="color: #2d3436; line-height: 1.6;">Romanttinen kosinta auringonlaskun aikana rannalla. Sanoin tietysti kyllä!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // FAQ Block
  blockManager.add('wedding-faq', {
    label: '❓ UKK',
    content: `
      <div style="padding: 60px 20px; background: #f5f6fa;">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 50px; color: #4834d4;">Usein Kysytyt Kysymykset</h2>
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 12px; border-left: 4px solid #4834d4;">
            <h3 style="color: #2d3436; margin-bottom: 15px; font-size: 1.3em;">Milloin tulee saapua paikalle?</h3>
            <p style="color: #636e72; line-height: 1.6;">Pyydämme vieraita saapumaan paikalle viimeistään 15 minuuttia ennen seremonian alkua.</p>
          </div>
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 12px; border-left: 4px solid #4834d4;">
            <h3 style="color: #2d3436; margin-bottom: 15px; font-size: 1.3em;">Onko lapsille ohjelmaa?</h3>
            <p style="color: #636e72; line-height: 1.6;">Kyllä! Meillä on lastenhoitaja ja lasten oma aktiviteettinurkkaus.</p>
          </div>
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 12px; border-left: 4px solid #4834d4;">
            <h3 style="color: #2d3436; margin-bottom: 15px; font-size: 1.3em;">Mikä on pukeutumiskoodi?</h3>
            <p style="color: #636e72; line-height: 1.6;">Juhla-asu tai tummaksi puku sopivat erinomaisesti.</p>
          </div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });

  // Contact Block
  blockManager.add('wedding-contact', {
    label: '📧 Yhteystiedot',
    content: `
      <div style="padding: 60px 20px; background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 30px; color: white;">Ota Yhteyttä</h2>
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px;">
          <p style="text-align: center; color: #2d3436; margin-bottom: 30px; font-size: 1.1em;">Onko sinulla kysyttävää? Ota rohkeasti yhteyttä!</p>
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
              <span style="font-size: 1.5em;">📱</span>
              <div>
                <div style="font-weight: bold; color: #2d3436;">Puhelin</div>
                <div style="color: #636e72;">+358 40 123 4567</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="font-size: 1.5em;">✉️</span>
              <div>
                <div style="font-weight: bold; color: #2d3436;">Sähköposti</div>
                <div style="color: #636e72;">haat@esimerkki.fi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    category: 'Hääblokit',
  });
}