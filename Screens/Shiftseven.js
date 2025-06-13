import React,{useState}from "react";
import { FlatList,Text,TextInput,TouchableOpacity,View ,StyleSheet} from "react-native";
import { modes } from "./List";


function Shiftseven({navigation,route}){
 
const[Id,setSelectedId]=useState('');

  
const HandleShiftModeItems=(id,actual,lower)=>{
 if(id=='1'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
    else if(id=='2'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='3'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='4'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='5'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='6'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='7'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='8'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
      else if(id=='9'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='10'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
     else if(id=='11'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
    else if(id=='12'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='13'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='14'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='15'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='16'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='17'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='18'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
      else if(id=='19'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='20'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
      else if(id=='21'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
    else if(id=='22'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='23'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='24'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='25'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='26'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='27'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='28'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
      else if(id=='29'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='30'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
      else if(id=='31'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
    else if(id=='32'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='33'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='34'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='35'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='36'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
    }
     else if(id=='37'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='38'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
      else if(id=='39'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
       else if(id=='40'){
        navigation.navigate('Main',{shiftsvn:actual,shiftsn:lower});
     }
}


return(
    <View  style={styles.container}>
        
       <FlatList
       data={modes.shiftseven}
       renderItem={({item})=>{
return(
<View style={{width:300,marginLeft:50,borderRadius:5,borderWidth:1,backgroundColor:'#434547',borderColor:'#83888d'}}>
<TouchableOpacity style={styles.item} onPress={()=>{HandleShiftModeItems(item.id,item.actual,item.lower)}} >
 <View style={{flexDirection:'row',alignItems:'center'}}>
      <View style={{width:180}}>
   <Text style={styles.itemText}>{item.upper}</Text>
<Text style={{fontSize:12,color:'white',marginTop:5}}>{item.lower}</Text>
        </View> 
    <View style={{marginLeft:30}}>
        <Text style={{color:'white',fontSize:17,fontWeight:'bold',marginLeft:30}}>{item.actual}</Text>
    </View>
    </View>
    
</TouchableOpacity>


</View>
);
  }  



}
       keyExtractor={(item,index)=>index.toString()}
       >
       
       </FlatList>
    </View>
);


}

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
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
    },
    itemText: {
      fontSize: 14,
      color: 'white',
      fontWeight:'bold'
    },
    underline: {
      height: 2,
      backgroundColor: 'blue',
      marginTop: 4,
    },
  });
export default Shiftseven;
