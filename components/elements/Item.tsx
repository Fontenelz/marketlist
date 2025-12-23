import { atualizarProduto, excluirProduto, ProdutoDTO } from "@/repositories/produtoRepository";
import { eFilterStatus } from "@/types/FIlterStatus";
import { calcularValorTotal, formatarValor } from "@/utils/itemCalculations";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../Themed";
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
          gap: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}>
          <View>
            <Text style={styles.description}>{data.nome}</Text>
            <Text style={styles.info}>R$ {data.valor}/{data.tipo}</Text>
          </View>
          <View style={styles.quantidadeItens}>
            <TouchableOpacity
              onPress={() => handleSubQuantidadeItem()}
              style={{ width: 20, height: 20, justifyContent: "center", alignItems: "center" }}
            >
              <Feather name="minus" color="#cccccc" size={16} />
            </TouchableOpacity>
            <Text style={{
              fontSize: 18
            }}>{quantidadeItem}</Text>
            <TouchableOpacity
              onPress={() => handleSomaQuantidadeItem()}
              style={{ width: 20, height: 20, justifyContent: "center", alignItems: "center" }}
            >
              <Feather name="plus" color="#cccccc" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.valorTotal}>{formatarValor(valorTotal)}</Text>
      <TouchableOpacity onPress={onDelete}>
        <Feather name="trash" size={22} color="red" />
      </TouchableOpacity>
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
    fontSize: 22,
    color: "#FFF"
  },
  info: {
    fontSize: 14,
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
    backgroundColor: "#141b24",
    borderRadius: 8,
    padding: 4
  },
  valorTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCCCCC',
  }
});
