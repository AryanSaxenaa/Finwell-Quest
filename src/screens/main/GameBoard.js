import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { 
  Layout, 
  Text, 
  Button, 
  Card,
  TopNavigation,
  TopNavigationAction,
  Modal
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5;
const TILE_SIZE = (width - 80) / GRID_SIZE;

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="black" />;
const DiceIcon = (props) => <Ionicons name="cube-outline" size={24} color="white" />;
const PersonIcon = (props) => <Ionicons name="person-outline" size={20} color="white" />;

// Enhanced board tiles with new types
const BOARD_TILES = Array.from({ length: 25 }, (_, i) => {
  if (i % 7 === 0 && i !== 0) return { id: i, type: 'trap' };
  if (i % 5 === 0 && i !== 0) return { id: i, type: 'investment' };
  if (i % 3 === 0) return { id: i, type: 'question' };
  if (i % 4 === 0 && i !== 0) return { id: i, type: 'bonus' };
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
      
      const newPosition = (position + roll) % 25;
      const tile = BOARD_TILES[newPosition];
      
      handleTileEffect(tile, newPosition);
      
      setIsRolling(false);
    }, 1500);
  };

  const renderTile = (tile, index) => {
    const isPlayerHere = index === position;
    const getTileColor = () => {
      switch (tile.type) {
        case 'question': return '#6C5CE7';
        case 'bonus': return '#00B894';
        case 'trap': return '#E74C3C';
        case 'investment': return '#F39C12';
        default: return '#DDD';
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
            <Text category='h4' style={styles.gameOverText}>Game Over!</Text>
            <Text category='p1'>Your final score: {score}</Text>
            <View style={styles.gameOverButtons}>
              <Button
                style={styles.restartButton}
                onPress={() => {
                  resetGame();
                  navigation.replace('GameBoard');
                }}
              >
                🔄 Restart Game
              </Button>
              <Button
                style={styles.resultsButton}
                appearance='outline'
                onPress={() => navigation.navigate('GameResults')}
              >
                📊 View Results
              </Button>
            </View>
          </Card>
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Game Board'
        accessoryLeft={renderBackAction}
      />
      
      <View style={styles.content}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text category='h6'>{score}</Text>
              <Text category='c1'>Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text category='h6'>{lives}</Text>
              <Text category='c1'>Lives</Text>
            </View>
            <View style={styles.statItem}>
              <Text category='h6'>{level}</Text>
              <Text category='c1'>Level</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.boardCard}>
          <View style={styles.board}>
            {renderBoard()}
          </View>
        </Card>

        <Card style={styles.diceCard}>
          <Text category='h6' style={styles.diceTitle}>Roll to Move</Text>
          {diceValue && (
            <Text category='h4' style={styles.diceValue}>🎲 {diceValue}</Text>
          )}
          <Button
            style={styles.rollButton}
            size='large'
            accessoryLeft={DiceIcon}
            onPress={rollDice}
            disabled={isRolling}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </Button>
        </Card>

        {/* Tile Effect Modal */}
        <Modal
          visible={showTileEffect}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setShowTileEffect(false)}
        >
          <Card disabled={true} style={styles.effectModal}>
            <Text category='h5' style={styles.effectTitle}>
              {currentTileEffect?.title}
            </Text>
            <Text category='p1' style={styles.effectMessage}>
              {currentTileEffect?.message}
            </Text>
            
            {currentTileEffect?.isChoice ? (
              <View style={styles.choiceButtons}>
                {currentTileEffect.choices.map((choice, index) => (
                  <Button
                    key={index}
                    style={styles.choiceButton}
                    onPress={() => {
                      if (choice.reward > 0) {
                        updateScore(choice.reward, null, true);
                      } else {
                        loseLife();
                      }
                      setShowTileEffect(false);
                    }}
                  >
                    {choice.text}
                  </Button>
                ))}
              </View>
            ) : (
              <Button
                style={styles.effectButton}
                onPress={() => {
                  currentTileEffect?.action?.();
                  setShowTileEffect(false);
                }}
              >
                Continue
              </Button>
            )}
          </Card>
        </Modal>

        {/* Level Up Modal */}
        <Modal
          visible={lastLevelUp}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => clearLevelUp()}
        >
          <Card disabled={true} style={styles.levelUpModal}>
            <Text category='h4' style={styles.levelUpTitle}>🎉 LEVEL UP! 🎉</Text>
            <Text category='h5' style={styles.levelUpText}>
              Congratulations! You reached Level {level}!
            </Text>
            <Button
              style={styles.levelUpButton}
              onPress={() => clearLevelUp()}
            >
              Awesome!
            </Button>
          </Card>
        </Modal>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  boardCard: {
    marginBottom: 16,
    padding: 16,
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
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    position: 'relative',
  },
  playerTile: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  tileNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  tileIcon: {
    fontSize: 16,
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
  diceCard: {
    alignItems: 'center',
  },
  diceTitle: {
    marginBottom: 8,
  },
  diceValue: {
    marginBottom: 16,
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
    padding: 24,
    alignItems: 'center',
  },
  gameOverText: {
    marginBottom: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
  gameOverButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  restartButton: {
    flex: 1,
    marginRight: 6,
  },
  resultsButton: {
    flex: 1,
    marginLeft: 6,
  },
});
