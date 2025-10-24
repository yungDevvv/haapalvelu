// Wedding site themes configuration

export const weddingThemes = {
  forest: {
    id: 'forest',
    name: 'Metsä',
    colors: {
      primary: '#2d5f3f',
      secondary: '#8ab38f',
      accent: '#f4e8d8',
      background: '#ffffff',
      text: '#1a1a1a',
    },
    gradients: {
      hero: 'from-green-600 to-green-800',
      section: 'from-green-100 to-green-50',
    },
    fonts: {
      heading: 'font-serif',
      body: 'font-sans',
    }
  },
  romantic: {
    id: 'romantic',
    name: 'Romanttinen',
    colors: {
      primary: '#e91e63',
      secondary: '#f48fb1',
      accent: '#fce4ec',
      background: '#ffffff',
      text: '#1a1a1a',
    },
    gradients: {
      hero: 'from-pink-500 to-rose-600',
      section: 'from-pink-100 to-rose-50',
    },
    fonts: {
      heading: 'font-serif',
      body: 'font-sans',
    }
  },
  elegant: {
    id: 'elegant',
    name: 'Elegantti',
    colors: {
      primary: '#673ab7',
      secondary: '#9575cd',
      accent: '#ede7f6',
      background: '#ffffff',
      text: '#1a1a1a',
    },
    gradients: {
      hero: 'from-purple-600 to-indigo-700',
      section: 'from-purple-100 to-indigo-50',
    },
    fonts: {
      heading: 'font-serif',
      body: 'font-sans',
    }
  },
  beach: {
    id: 'beach',
    name: 'Ranta',
    colors: {
      primary: '#0288d1',
      secondary: '#4fc3f7',
      accent: '#e1f5fe',
      background: '#ffffff',
      text: '#1a1a1a',
    },
    gradients: {
      hero: 'from-blue-500 to-cyan-600',
      section: 'from-blue-100 to-cyan-50',
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans',
    }
  },
  rustic: {
    id: 'rustic',
    name: 'Rustiikki',
    colors: {
      primary: '#795548',
      secondary: '#a1887f',
      accent: '#efebe9',
      background: '#fafafa',
      text: '#1a1a1a',
    },
    gradients: {
      hero: 'from-amber-700 to-brown-600',
      section: 'from-amber-100 to-brown-50',
    },
    fonts: {
      heading: 'font-serif',
      body: 'font-sans',
    }
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalistinen',
    colors: {
      primary: '#424242',
      secondary: '#757575',
      accent: '#f5f5f5',
      background: '#ffffff',
      text: '#212121',
    },
    gradients: {
      hero: 'from-gray-700 to-gray-900',
      section: 'from-gray-100 to-gray-50',
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans',
    }
  }
};

export const getTheme = (themeId) => {
  return weddingThemes[themeId] || weddingThemes.romantic;
};
