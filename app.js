import React from 'react';
import { StatusBar, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Navigation from './src/components/Navigation/Navigation';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <StatusBar backgroundColor="#06bcee" />
        <Navigation />
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

