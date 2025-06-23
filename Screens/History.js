import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet ,TouchableOpacity,Alert} from 'react-native';
import { fetchRecords,deleteRecordById } from './AllLogics'; // Update with correct path

export default function HistoryScreen() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadRecords = async () => {
      const data = await fetchRecords();
      setRecords(data);
    };

    loadRecords();
  }, []);

 const handleDelete = async (id) => {
    await deleteRecordById(id);
    setRecords((prev) => prev.filter((item) => item.id !== id)); // update state to reflect deletion
  };

  
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.expression}>{item.expression}</Text>
        <Text style={styles.result}>{item.result ?? 'Pending...'}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this record?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
            ]
          );
        }}
      >
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
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
  deleteButton: {
    backgroundColor: '#a00',
    padding: 8,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
  },
});