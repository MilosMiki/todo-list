// SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { storage } from '../storage';
import { categories } from '../App';

const SettingsScreen: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<{ [key: string]: boolean }>({});

  // On mount, load saved subscription settings
  useEffect(() => {
    const savedSubs = storage.getString('subscriptions');
    if (savedSubs) {
      setSubscriptions(JSON.parse(savedSubs));
    } else {
      // Initialize with false for all categories if no saved settings
      const defaultSubs: { [key: string]: boolean } = {};
      categories.forEach(cat => (defaultSubs[cat] = false));
      setSubscriptions(defaultSubs);
    }
  }, []);

  // Toggle subscription for a given category
  const toggleSubscription = async (category: string) => {
    const newStatus = !subscriptions[category];
    // Update local state and persist to MMKV
    const updatedSubs = { ...subscriptions, [category]: newStatus };
    setSubscriptions(updatedSubs);
    storage.set('subscriptions', JSON.stringify(updatedSubs));

    try {
      if (newStatus) {
        await messaging().subscribeToTopic(category);
        console.log(`Subscribed to ${category}`);
      } else {
        await messaging().unsubscribeFromTopic(category);
        console.log(`Unsubscribed from ${category}`);
      }
    } catch (error) {
      console.error(`Error toggling subscription for ${category}:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>
      {categories.map(category => (
        <View key={category} style={styles.item}>
          <Text style={styles.label}>{category}</Text>
          <Switch
            value={subscriptions[category] || false}
            onValueChange={() => toggleSubscription(category)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: { fontSize: 18 },
});

export default SettingsScreen;
