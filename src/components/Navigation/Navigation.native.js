import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import SplashScreen from '../../screens/SplashScreen/index.js'
import Dashboard from '../../screens/Dashboard/index.js'
import SignIn from '../../screens/SignIn/index.js'
import SignUp from '../../screens/SignUp/index.js'
import MenuBuilder from '../../screens/MenuBuilder/index.js'
import MenuItems from '../../screens/MenuItems/index.js'
import InvoiceTable from '../../screens/InvoiceTable/index.js'
import PurchaseHistory from '../../screens/PurchaseHistory/index.js'
import FoodCostCalculator from '../../screens/FoodCostCalculator/index.js'
import MarginCalculator from '../../screens/MarginCalculator/index.js'
import LoadingScreen from '../LoadingScreen/index.js';
import { AuthContext } from '../../context/AuthContext.js';

enableScreens();
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : userInfo.token ? (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }}/> 
            <Stack.Screen name="MenuItems" component={MenuItems} options={{ headerShown: false }}/>  
            <Stack.Screen name="MenuBuilder" component={MenuBuilder} options={{ headerShown: false }}/>
            <Stack.Screen name="InvoiceTable" component={InvoiceTable} options={{ headerShown: false }}/>
            <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} options={{ headerShown: false }}/>
            <Stack.Screen name="FoodCostCalculator" component={FoodCostCalculator} options={{ headerShown: false }}/>
            <Stack.Screen name="MarginCalculator" component={MarginCalculator} options={{ headerShown: false }}/>
          </>
        ) : (
          <>
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;