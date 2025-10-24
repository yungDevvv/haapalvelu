// Mock data for wedding service (hääpalvelu)
// Contains sample data for participants, events, photos, and other wedding-related information

export const weddingCouple = {
  bride: {
    id: 1,
    firstName: "Anna",
    lastName: "Virtanen",
    email: "anna.virtanen@email.fi",
    phone: "+358 50 123 4567",
    // avatar: "/avatars/anna.jpg"
  },
  groom: {
    id: 2,
    firstName: "Mikael",
    lastName: "Korhonen", 
    email: "mikael.korhonen@email.fi",
    phone: "+358 50 765 4321",
    // avatar: "/avatars/mikael.jpg"
  },
  weddingDate: "2024-07-15",
  venue: "Suomenlinna, Helsinki"
};

// VIERASKORTTI (Guest cards) - Main structure
// Each card represents one invitation unit (family, couple, single person, etc.)
// Categories from image: Perhe, Sukulaiset, Ystävät, Perhetutut, Työkaverit, Muut
export const vieraskortti = [
  {
    id: 1,
    title: "Morsiamen vanhemmat", // Card title
    category: "perhe", // Category
    email: "virtanen.perhe@email.fi", // Shared email for card
    phone: "+358 50 999 0000", // Shared phone for card
    address: "Majurinkatu 12, Helsinki", // Shared address for card
    vieraat: [ // Guests inside this card (only names!)
      { firstName: "Marja", lastName: "Virtanen", rsvpStatus: "tulossa" },
      { firstName: "Pekka", lastName: "Virtanen", rsvpStatus: "tulossa" }
    ],
    dietaryRestrictions: "Laktoosi-intoleranssi", // For the whole card
    // Invitation tracking for the CARD
    invitationSent: true,
    invitationSentDate: "2024-01-10",
    invitationViewed: true,
    invitationViewedDate: "2024-01-10",
    rsvpStatus: "accepted", // null / "accepted" / "declined"
    rsvpDate: "2024-01-10",
    confirmed: true
  },
  {
    id: 2,
    title: "Morsiusneidot",
    category: "ystävät",
    email: "liisa.makinen@email.fi",
    phone: "+358 50 111 2222",
    address: "Koskikatu 5, Tampere",
    vieraat: [
      { firstName: "Liisa", lastName: "Mäkinen", rsvpStatus: "tulossa" },
      { firstName: "Sanna", lastName: "Lehto", rsvpStatus: "tulossa" }
    ],
    dietaryRestrictions: "Kasvisruoka",
    invitationSent: true,
    invitationSentDate: "2024-01-10",
    invitationViewed: true,
    invitationViewedDate: "2024-01-11",
    rsvpStatus: "accepted",
    rsvpDate: "2024-01-12",
    confirmed: true
  },
  {
    id: 3,
    title: "Sulhasen miehet",
    category: "ystävät",
    email: "jukka.nieminen@email.fi",
    phone: "+358 50 555 6666",
    address: "Hämeentie 33, Helsinki",
    vieraat: [
      { firstName: "Jukka", lastName: "Nieminen", rsvpStatus: "ei_vastausta" },
      { firstName: "Petri", lastName: "Lahtinen", rsvpStatus: "tulossa" }
    ],
    dietaryRestrictions: "Ei kala-allergia",
    invitationSent: true,
    invitationSentDate: "2024-01-10",
    invitationViewed: false,
    invitationViewedDate: null,
    rsvpStatus: null,
    rsvpDate: null,
    confirmed: false
  },
  {
    id: 4,
    title: "Elina",
    category: "ystävät",
    email: "elina.korhonen@email.fi",
    phone: "+358 50 222 3333",
    address: "Mannerheimintie 100, Helsinki",
    vieraat: [
      { firstName: "Elina", lastName: "Korhonen", rsvpStatus: "tulossa" }
    ],
    dietaryRestrictions: "",
    invitationSent: true,
    invitationSentDate: "2024-01-10",
    invitationViewed: false,
    invitationViewedDate: null,
    rsvpStatus: null,
    rsvpDate: null,
    confirmed: true
  },
  {
    id: 5,
    title: "Työkaverit - Suunnittelutoimisto",
    category: "työkaverit",
    email: "work.team@company.fi",
    phone: "+358 50 444 5555",
    address: "Työpaikka Oy, Bulevardi 1, Helsinki",
    vieraat: [
      { firstName: "Mikko", lastName: "Virtanen", rsvpStatus: "ei_vastausta" },
      { firstName: "Laura", lastName: "Koskinen", rsvpStatus: "ei_vastausta" }
    ],
    dietaryRestrictions: "",
    invitationSent: false,
    invitationSentDate: null,
    invitationViewed: false,
    invitationViewedDate: null,
    rsvpStatus: null,
    rsvpDate: null,
    confirmed: false
  }
];

// Old participants structure (keeping for backward compatibility during migration)
export const participants = vieraskortti.flatMap((card, cardIndex) => 
  card.vieraat.map((vieras, vierasIndex) => ({
    id: cardIndex * 100 + vierasIndex + 1,
    firstName: vieras.firstName,
    lastName: vieras.lastName,
    email: card.email,
    phone: card.phone,
    role: card.title,
    category: card.category,
    confirmed: card.confirmed,
    dietaryRestrictions: card.dietaryRestrictions,
    invitationSent: card.invitationSent,
    invitationSentDate: card.invitationSentDate,
    invitationViewed: card.invitationViewed,
    invitationViewedDate: card.invitationViewedDate,
    rsvpStatus: card.rsvpStatus,
    rsvpDate: card.rsvpDate,
    partnerId: card.vieraat.length > 1 ? (vierasIndex === 0 ? cardIndex * 100 + 2 : cardIndex * 100 + 1) : null
  }))
);

export const weddingProgram = [
  {
    id: 1,
    title: "Polttarit", // Bachelor/Bachelorette parties
    date: "2024-06-15",
    time: "18:00",
    location: "Tallinna, Viro",
    description: "Yhteispolttarit Tallinnassa. Lähtö Helsingin satamasta klo 16:00.",
    participants: [1, 2, 3, 4],
    type: "polttarit",
    status: "suunniteltu" // planned
  },
  {
    id: 2,
    title: "Vihkiminen", // Wedding ceremony
    date: "2024-07-15",
    time: "14:00", 
    location: "Suomenlinnan kirkko",
    description: "Vihkiseremonia Suomenlinnan kirkossa. Saapuminen 30 min ennen alkua.",
    participants: "kaikki", // all
    type: "vihkiminen",
    status: "vahvistettu" // confirmed
  },
  {
    id: 3,
    title: "Hääkuvaus", // Wedding photoshoot
    date: "2024-07-15",
    time: "15:30",
    location: "Suomenlinna, ulkoalueet",
    description: "Hääkuvaus Suomenlinnan kauniissa maisemissa.",
    participants: [1, 2],
    type: "kuvaus",
    status: "vahvistettu"
  },
  {
    id: 4,
    title: "Hääjuhlat", // Wedding reception
    date: "2024-07-15", 
    time: "17:00",
    location: "Ravintola Suomenlinna",
    description: "Hääjuhlat illallisella ja tanssilla. Puheet alkavat klo 19:00.",
    participants: "kaikki",
    type: "juhlat",
    status: "vahvistettu"
  },
  {
    id: 5,
    title: "Häämatkalle lähtö", // Honeymoon departure
    date: "2024-07-16",
    time: "10:00",
    location: "Helsinki-Vantaan lentoasema",
    description: "Lento Kreikkaan, Santorini. Lento AY 1234.",
    participants: [1, 2],
    type: "hamatka",
    status: "vahvistettu"
  }
];

export const photoGalleries = [
  {
    id: 1,
    title: "Polttarikuvat", // Bachelor party photos - 3 photos
    category: "polttarit",
    date: "2024-06-15",
    description: "Hauskat hetket polttareilla Tallinnassa",
    isPasswordProtected: false,
    password: "",
    allowGuestUploads: true,
    disableCopyProtection: false,
    photos: [
      {
        id: 1,
        url: "/1.jpg",
        caption: "Laivalla matkalla Tallinnaan",
        uploadedBy: "Jukka Nieminen",
        uploadDate: "2024-06-16",
        views: 45
      },
      {
        id: 2,
        url: "/1.jpg", 
        caption: "Tallinna vanhakaupunki",
        uploadedBy: "Petri Lahtinen",
        uploadDate: "2024-06-16",
        views: 32
      },
      {
        id: 3,
        url: "/1.jpg",
        caption: "Ryhmäkuva ravintolassa",
        uploadedBy: "Liisa Mäkinen", 
        uploadDate: "2024-06-16",
        views: 58
      }
    ]
  },
  {
    id: 2,
    title: "Hääkuvat", // Wedding photos - 6 photos (PASSWORD PROTECTED!)
    category: "haakuvat",
    date: "2024-07-15",
    description: "Kauneimmat hetket hääpäivästämme",
    isPasswordProtected: true,
    password: "häät2024",
    allowGuestUploads: false,
    disableCopyProtection: true,
    photos: [
      {
        id: 4,
        url: "/1.jpg",
        caption: "Vihkiseremonia kirkossa",
        uploadedBy: "Valokuvaaja Matti Kuva",
        uploadDate: "2024-07-16",
        views: 120
      },
      {
        id: 5,
        url: "/1.jpg",
        caption: "Ensimmäinen tanssi",
        uploadedBy: "Valokuvaaja Matti Kuva", 
        uploadDate: "2024-07-16",
        views: 95
      },
      {
        id: 6,
        url: "/1.jpg",
        caption: "Ryhmäkuva perheen kanssa",
        uploadedBy: "Valokuvaaja Matti Kuva",
        uploadDate: "2024-07-16",
        views: 78
      },
      {
        id: 7,
        url: "/1.jpg",
        caption: "Morsiuspari ulkona",
        uploadedBy: "Valokuvaaja Matti Kuva",
        uploadDate: "2024-07-16",
        views: 135
      },
      {
        id: 8,
        url: "/1.jpg",
        caption: "Hääkakku",
        uploadedBy: "Valokuvaaja Matti Kuva",
        uploadDate: "2024-07-16",
        views: 67
      },
      {
        id: 9,
        url: "/1.jpg",
        caption: "Juhlat täydessä vauhdissa",
        uploadedBy: "Valokuvaaja Matti Kuva",
        uploadDate: "2024-07-16",
        views: 102
      }
    ]
  },
  {
    id: 3,
    title: "Hääkuvat vieraat", // Guest wedding photos - guests can upload
    category: "haakuvat", 
    date: "2024-07-15",
    description: "Jaa omat kuvasi hääpäivästämme! Vieraat voivat lähettää kuvia.",
    isPasswordProtected: false,
    password: "",
    allowGuestUploads: true,
    disableCopyProtection: false,
    photos: [
      {
        id: 10,
        url: "/1.jpg",
        caption: "Hääparin saapuminen",
        uploadedBy: "Liisa Mäkinen",
        uploadDate: "2024-07-15",
        views: 45,
        isGuestUpload: true
      },
      {
        id: 11,
        url: "/1.jpg",
        caption: "Sukulaiset onnittelemassa",
        uploadedBy: "Pekka Virtanen",
        uploadDate: "2024-07-15",
        views: 38,
        isGuestUpload: true
      },
      {
        id: 12,
        url: "/1.jpg",
        caption: "Iloinen tunnelma juhlapaikalla",
        uploadedBy: "Sanna Lehto",
        uploadDate: "2024-07-15",
        views: 52,
        isGuestUpload: true
      }
    ]
  }
];

export const weddingTasks = [
  {
    id: 1,
    title: "Tilaa kukkakimput",
    description: "Tilaa morsiuskimppu ja morsiusneitojen kimput kukkakaupasta",
    dueDate: "2025-10-01",
    assignedTo: "Anna Virtanen",
    status: "valmis",
    priority: "korkea",
    category: "kukat",
    emoji: "💐",
    pinned: false
  },
  {
    id: 2, 
    title: "Vahvista catering",
    description: "Vahvista lopullinen vierasmäärä cateringille",
    dueDate: "2025-10-15",
    assignedTo: "Mikael Korhonen", 
    status: "kesken",
    priority: "korkea",
    category: "catering",
    emoji: "🍽️",
    pinned: true,
    favorite: true
  },
  {
    id: 3,
    title: "Tilaa hääauto",
    description: "Tilaa hääauto kirkolta juhlasaliin",
    dueDate: "2025-10-01",
    assignedTo: "Jukka Nieminen",
    status: "odottaa",
    priority: "keskitaso",
    category: "yleinen",
    emoji: "🚗",
    pinned: true
  },
  {
    id: 4,
    title: "Varaa valokuvaaja",
    description: "Vahvista valokuvaajan varaus ja käy läpi toiveet",
    dueDate: "2025-10-20",
    assignedTo: "Anna Virtanen",
    status: "valmis",
    priority: "korkea",
    category: "valokuvaus",
    emoji: "📸",
    pinned: false
  },
  {
    id: 5,
    title: "Tilaa DJ",
    description: "Tilaa DJ juhliin ja käy läpi musiikkitoiveet",
    dueDate: "2025-10-25",
    assignedTo: "Mikael Korhonen",
    status: "kesken",
    priority: "keskitaso",
    category: "musiikki",
    emoji: "🎵",
    pinned: false,
    favorite: true
  },
  {
    id: 6,
    title: "Lähetä kutsut",
    description: "Lähetä hääkutsut kaikille vieraille",
    dueDate: "2025-10-15",
    assignedTo: "Anna Virtanen",
    status: "valmis",
    priority: "korkea",
    category: "vieraat",
    emoji: "💌",
    pinned: false
  },
  {
    id: 7,
    title: "Koristele juhlapaikka",
    description: "Suunnittele ja tilaa koristeet juhlasaliin",
    dueDate: "2025-10-10",
    assignedTo: "Liisa Mäkinen",
    status: "odottaa",
    priority: "keskitaso",
    category: "kukat",
    emoji: "🎀",
    pinned: false
  },
  {
    id: 8,
    title: "Tarkista juhlapaikka",
    description: "Käy paikan päällä tarkistamassa tilat ja tekniikka",
    dueDate: "2025-10-30",
    assignedTo: "Jukka Nieminen",
    status: "odottaa",
    priority: "matala",
    category: "paikka",
    emoji: "🏛️",
    pinned: false
  }
];

export const weddingBudget = {
  totalBudget: 25000,
  categories: [
    {
      name: "Venue ja catering",
      budgeted: 12000,
      spent: 11500,
      remaining: 500,
      description: "Juhlasali, ruoka ja juomat",
      color: "blue"
    },
    {
      name: "Valokuvaus",
      budgeted: 3000,
      spent: 2800,
      remaining: 200,
      description: "Valokuvaaja ja videokuvaus",
      color: "purple"
    },
    {
      name: "Kukat ja koristeet", 
      budgeted: 2000,
      spent: 1800,
      remaining: 200,
      description: "Morsiuskimppu, koristeet ja asetelmat",
      color: "pink"
    },
    {
      name: "Musiikki ja viihde",
      budgeted: 4000,
      spent: 3500,
      remaining: 500,
      description: "DJ, bändi ja äänentoisto",
      color: "orange"
    },
    {
      name: "Muut kulut",
      budgeted: 1500,
      spent: 800,
      remaining: 700,
      description: "Kutsukortti, kuljetukset ym.",
      color: "green"
    }
  ]
};

export const weddingNotes = [
  {
    id: 1,
    title: "Muistilista vihkipäiväksi",
    content: "Muista ottaa mukaan:\n- Vihkisormukset\n- Morsiuskimppu\n- Kamera\n- Hätäompelutarvikkeet\n- Särkylääke",
    createdBy: "Anna Virtanen",
    createdDate: "2024-06-10",
    lastModified: "2024-06-12",
    category: "muistilista",
    pinned: true // Pinned to dashboard
  },
  {
    id: 2,
    title: "Puheet ja kiitokset",
    content: "Kiitettävät henkilöt:\n- Vanhemmat\n- Morsiusneidot ja sulhasen miehet\n- Valokuvaaja\n- Catering-henkilökunta\n- Kaikki vieraat",
    createdBy: "Mikael Korhonen", 
    createdDate: "2024-06-05",
    lastModified: "2024-06-08",
    category: "puheet",
    pinned: false
  }
];

export const weddingExpenses = [
  {
    id: 1,
    category: "Venue ja catering",
    description: "Juhlasalin varaus",
    amount: 8000,
    estimatedPrice: 8500,
    confirmedPrice: 8000,
    date: "2024-05-15",
    vendor: "Villa Hääsali",
    notes: "Sisältää sali + peruskalusto",
    isPaid: true
  },
  {
    id: 2,
    category: "Venue ja catering", 
    description: "Catering-palvelut",
    amount: 3500,
    estimatedPrice: 3200,
    confirmedPrice: 3500,
    date: "2024-06-01",
    vendor: "Herkku Catering",
    notes: "3-ruokalajinen menu 50 hengelle",
    isPaid: true
  },
  {
    id: 3,
    category: "Valokuvaus",
    description: "Häävalokuvaus",
    amount: 2800,
    estimatedPrice: 3000,
    confirmedPrice: 2800,
    date: "2024-06-10",
    vendor: "Valokuvaaja Matti Kuva",
    notes: "Koko päivän kuvaus + editointi",
    isPaid: true
  },
  {
    id: 4,
    category: "Kukat ja koristeet",
    description: "Morsiuskimppu ja koristeet",
    amount: 1200,
    estimatedPrice: 1200,
    confirmedPrice: 1200,
    date: "2024-06-20",
    vendor: "Kukkakauppa Ruusu",
    notes: "Morsiuskimppu + 5 pöytäkoristeita",
    isPaid: false
  },
  {
    id: 5,
    category: "Kukat ja koristeet",
    description: "Kirkon koristelu",
    amount: 600,
    estimatedPrice: 650,
    confirmedPrice: 600,
    date: "2024-06-25",
    vendor: "Kukkakauppa Ruusu", 
    notes: "Alttarin ja käytävän koristelu",
    isPaid: false
  },
  {
    id: 6,
    category: "Musiikki ja viihde",
    description: "DJ-palvelut",
    amount: 2000,
    estimatedPrice: 1800,
    confirmedPrice: 2000,
    date: "2024-06-15",
    vendor: "DJ Tanssii",
    notes: "Juhlien musiikki + äänentoisto",
    isPaid: true
  },
  {
    id: 7,
    category: "Musiikki ja viihde",
    description: "Kirkkomusiikin järjestäminen",
    amount: 1500,
    estimatedPrice: 1500,
    confirmedPrice: 1500,
    date: "2024-06-18",
    vendor: "Seurakunnan kanttori",
    notes: "Urkuri + laulajat vihkiseremoniaan",
    isPaid: true
  },
  {
    id: 8,
    category: "Muut kulut",
    description: "Kutsukorttien painatus",
    amount: 300,
    estimatedPrice: 250,
    confirmedPrice: 300,
    date: "2024-05-20",
    vendor: "Painotalo Kortti",
    notes: "60 kpl kutsukortteja + kuoret",
    isPaid: true
  },
  {
    id: 9,
    category: "Muut kulut",
    description: "Hääauto vuokra",
    amount: 500,
    estimatedPrice: 500,
    confirmedPrice: null,
    date: "2024-06-30",
    vendor: "Lux Auto Vuokraus",
    notes: "Valkoinen Mercedes 4 tunnin vuokra",
    isPaid: false
  }
];
