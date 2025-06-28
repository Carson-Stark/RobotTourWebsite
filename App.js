import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';
import Login from './app/screens/Login';
import LandmarksView from './app/screens/LandmarksView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { Profiler, useEffect, useState } from "react";

const Stack = createNativeStackNavigator();


export var userId = "";


function InsideLayout() {
  return LandmarksView();
}

export default function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      userId = user.email;
    });
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
            <Stack.Screen name="Inside" component={InsideLayout} options={{headerShown: false}} />
          ) : (
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          )}
      </Stack.Navigator>
    </NavigationContainer>
  );

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
        marginVertical: 4,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
  },
  icon_button: {
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginVertical: 20
  },
});