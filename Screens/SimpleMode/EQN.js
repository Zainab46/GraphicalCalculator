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

const solveCubic = (a, b, c, d) => {
  // Handle case where a = 0 (not actually cubic)
  if (Math.abs(a) < 1e-10) {
    return solveQuadratic(b, c, d);
  }

  // Normalize coefficients
  b /= a;
  c /= a;
  d /= a;

  // Cardano's method for cubic equations
  const p = c - (b * b) / 3;
  const q = (2 * b * b * b - 9 * b * c + 27 * d) / 27;

  const discriminant = (q * q) / 4 + (p * p * p) / 27;

  if (discriminant > 0) {
    // One real root
    const sqrtD = Math.sqrt(discriminant);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);
    const root = u + v - b / 3;
    return [root];
  } else if (Math.abs(discriminant) < 1e-10) {
    // Two or three real roots (special case)
    if (Math.abs(q) < 1e-10) {
      // Three equal roots
      const root = -b / 3;
      return [root, root, root];
    } else {
      // Two distinct roots
      const root1 = 3 * q / p - b / 3;
      const root2 = -3 * q / (2 * p) - b / 3;
      return [root1, root2];
    }
  } else {
    // Three distinct real roots
    const rho = Math.sqrt(-(p * p * p) / 27);
    const theta = Math.acos(-q / (2 * rho));
    const cubeRootRho = Math.cbrt(rho);
    
    const root1 = 2 * cubeRootRho * Math.cos(theta / 3) - b / 3;
    const root2 = 2 * cubeRootRho * Math.cos((theta + 2 * Math.PI) / 3) - b / 3;
    const root3 = 2 * cubeRootRho * Math.cos((theta + 4 * Math.PI) / 3) - b / 3;
    
    return [root1, root2, root3];
  }
};

const solveQuartic = (a, b, c, d, e) => {
  // Handle case where a = 0 (not actually quartic)
  if (Math.abs(a) < 1e-10) {
    return solveCubic(b, c, d, e);
  }

  // Normalize coefficients
  b /= a;
  c /= a;
  d /= a;
  e /= a;

  // For simplicity, we'll use a numerical approach for quartic equations
  // as the analytical solution is very complex
  const roots = [];
  
  // Try to find roots using numerical methods
  // This is a simplified approach - you might want to use a more robust method
  for (let x = -10; x <= 10; x += 0.1) {
    const value = x*x*x*x + b*x*x*x + c*x*x + d*x + e;
    if (Math.abs(value) < 0.001) {
      // Check if this root is already found
      if (!roots.some(root => Math.abs(root - x) < 0.01)) {
        roots.push(x);
      }
    }
  }
  
  return roots.length > 0 ? roots : null;
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
    } else if (selectedEquation === 'cubic') {
      const [a, b, c, d] = inputValues.slice(0, 4);
      solution = solveCubic(a, b, c, d);
      if (solution && solution.length > 0) {
        if (solution.length === 1) {
          finalResult = `x = ${solution[0].toFixed(4)}`;
        } else if (solution.length === 2) {
          finalResult = `x₁ = ${solution[0].toFixed(4)}, x₂ = ${solution[1].toFixed(4)}`;
        } else {
          finalResult = `x₁ = ${solution[0].toFixed(4)}, x₂ = ${solution[1].toFixed(4)}, x₃ = ${solution[2].toFixed(4)}`;
        }
      } else {
        finalResult = 'No real roots or invalid input';
      }
    } else if (selectedEquation === 'quartic') {
      const [a, b, c, d, e] = inputValues.slice(0, 5);
      solution = solveQuartic(a, b, c, d, e);
      if (solution && solution.length > 0) {
        const rootStrings = solution.map((root, index) => `x${index + 1} = ${root.toFixed(4)}`);
        finalResult = rootStrings.join(', ');
      } else {
        finalResult = 'No real roots found or invalid input';
      }
    } else {
      finalResult = 'Solver not implemented for this equation type';
    }

    // Navigate immediately with the calculated values
    navigation.navigate('Main', { 
      equation: equationText,
      result: finalResult 
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
            <Text style={styles.buttonText}>Solve & Send to Main</Text>
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
    flex: 0.6,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 0.35,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EquationMenu;