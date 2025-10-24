# 🎨 Globaalit Tyyliasetukset - Ulkoasu-järjestelmä

## 📋 Yleiskuvaus

Ulkoasu-järjestelmä mahdollistaa **globaalien tyylien hallinnan** kaikille sivun elementeille yhdestä paikasta. Jokainen template sisältää omat uniikkiset globaalit tyyliasetukset jotka sopivat sen teemaan.

## 🎯 Kuinka se toimii?

### Hierarkia (tärkeysjärjestys):

1. **Käyttäjän manuaaliset muutokset** (korkein prioriteetti)
   - Jos käyttäjä on muokannut blokin asetuksia manuaalisesti, ne EIVÄT ylikirjoitu
   
2. **Globaalit tyyliasetukset** (keskitason prioriteetti)
   - Ulkoasu-paneelista määritetyt asetukset
   - Vaikuttavat kaikkiin blokkeihin joita EI ole muokattu manuaalisesti
   
3. **Template block defaults** (alin prioriteetti)
   - Automaattiset oletusasetukset kun lisää uuden blokin

## 📊 Mitä voi hallita?

### 1. **Tausta** (Background)
- Väri - Yleinen taustaväri kaikille lohkoille

### 2. **Tekstikappale** (Text Block)
- Väri
- Fontti
- Koko (px)
- Lihavointi
- Kursiivi

### 3. **Suuret otsikot** (Large Headings - H1)
- Väri
- Fontti
- Koko (px)
- Lihavointi
- Kursiivi

### 4. **Keskikokoiset otsikot** (Medium Headings - H2-H3)
- Väri
- Fontti
- Koko (px)
- Lihavointi
- Kursiivi

### 5. **Pienet otsikot** (Small Headings - H4-H5)
- Väri
- Fontti
- Koko (px)
- Lihavointi
- Kursiivi

### 6. **Linkit** (Links)
- Väri
- Fontti
- Koko (px)
- Lihavointi
- Kursiivi
- Alleviivaus

## 🎨 Esimerkkejä Template-kohtaisista asetuksista

### Benvenuto (Elegantti)
```javascript
globalStyles: {
  largeHeadings: {
    color: '#5b4b8a',      // Violetti
    font: 'great-vibes',   // Käsialafontti
    size: 56,
    bold: false,
    italic: false
  },
  textBlock: {
    color: '#4a4a4a',      // Tummanharmaa
    font: 'lato',          // Moderni sans-serif
    size: 16
  },
  links: {
    color: '#8b7ab8',      // Vaaleampi violetti
    underline: true
  }
}
```

### Ikimetsä (Metsäteema)
```javascript
globalStyles: {
  largeHeadings: {
    color: '#2d5016',      // Tummanvihreä
    font: 'playfair',      // Klassinen serif
    size: 48,
    bold: true
  },
  textBlock: {
    color: '#374151',      // Harmaa
    font: 'lato',
    size: 16
  },
  links: {
    color: '#7fa650',      // Vaaleampi vihreä
    underline: true
  }
}
```

## 🚀 Käyttöönotto

### 1. Avaa Ulkoasu-paneeli
Klikkaa **"Ulkoasu"** -nappia builder-sivun yläpalkissa (näkyy vain jos templatella on globalStyles).

### 2. Muokkaa elementtejä
Jokaiselle elementtityypille:
- Valitse väri color pickerillä
- Valitse fontti dropdown-valikosta
- Säädä kokoa (10-100px)
- Aktivoi/deaktivoi tyylit (lihavointi, kursiivi, alleviivaus)

### 3. Näe esikatselu reaaliajassa
Jokaisen elementin alla näkyy esikatselu valituilla asetuksilla.

### 4. Tallenna
Asetukset tallentuvat automaattisesti template-objektiin.

## 💡 Käytännön esimerkkejä

### Esimerkki 1: Vaihda kaikkien otsikoiden väri
1. Avaa Ulkoasu
2. Mene "Suuret otsikot"
3. Valitse uusi väri
4. → Kaikki H1-otsikot muuttuvat (paitsi ne joita olet muokannut manuaalisesti)

### Esimerkki 2: Vaihda leipätekstin fontti
1. Avaa Ulkoasu
2. Mene "Tekstikappale"
3. Valitse uusi fontti (esim. "Raleway" → "Lato")
4. → Kaikki kappaleet muuttuvat

### Esimerkki 3: Tee linkeistä lihavoituja
1. Avaa Ulkoasu
2. Mene "Linkit"
3. Aktivoi "Lihavoitu" checkbox
4. → Kaikki linkit muuttuvat boldiksi

## 🔒 Manuaalisten muutosten suojaus

Jos olet muokannut tietyn blokin asetuksia:

```javascript
// Esimerkki: Käyttäjä on muokannut Hero-blokin title-väriä
heroBlock.data.titleColor = '#ff0000' // Punainen

// Globaalit asetukset:
globalStyles.largeHeadings.color = '#5b4b8a' // Violetti

// Tulos: Hero-blokin otsikko pysyy PUNAISENA
// Koska käyttäjän muutos on prioriteetti #1
```

## 🎯 Tekninen Toteutus

### Tiedostot:

1. **GlobalStylesEditor.jsx**
   - UI-komponentti tyylien muokkaukseen
   - Props: `template`, `onUpdate`
   - Renderöi kategoriat dynaamisesti

2. **website-templates.js**
   - Template-objektit sisältävät `globalStyles`
   - Jokainen template voi määrittää omat arvot

3. **builder/page.jsx**
   - State: `showGlobalStyles`, `currentTemplate`
   - Handler: `handleGlobalStylesUpdate()`
   - Sheet-komponentti Ulkoasu-paneelille

## 📊 Template-rakenne

```javascript
{
  id: 'benvenuto',
  name: 'Benvenuto',
  theme: { ... },
  
  // GLOBAALIT TYYLIASETUKSET
  globalStyles: {
    background: { color: '#ffffff' },
    textBlock: { color, font, size, bold, italic },
    largeHeadings: { color, font, size, bold, italic },
    mediumHeadings: { color, font, size, bold, italic },
    smallHeadings: { color, font, size, bold, italic },
    links: { color, font, size, bold, italic, underline }
  },
  
  // Block-kohtaiset oletukset (alempi prioriteetti)
  blockDefaults: { ... },
  
  blocks: [ ... ]
}
```

## ✅ Edut

1. **Yhtenäisyys**: Kaikki sivun elementit noudattavat samaa tyyliä
2. **Nopeus**: Muuta kaikkia otsikoita yhdellä klikillä
3. **Joustavuus**: Voit silti muokata yksittäisiä blokkeja erikseen
4. **Suojaus**: Manuaaliset muutokset eivät ylikirjoitu
5. **Template-kohtaisuus**: Jokainen template voi määrittää omat globaalit tyylit

## 🎨 UI/UX

### Info-banner (yläosa):
- Violetti gradientti
- Palette-ikoni
- Selittää että asetukset eivät ylikirjoita manuaalisia muutoksia

### Kategoriakorttit:
- Icon per kategoria (Type, AlignLeft, LinkIcon)
- Kuvaus elementin käyttötarkoituksesta
- Lomake: väri, fontti, koko, tyyliasetukset
- Live preview jokaisen kategori

### Footer-info:
- Sininen info-laatikko
- Muistutus prioriteeteista

## 🚀 Tulevaisuuden Kehitys

- [ ] Tallennus backendiin
- [ ] Globaalien tyylien reset oletuksiin
- [ ] Tyylien kopiointi toiseen templateen
- [ ] Undo/Redo globaaleille muutoksille
- [ ] Enemmän elementtityyppejä (napit, kortit, etc.)

---

**Yhteenveto**: Ulkoasu-järjestelmä antaa käyttäjälle täyden kontrollin sivun ulkoasuun samalla kun se kunnioittaa käyttäjän yksittäisiä muokkauksia. 🎨
