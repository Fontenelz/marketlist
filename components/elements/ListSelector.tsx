import { useLists } from '@/contexts/ListsContext';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SecondaryView } from '../Themed';

export function ListSelector() {
  const { lists, currentList, setCurrentList, createList, loading } = useLists();
  const [isFocus, setIsFocus] = useState(false);
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

  if (loading) {
    return null;
  }

  if (lists.length === 0) {
    return (
      <View>
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

  const dropdownData = lists.map((list) => ({
    label: list.name,
    value: list.id,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={[styles.dropdown, isFocus && styles.dropdownFocus]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dropdownData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Selecione uma lista' : '...'}
          searchPlaceholder="Buscar..."
          value={currentList?.id || null}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            const selectedList = lists.find((list) => list.id === item.value);
            if (selectedList) {
              setCurrentList(selectedList);
            }
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <Feather
              name={isFocus ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#9CA3AF"
              style={styles.icon}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    backgroundColor: '#F3F3F3',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  dropdownFocus: {
    borderColor: '#2646B1',
    borderWidth: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 8,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#1F2937',
    color: '#FFF',
    borderRadius: 8,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
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

