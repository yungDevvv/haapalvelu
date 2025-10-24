// Wedding font options for text customization

export const weddingFonts = [
  // Elegant Serif Fonts
  {
    value: 'playfair',
    label: 'Playfair Display',
    className: 'font-serif',
    googleFont: 'Playfair+Display:ital,wght@0,400;0,700;1,400',
    category: 'Serif'
  },
  {
    value: 'cormorant',
    label: 'Cormorant Garamond',
    className: 'font-serif',
    googleFont: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400',
    category: 'Serif'
  },
  {
    value: 'cinzel',
    label: 'Cinzel',
    className: 'font-serif',
    googleFont: 'Cinzel:wght@400;700',
    category: 'Serif'
  },
  {
    value: 'eb-garamond',
    label: 'EB Garamond',
    className: 'font-serif',
    googleFont: 'EB+Garamond:ital,wght@0,400;0,700;1,400',
    category: 'Serif'
  },
  
  // Script/Handwriting Fonts
  {
    value: 'dancing-script',
    label: 'Dancing Script',
    className: 'font-cursive',
    googleFont: 'Dancing+Script:wght@400;700',
    category: 'Script'
  },
  {
    value: 'great-vibes',
    label: 'Great Vibes',
    className: 'font-cursive',
    googleFont: 'Great+Vibes',
    category: 'Script'
  },
  {
    value: 'allura',
    label: 'Allura',
    className: 'font-cursive',
    googleFont: 'Allura',
    category: 'Script'
  },
  {
    value: 'parisienne',
    label: 'Parisienne',
    className: 'font-cursive',
    googleFont: 'Parisienne',
    category: 'Script'
  },
  
  // Modern Sans-Serif Fonts
  {
    value: 'montserrat',
    label: 'Montserrat',
    className: 'font-sans',
    googleFont: 'Montserrat:wght@300;400;600;700',
    category: 'Sans-Serif'
  },
  {
    value: 'raleway',
    label: 'Raleway',
    className: 'font-sans',
    googleFont: 'Raleway:wght@300;400;600;700',
    category: 'Sans-Serif'
  },
  {
    value: 'lato',
    label: 'Lato',
    className: 'font-sans',
    googleFont: 'Lato:wght@300;400;700',
    category: 'Sans-Serif'
  },
  {
    value: 'poppins',
    label: 'Poppins',
    className: 'font-sans',
    googleFont: 'Poppins:wght@300;400;600;700',
    category: 'Sans-Serif'
  }
];

// Get font by value
export function getFontByValue(value) {
  return weddingFonts.find(font => font.value === value) || weddingFonts[0];
}

// Get font class by value
export function getFontClass(value) {
  const font = getFontByValue(value);
  return font.className;
}

// Get Google Fonts link for selected fonts
export function getGoogleFontsLink(fontValues) {
  const fonts = fontValues
    .map(value => getFontByValue(value))
    .filter(Boolean)
    .map(font => font.googleFont);
  
  const uniqueFonts = [...new Set(fonts)];
  
  if (uniqueFonts.length === 0) return '';
  
  return `https://fonts.googleapis.com/css2?${uniqueFonts.join('&')}&display=swap`;
}

// Group fonts by category
export function getFontsByCategory() {
  return {
    'Serif': weddingFonts.filter(f => f.category === 'Serif'),
    'Script': weddingFonts.filter(f => f.category === 'Script'),
    'Sans-Serif': weddingFonts.filter(f => f.category === 'Sans-Serif')
  };
}
