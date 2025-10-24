// Helper functions for working with block defaults from templates

/**
 * Get merged block defaults for a specific block type
 * Combines base defaults with template-specific overrides
 */
export function getMergedBlockDefaults(blockType, baseDefaults, templateDefaults) {
  const base = baseDefaults[blockType] || {};
  const templateOverrides = templateDefaults?.[blockType] || {};
  
  return {
    ...base,
    ...templateOverrides
  };
}

/**
 * Get a human-readable summary of template defaults for a block type
 */
export function getBlockDefaultsSummary(blockType, templateDefaults) {
  if (!templateDefaults?.[blockType]) {
    return null;
  }
  
  const defaults = templateDefaults[blockType];
  const summary = {};
  
  // Group settings by category
  if (defaults.titleFont || defaults.subtitleFont || defaults.contentFont || defaults.descriptionFont) {
    summary.fontit = {
      titleFont: defaults.titleFont,
      subtitleFont: defaults.subtitleFont,
      contentFont: defaults.contentFont,
      descriptionFont: defaults.descriptionFont
    };
  }
  
  if (defaults.backgroundColor || defaults.titleColor || defaults.contentColor || defaults.descriptionColor) {
    summary.varit = {
      backgroundColor: defaults.backgroundColor,
      titleColor: defaults.titleColor,
      subtitleColor: defaults.subtitleColor,
      contentColor: defaults.contentColor,
      descriptionColor: defaults.descriptionColor,
      cardColor: defaults.cardColor,
      accentColor: defaults.accentColor,
      buttonColor: defaults.buttonColor
    };
  }
  
  if (defaults.paddingY || defaults.paddingX) {
    summary.tilat = {
      paddingY: defaults.paddingY,
      paddingX: defaults.paddingX
    };
  }
  
  if (defaults.alignment) {
    summary.muut = {
      alignment: defaults.alignment
    };
  }
  
  return summary;
}

/**
 * Format block defaults summary for display
 */
export function formatBlockDefaultsForDisplay(blockType, templateDefaults) {
  const summary = getBlockDefaultsSummary(blockType, templateDefaults);
  
  if (!summary) {
    return 'Ei template-asetuksia';
  }
  
  const lines = [];
  
  if (summary.fontit) {
    lines.push('📝 Fontit:');
    Object.entries(summary.fontit).forEach(([key, value]) => {
      if (value) lines.push(`  • ${key}: ${value}`);
    });
  }
  
  if (summary.varit) {
    lines.push('🎨 Värit:');
    Object.entries(summary.varit).forEach(([key, value]) => {
      if (value) lines.push(`  • ${key}: ${value}`);
    });
  }
  
  if (summary.tilat) {
    lines.push('📐 Tilat:');
    Object.entries(summary.tilat).forEach(([key, value]) => {
      if (value) lines.push(`  • ${key}: ${value}px`);
    });
  }
  
  if (summary.muut) {
    lines.push('⚙️ Muut:');
    Object.entries(summary.muut).forEach(([key, value]) => {
      if (value) lines.push(`  • ${key}: ${value}`);
    });
  }
  
  return lines.join('\n');
}
