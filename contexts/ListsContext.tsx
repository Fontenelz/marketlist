import { listenLists, ShoppingListDTO } from '@/repositories/listRepository';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

type ListsContextType = {
  lists: ShoppingListDTO[];
  currentList: ShoppingListDTO | null;
  setCurrentList: (list: ShoppingListDTO | null) => void;
  createList: (name: string) => Promise<void>;
  updateList: (id: string, name: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  loading: boolean;
};

const ListsContext = createContext<ListsContextType | undefined>(undefined);

type ListsProviderProps = {
  children: ReactNode;
};

export function ListsProvider({ children }: ListsProviderProps) {
  const { user } = useAuth();
  const [lists, setLists] = useState<ShoppingListDTO[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingListDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLists([]);
      setCurrentList(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenLists(user.uid, (updatedLists) => {
      setLists(updatedLists);

      // If there's no current list and there are lists available, select the first one
      if (!currentList && updatedLists.length > 0) {
        setCurrentList(updatedLists[0]);
      }

      // If the current list was deleted, select the first available one
      if (currentList && !updatedLists.find(l => l.id === currentList.id)) {
        setCurrentList(updatedLists.length > 0 ? updatedLists[0] : null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [user, currentList]);

  const createList = async (name: string) => {
    if (!user) throw new Error('User not authenticated');

    const { createList: createListRepo } = await import('@/repositories/listRepository');
    await createListRepo({
      name: name.trim(),
      userId: user.uid,
    });
  };

  const updateList = async (id: string, name: string) => {
    const { updateList: updateListRepo } = await import('@/repositories/listRepository');
    await updateListRepo(id, { name: name.trim() });
  };

  const deleteList = async (id: string) => {
    const { deleteList: deleteListRepo } = await import('@/repositories/listRepository');
    await deleteListRepo(id);
  };

  const value = useMemo(
    () => ({
      lists,
      currentList,
      setCurrentList,
      createList,
      updateList,
      deleteList,
      loading,
    }),
    [lists, currentList, loading]
  );

  return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
}

export function useLists() {
  const context = useContext(ListsContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider');
  }
  return context;
}

