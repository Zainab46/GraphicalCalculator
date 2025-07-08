import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { config, performOperation } from '../AllLogics'; // Import both config and performOperation function

const VectorCalculator = ({ navigation }) => {
  // State for 3 vector inputs (A, B, C) - each with x, y, z components
  const [vectorA, setVectorA] = useState(['', '', '']);
  const [vectorB, setVectorB] = useState(['', '', '']);
  const [vectorC, setVectorC] = useState(['', '', '']);
  
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState('');
  const [vectorDisplay, setVectorDisplay] = useState('');

  const handleVectorChange = (vectorType, index, value) => {
    switch (vectorType) {
      case 'A':
        setVectorA(prev => {
          const newVector = [...prev];
          newVector[index] = value;
          return newVector;
        });
        break;
      case 'B':
        setVectorB(prev => {
          const newVector = [...prev];
          newVector[index] = value;
          return newVector;
        });
        break;
      case 'C':
        setVectorC(prev => {
          const newVector = [...prev];
          newVector[index] = value;
          return newVector;
        });
        break;
    }
  };

  const parseVector = (vec) => vec.map(val => parseFloat(val) || 0);

  const isValidVector = (vec) => {
    return vec.every(val => val !== '' && !isNaN(parseFloat(val)));
  };

  const calculate = () => {
    // Check if we have at least vectors A and B filled
    if (!isValidVector(vectorA) || !isValidVector(vectorB)) {
      setResult('Please fill in at least vectors A and B with valid numbers');
      return;
    }

    const a = parseVector(vectorA);
    const b = parseVector(vectorB);
    const c = isValidVector(vectorC) ? parseVector(vectorC) : null;

    let res = '';
    let questionString = '';
    let resultVector = null;

    switch (operation) {
      case 'add':
        if (c) {
          // A + B + C
          resultVector = a.map((val, i) => val + b[i] + c[i]);
          res = `(${resultVector.join(', ')})`;
          questionString = `vectA+vectB+vectC`;
        } else {
          // A + B
          resultVector = a.map((val, i) => val + b[i]);
          res = `(${resultVector.join(', ')})`;
          questionString = `vectA+vectB`;
        }
        break;
      case 'subtract':
        if (c) {
          // A - B - C
          resultVector = a.map((val, i) => val - b[i] - c[i]);
          res = `(${resultVector.join(', ')})`;
          questionString = `vectA-vectB-vectC`;
        } else {
          // A - B
          resultVector = a.map((val, i) => val - b[i]);
          res = `(${resultVector.join(', ')})`;
          questionString = `vectA-vectB`;
        }
        break;
      case 'dot':
        // Dot product only works with two vectors
        const dotResult = a.reduce((sum, val, i) => sum + val * b[i], 0);
        res = dotResult.toFixed(2);
        questionString = `vectA⋅vectB`;
        // For scalar results, we'll store the value in A
        resultVector = [dotResult, 0, 0];
        break;
      case 'cross':
        // Cross product only works with 3D vectors (A × B)
        if (a.length >= 3 && b.length >= 3) {
          resultVector = [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
          ];
          res = `(${resultVector.join(', ')})`;
          questionString = `vectA×vectB`;
        } else {
          res = 'Cross product requires 3D vectors';
          questionString = 'Invalid';
        }
        break;
      default:
        res = 'Invalid Operation';
        questionString = 'Invalid';
    }

    setResult(res);

    // Save result to config based on operation using performOperation function
    if (res !== 'Invalid Operation' && res !== 'Cross product requires 3D vectors' && resultVector) {
      try {
        // Store the result vector components in config.A, config.B, config.C
        if (operation === 'add') {
          // Store addition result in A, B, C
          performOperation(`A=${resultVector[0]}`);
          performOperation(`B=${resultVector[1]}`);
          performOperation(`C=${resultVector[2]}`);
        } else if (operation === 'subtract') {
          // Store subtraction result in A, B, C
          performOperation(`A=${resultVector[0]}`);
          performOperation(`B=${resultVector[1]}`);
          performOperation(`C=${resultVector[2]}`);
        } else if (operation === 'dot') {
          // Store dot product result in A, clear B and C
          performOperation(`A=${resultVector[0]}`);
          performOperation(`B=0`);
          performOperation(`C=0`);
        } else if (operation === 'cross') {
          // Store cross product result in A, B, C
          performOperation(`A=${resultVector[0]}`);
          performOperation(`B=${resultVector[1]}`);
          performOperation(`C=${resultVector[2]}`);
        }
        
        console.log('Updated config values:', {
          A: config.A,
          B: config.B,
          C: config.C
        });
      } catch (error) {
        console.error('Error updating config:', error);
      }

      // Navigate to main screen with result
      if (navigation) {
        navigation.navigate('Main', { 
          vector: questionString,
          vecresult: res
        });
      }
    }
  };

  const showVectors = () => {
    const display = [
      `A: ${config.A}`,
      `B: ${config.B}`,
      `C: ${config.C}`
    ].join('\n');
    setVectorDisplay(display);
  };

  const clearVectors = () => {
    try {
      // Use performOperation to properly set values to 0
      performOperation('A=0');
      performOperation('B=0');
      performOperation('C=0');
      
      setVectorDisplay('');
      setResult('');
      // Also clear input fields
      setVectorA(['', '', '']);
      setVectorB(['', '', '']);
      setVectorC(['', '', '']);
      
      console.log('Cleared config values:', {
        A: config.A,
        B: config.B,
        C: config.C
      });
    } catch (error) {
      console.error('Error clearing vectors:', error);
    }
  };

  const renderVectorInput = (vectorType, vectorState, label) => {
    return (
      <View style={styles.vectorContainer}>
        <Text style={styles.vectorLabel}>{label}:</Text>
        {['x', 'y', 'z'].map((component, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.componentLabel}>{component}</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={vectorState[index]}
              onChangeText={(val) => handleVectorChange(vectorType, index, val)}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Vector Calculator</Text>
      <Text style={styles.subHeading}>3D Vector Operations</Text>

      {/* Vector A Input */}
      {renderVectorInput('A', vectorA, 'Vector A')}
      
      {/* Vector B Input */}
      {renderVectorInput('B', vectorB, 'Vector B')}
      
      {/* Vector C Input */}
      {renderVectorInput('C', vectorC, 'Vector C')}

      <Text style={styles.subHeading}>Operation:</Text>
      <View style={styles.operations}>
        {[
          { key: 'add', label: 'A + B + C' },
          { key: 'subtract', label: 'A - B - C' },
          { key: 'dot', label: 'A ⋅ B' },
          { key: 'cross', label: 'A × B' }
        ].map(op => (
          <TouchableOpacity
            key={op.key}
            onPress={() => setOperation(op.key)}
            style={[styles.opButton, operation === op.key && styles.opButtonActive]}
          >
            <Text style={[styles.opText, operation === op.key && styles.opTextActive]}>
              {op.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={calculate} style={styles.calcButton}>
        <Text style={styles.calcText}>Calculate</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={showVectors} style={styles.showButton}>
        <Text style={styles.calcText}>Show Saved Vectors</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={clearVectors} style={styles.clearButton}>
        <Text style={styles.calcText}>Clear All Vectors</Text>
      </TouchableOpacity>

      <Text style={styles.resultLabel}>Result:</Text>
      <Text style={styles.result}>{result}</Text>

      <Text style={styles.resultLabel}>Values (A, B, C):</Text>
      <Text style={styles.result}>{vectorDisplay}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subHeading: { fontSize: 16, marginTop: 15, marginBottom: 10, fontWeight: '600' },
  vectorContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 8, 
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 1
  },
  vectorLabel: { 
    width: 80, 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#333' 
  },
  inputContainer: {
    alignItems: 'center',
    marginHorizontal: 8
  },
  componentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    width: 50,
    backgroundColor: '#fff',
    textAlign: 'center'
  },
  operations: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginVertical: 15,
    justifyContent: 'space-around' 
  },
  opButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    margin: 5
  },
  opButtonActive: {
    backgroundColor: '#6200ee'
  },
  opText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14
  },
  opTextActive: {
    color: '#fff'
  },
  calcButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  showButton: {
    marginTop: 10,
    backgroundColor: '#388e3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  calcText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  resultLabel: { 
    marginTop: 20, 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333' 
  },
  result: {
    fontSize: 16,
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 6,
    minHeight: 50
  }
});

export default VectorCalculator;