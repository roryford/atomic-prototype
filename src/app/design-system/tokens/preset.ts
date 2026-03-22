import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const CustomPreset = definePreset(Aura, {
  // Primitive tier: raw palette values
  primitive: {
    indigo: {
      500: '#4338CA',  // Brand Indigo
      400: '#6366F1',  // Brand Indigo Light
      600: '#3730A3',  // Brand Indigo Dark
    },
    red: {
      500: '#DC2626',  // Danger Red
      600: '#B91C1C',  // Danger Red Dark (hover)
    },
    green: {
      500: '#16A34A',  // Success Green
    },
    amber: {
      500: '#D97706',  // Warning Amber
    },
    stone: {
      50:  '#FAFAF9',  // Surface Warm
      100: '#F5F5F4',  // Surface Muted
      200: '#E7E5E4',  // Border color
      500: '#78716C',  // Text Secondary
      900: '#1C1917',  // Text Primary
    },
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
    },
  },

  // Semantic tier: intent-based aliases
  semantic: {
    primary: {
      50:  '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4338CA',
      700: '#3730A3',
      800: '#312E81',
      900: '#1E1B4B',
      950: '#0F0D2E',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#4338CA',
          contrastColor: '#FFFFFF',
          hoverColor: '#6366F1',
          activeColor: '#3730A3',
        },
        highlight: {
          background: '#E0E7FF',
          focusBackground: '#C7D2FE',
          color: '#4338CA',
          focusColor: '#3730A3',
        },
        surface: {
          0: '#FFFFFF',
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        text: {
          color: '#1C1917',
          hoverColor: '#0C0A09',
          mutedColor: '#78716C',
          hoverMutedColor: '#57534E',
        },
      },
      dark: {
        primary: {
          color: '#6366F1',
          contrastColor: '#FFFFFF',
          hoverColor: '#818CF8',
          activeColor: '#4338CA',
        },
        highlight: {
          background: '#312E81',
          focusBackground: '#3730A3',
          color: '#A5B4FC',
          focusColor: '#C7D2FE',
        },
        surface: {
          0: '#0C0A09',
          50: '#1C1917',
          100: '#292524',
          200: '#44403C',
          300: '#57534E',
          400: '#78716C',
          500: '#A8A29E',
          600: '#D6D3D1',
          700: '#E7E5E4',
          800: '#F5F5F4',
          900: '#FAFAF9',
          950: '#FFFFFF',
        },
        text: {
          color: '#FAFAF9',
          hoverColor: '#FFFFFF',
          mutedColor: '#A8A29E',
          hoverMutedColor: '#D6D3D1',
        },
      },
    },
  },

  // Component tier: per-component overrides
  components: {
    button: {
      root: {
        borderRadius: '6px',
        paddingX: '16px',
        paddingY: '8px',
        label: {
          fontWeight: '600',
        },
        primary: {
          background: '#4338CA',
          hoverBackground: '#6366F1',
          color: '#FFFFFF',
          borderColor: '#4338CA',
          hoverBorderColor: '#6366F1',
        },
        secondary: {
          background: 'transparent',
          hoverBackground: '#E0E7FF',
          color: '#4338CA',
          borderColor: '#4338CA',
        },
        danger: {
          background: '#DC2626',
          hoverBackground: '#B91C1C',
          color: '#FFFFFF',
          borderColor: '#DC2626',
          hoverBorderColor: '#B91C1C',
        },
      },
    },
    tag: {
      root: {
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        padding: '2px 10px',
      },
      success: {
        background: '#DCFCE7',
        color: '#16A34A',
      },
      warn: {
        background: '#FEF3C7',
        color: '#D97706',
      },
      danger: {
        background: '#FEE2E2',
        color: '#DC2626',
      },
      info: {
        background: '#E0E7FF',
        color: '#4338CA',
      },
    },
    card: {
      root: {
        background: '#FFFFFF',
        borderRadius: '12px',
        shadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      body: {
        padding: '24px',
      },
    },
    datatable: {
      headerCell: {
        background: '#F5F5F4',
        color: '#1C1917',
        borderColor: '#E7E5E4',
      },
      bodyCell: {
        borderColor: '#E7E5E4',
      },
      row: {
        hoverBackground: '#FAFAF9',
      },
    },
  },
});

export default CustomPreset;
