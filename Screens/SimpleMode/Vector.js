import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const VectorCalculator = ({ navigation }) => {
  const [dimension, setDimension] = useState('2');
  const [vectorInput, setVectorInput] = useState([]);
  const [savedVectors, setSavedVectors] = useState({ A: null, B: null, C: null });
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState('');
  const [vectorDisplay, setVectorDisplay] = useState('');
  const [autoSaveDisabled, setAutoSaveDisabled] = useState(false);

  // Initialize vectorInput based on dimension
  useEffect(() => {
    const dim = parseInt(dimension) || 2;
    const newInput = new Array(dim).fill('');
    setVectorInput(newInput);
    setAutoSaveDisabled(false); // Reset auto-save when dimension changes
  }, [dimension]);

  // Memoized function to check if all inputs are filled and valid
  const checkIfAllFilled = useCallback((inputs) => {
    return inputs.length > 0 && inputs.every(val => val !== '' && !isNaN(parseFloat(val)));
  }, []);

  // Auto-save vector when all components are filled
  useEffect(() => {
    if (autoSaveDisabled || vectorInput.length === 0) return;

    const allFilled = checkIfAllFilled(vectorInput);
    
    if (allFilled) {
      const vector = vectorInput.map(val => parseFloat(val));
      
      setSavedVectors(prev => {
        // Check if this exact vector is already saved to prevent unnecessary updates
        const vectorStr = vector.join(',');
        const existingVectors = Object.values(prev).filter(v => v !== null);
        const alreadySaved = existingVectors.some(v => v.join(',') === vectorStr);
        
        if (alreadySaved) return prev;

        if (!prev.A) return { ...prev, A: vector };
        if (!prev.B) return { ...prev, B: vector };
        if (!prev.C) return { ...prev, C: vector };
        return prev;
      });

      // Clear inputs and disable auto-save
      setVectorInput(new Array(vectorInput.length).fill(''));
      setAutoSaveDisabled(true);
    }
  }, [vectorInput, autoSaveDisabled, checkIfAllFilled]);

  // Re-enable auto-save when inputs are cleared
  useEffect(() => {
    const allEmpty = vectorInput.every(val => val === '');
    if (allEmpty && autoSaveDisabled) {
      setAutoSaveDisabled(false);
    }
  }, [vectorInput, autoSaveDisabled]);

  const handleDimensionChange = (value) => {
    const dim = value.replace(/[^0-9]/g, '');
    setDimension(dim);
  };

  const handleVectorChange = (index, value) => {
    setVectorInput(prev => {
      const newInput = [...prev];
      newInput[index] = value;
      return newInput;
    });
  };

  const parseVector = (vec) => vec.map(val => parseFloat(val) || 0);

  const calculate = () => {
    const a = savedVectors.A ? parseVector(savedVectors.A) : null;
    const b = savedVectors.B ? parseVector(savedVectors.B) : null;
    const c = savedVectors.C ? parseVector(savedVectors.C) : null;

    if (!a || !b) {
      setResult('Please save at least two vectors (A and B)');
      return;
    }

    let res = '';
    let questionString = '';

    switch (operation) {
      case 'add':
        if (c) {
          // A + B + C
          res = `(${a.map((val, i) => val + b[i] + c[i]).join(', ')})`;
          questionString = `vectA+vectB+vectC`;
        } else {
          // A + B
          res = `(${a.map((val, i) => val + b[i]).join(', ')})`;
          questionString = `vectA+vectB`;
        }
        break;
      case 'subtract':
        if (c) {
          // A - B - C
          res = `(${a.map((val, i) => val - b[i] - c[i]).join(', ')})`;
          questionString = `vectA-vectB-vectC`;
        } else {
          // A - B
          res = `(${a.map((val, i) => val - b[i]).join(', ')})`;
          questionString = `vectA-vectB`;
        }
        break;
      case 'dot':
        // Dot product only works with two vectors
        res = a.reduce((sum, val, i) => sum + val * b[i], 0).toFixed(2);
        questionString = `vectA⋅vectB`;
        break;
      default:
        res = 'Invalid Operation';
        questionString = 'Invalid';
    }

    setResult(res);

    // Navigate to main screen with simple data
    if (navigation && res !== 'Invalid Operation') {
      navigation.navigate('Main', { 
        vector: questionString,
        vecresult: res
      });
    }
  };

  const showVectors = () => {
    const display = Object.entries(savedVectors)
      .filter(([_, vec]) => vec)
      .map(([key, vec]) => `${key}: (${vec.join(', ')})`)
      .join('\n');
    setVectorDisplay(display || 'No vectors saved');
  };

  const clearVectors = () => {
    setSavedVectors({ A: null, B: null, C: null });
    setVectorDisplay('');
    setResult('');
    setAutoSaveDisabled(false);
  };

  const renderVectorInputs = () => {
    const dim = parseInt(dimension) || 2;
    return (
      <View style={styles.vectorContainer}>
        <Text style={styles.label}>Vector Input</Text>
        {Array.from({ length: dim }).map((_, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`x${index + 1}`}
            keyboardType="numeric"
            value={vectorInput[index] || ''}
            onChangeText={(val) => handleVectorChange(index, val)}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Vector Calculator</Text>

      <Text style={styles.subHeading}>Dimension:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter dimension (e.g., 2, 3)"
        keyboardType="numeric"
        value={dimension}
        onChangeText={handleDimensionChange}
      />

      {renderVectorInputs()}

      <Text style={styles.subHeading}>Operation:</Text>
      <View style={styles.operations}>
        {['add', 'subtract', 'dot'].map(op => (
          <TouchableOpacity
            key={op}
            onPress={() => setOperation(op)}
            style={[styles.opButton, operation === op && styles.opButtonActive]}
          >
            <Text style={[styles.opText, operation === op && styles.opTextActive]}>
              {op === 'add' && 'A + B'}
              {op === 'subtract' && 'A - B'}
              {op === 'dot' && 'A ⋅ B'}
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

      <Text style={styles.resultLabel}>Saved Vectors:</Text>
      <Text style={styles.result}>{vectorDisplay}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subHeading: { fontSize: 16, marginTop: 10 },
  vectorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, flexWrap: 'wrap' },
  label: { width: 80, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 6,
    width: 60,
    backgroundColor: '#fff'
  },
  operations: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 10 },
  opButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
    margin: 5
  },
  opButtonActive: {
    backgroundColor: '#6200ee'
  },
  opText: {
    color: '#000',
    fontWeight: 'bold'
  },
  opTextActive: {
    color: '#fff'
  },
  calcButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  showButton: {
    marginTop: 10,
    backgroundColor: '#388e3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  calcText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  resultLabel: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  result: {
    fontSize: 18,
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6
  }
});

export default VectorCalculator;