import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  fetchFavourites,
  deleteFavouriteById,
  deleteAllFavourites,
} from './AllLogics'; // Adjust path if needed

export default function FavouritesScreen({navigation}) {
  const [favourites, setFavourites] = useState([]);

  const loadFavourites = async () => {
    const data = await fetchFavourites();
    setFavourites(data);
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  const handleDelete = async (id) => {
    await deleteFavouriteById(id);
    setFavourites((prev) => prev.filter((item) => item.id !== id));
  };

  const gotomain=(expr)=>{
    navigation.navigate('Main',{showexpr:expr})
  }

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All',
      'Are you sure you want to delete all favourite expressions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllFavourites();
              setFavourites([]);
            } catch (error) {
              console.error('Failed to delete all favourites:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <TouchableOpacity onPress={()=>{gotomain(item.expression)}}>
            <Text style={styles.expression}>{item.expression}</Text>
        </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to remove this from favourites?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => handleDelete(item.id),
              },
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
        data={favourites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No favourites found.</Text>
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
  expression: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    marginRight: 12,
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
