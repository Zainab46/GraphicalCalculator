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

function EquationMenu({navigation, route}) {
  const [selectedEquation, setSelectedEquation] = useState(null);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [equationDisplay, setEquationDisplay] = useState('');

  const handleEquationSelect = (value) => {
    setSelectedEquation(value);
    setInputs({}); // Reset inputs
    setResult(null); // Reset result
    setEquationDisplay(''); // Reset equation display
  };

  const getInputFields = () => {
    if (!selectedEquation) return [];

    if (selectedEquation === 'linear') {
      // Two equations: a1x + b1y = c1, a2x + b2y = c2
      return ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'];
    } else if (selectedEquation === 'quadratic') {
      // Quadratic equation: ax² + bx + c = 0
      return ['a', 'b', 'c'];
    } else if (selectedEquation === 'cubic') {
      return ['a', 'b', 'c', 'd'];
    } else if (selectedEquation === 'quartic') {
      return ['a', 'b', 'c', 'd', 'e'];
    }
    return [];
  };

  const formatEquation = (inputValues) => {
    if (selectedEquation === 'linear') {
      const [a1, b1, c1, a2, b2, c2] = inputValues;
      const eq1 = `${a1}x + ${b1}y = ${c1}`;
      const eq2 = `${a2}x + ${b2}y = ${c2}`;
      return `${eq1}\n${eq2}`;
    } else if (selectedEquation === 'quadratic') {
      const [a, b, c] = inputValues;
      return `${a}x² + ${b}x + ${c} = 0`;
    } else if (selectedEquation === 'cubic') {
      const [a, b, c, d] = inputValues;
      return `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;
    } else if (selectedEquation === 'quartic') {
      const [a, b, c, d, e] = inputValues;
      return `${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0`;
    }
    return '';
  };

  const solveEquation = () => {
    const inputValues = Object.values(inputs).map(val => parseFloat(val) || 0);
    let solution = null;
    let finalResult = '';

    // Format and display the equation
    const equationText = formatEquation(inputValues);
    setEquationDisplay(equationText);

    if (selectedEquation === 'linear') {
      const coefficients = [
        [inputValues[0], inputValues[1]], // a1, b1
        [inputValues[3], inputValues[4]], // a2, b2
      ];
      const constants = [inputValues[2], inputValues[5]]; // c1, c2
      solution = solveLinearSystem(coefficients, constants);
      if (solution) {
        finalResult = `x = ${solution[0].toFixed(4)}, y = ${solution[1].toFixed(4)}`;
      } else {
        finalResult = 'No solution or invalid input';
      }
    } else if (selectedEquation === 'quadratic') {
      const [a, b, c] = inputValues.slice(0, 3);
      solution = solveQuadratic(a, b, c);
      if (solution) {
        finalResult = `x₁ = ${solution[0].toFixed(4)}, x₂ = ${solution[1].toFixed(4)}`;
      } else {
        finalResult = 'No real roots or invalid input';
      }
    } else {
      finalResult = 'Solver not implemented for this equation type';
    }

    setResult(finalResult);
     
      navigation.navigate('Main', { 
        equation: equationDisplay,
        result: result 
      });
  };


  const resetEquation = () => {
    setSelectedEquation(null);
    setInputs({});
    setResult(null);
    setEquationDisplay('');
  };

  const renderInputs = () => {
    if (!selectedEquation) return null;

    const inputFields = getInputFields();

    return (
      <ScrollView style={styles.inputContainer}>
        <Text style={styles.headingText}>{selectedEquation.toUpperCase()} Equation Solver</Text>
        
        {/* Input Fields */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Enter Coefficients:</Text>
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
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.solveButton} onPress={solveEquation}>
            <Text style={styles.buttonText}>Solve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetEquation}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>

        
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {!selectedEquation && (
        <FlatList
          data={modes.eq}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity onPress={() => handleEquationSelect(item.value)} style={styles.item}>
                <Text style={styles.itemText}>{item.id}: {item.name}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {renderInputs()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: 20,
  },
  listItem: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#434547',
    borderColor: '#83888d',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  item: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    padding: 20,
  },
  headingText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#333',
    color: 'white',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  solveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 0.45,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 0.45,
  },
  mainButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  displaySection: {
    marginBottom: 20,
  },
  equationBox: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
  },
  equationText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultBox: {
    backgroundColor: '#1a472a',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#28a745',
  },
  resultText: {
    color: '#28a745',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EquationMenu;