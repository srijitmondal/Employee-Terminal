import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminAnalytics from './admin_analytics';
import Analytics from './analytics';

const AnalyticsRouter = () => {
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleId = async () => {
      try {
        const storedRoleId = await AsyncStorage.getItem('roleId');
        setRoleId(storedRoleId ? parseInt(storedRoleId, 10) : null);
      } catch (error) {
        console.error('Error fetching roleId:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleId();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (roleId === 1 || roleId===2 || roleId===3 || roleId===4) ? <AdminAnalytics /> : <Analytics />;
};

export default AnalyticsRouter;
