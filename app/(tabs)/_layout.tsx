import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFCB05',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarStyle: {
          backgroundColor: '#0A1628',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,203,5,0.15)',
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: '#0F1F3D',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,203,5,0.2)',
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 22,
          color: '#FFCB05',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pokédex',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'โปรด',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
