import React,{useState}from "react";
import { FlatList,Text,TextInput,TouchableOpacity,View ,StyleSheet} from "react-native";
import { modes } from "./List";

function Shifteight({navigation}){
 
const[selectedconversion,setSelectedConversion]=useState('');

const[input,setInput]= useState('');

const [result,setResult]=useState('');






return(
 <View  style={styles.container}>
        
       <FlatList
       data={modes.shifteight}
       renderItems={({item})=>{
    return(
    <View style={{width:400,borderRadius:5,borderWidth:1,backgroundColor:'#434547',borderColor:'#83888d'}}>
   <TouchableOpacity style={styles.item}  >
   <Text style={styles.itemText}>{item.id} :  {item.name}</Text> 
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
export default Shifteight;
