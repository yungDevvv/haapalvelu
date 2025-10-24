# Template Block Defaults - Järjestelmä

## 📋 Yleiskuvaus

Järjestelmä automaattisesti soveltaa template-kohtaiset oletusasetukset (fontit, värit, tilat) uusiin blokkeihin kun ne lisätään sivulle. Käyttäjän ei tarvitse manuaalisesti muokata jokaista blokkia templaten mukaiseksi.

## 🎯 Toiminnallisuus

### Automaattinen Asetusten Soveltaminen

Kun käyttäjä lisää uuden lohkon (esim. Hero, Text, Program):
1. Järjestelmä tarkistaa onko aktiivisella templatella `blockDefaults`-määritykset
2. Jos on, ne yhdistetään perus-oletusarvoihin
3. Template-asetukset **ylikirjoittavat** perus-oletukset
4. Käyttäjä näkee konsolissa: `✨ Käytetään template 'Benvenuto' asetuksia blokkityypille 'hero'`

### Esimerkki: Benvenuto Template

```javascript
blockDefaults: {
  hero: {
    titleFont: 'great-vibes',           // Template määrittää fontin
    subtitleFont: 'cinzel',
    backgroundColor: '#5b4b8a',          // Template määrittää taustavärin
    titleColor: '#ffffff',
    paddingY: 160,                       // Template määrittää tilan
    paddingX: 16,
    overlay: true,
    overlayOpacity: 0.4
  },
  text: {
    titleFont: 'cinzel',
    contentFont: 'lato',
    titleColor: '#5b4b8a',
    contentColor: '#4a4a4a',
    backgroundColor: '#ffffff',
    paddingY: 90,
    paddingX: 24,
    alignment: 'left'
  }
  // ... muut blokkit
}
```

## 📁 Tiedostorakenne

### 1. Template-määritykset
**Tiedosto:** `src/lib/website-templates.js`

```javascript
{
  id: 'benvenuto',
  name: 'Benvenuto',
  theme: { ... },
  
  // UUSI: BlockDefaults jokaiselle blokkityypille
  blockDefaults: {
    hero: { ... },
    text: { ... },
    program: { ... },
    countdown: { ... },
    rsvp: { ... },
    gallery: { ... }
  },
  
  blocks: [ ... ]
}
```

### 2. Builder-sivu
**Tiedosto:** `src/app/builder/page.jsx`

**State:**
```javascript
const [currentTemplate, setCurrentTemplate] = useState(null);
```

**handleAddBlock-funktio:**
```javascript
const handleAddBlock = (blockType) => {
  // Aloita perus-oletuksista
  let blockData = { ...blockDefaults[blockType] };
  
  // Jos templatella on blockDefaults, yhdistä ne
  if (currentTemplate?.blockDefaults?.[blockType]) {
    blockData = {
      ...blockData,
      ...currentTemplate.blockDefaults[blockType]
    };
  }
  
  // Luo uusi blokki merged asetuksilla
  const newBlock = {
    id: Date.now().toString(),
    type: blockType,
    data: blockData,
    component: null
  };
  
  setBlocks(prev => [...prev, newBlock]);
};
```

### 3. BlocksSidebar
**Tiedosto:** `src/components/wedding-builder/BlocksSidebar.jsx`

**Props:** `currentTemplate`

**Template Info Banner:**
```jsx
{currentTemplate?.blockDefaults && (
  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
    <span>✨</span>
    <p className="text-xs font-semibold">
      Template-asetukset aktiivisina
    </p>
    <p className="text-xs">
      Uudet lohkot käyttävät automaattisesti {currentTemplate.name} 
      template-tyylejä (fontit, värit, tilat).
    </p>
  </div>
)}
```

### 4. TabbedBlockEditor
**Tiedosto:** `src/components/wedding-builder/TabbedBlockEditor.jsx`

**Props:** `currentTemplate`

**Info Banner:**
```jsx
{hasTemplateDefaults && (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
    <p className="text-xs">
      <strong>Template-asetukset aktiivisina:</strong> 
      Tämä lohko käyttää {currentTemplate.name} templaten 
      oletusasetuksia. Voit halutessasi muuttaa yksittäisiä asetuksia.
    </p>
  </div>
)}
```

### 5. Helper-funktiot
**Tiedosto:** `src/lib/block-defaults-helper.js`

```javascript
// Yhdistä perus- ja template-asetukset
getMergedBlockDefaults(blockType, baseDefaults, templateDefaults)

// Hae template-asetusten yhteenveto
getBlockDefaultsSummary(blockType, templateDefaults)

// Formatoi asetukset näyttöä varten
formatBlockDefaultsForDisplay(blockType, templateDefaults)
```

## 🎨 Määritettävät Asetukset Blokkityypeittäin

### Hero Block
- `titleFont`, `subtitleFont`
- `backgroundColor`, `titleColor`, `subtitleColor`
- `paddingY`, `paddingX`
- `overlay`, `overlayOpacity`

### Text Block
- `titleFont`, `contentFont`
- `titleColor`, `contentColor`
- `backgroundColor`
- `paddingY`, `paddingX`
- `alignment` (left/center)
- `backgroundImage`, `imagePosition` (left/right)

### Program Block
- `titleFont`, `descriptionFont`
- `backgroundColor`, `titleColor`, `descriptionColor`
- `cardColor`, `accentColor`
- `paddingY`, `paddingX`

### Countdown Block
- `titleFont`, `descriptionFont`
- `backgroundColor`, `titleColor`, `descriptionColor`
- `paddingY`, `paddingX`

### RSVP Block
- `titleFont`, `descriptionFont`
- `backgroundColor`, `titleColor`, `descriptionColor`
- `buttonColor`
- `paddingY`, `paddingX`

### Gallery Block
- `titleFont`, `descriptionFont`
- `backgroundColor`, `titleColor`
- `paddingY`, `paddingX`

## ✅ Edut

1. **Käyttäjäystävällisyys:** Käyttäjän ei tarvitse manuaalisesti muokata jokaista blokkia
2. **Konsistenssi:** Kaikki blokkit noudattavat samaa tyyliä automaattisesti
3. **Nopeus:** Sivun rakentaminen on paljon nopeampaa
4. **Joustavuus:** Käyttäjä voi silti muuttaa yksittäisiä asetuksia halutessaan
5. **Läpinäkyvyys:** Info-bannerit kertovat kun template-asetukset ovat käytössä

## 🔄 Käyttöesimerkki

1. Käyttäjä valitsee "Benvenuto" templaten
2. Lisää Hero-lohkon → Saa automaattisesti:
   - great-vibes fontin titlelle
   - cinzel fontin subtitlelle
   - #5b4b8a taustavärin
   - 160px paddingY
3. Lisää Text-lohkon → Saa automaattisesti:
   - cinzel fontin titlelle
   - lato fontin contentille
   - #5b4b8a värin titlelle
   - #ffffff taustavärin

## 📊 Template-rakenne JSON-muodossa

```json
{
  "id": "benvenuto",
  "name": "Benvenuto",
  "theme": {
    "name": "elegant",
    "colors": {
      "primary": "#5b4b8a",
      "secondary": "#8b7ab8",
      "accent": "#e8dff5"
    },
    "fonts": {
      "heading": "font-serif",
      "body": "font-sans"
    }
  },
  "blockDefaults": {
    "hero": {
      "titleFont": "great-vibes",
      "backgroundColor": "#5b4b8a",
      "paddingY": 160
    },
    "text": {
      "titleFont": "cinzel",
      "contentFont": "lato",
      "titleColor": "#5b4b8a"
    }
  },
  "blocks": [...]
}
```

## 🚀 Tulevaisuuden Kehitys

Potentiaalisia lisäyksiä:
- [ ] Visual editor template-asetusten muokkaamiseen
- [ ] Template-asetusten export/import
- [ ] Custom template-luonti käyttöliittymästä
- [ ] Block-kohtaiset override-vaihtoehdot
- [ ] Template preview ennen valintaa
