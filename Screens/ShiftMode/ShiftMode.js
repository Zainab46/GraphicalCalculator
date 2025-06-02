import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { modes } from '../List';


function ShiftMode({navigation}){

  const ShiftModeItems=(id)=>{
   if(id=='1'){
        navigation.navigate('Main');
    }
    else if(id=='2'){
        navigation.navigate('Main');
    }
    else  if(id=='3'){
        navigation.navigate('Main');
    }
     else if(id=='4'){
        navigation.navigate('Main');
    }
    else  if(id=='5'){
        navigation.navigate('Main');
    }
    else if(id=='6'){
        navigation.navigate('Main');
    }
    else if(id=='7'){
        navigation.navigate('Main');
     }
    else if(id=='8'){
        navigation.navigate('Main');
     }
 
    }
    

  return (
    <View style={styles.container}>
      <FlatList
        data={modes.shiftmode}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={{width:'100%',borderRadius:5,borderWidth:1,backgroundColor:'#434547',borderColor:'#83888d'}}>
           <TouchableOpacity onPress={() => ShiftModeItems(item.id)} style={styles.item}>
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

export default ShiftMode;
