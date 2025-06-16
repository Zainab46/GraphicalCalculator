import React, { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { modes } from "./List";

function Shifteight({ navigation }) {
  const [selectedConversion, setSelectedConversion] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  const conversionFactors = {
    "in ▶ cm": 2.54, 
    "cm ▶ in": 1 / 2.54,
    "ft ▶ m": 0.3048, 
    "m ▶ ft": 1 / 0.3048,
    "yd ▶ m": 0.9144, 
    "m ▶ yd": 1 / 0.9144,
    "mile ▶ km": 1.609344, 
    "km ▶ mile": 1 / 1.609344,
    "n mile ▶ m": 1852, 
    "m ▶ n mile": 1 / 1852,
    "pc ▶ km": 3.085677581e13, 
    "km ▶ pc": 1 / 3.085677581e13,
    "acre ▶ m²": 4046.8564224,
    "m² ▶ acre": 1 / 4046.8564224,
    "gal(US) ▶ L": 3.785411784, 
    "L ▶ gal(US)": 1 / 3.785411784,
    "gal(UK) ▶ L": 4.54609, 
    "L ▶ gal(UK)": 1 / 4.54609,
    "km/h ▶ m/s": 1000 / 3600, 
    "m/s ▶ km/h": 3600 / 1000,
    "oz ▶ g": 28.349523125, 
    "g ▶ oz": 1 / 28.349523125,
    "lb ▶ kg": 0.45359237, 
    "kg ▶ lb": 1 / 0.45359237,
    "atm ▶ Pa": 101325, 
    "Pa ▶ atm": 1 / 101325,
    "mmHg ▶ Pa": 133.322387415, 
    "Pa ▶ mmHg": 1 / 133.322387415,
    "lbf/in² ▶ kPa": 6.894757293, 
    "kPa ▶ lbf/in²": 1 / 6.894757293,
    "kgf/cm² ▶ Pa": 98066.5, 
    "Pa ▶ kgf/cm²": 1 / 98066.5,
    "hp ▶ kW": 0.745699872, 
    "kW ▶ hp": 1 / 0.745699872,
    "kgf·m ▶ J": 9.80665, 
    "J ▶ kgf·m": 1 / 9.80665,
    "J ▶ cal": 1 / 4.184, 
    "cal ▶ J": 4.184,
  };

  const handleConversion = () => {
    if (!selectedConversion) {
      setResult("Please select a conversion");
      return;
    }
    if (!inputValue || isNaN(inputValue)) {
      setResult("Please enter a valid number");
      return;
    }

    const value = parseFloat(inputValue);
    const name = selectedConversion.name;
    let resultValue;
    let resultText;

    if (name === "°F ▶ °C") {
      resultValue = ((value - 32) * 5) / 9;
      resultText = `${value} °F = ${resultValue.toFixed(4)} °C`;
    } else if (name === "°C ▶ °F") {
      resultValue = (value * 9) / 5 + 32;
      resultText = `${value} °C = ${resultValue.toFixed(4)} °F`;
    } else {
      const factor = conversionFactors[name];
      if (factor) {
        resultValue = value * factor;
        resultText = `${value} ${name.split(" ▶ ")[0]} = ${resultValue.toFixed(4)} ${name.split(" ▶ ")[1]}`;
      } else {
        resultText = "Conversion not supported";
      }
    }

    setResult(resultText);
    const questionText = `${value} ${name}`;
    navigation.navigate('Main', { question: questionText, answer: resultText });
  };

  const showconversions = ({ item }) => {
    const isSelected = selectedConversion && selectedConversion.id === item.id;
    return (
      <View style={{ width: "90%", borderRadius: 5, borderWidth: 1, backgroundColor: isSelected ? "#56585a" : "#434547", borderColor: "#83888d", marginVertical: 5, alignSelf: "center" }}>
        <TouchableOpacity style={styles.item} onPress={() => setSelectedConversion(item)}>
          <Text style={styles.itemText}>
            {item.id} : {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Unit Conversions</Text>
      {selectedConversion && (
        <View style={styles.inputContainer}>
          <Text style={styles.selectedText}>Selected: {selectedConversion.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter value to convert"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
          />

          <TouchableOpacity style={styles.convertButton} onPress={handleConversion}>
            <Text style={styles.buttonText}>Convert</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={modes.shifteight}
        renderItem={showconversions}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 10,
  },
  inputContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  selectedText: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  convertButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  itemText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 18,
    color: "#0f0",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Shifteight;