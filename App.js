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
import BaseN from './Screens/SimpleMode/Base-N';
import ShiftTwo from './Screens/ShiftTwo';
import VectorCalculator from './Screens/SimpleMode/Vector';


const Stack= createStackNavigator();


const App=()=>{
const[ActualMode,setActualMode]=useState("COMP");


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
   
     
          <Stack.Screen 
            name="SimpleMode"  
            options={{
              headerShown: true,
              headerTitle: 'MODE',
              headerStyle: { 
                backgroundColor: '#434547',
                
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
              headerTitle: 'CONVERTIONS',
              headerStyle: { 
                backgroundColor: '#434547',
              
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
              headerTitle: 'CONSTANTS',
              headerStyle: { 
                backgroundColor: '#434547',
              
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
            name="Base-N" 
            component={BaseN}
            options={{
              headerShown: true,
              headerTitle: 'Base-N',
              headerStyle: { 
                backgroundColor: '#434547',
                
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
            name="ShiftTwo" 
            component={ShiftTwo}
            options={{
              headerShown: true,
              headerTitle: 'CMPLX',
              headerStyle: { 
                backgroundColor: '#434547',  
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
            component={VectorCalculator}
            options={{
              headerShown: true,
              headerTitle: 'Vector',
              headerStyle: { 
                backgroundColor: '#434547',  
              },
              headerTitleStyle: { 
                marginLeft: 100, 
                color: 'white', 
                fontWeight: 'bold' 
              },
              headerTintColor: 'white',
            }} 
          />
        
  

</Stack.Navigator>
</NavigationContainer>
);


}
export default App;