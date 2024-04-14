import React from 'react';
import { StatusBar, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Navigation from './src/components/Navigation/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import styled, { ThemeProvider } from 'styled-components';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <StatusBar backgroundColor="#06bcee" />
        <Font>
          <Navigation />
        </Font>
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


