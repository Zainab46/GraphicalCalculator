import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { fetchRecords } from './AllLogics'; // Update with correct path

export default function HistoryScreen() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadRecords = async () => {
      const data = await fetchRecords();
      setRecords(data);
    };

    loadRecords();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.expression}>{item.expression}</Text>
      <Text style={styles.result}>{item.result ?? 'Pending...'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#333',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  expression: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  result: {
    fontSize: 14,
    color: '#0af',
  },
});
