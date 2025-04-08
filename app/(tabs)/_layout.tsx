import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LayoutDashboard,
  Users,
  ChartNoAxesCombined,
  Calendar,
} from 'lucide-react-native';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';

const IconWrapper = ({ children }: { children: ReactNode }) => {
  return Platform.OS === 'web' ? children : <View>{children}</View>;
};

export default function TabLayout() {
  const [roleId, setRoleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadDone = useRef(false);

  const fetchRoleId = async () => {
    try {
      const storedRoleId = await AsyncStorage.getItem('roleId');
      setRoleId(storedRoleId ? parseInt(storedRoleId, 10) : null);
    } catch (error) {
      console.error('Error fetching roleId:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Listen for login event
    eventEmitter.on(EVENTS.USER_LOGIN, () => {
      initialLoadDone.current = false; // Reset the ref on new login
      fetchRoleId(); // Fetch role ID again
    });

    // Initial load
    if (!initialLoadDone.current) {
      fetchRoleId();
      initialLoadDone.current = true;
    }

    // Cleanup
    return () => {
      eventEmitter.off(EVENTS.USER_LOGIN);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#6b7280',
        }}
      >
        {/* Always visible tabs */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <IconWrapper>
                <LayoutDashboard size={size} color={color} />
              </IconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Users',
            tabBarIcon: ({ color, size }) => (
              <IconWrapper>
                <Users size={size} color={color} />
              </IconWrapper>
            ),
            href:
              roleId === 1 || roleId === 2 || roleId === 3 || roleId === 4
                ? '/(tabs)/users'
                : null,
          }}
        />

        <Tabs.Screen
          name="analytics_access_controller"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <IconWrapper>
                <ChartNoAxesCombined size={size} color={color} />
              </IconWrapper>
            ),
          }}
        />

        <Tabs.Screen
          name="admin_analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <IconWrapper>
                <ChartNoAxesCombined size={size} color={color} />
              </IconWrapper>
            ),
            href: null,
          }}
        />

        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <IconWrapper>
                <ChartNoAxesCombined size={size} color={color} />
              </IconWrapper>
            ),
            href: null,
          }}
        />

        {/* Always visible tab */}
        <Tabs.Screen
          name="leavedashboard"
          options={{
            title: 'Holidays',
            tabBarIcon: ({ color, size }) => (
              <IconWrapper>
                <Calendar size={size} color={color} />
              </IconWrapper>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
