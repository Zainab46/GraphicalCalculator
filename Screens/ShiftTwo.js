import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { modes } from './List';
function ShiftTwo({navigation,route}){

  const ShiftTwoMenuItems=(id,value)=>{
   if(id=='1'){
        navigation.navigate('Main',{complxvalues:value});
    }
    else if(id=='2'){
        navigation.navigate('Main',{complxvalues:value});
    }
    else  if(id=='3'){
         navigation.navigate('Main',{complxvalues:value});
    }
     else  if(id=='4'){
        navigation.navigate('Main',{complxvalues:value});
    }
   
    }
    

  return (
    <View style={styles.container}>
      <FlatList
        data={modes.shiftTwo}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={{width:400,borderRadius:5,borderWidth:1,backgroundColor:'#434547',borderColor:'#83888d'}}>
           <TouchableOpacity onPress={() => ShiftTwoMenuItems(item.id,item.value)} style={styles.item}>
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

export default ShiftTwo;

