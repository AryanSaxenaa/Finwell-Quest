// Neo-Brutalism Design System for FinPath Quest

export const NeoBrutalism = {
  // Color Palette
  colors: {
    // Primary Neo-Brutalism Colors
    black: '#000000',
    white: '#FFFFFF',
    
    // Vibrant Accent Colors
    neonYellow: '#FFFF00',
    hotPink: '#FF1493',
    electricBlue: '#00BFFF',
    neonGreen: '#39FF14',
    brightOrange: '#FF4500',
    pureRed: '#FF0000',
    deepPurple: '#8B00FF',
    
    // New darker alternatives
    darkBlue: '#1a365d',
    darkGreen: '#1a4338',
    darkOrange: '#c53030',
    darkGray: '#4a5568',
    lightGray: '#e2e8f0',
    gray: '#718096',
    
    // Functional Colors
    success: '#39FF14',
    warning: '#FFFF00',
    error: '#FF0000',
    info: '#00BFFF',
    
    // Backgrounds
    background: '#FFFFFF',
    surface: '#000000',
    cardBackground: '#FFFFFF',
  },

  // Typography
  typography: {
    // Font Families (using system fonts for Neo-Brutalism)
    primary: 'System', // Will use platform default bold fonts
    mono: 'Courier', // Monospace for code-like elements
    
    // Font Sizes
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    body: 14,
    caption: 12,
    button: 16,
    
    // Font Weights
    bold: '900', // Extra bold for Neo-Brutalism
    semiBold: '700',
    medium: '600',
    regular: '400',
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Styles
  borders: {
    thick: 4,
    medium: 3,
    thin: 2,
    radius: 0, // Sharp corners for Neo-Brutalism
    buttonRadius: 2, // Minimal rounding for buttons only
  },

  // Shadows (minimal for Neo-Brutalism)
  shadows: {
    brutal: {
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },

  // Component Styles
  components: {
    // Button Styles
    button: {
      primary: {
        backgroundColor: '#FFFF00',
        borderColor: '#000000',
        borderWidth: 4,
        borderRadius: 2,
        paddingVertical: 16,
        paddingHorizontal: 24,
      },
      secondary: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 4,
        borderRadius: 2,
        paddingVertical: 16,
        paddingHorizontal: 24,
      },
      danger: {
        backgroundColor: '#FF0000',
        borderColor: '#000000',
        borderWidth: 4,
        borderRadius: 2,
        paddingVertical: 16,
        paddingHorizontal: 24,
      },
      success: {
        backgroundColor: '#39FF14',
        borderColor: '#000000',
        borderWidth: 4,
        borderRadius: 2,
        paddingVertical: 16,
        paddingHorizontal: 24,
      },
    },

    // Card Styles
    card: {
      default: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 4,
        borderRadius: 0,
        padding: 20,
      },
      highlighted: {
        backgroundColor: '#FFFF00',
        borderColor: '#000000',
        borderWidth: 4,
        borderRadius: 0,
        padding: 20,
      },
      surface: {
        backgroundColor: '#000000',
        borderColor: '#FFFFFF',
        borderWidth: 4,
        borderRadius: 0,
        padding: 20,
      },
    },

    // Input Styles
    input: {
      default: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 4,
        borderRadius: 0,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
      },
    },

    // Navigation Styles
    navigation: {
      header: {
        backgroundColor: '#000000',
        borderBottomColor: '#FFFF00',
        borderBottomWidth: 4,
      },
      tab: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#000000',
        borderTopWidth: 4,
      },
    },
  },

  // Game-specific Colors
  game: {
    board: {
      normal: '#FFFFFF',
      question: '#00BFFF',
      bonus: '#39FF14',
      trap: '#FF0000',
      investment: '#FFFF00',
      player: '#FF1493',
    },
    stats: {
      score: '#8B00FF',
      lives: '#FF0000',
      level: '#39FF14',
      xp: '#FFFF00',
    },
  },

  // Financial Category Colors
  finance: {
    budgeting: '#FFFF00',
    saving: '#39FF14',
    investing: '#00BFFF',
    debt: '#FF0000',
    credit: '#FF1493',
    insurance: '#FF4500',
  },
};

// Helper functions for consistent styling
export const createBrutalButton = (variant = 'primary') => ({
  ...NeoBrutalism.components.button[variant],
  ...NeoBrutalism.shadows.brutal,
});

export const createBrutalCard = (variant = 'default') => ({
  ...NeoBrutalism.components.card[variant],
  ...NeoBrutalism.shadows.brutal,
});

export const createBrutalInput = () => ({
  ...NeoBrutalism.components.input.default,
  ...NeoBrutalism.shadows.none,
});

export const brutalTextStyle = (size = 'body', weight = 'bold', color = 'black') => ({
  fontSize: NeoBrutalism.typography[size],
  fontWeight: NeoBrutalism.typography[weight],
  color: NeoBrutalism.colors[color],
  textTransform: 'uppercase', // Neo-Brutalism often uses uppercase
  letterSpacing: 0.5,
});

// Predefined text styles for easy access
brutalTextStyle.title = brutalTextStyle('h1', 'bold', 'white');
brutalTextStyle.subtitle = brutalTextStyle('h6', 'medium', 'white');
brutalTextStyle.body = brutalTextStyle('body', 'medium', 'white');
brutalTextStyle.caption = brutalTextStyle('caption', 'medium', 'gray');
