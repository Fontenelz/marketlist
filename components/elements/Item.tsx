import { atualizarProduto, excluirProduto, ProdutoDTO } from "@/repositories/produtoRepository";
import { eFilterStatus } from "@/types/FIlterStatus";
import { calcularValorTotal, formatarValor } from "@/utils/itemCalculations";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input, Text } from "../Themed";
import { StatusIcon } from "./StatusIcon";

type props = {
  itemId: string;
  data: ProdutoDTO,
}

export function Item({ itemId, data }: props) {
  const [quantidadeItem, setQuantidadeItem] = useState(data.quantidade ?? 0);

  // Sincroniza a quantidade quando o data.quantidade mudar
  useEffect(() => {
    setQuantidadeItem(data.quantidade);
  }, [data.quantidade]);

  // Calcula o valor total baseado na quantidade e tipo
  const valorTotal = calcularValorTotal(quantidadeItem, data.tipo, data.valor);

  function handleSomaQuantidadeItem() {
    const newQuantity = quantidadeItem + 1;
    setQuantidadeItem(newQuantity);
    atualizarProduto(itemId, {
      quantidade: newQuantity
    })
  }

  function handleSubQuantidadeItem() {
    if (quantidadeItem > 0) {
      const newQuantity = quantidadeItem - 1;
      setQuantidadeItem(newQuantity);
      atualizarProduto(itemId, {
        quantidade: newQuantity
      })
    }
  }

  function onStatusChange() {
    if (data.status === eFilterStatus.PENDING) {
      atualizarProduto(itemId, {
        status: eFilterStatus.COMPLETED
      })
    } else {
      atualizarProduto(itemId, {
        status: eFilterStatus.PENDING
      })
    }
  }

  async function onDelete() {
    await excluirProduto(itemId);
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
              <Text style={styles.description}>{data.nome}</Text>

              <TouchableOpacity onPress={onDelete}>
                <Feather name="trash" size={16} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={styles.info}>R$ {data.valor}/{data.tipo}</Text>

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
                onPress={() => handleSubQuantidadeItem()}
                style={{ width: 12, height: 12, justifyContent: "center", alignItems: "center" }}
              >
                <Feather name="minus" color="#cccccc" size={12} />
              </TouchableOpacity>
              <Text style={{
                fontSize: 12
              }}>{quantidadeItem}</Text>
              <TouchableOpacity
                onPress={() => handleSomaQuantidadeItem()}
                style={{ width: 12, height: 12, justifyContent: "center", alignItems: "center" }}
              >
                <Feather name="plus" color="#cccccc" size={12} />
              </TouchableOpacity>
            </Input>
            <Text style={styles.valorTotal}>{formatarValor(valorTotal)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
