import { useLists } from '@/contexts/ListsContext';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SecondaryView } from '../Themed';

export function ListSelector() {
  const { lists, currentList, setCurrentList, createList, deleteList, loading } = useLists();
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Erro', 'Por favor, informe um nome para a lista');
      return;
    }

    try {
      await createList(newListName);
      setNewListName('');
      setShowCreateModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a lista');
    }
  };

  const handleDeleteList = (id: string, name: string) => {
    Alert.alert(
      'Excluir Lista',
      `Tem certeza que deseja excluir a lista "${name}"? Todos os produtos serão excluídos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a lista');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return null;
  }

  if (lists.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Feather name="plus" size={20} color="#FFF" />
          <Text style={styles.createButtonText}>Criar primeira lista</Text>
        </TouchableOpacity>

        <Modal
          visible={showCreateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <SecondaryView style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nova Lista de Compras</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome da lista"
                placeholderTextColor="#9CA3AF"
                value={newListName}
                onChangeText={setNewListName}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowCreateModal(false);
                    setNewListName('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleCreateList}
                >
                  <Text style={styles.confirmButtonText}>Criar</Text>
                </TouchableOpacity>
              </View>
            </SecondaryView>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.selectorText} numberOfLines={1}>
          {currentList?.name || 'Selecione uma lista'}
        </Text>
        <Feather name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <SecondaryView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Listas de Compras</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather name="x" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              {lists.map((list) => (
                <TouchableOpacity
                  key={list.id}
                  style={[
                    styles.listaItem,
                    list.id === currentList?.id && styles.listaItemActive,
                  ]}
                  onPress={() => {
                    setCurrentList(list);
                    setShowModal(false);
                  }}
                >
                  <View style={styles.listaItemContent}>
                    <Feather
                      name={list.id === currentList?.id ? 'check-circle' : 'circle'}
                      size={20}
                      color={list.id === currentList?.id ? '#2646B1' : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.listaItemText,
                        list.id === currentList?.id && styles.listaItemTextActive,
                      ]}
                    >
                      {list.name}
                    </Text>
                  </View>
                  {lists.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleDeleteList(list.id, list.name)}
                      style={styles.deleteButton}
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setShowModal(false);
                setShowCreateModal(true);
              }}
            >
              <Feather name="plus" size={20} color="#2646B1" />
              <Text style={styles.addButtonText}>Nova Lista</Text>
            </TouchableOpacity>
          </SecondaryView>
        </View>
      </Modal>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <SecondaryView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Lista de Compras</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da lista"
              placeholderTextColor="#9CA3AF"
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewListName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateList}
              >
                <Text style={styles.confirmButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </SecondaryView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C4c4c4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  selectorText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2646B1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listContainer: {
    maxHeight: 400,
  },
  listaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#1F2937',
  },
  listaItemActive: {
    backgroundColor: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#2646B1',
  },
  listaItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  listaItemText: {
    color: '#9CA3AF',
    fontSize: 16,
    flex: 1,
  },
  listaItemTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2646B1',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#2646B1',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  confirmButton: {
    backgroundColor: '#2646B1',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

