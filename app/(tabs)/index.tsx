import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import Filter from '@/components/elements/Filter';
import { Item } from '@/components/elements/Item';
import { SecondaryView, Text, View } from '@/components/Themed';
import { useItems } from '@/contexts/ItemsContext';
import { eFilterStatus } from '@/types/FIlterStatus';
import { formatarValor } from '@/utils/itemCalculations';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// const INITIAL_ITEMS: ItemType[] = [
//   {
//     id: 1,
//     nome: "Arroz",
//     quantidade: 2,
//     tipo: "kg",
//     valor: 10,
//     status: eFilterStatus.COMPLETED,
//   },
//   {
//     id: 2,
//     nome: "Feijão",
//     quantidade: 1,
//     tipo: "kg",
//     valor: 10,
//     status: eFilterStatus.PENDING,
//   },
//   {
//     id: 3,
//     nome: "Leite",
//     quantidade: 3,
//     tipo: "litros",
//     valor: 10,
//     status: eFilterStatus.COMPLETED,
//   },
//   {
//     id: 4,
//     nome: "Ovos",
//     quantidade: 12,
//     tipo: "unidade",
//     valor: 10,
//     status: eFilterStatus.PENDING,
//   },
//   {
//     id: 5,
//     nome: "Pão",
//     quantidade: 10,
//     tipo: "unidade",
//     valor: 10,
//     status: eFilterStatus.COMPLETED,
//   },
//   {
//     id: 6,
//     nome: "Queijo",
//     quantidade: 400,
//     tipo: "gramas",
//     valor: 10,
//     status: eFilterStatus.COMPLETED,
//   },
//   {
//     id: 7,
//     nome: "Tomate",
//     quantidade: 1,
//     tipo: "kg",
//     valor: 10,
//     status: eFilterStatus.PENDING,
//   },
//   {
//     id: 8,
//     nome: "Batata",
//     quantidade: 2,
//     tipo: "kg",
//     valor: 10,
//     status: eFilterStatus.COMPLETED,
//   },
//   {
//     id: 9,
//     nome: "Óleo",
//     quantidade: 1,
//     tipo: "litros",
//     valor: 10,
//     status: eFilterStatus.COMPLETED,
//   },
//   {
//     id: 10,
//     nome: "Frango",
//     quantidade: 1,
//     tipo: "kg",
//     valor: 10,
//     status: eFilterStatus.PENDING,
//   },
// ];

const FILTERS_STATUS: eFilterStatus[] = [
  eFilterStatus.ALL,
  eFilterStatus.PENDING,
  eFilterStatus.COMPLETED,
];


export default function TabOneScreen() {
  const [activeFilter, setActiveFilter] = useState<eFilterStatus>(eFilterStatus.ALL);
  const { getTotalByFilter, getFilteredItems, clearItems } = useItems();


  const handleFilterChange = (status: eFilterStatus) => {
    setActiveFilter(status);
  };

  const totalPayment = getTotalByFilter(activeFilter);
  const filteredItems = getFilteredItems(activeFilter);

  return (
    <View style={styles.mainContainer}>
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

      {/* ----- total value ----- */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Payment</Text>
        <Text style={styles.totalValue}>{formatarValor(totalPayment)}</Text>
      </View>

      <SecondaryView style={styles.listContainer}>
        <SecondaryView style={styles.filtersContainer}>
          <SecondaryView style={styles.filtersRow}>
            {FILTERS_STATUS.map((status) => (
              <Filter key={status} status={status} isActive={status === activeFilter} onPress={() => handleFilterChange(status)} />
            ))}
          </SecondaryView>
          <TouchableOpacity style={styles.clearButton} onPress={clearItems}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </SecondaryView>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingBottom: 80
          }}
          renderItem={({ item }) => (
            <Item
              key={item.id}
              itemId={item.id}
              data={{
                id: item.id,
                status: item.status,
                nome: item.nome,
                quantidade: item.quantidade,
                tipo: item.tipo,
                valor: item.valor,
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <SecondaryView style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>Try changing the filter</Text>
            </SecondaryView>
          )}
        />
      </SecondaryView>

      <Link href="/modal" asChild>
        <Pressable style={styles.addItemButton}>
          {({ pressed }) => (
            <Feather
              name="plus"
              size={24}
              color="#FFF"
              style={{ marginRight: 2, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      </Link>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '#E5E7EB',
    paddingTop: 64,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
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
    backgroundColor: '#FFFFFF',
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
  totalContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  totalLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  totalValue: {
    color: '#bec4cf',
    fontSize: 30,
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  filtersContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#646e7d',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    marginLeft: 'auto',
  },
  clearButtonText: {
    color: '#2563EB',
    fontSize: 14,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#141b24',
  },
  emptyContainer: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
  },
  addItemButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
});
