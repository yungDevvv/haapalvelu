# Hääpalvelu - Wedding Service Management System

Kattava hääpalvelujärjestelmä, joka auttaa hääparia Hallitsemaan kaikkia häävalmistelujen osa-alueita yhdessä paikassa.

## Ominaisuudet

### Dashboard
- Reaaliaikainen tilannekatsaus häävalmisteluista
- Osallistujien vahvistustilanne
- Tehtävien edistyminen
- Budjettiseuranta
- Kuvagallerian tilastot
- Viimeisimmät tapahtumat

### Osallistujien Hallinta
- Osallistujalistan ylläpito
- Kategoriointi (morsiusneidot, sulhasen miehet, perhe, ystävät)
- Vahvistusten seuranta
- Ruokavaliorajoitusten Hallinta
- Yhteystietojen tallennus

### Ohjelmansuunnittelu
- Hääohjelman aikataulutus
- Tapahtumien kategoriointi
- Sijaintitietojen Hallinta
- Osallistujien määrittely tapahtumittain
- Tilaseuranta (suunniteltu, vahvistettu, valmis)

### Kuvagalleria
- Kuvien kategoriointi (polttarit, hääkuvat, häämatkakuvat)
- Kuvien lataus ja Hallinta
- Kuvatekstit ja metatiedot
- Gallerian jakaminen

### Tehtävien Hallinta
- Tehtävälistojen luominen
- Prioriteettien asettaminen
- Vastuuhenkilöiden määrittely
- Määräaikojen seuranta
- Edistymisen visualisointi

### Muistiinpanot
- Rich text editor muistiinpanoille
- Kategoriointi (muistilistat, puheet, ideat, yhteystiedot)
- Hakutoiminto
- Versiohistoria

## Teknologiat

- **Frontend**: Next.js 15.5.4 (React 19.1.0)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Rich Text Editor**: TipTap
- **Build Tool**: Turbopack

## Käyttöönotto

### Vaatimukset
- Node.js 18+ 
- npm tai yarn

### Asennus

1. Kloonaa repositorio:
```bash
git clone <repository-url>
cd bride_service
```

2. Asenna riippuvuudet:
```bash
npm install
```

3. Käynnistä kehityspalvelin:
```bash
npm run dev
```

4. Avaa selaimessa: [http://localhost:3001](http://localhost:3001)

## Projektin rakenne

```
src/
├── app/
│   ├── globals.css          # Globaalit tyylit
│   ├── layout.js           # Sovelluksen layout
│   └── page.js             # Pääsivu
├── components/
│   ├── ui/                 # shadcn/ui komponentit
│   ├── participants-manager.jsx
│   ├── program-manager.jsx
│   ├── photo-gallery.jsx
│   ├── tasks-manager.jsx
│   ├── notes-manager.jsx
│   └── rich-text-editor.jsx
└── lib/
    ├── mock-data.js        # Demo-data
    └── utils.js            # Apufunktiot
```

## UI/UX Ominaisuudet

- **Responsiivinen design** - toimii kaikilla laitteilla
- **Moderni käyttöliittymä** - shadcn/ui komponenteilla
- **Intuitiivinen navigointi** - välilehtipohjainen rakenne
- **Visuaalinen palaute** - edistymispalkit ja tilaindikaattorit
- **Suomenkielinen käyttöliittymä** - täysin lokalisoitu

## Mock Data

Sovellus sisältää kattavan demo-datan:
- Hääparin tiedot (Anna & Mikael)
- 6 osallistujaa eri kategorioissa
- 5 tapahtumaa hääohjelmassa
- 3 kuvagalleriaa yhteensä 8 kuvalla
- 3 tehtävää eri prioriteeteilla
- Budjettiseuranta 6 kategoriassa
- 2 muistiinpanoa

## Kehitys

### Uusien komponenttien lisääminen

1. Luo uusi komponentti `src/components/` kansioon
2. Käytä shadcn/ui komponentteja johdonmukaisuuden vuoksi
3. Noudata olemassa olevaa nimeämiskäytäntöä
4. Lisää tarvittaessa mock-dataa `src/lib/mock-data.js` tiedostoon

### Koodin tyyli

- **Kommentit**: Englanninkieliset
- **UI-tekstit**: Suomenkieliset
- **Muuttujanimet**: Englanninkieliset
- **Funktiot**: camelCase
- **Komponentit**: PascalCase

## Tuotantoon vienti

```bash
npm run build
npm start
```

## Lisenssi

Tämä projekti on tehty demonstraatiotarkoituksiin.

## Kehittäjät

Kehitetty käyttäen modernia React-ekosysteemiä ja parhaita käytäntöjä.
