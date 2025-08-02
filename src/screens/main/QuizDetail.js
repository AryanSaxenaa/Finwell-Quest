import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="black" />;

export default function QuizDetail({ navigation, route }) {
  const { topic } = route.params || { topic: { title: 'Sample Quiz' } };

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => navigation.goBack()} 
    />
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title={topic.title}
        accessoryLeft={renderBackAction}
      />
      
      <View style={styles.content}>
        <Text category='h5'>Quiz Coming Soon!</Text>
        <Text category='p1'>
          Interactive quizzes for {topic.title} will be available in a future update.
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
