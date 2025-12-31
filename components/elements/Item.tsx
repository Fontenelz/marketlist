import { deleteProduct, ProductDTO, updateProduct } from "@/repositories/productRepository";
import { eFilterStatus } from "@/types/FIlterStatus";
import { calculateTotalValue, formatValue } from "@/utils/itemCalculations";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input, Text } from "../Themed";
import { StatusIcon } from "./StatusIcon";

type props = {
  itemId: string;
  data: ProductDTO,
}

export function Item({ itemId, data }: props) {
  const [itemQuantity, setItemQuantity] = useState(data.quantity ?? 0);

  // Syncs quantity when data.quantity changes
  useEffect(() => {
    setItemQuantity(data.quantity);
  }, [data.quantity]);

  // Calculates total value based on quantity and type
  const totalValue = calculateTotalValue(itemQuantity, data.type, data.price);

  function handleIncrementQuantity() {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    updateProduct(itemId, {
      quantity: newQuantity
    })
  }

  function handleDecrementQuantity() {
    if (itemQuantity > 0) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      updateProduct(itemId, {
        quantity: newQuantity
      })
    }
  }

  function onStatusChange() {
    if (data.status === eFilterStatus.PENDING) {
      updateProduct(itemId, {
        status: eFilterStatus.COMPLETED
      })
    } else {
      updateProduct(itemId, {
        status: eFilterStatus.PENDING
      })
    }
  }

  async function onDelete() {
    await deleteProduct(itemId);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onStatusChange}>
        <StatusIcon status={data.status} size={24} />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={{
          gap: 12,
        }}>
          <View
            style={{
              gap: 2,
            }}
          >
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: 4,
              justifyContent: "space-between",
            }}>
              <Text style={styles.description}>{data.name}</Text>

              <TouchableOpacity onPress={onDelete}>
                <Feather name="trash" size={16} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={styles.info}>R$ {data.price}/{data.type}</Text>

          </View>

          <View
            style={{
              gap: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <Input style={styles.quantidadeItens}>
              <TouchableOpacity
                onPress={() => handleDecrementQuantity()}
                style={{ width: 12, height: 12, justifyContent: "center", alignItems: "center" }}
              >
                <Feather name="minus" color="#cccccc" size={12} />
              </TouchableOpacity>
              <Text style={{
                fontSize: 12
              }}>{itemQuantity}</Text>
              <TouchableOpacity
                onPress={() => handleIncrementQuantity()}
                style={{ width: 12, height: 12, justifyContent: "center", alignItems: "center" }}
              >
                <Feather name="plus" color="#cccccc" size={12} />
              </TouchableOpacity>
            </Input>
            <Text style={styles.valorTotal}>{formatValue(totalValue)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    gap: 12
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  description: {
    fontSize: 14,
  },
  info: {
    fontSize: 12,
    color: "#757575"
  },
  deleteButton: {
    color: '#EF4444',
    fontSize: 20,
  },
  quantidadeItens: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 4
  },
  valorTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#CCCCCC',
  }
});
