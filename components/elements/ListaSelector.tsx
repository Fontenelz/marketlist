import { useListas } from '@/contexts/ListasContext';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SecondaryView } from '../Themed';

export function ListaSelector() {
  const { listas, listaAtual, setListaAtual, criarLista, excluirLista, loading } = useListas();
  const [showModal, setShowModal] = useState(false);
  const [novaListaNome, setNovaListaNome] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCriarLista = async () => {
    if (!novaListaNome.trim()) {
      Alert.alert('Erro', 'Por favor, informe um nome para a lista');
      return;
    }

    try {
      await criarLista(novaListaNome);
      setNovaListaNome('');
      setShowCreateModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a lista');
    }
  };

  const handleExcluirLista = (id: string, nome: string) => {
    Alert.alert(
      'Excluir Lista',
      `Tem certeza que deseja excluir a lista "${nome}"? Todos os produtos serão excluídos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirLista(id);
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

  if (listas.length === 0) {
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
                value={novaListaNome}
                onChangeText={setNovaListaNome}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowCreateModal(false);
                    setNovaListaNome('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleCriarLista}
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
          {listaAtual?.nome || 'Selecione uma lista'}
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
              {listas.map((lista) => (
                <TouchableOpacity
                  key={lista.id}
                  style={[
                    styles.listaItem,
                    lista.id === listaAtual?.id && styles.listaItemActive,
                  ]}
                  onPress={() => {
                    setListaAtual(lista);
                    setShowModal(false);
                  }}
                >
                  <View style={styles.listaItemContent}>
                    <Feather
                      name={lista.id === listaAtual?.id ? 'check-circle' : 'circle'}
                      size={20}
                      color={lista.id === listaAtual?.id ? '#2646B1' : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.listaItemText,
                        lista.id === listaAtual?.id && styles.listaItemTextActive,
                      ]}
                    >
                      {lista.nome}
                    </Text>
                  </View>
                  {listas.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleExcluirLista(lista.id, lista.nome)}
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
              value={novaListaNome}
              onChangeText={setNovaListaNome}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNovaListaNome('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCriarLista}
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
  container: {
    marginBottom: 16,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141b24',
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

