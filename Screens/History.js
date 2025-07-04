import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { fetchRecords, deleteRecordById, deleteAllRecords } from './AllLogics'; // Adjust path if needed

export default function HistoryScreen() {
  const [records, setRecords] = useState([]);

  const loadRecords = async () => {
    const data = await fetchRecords();
    setRecords(data);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDelete = async (id) => {
    await deleteRecordById(id);
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };
  
const handleDeleteAll = () => {
  Alert.alert(
    'Delete All',
    'Are you sure you want to delete all history records?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAllRecords();
            setRecords([]);
          } catch (error) {
            console.error('Failed to delete all:', error);
          }
        },
      },
    ]
  );
};

const formatTimestamp = (timestamp) => {
  // Expecting format: "MM/DD/YYYY, HH:mm:ss"
  const [datePart, timePart] = timestamp.split(', ');
  if (!datePart || !timePart) return timestamp;

  const [month, day, year] = datePart.split('/').map(Number);
  const [hourStr, minuteStr] = timePart.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = months[month - 1];

  return `${monthName} ${String(day).padStart(2, '0')}, ${year}, ${hour}:${String(minute).padStart(2, '0')} ${ampm}`;
};


  const renderItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <View style={styles.textContainer}>
      <Text style={styles.expression}>{item.expression}</Text>
      <Text style={styles.result}>{item.result ?? 'Pending...'}</Text>
      <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
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
      <TouchableOpacity style={styles.clearAllButton} onPress={handleDeleteAll}>
        <Text style={styles.clearAllText}>🧹 Clear All</Text>
      </TouchableOpacity>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No history found.</Text>
        }
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
  clearAllButton: {
    backgroundColor: '#800',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  clearAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  timestamp: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 4,
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
  emptyMessage: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
