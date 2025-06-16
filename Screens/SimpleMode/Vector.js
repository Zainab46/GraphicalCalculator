import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const VectorCalculator = () => {
  const [dimension, setDimension] = useState('2D');
  const [vectorA, setVectorA] = useState({ x: '', y: '', z: '' });
  const [vectorB, setVectorB] = useState({ x: '', y: '', z: '' });
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState('');

  const handleChange = (setter, axis, value) => {
    setter(prev => ({ ...prev, [axis]: value }));
  };

  const parseVector = (vec) => ({
    x: parseFloat(vec.x) || 0,
    y: parseFloat(vec.y) || 0,
    z: dimension === '3D' ? parseFloat(vec.z) || 0 : 0
  });

  const calculate = () => {
    const a = parseVector(vectorA);
    const b = parseVector(vectorB);

    let res = '';

    switch (operation) {
      case 'add':
        res = `(${a.x + b.x}, ${a.y + b.y}${dimension === '3D' ? `, ${a.z + b.z}` : ''})`;
        break;
      case 'subtract':
        res = `(${a.x - b.x}, ${a.y - b.y}${dimension === '3D' ? `, ${a.z - b.z}` : ''})`;
        break;
      case 'dot':
        res = (a.x * b.x + a.y * b.y + a.z * b.z).toFixed(2);
        break;
      case 'cross':
        if (dimension === '2D') {
          res = 'Cross product is not defined in 2D';
        } else {
          const cx = a.y * b.z - a.z * b.y;
          const cy = a.z * b.x - a.x * b.z;
          const cz = a.x * b.y - a.y * b.x;
          res = `(${cx}, ${cy}, ${cz})`;
        }
        break;
      case 'magnitudeA':
        res = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2).toFixed(2);
        break;
      case 'magnitudeB':
        res = Math.sqrt(b.x ** 2 + b.y ** 2 + b.z ** 2).toFixed(2);
        break;
      default:
        res = 'Invalid Operation';
    }

    setResult(res);
  };

  const renderVectorInputs = (label, vector, setVector) => (
    <View style={styles.vectorContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="x"
        keyboardType="numeric"
        value={vector.x}
        onChangeText={(val) => handleChange(setVector, 'x', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="y"
        keyboardType="numeric"
        value={vector.y}
        onChangeText={(val) => handleChange(setVector, 'y', val)}
      />
      {dimension === '3D' && (
        <TextInput
          style={styles.input}
          placeholder="z"
          keyboardType="numeric"
          value={vector.z}
          onChangeText={(val) => handleChange(setVector, 'z', val)}
        />
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.subHeading}>Select Dimension:</Text>
      <View style={styles.radioGroup}>
        {['2D', '3D'].map((dim) => (
          <TouchableOpacity
            key={dim}
            style={[styles.radioButton, dimension === dim && styles.radioButtonSelected]}
            onPress={() => setDimension(dim)}
          >
            <Text style={styles.radioText}>{dim}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderVectorInputs('Vector A', vectorA, setVectorA)}
      {renderVectorInputs('Vector B', vectorB, setVectorB)}

      <Text style={styles.subHeading}>Operation:</Text>
      <View style={styles.operations}>
        {['add', 'subtract', 'dot', 'cross', 'magnitudeA', 'magnitudeB'].map(op => (
          <TouchableOpacity
            key={op}
            onPress={() => setOperation(op)}
            style={[styles.opButton, operation === op && styles.opButtonActive]}
          >
            <Text style={[styles.opText, operation === op && styles.opTextActive]}>
              {op === 'add' && 'A + B'}
              {op === 'subtract' && 'A - B'}
              {op === 'dot' && 'A ⋅ B'}
              {op === 'cross' && 'A × B'}
              {op === 'magnitudeA' && '|A|'}
              {op === 'magnitudeB' && '|B|'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={calculate} style={styles.calcButton}>
        <Text style={styles.calcText}>Calculate</Text>
      </TouchableOpacity>

      <Text style={styles.resultLabel}>Result:</Text>
      <Text style={styles.result}>{result}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subHeading: { fontSize: 16, marginTop: 10 },
  vectorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  label: { width: 80, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 6,
    width: 60,
    backgroundColor: '#fff'
  },
  radioGroup: { flexDirection: 'row', gap: 10, marginTop: 5 },
  radioButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginRight: 10
  },
  radioButtonSelected: {
    backgroundColor: '#6200ee'
  },
  radioText: {
    color: '#000',
    fontWeight: 'bold'
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
