import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { modes } from '../List';


function SimpleMode({navigation,ActualMode,setActualMode}){

    const SimpleModeItems=(id)=>{

    if(id=='1'){
        setActualMode('COMP');
        navigation.navigate('Main');
    }
    else if(id=='2'){
        setActualMode('CMPLX');
        navigation.navigate('Main');
     }
    else if(id=='3'){
        setActualMode('STAT');
        navigation.navigate('Stat');
     }
     else if(id=='4'){
        setActualMode('BASE_N');
        navigation.navigate('Base_N');
     }
    else if(id=='5'){
        setActualMode('EQUATION');
        navigation.navigate('EQN');
     }
     else if(id=='6'){
        setActualMode('MATRIX');
        navigation.navigate('Matrix');
     }
    else if(id=='7'){
        setActualMode('TABLE');
        navigation.navigate('Table');
     }
     else if(id=='8'){
        setActualMode('VECTOR');
        navigation.navigate('Vector')
     }
 
    }
    

  return (
    <View style={styles.container}>
      <FlatList
        data={modes.simplemodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={{width:'100%',borderRadius:5,borderWidth:1,backgroundColor:'#434547',borderColor:'#83888d'}}>
           <TouchableOpacity onPress={() => SimpleModeItems(item.id)} style={styles.item}>
            <Text style={styles.itemText}>{item.id}:      {item.name}</Text>
           </TouchableOpacity>
            </View>
         
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222', 
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
  item: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  itemText: {
    fontSize: 18,
    color: 'white',
    fontWeight:'bold'
  },
  underline: {
    height: 2,
    backgroundColor: 'blue',
    marginTop: 4,
  },
});

export default SimpleMode;
