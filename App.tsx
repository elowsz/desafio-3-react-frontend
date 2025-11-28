import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { api } from './services/api';

type Item = {
  id: number;
  name: string;
};

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Carrega todos os itens
  const loadItems = () => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Adicionar item
  const handleAdd = () => {
    if (!newItemName.trim()) return;
    api.post('/items', { name: newItemName })
      .then(() => {
        setNewItemName('');
        loadItems();
      })
      .catch(err => console.error(err));
  };

  // Atualizar item
  const handleUpdate = () => {
    if (!newItemName.trim() || editingId === null) return;
    api.put(`/items/${editingId}`, { name: newItemName })
      .then(() => {
        setNewItemName('');
        setEditingId(null);
        loadItems();
      })
      .catch(err => console.error(err));
  };

  // Deletar item
  const handleDelete = (id: number) => {
    Alert.alert('Confirmação', 'Deseja realmente deletar este item?', [
      { text: 'Cancelar' },
      { text: 'Sim', onPress: () => {
        api.delete(`/items/${id}`)
          .then(() => loadItems())
          .catch(err => console.error(err));
      }}
    ]);
  };

  // Começar edição
  const startEditing = (item: Item) => {
    setNewItemName(item.name);
    setEditingId(item.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD de Itens</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do item"
        value={newItemName}
        onChangeText={setNewItemName}
      />

      <Button
        title={editingId === null ? "Adicionar" : "Atualizar"}
        onPress={editingId === null ? handleAdd : handleUpdate}
      />

      <FlatList
        style={{ marginTop: 20 }}
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{item.name}</Text>
            <View style={styles.buttons}>
              <Button title="Editar" onPress={() => startEditing(item)} />
              <Button title="Deletar" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  item: { fontSize: 18 },
  buttons: { flexDirection: 'row', gap: 5 }
});
