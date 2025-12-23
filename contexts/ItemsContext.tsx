import { escutarProdutos, ProdutoDTO } from '@/repositories/produtoRepository';
import { eFilterStatus } from '@/types/FIlterStatus';
import { calcularValorTotal } from '@/utils/itemCalculations';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type ItemsContextType = {
  items: ProdutoDTO[];
  setItems: (items: ProdutoDTO[]) => void;
  updateItemQuantity: (itemId: string, quantidade: number) => void;
  // addItem: (item: Omit<ProdutoDTO, 'id'>) => void;
  getTotalByFilter: (filter: eFilterStatus) => number;
  getFilteredItems: (filter: eFilterStatus) => ProdutoDTO[];
  clearItems: () => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

type ItemsProviderProps = {
  children: ReactNode;
  initialItems?: ProdutoDTO[];
};

export function ItemsProvider({ children, initialItems = [] }: ItemsProviderProps) {
  const [items, setItems] = useState<ProdutoDTO[]>(initialItems);

  useEffect(() => {
    const unsubscribe = escutarProdutos(setItems)
    return unsubscribe
  }, [])

  const updateItemQuantity = (itemId: string, quantidade: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantidade: Math.max(0, quantidade) } : item
      )
    );
  };

  // const addItem = (item: Omit<ProdutoDTO, 'id'>) => {
  //   const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  //   const newItem: Item = {
  //     ...item,
  //     id: newId,
  //   };
  //   setItems((prevItems) => [...prevItems, newItem]);
  // };

  const getFilteredItems = (filter: eFilterStatus): ProdutoDTO[] => {
    if (filter === eFilterStatus.ALL) {
      return items;
    }
    return items.filter((item) => item.status === filter);
  };

  const getTotalByFilter = (filter: eFilterStatus): number => {
    const filteredItems = getFilteredItems(filter);
    return filteredItems.reduce((total, item) => {
      const itemTotal = calcularValorTotal(item.quantidade, item.tipo, item.valor);
      return total + itemTotal;
    }, 0);
  };

  const clearItems = () => {
    setItems([]);
  };

  const value = useMemo(
    () => ({
      items,
      setItems,
      updateItemQuantity,
      getTotalByFilter,
      getFilteredItems,
      clearItems,
    }),
    [items]
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}

