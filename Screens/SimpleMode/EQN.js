import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import { modes } from '../List';

// Helper functions for solving equations
const solveLinearSystem = (coefficients, constants) => {
  const n = constants.length;
  if (coefficients.length !== n || coefficients.some(row => row.length !== n)) {
    return null; // Invalid input
  }

  // Gaussian elimination
  const matrix = coefficients.map((row, i) => [...row, constants[i]]);
  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
        maxRow = k;
      }
    }
    [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];

    if (Math.abs(matrix[i][i]) < 1e-10) return null; // Singular matrix

    // Eliminate
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = matrix[k][i] / matrix[i][i];
        for (let j = i; j <= n; j++) {
          matrix[k][j] -= factor * matrix[i][j];
        }
      }
    }
  }

  // Back substitution
  const solution = new Array(n);
  for (let i = 0; i < n; i++) {
    solution[i] = matrix[i][n] / matrix[i][i];
  }
  return solution;
};

const solveQuadratic = (a, b, c) => {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null; // No real roots
  const sqrtD = Math.sqrt(discriminant);
  return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
};

function EquationMenu() {
  const [selectedEquation, setSelectedEquation] = useState(null);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const handleEquationSelect = (value) => {
    setSelectedEquation(value);
    setInputs({}); // Reset inputs
    setResult(null); // Reset result
  };

  const getInputFields = () => {
    if (!selectedEquation) return [];

    if (selectedEquation === 'linear') {
      // Two equations: a1x + b1y = c1, a2x + b2y = c2
      return ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'];
    } else if (selectedEquation === 'quadratic') {
      // Three equations: a1x² + b1x + c1 = 0, etc.
      return ['a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'b3', 'c3'];
    } else if (selectedEquation === 'cubic') {
      return ['a1', 'b1', 'c1', 'd1', 'a2', 'b2', 'c2', 'd2', 'a3', 'b3', 'c3', 'd3'];
    } else if (selectedEquation === 'quartic') {
      return ['a1', 'b1', 'c1', 'd1', 'e1', 'a2', 'b2', 'c2', 'd2', 'e2', 'a3', 'b3', 'c3', 'd3', 'e3'];
    }
    return [];
  };

  const handleSolve = () => {
    const inputValues = Object.values(inputs).map(val => parseFloat(val) || 0);
    let solution = null;

    if (selectedEquation === 'linear') {
      const coefficients = [
        [inputValues[0], inputValues[1]], // a1, b1
        [inputValues[3], inputValues[4]], // a2, b2
      ];
      const constants = [inputValues[2], inputValues[5]]; // c1, c2
      solution = solveLinearSystem(coefficients, constants);
      if (solution) {
        setResult(`x = ${solution[0].toFixed(2)}, y = ${solution[1].toFixed(2)}`);
      } else {
        setResult('No solution or invalid input');
      }
    } else if (selectedEquation === 'quadratic') {
      // Solve first quadratic equation for simplicity
      const [a, b, c] = inputValues.slice(0, 3); // a1, b1, c1
      solution = solveQuadratic(a, b, c);
      if (solution) {
        setResult(`Roots: x1 = ${solution[0].toFixed(2)}, x2 = ${solution[1].toFixed(2)}`);
      } else {
        setResult('No real roots or invalid input');
      }
    } else {
      setResult('Solver not implemented for this equation type');
    }
  };

  const renderInputs = () => {
    if (!selectedEquation) return null;

    const inputFields = getInputFields();

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.headingText}>{selectedEquation.toUpperCase()} Equation Inputs</Text>
        {inputFields.map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={`Enter ${field}`}
            placeholderTextColor="#999"
            value={inputs[field] || ''}
            onChangeText={(text) => setInputs({ ...inputs, [field]: text })}
            keyboardType="numeric"
          />
        ))}
        <Button title="Solve" onPress={handleSolve} />
        {result && <Text style={styles.resultText}>{result}</Text>}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {!selectedEquation && (
        <FlatList
          data={modes.eq}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: '100%', borderRadius: 5, borderWidth: 1, backgroundColor: '#434547', borderColor: '#83888d' }}>
              <TouchableOpacity onPress={() => handleEquationSelect(item.value)} style={styles.item}>
                <Text style={styles.itemText}>{item.id}: {item.name}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {renderInputs()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: 20,
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
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 20,
  },
  headingText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#333',
    color: 'white',
  },
  resultText: {
    fontSize: 18,
    color: '#0f0',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default EquationMenu;