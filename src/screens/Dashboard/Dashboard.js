// HomeScreen.js
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigate } from 'react-router'
import { AuthContext } from '../../context/AuthContext.js'
import Header from '../../components/global/Header/index.js'
import client from '../../utils/ApiConfig/index.js'

const Dashboard = () => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate({});
  return (
    <View>
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <Text style={styles.welcome}>Welcome, {userInfo.user.firstName} {userInfo.user.lastName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  welcome: {
    fontSize: 30,
    marginBottom: 40,
  },
  blueBtn: {
    position: "relative",
    // width: 170,
    // height: 45,
    margin: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: "#2bb378",
    backgroundColor: "#0071cd",
    justifyContent: "center"
  }
});

export default Dashboard;
