import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

function BaseN({ navigation }) {
  const [mode, setMode] = useState("convert"); // convert | logic
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [selectedOp, setSelectedOp] = useState("XOR");
  const [base, setBase] = useState("DEC");

  const baseMap = {
    BIN: 2,
    OCT: 8,
    DEC: 10,
    HEX: 16,
  };

  const validChars = {
    BIN: "01",
    OCT: "01234567",
    DEC: "0123456789",
    HEX: "0123456789ABCDEF",
  };

  const handleInput = (text, setter) => {
    const upper = text.toUpperCase();
    const valid = validChars[base];
    if (upper.split("").every((char) => valid.includes(char))) {
      setter(upper);
    }
  };

  const convert = () => {
    try {
      const fromBase = baseMap[base];

      // Convert mode
      if (mode === "convert") {
        const decimal = parseInt(input1, fromBase);
        const result = decimal.toString(fromBase).toUpperCase();
        const label = `${input1} ${base}`;
        navigation.navigate("Main", {
          base: label,
          baseresult: result,
        });
      }

      // Logic mode
      else {
        const val1 = parseInt(input1, fromBase) >>> 0;
        const val2 = parseInt(input2, fromBase) >>> 0;
        let result;

        switch (selectedOp) {
          case "XOR":
            result = val1 ^ val2;
            break;
          case "OR":
            result = val1 | val2;
            break;
          case "AND":
            result = val1 & val2;
            break;
          case "XNOR":
            result = ~(val1 ^ val2) >>> 0;
            break;
          case "NOT":
            result = ~val1 >>> 0;
            break;
          case "NEG":
            result = (-val1) >>> 0;
            break;
          default:
            result = 0;
        }

        const output = result.toString(fromBase).toUpperCase();
        const label =
          selectedOp === "NOT" || selectedOp === "NEG"
            ? `${selectedOp} ${input1}`
            : `${input1} ${selectedOp} ${input2}`;

        navigation.navigate("Main", {
          base: label,
          baseresult: output,
        });
      }
    } catch (err) {
      alert("Invalid input for selected base");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Base-N Calculator</Text>

      <View style={styles.modeRow}>
        {["convert", "logic"].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeButton, mode === m && styles.selected]}
            onPress={() => setMode(m)}
          >
            <Text style={styles.baseText}>{m.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Base:</Text>
        {["BIN", "OCT", "DEC", "HEX"].map((b) => (
          <TouchableOpacity
            key={b}
            style={[styles.baseButton, base === b && styles.selected]}
            onPress={() => setBase(b)}
          >
            <Text style={styles.baseText}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        value={input1}
        onChangeText={(text) => handleInput(text, setInput1)}
        placeholder={`Enter first ${base} value`}
        placeholderTextColor="#888"
        autoCapitalize="characters"
      />

      {mode === "logic" && selectedOp !== "NOT" && selectedOp !== "NEG" && (
        <TextInput
          style={styles.input}
          value={input2}
          onChangeText={(text) => handleInput(text, setInput2)}
          placeholder={`Enter second ${base} value`}
          placeholderTextColor="#888"
          autoCapitalize="characters"
        />
      )}

      {mode === "logic" && (
        <View style={styles.row}>
          {["XOR", "OR", "AND", "XNOR", "NOT", "NEG"].map((op) => (
            <TouchableOpacity
              key={op}
              style={[styles.opButton, selectedOp === op && styles.selected]}
              onPress={() => setSelectedOp(op)}
            >
              <Text style={styles.baseText}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.calculateButton} onPress={convert}>
        <Text style={styles.calculateText}>Calculate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    fontSize: 20,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    alignItems: "center",
  },
  modeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  modeButton: {
    backgroundColor: "#444",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 6,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginRight: 10,
  },
  baseButton: {
    backgroundColor: "#444",
    padding: 10,
    margin: 5,
    borderRadius: 6,
  },
  selected: {
    backgroundColor: "#0af",
  },
  baseText: {
    color: "white",
    fontSize: 16,
  },
  opButton: {
    backgroundColor: "#444",
    padding: 10,
    margin: 5,
    borderRadius: 6,
  },
  calculateButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  calculateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BaseN;
