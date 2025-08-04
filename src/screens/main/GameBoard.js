import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Layout, 
  Text, 
  Modal
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  BrutalStats,
  brutalTextStyle 
} from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

const { width } = Dimensions.get('window');
const GRID_SIZE = 6;
const TILE_SIZE = (width - 48) / GRID_SIZE; // Reduced padding for more compact 6x6 grid

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="black" />;
const DiceIcon = (props) => <Ionicons name="cube-outline" size={24} color="white" />;
const PersonIcon = (props) => <Ionicons name="person-outline" size={20} color="white" />;

// Enhanced board tiles with new types for 6x6 grid (36 tiles)
const BOARD_TILES = Array.from({ length: 36 }, (_, i) => {
  if (i % 8 === 0 && i !== 0) return { id: i, type: 'trap' };
  if (i % 6 === 0 && i !== 0) return { id: i, type: 'investment' };
  if (i % 3 === 0) return { id: i, type: 'question' };
  if (i % 5 === 0 && i !== 0) return { id: i, type: 'bonus' };
  return { id: i, type: 'normal' };
});

export default function GameBoard({ navigation }) {
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showTileEffect, setShowTileEffect] = useState(false);
  const [currentTileEffect, setCurrentTileEffect] = useState(null);
  
  const { 
    score, 
    level, 
    lives, 
    position, 
    movePlayer, 
    setCurrentQuestion,
    updateScore,
    loseLife,
    lastLevelUp,
    clearLevelUp,
    resetGame
  } = useGameStore();

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => {
        // If game is in progress (score > 0 or lives < 3), show confirmation
        if (score > 0 || lives < 3) {
          // For now, just go back - could add Alert later
          resetGame();
          navigation.goBack();
        } else {
          navigation.goBack();
        }
      }} 
    />
  );

  const handleTileEffect = (tile, newPosition) => {
    switch (tile.type) {
      case 'question':
        setTimeout(() => {
          navigation.navigate('QuestionScreen', { 
            tileType: tile.type,
            position: newPosition 
          });
        }, 1000);
        break;
      
      case 'bonus':
        setCurrentTileEffect({
          type: 'bonus',
          title: '🎉 Bonus Tile!',
          message: 'You found a treasure! +50 XP',
          action: () => updateScore(50, null, true)
        });
        setShowTileEffect(true);
        break;
        
      case 'trap':
        setCurrentTileEffect({
          type: 'trap',
          title: '⚠️ Unexpected Expense!',
          message: 'Car repair bill! You lose 1 life.',
          action: () => loseLife()
        });
        setShowTileEffect(true);
        break;
        
      case 'investment':
        setCurrentTileEffect({
          type: 'investment',
          title: '📈 Investment Opportunity!',
          message: 'Choose your risk level:',
          isChoice: true,
          choices: [
            { text: 'Safe Investment (+20 XP)', reward: 20 },
            { text: 'Risky Investment (+50 XP or -1 life)', reward: Math.random() > 0.5 ? 50 : -1 }
          ]
        });
        setShowTileEffect(true);
        break;
    }
  };

  const rollDice = () => {
    if (isRolling || lives <= 0) return;
    
    setIsRolling(true);
    
    // Simulate dice roll animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      movePlayer(roll);
      
      const newPosition = (position + roll) % 36;
      const tile = BOARD_TILES[newPosition];
      
      handleTileEffect(tile, newPosition);
      
      setIsRolling(false);
    }, 1500);
  };

  const renderTile = (tile, index) => {
    const isPlayerHere = index === position;
    const getTileColor = () => {
      switch (tile.type) {
        case 'question': return NeoBrutalism.colors.electricBlue;
        case 'bonus': return NeoBrutalism.colors.neonGreen;
        case 'trap': return NeoBrutalism.colors.hotPink;
        case 'investment': return '#D97706'; // Changed from neonYellow to darker orange
        default: return '#6B7280'; // Dark gray for better visibility
      }
    };
    
    const getTileIcon = () => {
      switch (tile.type) {
        case 'question': return '❓';
        case 'bonus': return '💰';
        case 'trap': return '⚠️';
        case 'investment': return '📈';
        default: return '';
      }
    };

    const tileStyle = [
      styles.tile,
      { backgroundColor: getTileColor() },
      isPlayerHere && styles.playerTile
    ];

    return (
      <View key={tile.id} style={tileStyle}>
        <Text style={styles.tileNumber}>{index + 1}</Text>
        <Text style={styles.tileIcon}>{getTileIcon()}</Text>
        {isPlayerHere && (
          <View style={styles.player}>
            <PersonIcon />
          </View>
        )}
      </View>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        const index = i * GRID_SIZE + j;
        row.push(renderTile(BOARD_TILES[index], index));
      }
      rows.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return rows;
  };

  if (lives <= 0) {
    return (
      <Layout style={styles.container}>
        <TopNavigation
          title='Game Over'
          accessoryLeft={renderBackAction}
        />
        <View style={styles.gameOverContainer}>
          <Card style={styles.gameOverCard}>
            <Ionicons name="skull-outline" size={64} color="#E74C3C" style={styles.gameOverIcon} />
            <Text category='h4' style={styles.gameOverText}>Game Over!</Text>
            <Text category='p1' style={styles.gameOverScore}>Your final score: {score}</Text>
            
            <View style={styles.gameOverButtons}>
              <BrutalButton
                style={styles.restartButton}
                onPress={() => {
                  resetGame();
                  navigation.replace('GameBoard');
                }}
                icon={<Ionicons name="refresh" size={20} color="white" />}
              >
                RESTART GAME
              </BrutalButton>
              
              <BrutalButton
                style={styles.resultsButton}
                variant="outline"
                onPress={() => navigation.navigate('GameResults')}
                icon={<Ionicons name="stats-chart" size={20} color="#6C5CE7" />}
              >
                VIEW RESULTS
              </BrutalButton>
            </View>
          </Card>
        </View>
      </Layout>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Layout style={styles.container}>
        <BrutalHeader 
          title="🎮 GAME BOARD"
          textColor="white"
          leftAction={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
            </TouchableOpacity>
          }
        />
        
        <View style={styles.content}>
          {/* Stats Section */}
          <BrutalStats 
            stats={[
              { label: 'SCORE', value: score, color: NeoBrutalism.colors.neonYellow },
              { label: 'LIVES', value: lives, color: NeoBrutalism.colors.hotPink },
              { label: 'LEVEL', value: level, color: NeoBrutalism.colors.electricBlue }
            ]}
            style={styles.statsSection}
          />

          {/* Game Board */}
          <BrutalCard style={styles.boardSection}>
            <View style={styles.board}>
              {renderBoard()}
            </View>
          </BrutalCard>

          {/* Dice Section */}
          <BrutalCard style={styles.diceSection}>
            <View style={styles.diceValueContainer}>
              {diceValue && (
                <Text style={brutalTextStyle('h4', 'bold', 'black')}>🎲 {diceValue}</Text>
              )}
            </View>
            <BrutalButton
              title={isRolling ? 'ROLLING...' : 'ROLL DICE'}
              onPress={rollDice}
              variant="primary"
              size="large"
              disabled={isRolling}
              icon={<Ionicons name="cube" size={24} color={NeoBrutalism.colors.black} />}
            />
          </BrutalCard>
        </View>

        {/* Tile Effect Modal */}
        <Modal
          visible={showTileEffect}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setShowTileEffect(false)}
        >
          <BrutalCard style={styles.effectModal}>
            <Text style={brutalTextStyle('h5', 'bold', 'black')}>
              {currentTileEffect?.title}
            </Text>
            <Text style={[brutalTextStyle('body', 'medium', 'gray'), styles.effectMessage]}>
              {currentTileEffect?.message}
            </Text>
            
            {currentTileEffect?.isChoice ? (
              <View style={styles.choiceButtons}>
                {currentTileEffect.choices.map((choice, index) => (
                  <BrutalButton
                    key={index}
                    title={choice.text}
                    variant={index === 0 ? "secondary" : "primary"}
                    style={styles.choiceButton}
                    onPress={() => {
                      if (choice.reward > 0) {
                        updateScore(choice.reward, null, true);
                      } else {
                        loseLife();
                      }
                      setShowTileEffect(false);
                    }}
                  />
                ))}
              </View>
            ) : (
              <BrutalButton
                style={styles.effectButton}
                onPress={() => {
                  currentTileEffect?.action?.();
                  setShowTileEffect(false);
                }}
              >
                CONTINUE
              </BrutalButton>
            )}
          </BrutalCard>
        </Modal>

        {/* Level Up Modal */}
        <Modal
          visible={lastLevelUp}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => clearLevelUp()}
        >
          <BrutalCard style={styles.levelUpModal}>
            <Text style={brutalTextStyle('h4', 'bold', 'black')}>🎉 LEVEL UP! 🎉</Text>
            <Text style={brutalTextStyle('h5', 'bold', 'black')}>
              CONGRATULATIONS! YOU REACHED LEVEL {level}!
            </Text>
            <BrutalButton
              style={styles.levelUpButton}
              onPress={() => clearLevelUp()}
            >
              AWESOME!
            </BrutalButton>
          </BrutalCard>
        </Modal>
    </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topNavigation: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 12,
    paddingTop: 24, // Added padding between header and stats section
    paddingBottom: 140, // Extra padding to prevent overlap with bottom nav
  },
  statsSection: {
    marginBottom: 12,
    paddingVertical: 12,
    marginTop: 8, // Additional spacing from the header
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#8F9BB3',
    marginTop: 4,
  },
  boardSection: {
    marginBottom: 4,
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 6,
  },
  board: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    position: 'relative',
  },
  playerTile: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  tileNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  tileIcon: {
    fontSize: 14,
    position: 'absolute',
    bottom: 2,
  },
  player: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  effectModal: {
    margin: 20,
    alignItems: 'center',
    padding: 20,
    borderWidth: 0,
    backgroundColor: NeoBrutalism.colors.white,
  },
  effectTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  effectMessage: {
    marginBottom: 20,
    textAlign: 'center',
  },
  effectButton: {
    minWidth: 120,
  },
  choiceButtons: {
    width: '100%',
    gap: 12,
  },
  choiceButton: {
    marginBottom: 8,
  },
  levelUpModal: {
    margin: 20,
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F0F8FF',
    borderWidth: 0,
  },
  levelUpTitle: {
    color: '#6C5CE7',
    marginBottom: 16,
    textAlign: 'center',
  },
  levelUpText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  levelUpButton: {
    backgroundColor: '#6C5CE7',
    minWidth: 120,
  },
  playerIcon: {
    width: 12,
    height: 12,
  },
  diceSection: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  diceTitle: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2E384D',
  },
  diceValueContainer: {
    height: 50, // Fixed height to prevent layout shift
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  diceValue: {
    marginBottom: 0,
    color: '#6C5CE7',
  },
  rollButton: {
    minWidth: 150,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  gameOverCard: {
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  gameOverIcon: {
    marginBottom: 16,
  },
  gameOverText: {
    marginBottom: 12,
    color: '#E74C3C',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gameOverScore: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
    color: '#8F9BB3',
  },
  gameOverButtons: {
    width: '100%',
    gap: 16,
  },
  restartButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    marginBottom: 12,
    minHeight: 50,
  },
  resultsButton: {
    borderColor: '#6C5CE7',
    borderRadius: 12,
    minHeight: 50,
  },
});
