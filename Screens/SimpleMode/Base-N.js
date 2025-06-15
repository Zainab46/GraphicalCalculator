import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";

function BaseN({ navigation }) {
  const [base, setBase] = useState("DEC"); // Current base: BIN, OCT, DEC, HEX
  const [input, setInput] = useState("");
  const [operand1, setOperand1] = useState(null);
  const [operation, setOperation] = useState(null);
  const [result, setResult] = useState("");

  // Valid characters for each base
  const validChars = {
    BIN: "01",
    OCT: "01234567",
    DEC: "0123456789",
    HEX: "0123456789ABCDEF",
  };

  // Convert a number string from given base to decimal
  const toDecimal = (value, fromBase) => {
    if (!value) return 0;
    value = value.toUpperCase();
    let decimal = 0;
    for (let char of value) {
      const digit = fromBase === 16 ? parseInt(char, 16) : parseInt(char, fromBase);
      decimal = decimal * fromBase + digit;
    }
    return decimal;
  };

  // Convert a decimal number to the target base
  const fromDecimal = (decimal, toBase) => {
    if (decimal === 0) return "0";
    let digits = toBase === 16 ? "0123456789ABCDEF" : "0123456789";
    let result = "";
    let num = Math.abs(decimal);
    while (num > 0) {
      result = digits[num % toBase] + result;
      num = Math.floor(num / toBase);
    }
    return decimal < 0 ? "-" + result : result;
  };

  // Validate input based on current base
  const handleInput = (text) => {
    if (!text) {
      setInput("");
      return;
    }
    const valid = validChars[base];
    if (text.split("").every((char) => valid.includes(char.toUpperCase()))) {
      setInput(text.toUpperCase());
    }
  };

  // Handle digit or letter button press
  const handleDigit = (digit) => {
    if (validChars[base].includes(digit)) {
      setInput((prev) => (prev === "0" ? digit : prev + digit));
    }
  };

  // Handle base change
  const handleBaseChange = (newBase) => {
    if (input) {
      const decimal = toDecimal(input, base === "BIN" ? 2 : base === "OCT" ? 8 : base === "DEC" ? 10 : 16);
      setInput(fromDecimal(decimal, newBase === "BIN" ? 2 : newBase === "OCT" ? 8 : newBase === "DEC" ? 10 : 16));
    }
    setBase(newBase);
    setOperation(null);
    setOperand1(null);
    setResult("");
  };

  // Handle arithmetic or logical operation
  const handleOperation = (op) => {
    if (input) {
      const decimal = toDecimal(input, base === "BIN" ? 2 : base === "OCT" ? 8 : base === "DEC" ? 10 : 16);
      setOperand1(decimal);
      setOperation(op);
      setInput("");
    }
  };

  // Perform calculation
  const handleEquals = () => {
    if (!operand1 || !input || !operation) return;

    const decimal2 = toDecimal(input, base === "BIN" ? 2 : base === "OCT" ? 8 : base === "DEC" ? 10 : 16);
    let resultDecimal;

    // Arithmetic operations
    if (["+", "-", "×", "÷"].includes(operation)) {
      if (operation === "+") resultDecimal = operand1 + decimal2;
      else if (operation === "-") resultDecimal = operand1 - decimal2;
      else if (operation === "×") resultDecimal = operand1 * decimal2;
      else if (operation === "÷") {
        if (decimal2 === 0) {
          setResult("Error: Division by 0");
          return;
        }
        resultDecimal = Math.floor(operand1 / decimal2); // Integer division
      }
    }
    // Logical operations (bitwise, assume 32-bit integers)
    else {
      const op1 = operand1 >>> 0; // Convert to unsigned 32-bit
      const op2 = decimal2 >>> 0;
      if (operation === "AND") resultDecimal = op1 & op2;
      else if (operation === "OR") resultDecimal = op1 | op2;
      else if (operation === "XOR") resultDecimal = op1 ^ op2;
      else if (operation === "XNOR") resultDecimal = ~(op1 ^ op2) >>> 0;
      else if (operation === "NOT") {
        resultDecimal = ~op1 >>> 0;
        setInput("");
        setOperand1(null);
        setOperation(null);
      }
      else if (operation === "NEG") {
        resultDecimal = (-op1) >>> 0;
        setInput("");
        setOperand1(null);
        setOperation(null);
      }
    }

    if (resultDecimal !== undefined) {
      const resultStr = fromDecimal(resultDecimal, base === "BIN" ? 2 : base === "OCT" ? 8 : base === "DEC" ? 10 : 16);
      setResult(resultStr);
      setInput(resultStr);
      setOperand1(null);
      setOperation(null);
    }
  };

  // Clear all
  const handleClear = () => {
    setInput("");
    setOperand1(null);
    setOperation(null);
    setResult("");
  };

  // Button layout
  const buttons = [
    [
      { label: "C", onPress: handleClear, style: styles.clearButton },
      { label: "NOT", onPress: () => handleOperation("NOT"), style: styles.opButton },
      { label: "NEG", onPress: () => handleOperation("NEG"), style: styles.opButton },
      { label: "÷", onPress: () => handleOperation("÷"), style: styles.opButton },
    ],
    [
      { label: "A", onPress: () => handleDigit("A"), disabled: base !== "HEX" },
      { label: "B", onPress: () => handleDigit("B"), disabled: base !== "HEX" },
      { label: "AND", onPress: () => handleOperation("AND"), style: styles.opButton },
      { label: "×", onPress: () => handleOperation("×"), style: styles.opButton },
    ],
    [
      { label: "C", onPress: () => handleDigit("C"), disabled: base !== "HEX" },
      { label: "D", onPress: () => handleDigit("D"), disabled: base !== "HEX" },
      { label: "OR", onPress: () => handleOperation("OR"), style: styles.opButton },
      { label: "-", onPress: () => handleOperation("-"), style: styles.opButton },
    ],
    [
      { label: "E", onPress: () => handleDigit("E"), disabled: base !== "HEX" },
      { label: "F", onPress: () => handleDigit("F"), disabled: base !== "HEX" },
      { label: "XOR", onPress: () => handleOperation("XOR"), style: styles.opButton },
      { label: "+", onPress: () => handleOperation("+"), style: styles.opButton },
    ],
    [
      { label: "7", onPress: () => handleDigit("7"), disabled: base === "BIN" || base === "OCT" },
      { label: "8", onPress: () => handleDigit("8"), disabled: base === "BIN" },
      { label: "9", onPress: () => handleDigit("9"), disabled: base === "BIN" },
      { label: "XNOR", onPress: () => handleOperation("XNOR"), style: styles.opButton },
    ],
    [
      { label: "4", onPress: () => handleDigit("4"), disabled: base === "BIN" },
      { label: "5", onPress: () => handleDigit("5"), disabled: base === "BIN" },
      { label: "6", onPress: () => handleDigit("6"), disabled: base === "BIN" },
      { label: "=", onPress: handleEquals, style: styles.equalsButton },
    ],
    [
      { label: "1", onPress: () => handleDigit("1") },
      { label: "2", onPress: () => handleDigit("2"), disabled: base === "BIN" },
      { label: "3", onPress: () => handleDigit("3"), disabled: base === "BIN" },
      { label: "0", onPress: () => handleDigit("0") },
    ],
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BASE-N Calculator</Text>
      <View style={styles.display}>
        <Text style={styles.baseLabel}>{base}</Text>
        <TextInput
          style={styles.input}
          value={input || result || "0"}
          onChangeText={handleInput}
          placeholder="0"
          placeholderTextColor="#888"
          keyboardType="default"
          autoCapitalize="characters"
        />
      </View>
      <View style={styles.baseButtons}>
        {["BIN", "OCT", "DEC", "HEX"].map((b) => (
          <TouchableOpacity
            key={b}
            style={[styles.baseButton, base === b && styles.selectedBaseButton]}
            onPress={() => handleBaseChange(b)}
          >
            <Text style={styles.baseButtonText}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonGrid}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((btn, btnIndex) => (
              <TouchableOpacity
                key={btn.label}
                style={[styles.button, btn.style, btn.disabled && styles.disabledButton]}
                onPress={btn.onPress}
                disabled={btn.disabled}
              >
                <Text style={styles.buttonText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
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
  display: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  baseLabel: {
    fontSize: 18,
    color: "#0f0",
    width: 50,
    textAlign: "center",
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: "white",
    textAlign: "right",
  },
  baseButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  baseButton: {
    backgroundColor: "#434547",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#83888d",
  },
  selectedBaseButton: {
    backgroundColor: "#56585a",
  },
  baseButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  buttonGrid: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#434547",
    width: "22%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#83888d",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
  },
  opButton: {
    backgroundColor: "#FF9500",
  },
  equalsButton: {
    backgroundColor: "#007AFF",
  },
  disabledButton: {
    backgroundColor: "#555",
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default BaseN;