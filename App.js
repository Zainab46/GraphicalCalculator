import React, {Component, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Main';
import SimpleMode from './Screens/SimpleMode/SimpleMode';
import ShiftMode from './Screens/ShiftMode/ShiftMode';
import HyperbolicMenu from './HyperbolicMenu';
import StatMenu from './Screens/SimpleMode/Stat';
import EquationMenu from './Screens/SimpleMode/EQN';
import VectorMenu from './Screens/SimpleMode/Vector';
import Shiftseven from './Screens/Shiftseven';
import Shifteight from './Screens/Shifteight';

const Stack= createStackNavigator();


const App=()=>{
const[ActualMode,setActualMode]=useState("COMP");

 const forCustomModal = ({ current, next, layouts }) => {
        const progress = current.progress;
        
        return {
          cardStyle: {
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.height, layouts.screen.height * 0.2],
                }),
              },],
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
            marginTop: 'auto', // Push to bottom
            height: '50%', // Half screen height
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
            backgroundColor: 'black',
          },
        };
      };
return(
<NavigationContainer>
 <Stack.Navigator initialRouteName="Main"  screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
        }}>

<Stack.Screen name="Main" options={{ headerShown: false }}>
    {(props) => (
        <Main {...props} ActualMode={ActualMode} setActualMode={setActualMode} />
    )}
</Stack.Screen>        
   
     <Stack.Group
          screenOptions={{
            cardStyleInterpolator: forCustomModal,
            presentation: 'transparentModal',
          }}
        >
          <Stack.Screen 
            name="SimpleMode"  
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }}
          >
            {(props) => (
              <SimpleMode {...props} ActualMode={ActualMode} setActualMode={setActualMode} />
            )}   
          </Stack.Screen>
 
            
<Stack.Screen 
            name="ShiftMode" 
            component={ShiftMode}
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
        
<Stack.Screen 
            name="HyperbolicMenu" 
            component={HyperbolicMenu}
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
          <Stack.Screen 
            name="Stat" 
            component={StatMenu}
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
  <Stack.Screen 
            name="EQN" 
            component={EquationMenu}
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
          <Stack.Screen 
            name="Vector" 
            component={VectorMenu}
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
          <Stack.Screen 
            name="Shifteight" 
            component={Shifteight}
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
        
         <Stack.Screen 
            name="Shiftseven" 
            component={Shiftseven}
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
        
  
</Stack.Group>
</Stack.Navigator>
</NavigationContainer>
);


}
export default App;