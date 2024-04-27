import React from 'react';
import { StatusBar, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Navigation from './src/components/Navigation/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { AlertsProvider } from './src/context/AlertsContext';
import styled, { ThemeProvider } from 'styled-components';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <AlertsProvider>
          <StatusBar backgroundColor="#06bcee" />
          <Navigation />
        </AlertsProvider>
      </AuthProvider>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


