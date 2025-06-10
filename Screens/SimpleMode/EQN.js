import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { modes } from '../List';

function EquationMenu() {
  const [selectedEquation, setSelectedEquation] = useState(null);
  const [inputs, setInputs] = useState({ a: '', b: '', c: '', d: '', e: '' });

  const handleEquationSelect = (value) => {
    setSelectedEquation(value);
    setInputs({ a: '', b: '', c: '', d: '', e: '' }); // reset inputs
  };

  const renderInputs = () => {
    if (!selectedEquation) return null;

    const inputFields = [];

    if (selectedEquation === 'linear') {
      inputFields.push('a', 'b');
    } else if (selectedEquation === 'quadratic') {
      inputFields.push('a', 'b', 'c');
    } else if (selectedEquation === 'cubic') {
      inputFields.push('a', 'b', 'c', 'd');
    } else if (selectedEquation === 'quartic') {
      inputFields.push('a', 'b', 'c', 'd', 'e');
    }

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.headingText}>{selectedEquation.toUpperCase()} Equation Inputs</Text>
        {inputFields.map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={`Enter ${field}`}
            placeholderTextColor="#999"
            value={inputs[field]}
            onChangeText={(text) => setInputs({ ...inputs, [field]: text })}
            keyboardType="numeric"
          />
        ))}
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
            <View style={{ width: 400, borderRadius: 5, borderWidth: 1, backgroundColor: '#434547', borderColor: '#83888d' }}>
              <TouchableOpacity onPress={() => handleEquationSelect(item.value)} style={styles.item}>
                <Text style={styles.itemText}>{item.id}:      {item.name}</Text>
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
    fontWeight: 'bold'
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
});

export default EquationMenu;