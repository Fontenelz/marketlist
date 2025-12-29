import { listenProducts, ProductDTO } from '@/repositories/productRepository';
import { eFilterStatus } from '@/types/FIlterStatus';
import { calculateTotalValue } from '@/utils/itemCalculations';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLists } from './ListsContext';

type ItemsContextType = {
  items: ProductDTO[];
  setItems: (items: ProductDTO[]) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  // addItem: (item: Omit<ProductDTO, 'id'>) => void;
  getTotalByFilter: (filter: eFilterStatus) => number;
  getFilteredItems: (filter: eFilterStatus) => ProductDTO[];
  clearItems: () => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

type ItemsProviderProps = {
  children: ReactNode;
  initialItems?: ProductDTO[];
};

export function ItemsProvider({ children, initialItems = [] }: ItemsProviderProps) {
  const { currentList } = useLists();
  const [items, setItems] = useState<ProductDTO[]>(initialItems);

  useEffect(() => {
    if (!currentList) {
      setItems([]);
      return;
    }

    const unsubscribe = listenProducts(currentList.id, setItems);
    return unsubscribe;
  }, [currentList])

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  // const addItem = (item: Omit<ProductDTO, 'id'>) => {
  //   const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  //   const newItem: Item = {
  //     ...item,
  //     id: newId,
  //   };
  //   setItems((prevItems) => [...prevItems, newItem]);
  // };

  const getFilteredItems = (filter: eFilterStatus): ProductDTO[] => {
    if (filter === eFilterStatus.ALL) {
      return items;
    }
    return items.filter((item) => item.status === filter);
  };

  const getTotalByFilter = (filter: eFilterStatus): number => {
    const filteredItems = getFilteredItems(filter);
    return filteredItems.reduce((total, item) => {
      const itemTotal = calculateTotalValue(item.quantity, item.type, item.price);
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

