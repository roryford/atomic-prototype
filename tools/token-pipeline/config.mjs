import StyleDictionary from 'style-dictionary';

/**
 * Custom Style Dictionary format: primeng/definePreset
 *
 * Maps DTCG design tokens to PrimeNG's definePreset() structure,
 * outputting a TypeScript file that can be dropped straight into
 * an Angular app's theme configuration.
 *
 * PrimeNG themes have 3 tiers:
 *   primitive  — raw palette values (indigo.500, red.500, etc.)
 *   semantic   — role-based mappings  (primary.color, surface.0, etc.)
 *   component  — per-component overrides (optional, not generated here)
 */
StyleDictionary.registerFormat({
  name: 'primeng/definePreset',
  format: ({ dictionary }) => {
    // ── Helpers ──────────────────────────────────────────────────────
    const colorTokens = dictionary.allTokens.filter((t) => t.$type === 'color');
    const dimensionTokens = dictionary.allTokens.filter((t) => t.$type === 'dimension');

    /** Find a token value by its path segments (e.g. 'color','brand','indigo'). */
    const val = (...segments) => {
      const token = colorTokens.find((t) => t.path.join('.') === segments.join('.'));
      return token ? (token.$value ?? token.value) : undefined;
    };

    const dimVal = (...segments) => {
      const token = dimensionTokens.find((t) => t.path.join('.') === segments.join('.'));
      return token ? (token.$value ?? token.value) : undefined;
    };

    // ── Primitive tier ───────────────────────────────────────────────
    // PrimeNG expects a palette object keyed by color family, with
    // numeric shade keys (50-950). We map our brand tokens into that
    // structure and add standalone status colors.

    const primitive = {};

    // Brand indigo palette — map to shade numbers PrimeNG expects
    const indigo = val('color', 'brand', 'indigo');
    const indigoLight = val('color', 'brand', 'indigo-light');
    const indigoDark = val('color', 'brand', 'indigo-dark');

    if (indigo || indigoLight || indigoDark) {
      primitive.indigo = {};
      if (indigoLight) primitive.indigo[400] = `'${indigoLight}'`;
      if (indigo) primitive.indigo[500] = `'${indigo}'`;
      if (indigoDark) primitive.indigo[600] = `'${indigoDark}'`;
    }

    // Status colors as single-shade palettes
    for (const status of ['danger', 'success', 'warning']) {
      const v = val('color', status);
      if (v) {
        primitive[status === 'danger' ? 'red' : status === 'success' ? 'green' : 'amber'] = {
          500: `'${v}'`,
        };
      }
    }

    // Surface neutrals
    const surfaceWarm = val('color', 'surface', 'warm');
    const surfaceMuted = val('color', 'surface', 'muted');
    const surfaceBorder = val('color', 'surface', 'border');
    if (surfaceWarm || surfaceMuted || surfaceBorder) {
      primitive.stone = {};
      if (surfaceWarm) primitive.stone[50] = `'${surfaceWarm}'`;
      if (surfaceMuted) primitive.stone[100] = `'${surfaceMuted}'`;
      if (surfaceBorder) primitive.stone[200] = `'${surfaceBorder}'`;
    }

    // Border radius
    const radiusDefault = dimVal('borderRadius', 'default');
    const radiusRounded = dimVal('borderRadius', 'rounded');
    const radiusPill = dimVal('borderRadius', 'pill');
    if (radiusDefault || radiusRounded || radiusPill) {
      primitive.borderRadius = {};
      if (radiusDefault) primitive.borderRadius.md = `'${radiusDefault}'`;
      if (radiusRounded) primitive.borderRadius.lg = `'${radiusRounded}'`;
      if (radiusPill) primitive.borderRadius.xl = `'${radiusPill}'`;
    }

    // Spacing scale — PrimeNG's `Primitive` type has no `spacing` slot, so we
    // emit it under the preset's `extend` key (Record<string, ...>), which is the
    // supported escape hatch for custom design tokens. This exposes
    // --p-spacing-xs … --p-spacing-lg CSS variables without breaking typings.
    const extend = {};
    const spacingXs = dimVal('spacing', 'xs');
    const spacingSm = dimVal('spacing', 'sm');
    const spacingMd = dimVal('spacing', 'md');
    const spacingLg = dimVal('spacing', 'lg');
    if (spacingXs || spacingSm || spacingMd || spacingLg) {
      extend.spacing = {};
      if (spacingXs) extend.spacing.xs = `'${spacingXs}'`;
      if (spacingSm) extend.spacing.sm = `'${spacingSm}'`;
      if (spacingMd) extend.spacing.md = `'${spacingMd}'`;
      if (spacingLg) extend.spacing.lg = `'${spacingLg}'`;
    }

    // ── Semantic tier ────────────────────────────────────────────────
    // Maps primitive values to UI roles under colorScheme.light

    const surfaceCard = val('color', 'surface', 'card');
    const textPrimary = val('color', 'text', 'primary');
    const textSecondary = val('color', 'text', 'secondary');

    // Dark scheme values (defined under color.dark.* in primitives.json)
    const darkPrimary = val('color', 'dark', 'primary');
    const darkPrimaryHover = val('color', 'dark', 'primary-hover');
    const darkPrimaryActive = val('color', 'dark', 'primary-active');
    const darkSurfaceCard = val('color', 'dark', 'surface', 'card');
    const darkSurfaceWarm = val('color', 'dark', 'surface', 'warm');
    const darkSurfaceMuted = val('color', 'dark', 'surface', 'muted');
    const darkSurfaceBorder = val('color', 'dark', 'surface', 'border');
    const darkTextPrimary = val('color', 'dark', 'text', 'primary');
    const darkTextSecondary = val('color', 'dark', 'text', 'secondary');

    const semantic = {
      colorScheme: {
        light: {
          primary: {
            color: indigo ? `'${indigo}'` : undefined,
            hoverColor: indigoLight ? `'${indigoLight}'` : undefined,
            activeColor: indigoDark ? `'${indigoDark}'` : undefined,
          },
          surface: {
            0: surfaceCard ? `'${surfaceCard}'` : undefined,
            50: surfaceWarm ? `'${surfaceWarm}'` : undefined,
            100: surfaceMuted ? `'${surfaceMuted}'` : undefined,
            200: surfaceBorder ? `'${surfaceBorder}'` : undefined,
          },
          text: {
            color: textPrimary ? `'${textPrimary}'` : undefined,
            mutedColor: textSecondary ? `'${textSecondary}'` : undefined,
          },
        },
        dark: {
          primary: {
            color: darkPrimary ? `'${darkPrimary}'` : undefined,
            hoverColor: darkPrimaryHover ? `'${darkPrimaryHover}'` : undefined,
            activeColor: darkPrimaryActive ? `'${darkPrimaryActive}'` : undefined,
          },
          surface: {
            0: darkSurfaceCard ? `'${darkSurfaceCard}'` : undefined,
            50: darkSurfaceWarm ? `'${darkSurfaceWarm}'` : undefined,
            100: darkSurfaceMuted ? `'${darkSurfaceMuted}'` : undefined,
            200: darkSurfaceBorder ? `'${darkSurfaceBorder}'` : undefined,
          },
          text: {
            color: darkTextPrimary ? `'${darkTextPrimary}'` : undefined,
            mutedColor: darkTextSecondary ? `'${darkTextSecondary}'` : undefined,
          },
        },
      },
    };

    // ── Render TypeScript ────────────────────────────────────────────

    /** Recursively render an object as TypeScript source, stripping
     *  quotes from values that are already wrapped in single-quotes
     *  (those are literal strings, not JSON strings). */
    function renderObj(obj, indent = 2) {
      const pad = ' '.repeat(indent);
      const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
      if (entries.length === 0) return '{}';

      const lines = entries.map(([key, value]) => {
        // Quote keys that are purely numeric or contain hyphens
        const safeKey = /^\d+$/.test(key) || key.includes('-') ? `'${key}'` : key;

        if (typeof value === 'object' && value !== null) {
          return `${pad}${safeKey}: ${renderObj(value, indent + 2)},`;
        }
        // Values already wrapped in single-quotes are emitted verbatim
        return `${pad}${safeKey}: ${value},`;
      });

      return `{\n${lines.join('\n')}\n${' '.repeat(indent - 2)}}`;
    }

    return [
      '// Generated by Style Dictionary — do not edit manually',
      "import { definePreset } from '@primeng/themes';",
      "import Aura from '@primeng/themes/aura';",
      '',
      `export default definePreset(Aura, ${renderObj({
        primitive,
        semantic,
        extend: Object.keys(extend).length > 0 ? extend : undefined,
      })});`,
      '',
    ].join('\n');
  },
});

// ── Style Dictionary config ──────────────────────────────────────────
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    primeng: {
      buildPath: 'output/',
      files: [
        {
          destination: 'preset.ts',
          format: 'primeng/definePreset',
        },
      ],
    },
  },
};
