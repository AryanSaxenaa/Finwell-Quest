import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NeoBrutalism, createBrutalButton, createBrutalCard, brutalTextStyle } from '../styles/neoBrutalism';

// Neo-Brutalism Button Component
export const BrutalButton = ({ 
  title, 
  children,
  onPress, 
  variant = 'primary', 
  disabled = false, 
  icon = null,
  style = {},
  textStyle = {}
}) => {
  const buttonStyle = createBrutalButton(variant);
  const buttonText = title || children;
  
  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        disabled && { opacity: 0.6 },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.buttonIcon}>{icon}</View>}
        <Text style={[
          brutalTextStyle('button', 'bold', 'black'),
          textStyle
        ]}>
          {buttonText ? buttonText.toString().toUpperCase() : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Neo-Brutalism Card Component
export const BrutalCard = ({ 
  children, 
  variant = 'default', 
  style = {},
  title = null,
  titleColor = 'black'
}) => {
  const cardStyle = createBrutalCard(variant);
  
  return (
    <View style={[cardStyle, style]}>
      {title && (
        <Text style={[
          brutalTextStyle('h6', 'bold', titleColor),
          styles.cardTitle
        ]}>
          {title ? title.toUpperCase() : ''}
        </Text>
      )}
      {children}
    </View>
  );
};

// Neo-Brutalism Stats Component
export const BrutalStats = ({ stats = [] }) => {
  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <BrutalCard key={index} variant="default" style={styles.statCard}>
          <Text style={brutalTextStyle('h4', 'bold', 'black')}>
            {stat.value}
          </Text>
          <Text style={brutalTextStyle('caption', 'medium', 'black')}>
            {stat.label ? stat.label.toUpperCase() : ''}
          </Text>
        </BrutalCard>
      ))}
    </View>
  );
};

// Neo-Brutalism Single Stat Component
export const BrutalStat = ({ 
  label, 
  value, 
  subtitle = null,
  color = 'black', 
  size = 'medium',
  style = {} 
}) => {
  return (
    <BrutalCard variant="default" style={[styles.statCard, style]}>
      <Text 
        style={brutalTextStyle('caption', 'medium', 'black')}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
      >
        {label ? label.toUpperCase() : ''}
      </Text>
      <Text 
        style={brutalTextStyle(size === 'large' ? 'h3' : 'h4', 'bold', 'black')}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
      >
        {value || ''}
      </Text>
      {subtitle && (
        <Text 
          style={brutalTextStyle('caption', 'medium', 'gray')}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          {subtitle ? subtitle.toUpperCase() : ''}
        </Text>
      )}
    </BrutalCard>
  );
};

// Neo-Brutalism Illustration Component
export const BrutalIllustration = ({ 
  source, 
  size = 'medium', 
  style = {},
  borderColor = 'black'
}) => {
  const sizeMap = {
    small: 80,
    medium: 120,
    large: 200,
    xlarge: 280
  };

  const illustrationSize = sizeMap[size];

  return (
    <View style={[
      styles.illustrationContainer,
      {
        width: illustrationSize,
        height: illustrationSize,
        borderColor: NeoBrutalism.colors[borderColor],
      },
      style
    ]}>
      <Image
        source={source}
        style={styles.illustration}
        resizeMode="contain"
      />
    </View>
  );
};

// Neo-Brutalism Header Component
export const BrutalHeader = ({ 
  title, 
  subtitle = null, 
  backgroundColor = 'darkBlue',
  textColor = 'white',
  illustration = null,
  leftAction = null,
  rightAction = null
}) => {
  return (
    <View style={[
      styles.headerContainer,
      { backgroundColor: NeoBrutalism.colors[backgroundColor] }
    ]}>
      <View style={styles.headerContent}>
        {leftAction && (
          <View style={styles.headerAction}>
            {leftAction}
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={brutalTextStyle('h5', 'bold', textColor)}>
            {title ? title.toUpperCase() : ''}
          </Text>
          {subtitle && (
            <Text style={[
              brutalTextStyle('caption', 'medium', textColor),
              styles.subtitle
            ]}>
              {subtitle ? subtitle.toUpperCase() : ''}
            </Text>
          )}
        </View>
        {rightAction && (
          <View style={styles.headerAction}>
            {rightAction}
          </View>
        )}
        {illustration && (
          <BrutalIllustration 
            source={illustration} 
            size="small"
            borderColor={textColor}
          />
        )}
      </View>
    </View>
  );
};

// Neo-Brutalism Progress Bar
export const BrutalProgressBar = ({ 
  progress, 
  backgroundColor = 'white', 
  fillColor = 'neonGreen',
  height = 20,
  style = {}
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress || 0, 0), 100);
  
  return (
    <View style={[
      styles.progressContainer,
      {
        backgroundColor: NeoBrutalism.colors[backgroundColor],
        height: height,
      },
      style
    ]}>
      <View style={[
        styles.progressFill,
        {
          width: `${normalizedProgress}%`,
          backgroundColor: NeoBrutalism.colors[fillColor],
        }
      ]} />
    </View>
  );
};

// Neo-Brutalism Game Tile
export const BrutalGameTile = ({ 
  number, 
  type = 'normal', 
  isPlayer = false, 
  size = 50,
  onPress = null 
}) => {
  const tileColors = {
    normal: NeoBrutalism.colors.white,
    question: NeoBrutalism.colors.electricBlue,
    bonus: NeoBrutalism.colors.neonGreen,
    trap: NeoBrutalism.colors.pureRed,
    investment: NeoBrutalism.colors.neonYellow,
  };

  return (
    <TouchableOpacity
      style={[
        styles.gameTile,
        {
          width: size,
          height: size,
          backgroundColor: tileColors[type],
          borderColor: isPlayer ? NeoBrutalism.colors.hotPink : NeoBrutalism.colors.black,
          borderWidth: isPlayer ? 6 : 3,
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={brutalTextStyle('caption', 'bold', 'black')}>
        {number}
      </Text>
      {isPlayer && (
        <View style={styles.playerIndicator}>
          <Text style={styles.playerEmoji}>👤</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Button Styles
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: NeoBrutalism.spacing.sm,
  },

  // Card Styles
  cardTitle: {
    marginBottom: NeoBrutalism.spacing.md,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: NeoBrutalism.spacing.md,
  },
  statCard: {
    flex: 1,
    marginHorizontal: NeoBrutalism.spacing.xs,
    alignItems: 'center',
    paddingVertical: NeoBrutalism.spacing.sm,
    paddingHorizontal: NeoBrutalism.spacing.xs,
    minHeight: 70,
  },

  // Illustration Styles
  illustrationContainer: {
    borderWidth: NeoBrutalism.borders.thick,
    borderRadius: NeoBrutalism.borders.radius,
    padding: NeoBrutalism.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NeoBrutalism.colors.white,
    ...NeoBrutalism.shadows.brutal,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },

  // Header Styles
  headerContainer: {
    borderBottomWidth: NeoBrutalism.borders.thick,
    borderBottomColor: NeoBrutalism.colors.black,
    paddingVertical: NeoBrutalism.spacing.md,
    paddingHorizontal: NeoBrutalism.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerAction: {
    minWidth: 40,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: NeoBrutalism.spacing.xs / 2,
    opacity: 0.8,
  },

  // Progress Bar Styles
  progressContainer: {
    borderWidth: NeoBrutalism.borders.medium,
    borderColor: NeoBrutalism.colors.black,
    borderRadius: NeoBrutalism.borders.radius,
    overflow: 'hidden',
    ...NeoBrutalism.shadows.brutal,
  },
  progressFill: {
    height: '100%',
    borderRightWidth: 2,
    borderRightColor: NeoBrutalism.colors.black,
  },

  // Game Tile Styles
  gameTile: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    position: 'relative',
    ...NeoBrutalism.shadows.brutal,
  },
  playerIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: NeoBrutalism.colors.hotPink,
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerEmoji: {
    fontSize: 10,
  },
});

// Re-export brutalTextStyle for easy access
export { brutalTextStyle };
