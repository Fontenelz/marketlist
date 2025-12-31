import { CardButton, ItemSeparator, SecondaryView, Text } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { useLists } from '@/contexts/ListsContext';
import { listenAllProducts, ProductDTO } from '@/repositories/productRepository';
import dayjs from '@/utils/dayjs';
import { calculateTotalValue, formatValue } from '@/utils/itemCalculations';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type ListSummary = {
  listId: string;
  listName: string;
  listCreatedAt: Date | null,
  totalProducts: number;
  totalValue: number;
  completedProducts: number;
  pendingProducts: number;
};

export default function Index() {
  const { lists, setCurrentList, createList, deleteList } = useLists();
  const { user } = useAuth();
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<ProductDTO[]>([]);
  const [listSummaries, setListSummaries] = useState<ListSummary[]>([]);
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

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenAllProducts(user.uid, (products) => {
      setAllProducts(products);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const summaries: ListSummary[] = lists.map((list) => {
      const listProducts = allProducts.filter((product) => product.listId === list.id);
      const totalValue = listProducts.reduce((total, product) => {
        return total + calculateTotalValue(product.quantity, product.type, product.price);
      }, 0);
      const completedProducts = listProducts.filter((p) => p.status === 'completed').length;
      const pendingProducts = listProducts.filter((p) => p.status === 'pending').length;

      return {
        listId: list.id,
        listName: list.name,
        listCreatedAt: list.createdAt,
        totalProducts: listProducts.length,
        totalValue,
        completedProducts,
        pendingProducts,
      };
    });

    setListSummaries(summaries);
  }, [lists, allProducts]);

  const handleSelectList = (listId: string) => {
    const selectedList = lists.find((list) => list.id === listId);
    if (selectedList) {
      setCurrentList(selectedList);
      router.push('/list-itens-screen');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />

      {/* ----- header ----- */}
      <View style={styles.header}>
        <View style={{
          flexDirection: "row", gap: 8, justifyContent: "center", alignItems: "center"
        }}>
          <Image source={require("../../assets/images/adaptive-icon.png")} style={styles.logo} />
          <Text style={{
            fontSize: 24, color: "#2646B1",
            fontFamily: 'quicksand', fontWeight: 'bold'
          }}>Comprar</Text>
        </View>
        <View style={styles.headerButtons}>
          <Link href="/login" asChild>
            <Pressable style={styles.headerButton}>
              {({ pressed }) => (
                <Text style={[styles.headerButtonText, { marginRight: 2, opacity: pressed ? 0.5 : 1 }]}>MO</Text>
              )}
            </Pressable>
          </Link>
        </View>
      </View>

      <SecondaryView style={styles.listContainer}>
        <FlatList
          data={listSummaries}
          keyExtractor={(item) => item.listId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            return <CardButton
              style={styles.listCard}
              onPress={() => handleSelectList(item.listId)}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 12,
                color: '#a4a4a4',
                marginBottom: 2
              }}>
                {item.listCreatedAt
                  ? `Criada ${dayjs(item.listCreatedAt).fromNow()}`
                  : ''}
              </Text>
              <View style={styles.listCardHeader}>
                <Text style={styles.listCardTitle}>{item.listName}</Text>
                <View style={styles.listCardActions}>
                  {lists.length > 1 && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteList(item.listId, item.listName);
                      }}
                      style={styles.deleteButton}
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              </View>

              <View style={styles.listCardStats}>
                <View style={styles.statItem}>
                  <Feather name="package" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{item.totalProducts} produtos</Text>
                </View>
                <View style={styles.statItem}>
                  <Feather name="check-circle" size={16} color="#10B981" />
                  <Text style={[styles.statText, styles.completedText]}>
                    {item.completedProducts} completos
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Feather name="circle" size={16} color="#F59E0B" />
                  <Text style={[styles.statText, styles.pendingText]}>
                    {item.pendingProducts} pendentes
                  </Text>
                </View>
              </View>
              <ItemSeparator />
              <View style={styles.listCardFooter}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>{formatValue(item.totalValue)}</Text>
              </View>
            </CardButton>
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <SecondaryView style={styles.emptyContainer}>
              <Feather name="list" size={48} color="#6B7280" />
              <Text style={styles.emptyText}>Nenhuma lista encontrada</Text>
              <Text style={styles.emptySubtext}>Crie sua primeira lista na aba Home</Text>
            </SecondaryView>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SecondaryView>

      {/* Floating Add Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => setShowCreateModal(true)}
      >
        {({ pressed }) => (
          <Feather
            name="plus"
            size={24}
            color="#FFF"
            style={{ opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>

      {/* Create List Modal */}
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
  mainContainer: {
    flex: 1,
    paddingTop: 64,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  logo: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    width: 38,
    height: 38,
    padding: 4
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3f3f3',
    borderRadius: 18,
  },
  headerButtonSecondary: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#1F2937',
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  listCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C4C4C4',
  },
  listCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  listCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  listCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  completedText: {
    color: '#10B981',
  },
  pendingText: {
    color: '#F59E0B',
  },
  listCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2646B1',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2646B1',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
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
    marginBottom: 24,
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
