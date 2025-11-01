import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/screens/LoginScreen';
import { PairingScreen } from '@/screens/PairingScreen';
import { ProfileSetupScreen } from '@/screens/ProfileSetupScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { AddReviewScreen } from '@/screens/AddReviewScreen';
import { ReviewDetailsScreen } from '@/screens/ReviewDetailsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { palette } from '@/styles/theme';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Pairing: undefined;
  ProfileSetup: undefined;
  AddReview: undefined;
  ReviewDetails: { reviewId: string };
};

export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background
  }
};

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: palette.primary,
      tabBarInactiveTintColor: palette.muted,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: 'transparent'
      },
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'Pair') {
          iconName = 'link-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-circle-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen
      name="Pair"
      component={PairingScreen}
      options={{ title: 'Connect' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const { session, profile } = useAuth();
  const isAuthenticated = Boolean(session?.user);
  const hasProfile = Boolean(profile?.display_name);
  const hasPair = Boolean(profile?.pair_id);

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        ) : !hasProfile ? (
          <Stack.Screen
            name="ProfileSetup"
            component={ProfileSetupScreen}
            options={{ headerShown: false }}
          />
        ) : !hasPair ? (
          <Stack.Screen
            name="Pairing"
            component={PairingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        )}
        <Stack.Screen
          name="AddReview"
          component={AddReviewScreen}
          options={{ presentation: 'modal', title: 'Add Review' }}
        />
        <Stack.Screen
          name="ReviewDetails"
          component={ReviewDetailsScreen}
          options={{ title: 'Review Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
