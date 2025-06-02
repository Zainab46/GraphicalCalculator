import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { modes } from '../Screens/List';

function ConstantsMenu({navigation}){

  const ConstantsMenuItems=(id,lower)=>{
   if(id=='1'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='2'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='3'){
        navigation.navigate('Main',{convalues:value});
    }
     else if(id=='4'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='5'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='6'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='7'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='8'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='9'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='10'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='11'){
        navigation.navigate('Main',{convalues:value});
    }
     else if(id=='12'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='13'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='14'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='15'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='16'){
        navigation.navigate('Main',{convalues:value});
     }
     
     else if(id=='17'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='18'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='19'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='20'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='21'){
        navigation.navigate('Main',{convalues:value});
     }
      else if(id=='22'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='23'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='24'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='25'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='26'){
        navigation.navigate('Main',{convalues:value});
     }
        else if(id=='27'){
        navigation.navigate('Main',{convalues:value});
     }
      else if(id=='28'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='29'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='30'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='31'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='32'){
        navigation.navigate('Main',{convalues:value});
     }
      else if(id=='33'){
        navigation.navigate('Main',{convalues:value});
     }
      else if(id=='34'){
        navigation.navigate('Main',{convalues:value});
    }
    else  if(id=='35'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='36'){
        navigation.navigate('Main',{convalues:value});
    }
    else if(id=='37'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='38'){
        navigation.navigate('Main',{convalues:value});
     }
       else if(id=='39'){
        navigation.navigate('Main',{convalues:value});
     }
    else if(id=='40'){
        navigation.navigate('Main',{convalues:value});
     }
 
    }
    

  return (
    <View style={styles.container}>
      <FlatList
        data={modes.constant}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={{width:'100%',borderRadius:5,borderWidth:1,backgroundColor:'#434547',borderColor:'#83888d',flex:1}}>

           <TouchableOpacity onPress={() => ConstantsMenuItems(item.id,item.upper)} style={styles.item}>
            <Text style={styles.itemText}>{item.id}:      {item.upper}                      {item.actual} </Text>
            <Text style={styles.itemText}>{item.lower} </Text>
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

export default ConstantsMenu;
