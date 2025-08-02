import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { 
  Layout, 
  Text, 
  Button, 
  Card,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5;
const TILE_SIZE = (width - 80) / GRID_SIZE;

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="black" />;
const DiceIcon = (props) => <Ionicons name="cube-outline" size={24} color="white" />;
const PersonIcon = (props) => <Ionicons name="person-outline" size={20} color="white" />;

// Sample board tiles
const BOARD_TILES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  type: i % 3 === 0 ? 'question' : i % 4 === 0 ? 'bonus' : 'normal',
}));

export default function GameBoard({ navigation }) {
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  
  const { 
    score, 
    level, 
    lives, 
    position, 
    movePlayer, 
    setCurrentQuestion 
  } = useGameStore();

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => navigation.goBack()} 
    />
  );

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
      
      if (tile.type === 'question') {
        // Navigate to question screen after a short delay
        setTimeout(() => {
          navigation.navigate('QuestionScreen', { 
            tileType: tile.type,
            position: newPosition 
          });
        }, 1000);
      }
      
      setIsRolling(false);
    }, 1500);
  };

  const renderTile = (tile, index) => {
    const isPlayerHere = index === position;
    const tileStyle = [
      styles.tile,
      {
        backgroundColor: 
          tile.type === 'question' ? '#6C5CE7' :
          tile.type === 'bonus' ? '#00B894' : '#DDD'
      },
      isPlayerHere && styles.playerTile
    ];

    return (
      <View key={tile.id} style={tileStyle}>
        <Text style={styles.tileNumber}>{index + 1}</Text>
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
            <Button
              style={styles.restartButton}
              onPress={() => navigation.navigate('GameResults')}
            >
              View Results
            </Button>
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
  },
  restartButton: {
    marginTop: 16,
  },
});
