import type { HoneyCSSColor, HoneyFont, HoneyTheme } from '@react-hive/honey-layout';

type PrimaryColors = 'skyBlue' | 'aliceBlue' | 'dodgerBlue' | 'deepSkyBlue';

type SecondaryColors =
  | 'lightestGray'
  | 'extraLightGray'
  | 'lightGray'
  | 'softGray'
  | 'mediumLightGray';

type AccentColors = string;

type NeutralColors =
  | 'charcoalDark'
  | 'charcoalGray'
  | 'royalBlue'
  | 'slateBlue'
  | 'darkGray'
  | 'mediumGray'
  | 'lightGray';

type SuccessColors = 'greenLight' | 'mintGreen' | 'green' | 'emeraldGreen' | 'greenDark';

type WarningColors = 'yellowLight' | 'yellow' | 'gold' | 'orange' | 'darkOrange';

type ErrorColors =
  | 'pinkLight'
  | 'pink'
  | 'redLight'
  | 'red'
  | 'darkRed'
  | 'crimsonRed'
  | 'coralRed';

declare module '@react-hive/honey-layout' {
  export interface HoneyFonts {
    h4: HoneyFont;
    h5: HoneyFont;
    h6: HoneyFont;
    subtitle1: HoneyFont;
    subtitle2: HoneyFont;
    body1: HoneyFont;
    body2: HoneyFont;
    button: HoneyFont;
    caption1: HoneyFont;
    caption2: HoneyFont;
  }

  export interface HoneyColors {
    primary: Record<PrimaryColors, HoneyCSSColor>;
    secondary: Record<SecondaryColors, HoneyCSSColor>;
    accent: Record<AccentColors, HoneyCSSColor>;
    neutral: Record<NeutralColors, HoneyCSSColor>;
    success: Record<SuccessColors, HoneyCSSColor>;
    warning: Record<WarningColors, HoneyCSSColor>;
    error: Record<ErrorColors, HoneyCSSColor>;
  }
}

export const theme: HoneyTheme = {
  breakpoints: {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
  },
  container: {
    maxWidth: '1450px',
  },
  spacings: {
    base: 8,
  },
  fonts: {
    h4: {
      size: 24,
    },
    h5: {
      size: 22,
    },
    h6: {
      size: 20,
    },
    subtitle1: {
      size: 18,
      weight: 600,
    },
    subtitle2: {
      size: 16,
    },
    body1: {
      size: 16,
    },
    body2: {
      size: 14,
    },
    button: {
      size: 12,
    },
    caption1: {
      size: 10,
    },
    caption2: {
      size: 12,
    },
  },
  dimensions: {},
  colors: {
    primary: {
      skyBlue: '#87CEEB', // Sky blue, gentle primary color option
      aliceBlue: '#F0F8FF', // Very light blue, suitable for subtle backgrounds
      dodgerBlue: '#1E90FF', // Brighter blue for buttons or active states
      deepSkyBlue: '#00BFFF', // Vibrant blue, ideal for interactive elements
    },
    secondary: {
      lightestGray: '#F9F9F9', // Very light gray, nearly white, good for background
      extraLightGray: '#F2F2F2', // Extra light gray for background or hover states
      lightGray: '#EAEAEA', // Light gray, a subtle contrast for card backgrounds
      softGray: '#DADADA', // Soft gray for neutral components like dividers
      mediumLightGray: '#C8C8C8', // Slightly darker, for borders and outlines
    },
    accent: {},
    neutral: {
      charcoalDark: '#222222',
      charcoalGray: '#333333',
      royalBlue: '#4169E1',
      slateBlue: '#6A5ACD',
      // Text
      darkGray: '#333333', // Dark gray, ideal for primary text
      mediumGray: '#4F4F4F', // Medium gray for secondary text
      lightGray: '#7A7A7A', // Lighter gray for muted or placeholder text
    },
    success: {
      greenLight: '#E6FFE6', // Very light green, subtle success background
      mintGreen: '#98FF98', // Light mint green, soft success indication
      green: '#32CD32', // Standard green for success messages
      emeraldGreen: '#50C878', // Rich green for a stronger success emphasis
      greenDark: '#006400', // Dark green for bold success notifications
    },
    warning: {
      yellowLight: '#FFF8DC', // Light yellow, subtle warning background
      yellow: '#FFD700', // Bright yellow for standard warning
      gold: '#FFC107', // Slightly darker yellow-gold for elevated warnings
      orange: '#FFA500', // Orange for more urgent warnings
      darkOrange: '#FF8C00', // Darker orange, intense warning signal
    },
    error: {
      pinkLight: '#FFE4E1', // Light pink for soft error background
      pink: '#FFB6C1', // Soft pink for mild error indications
      redLight: '#FF7F7F', // Light red for general error notifications
      red: '#FF0000', // Standard red for strong error alerts
      darkRed: '#8B0000', // Dark red for critical or urgent errors
      crimsonRed: '#DC143C', // Crimson red for additional emphasis
      coralRed: '#FF4D4D', // Coral red for moderate alerts
    },
  },
};
