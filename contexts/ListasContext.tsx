import { escutarListas, ListaDTO } from '@/repositories/listaRepository';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

type ListasContextType = {
  listas: ListaDTO[];
  listaAtual: ListaDTO | null;
  setListaAtual: (lista: ListaDTO | null) => void;
  criarLista: (nome: string) => Promise<void>;
  atualizarLista: (id: string, nome: string) => Promise<void>;
  excluirLista: (id: string) => Promise<void>;
  loading: boolean;
};

const ListasContext = createContext<ListasContextType | undefined>(undefined);

type ListasProviderProps = {
  children: ReactNode;
};

export function ListasProvider({ children }: ListasProviderProps) {
  const { user } = useAuth();
  const [listas, setListas] = useState<ListaDTO[]>([]);
  const [listaAtual, setListaAtual] = useState<ListaDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setListas([]);
      setListaAtual(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = escutarListas(user.uid, (listasAtualizadas) => {
      setListas(listasAtualizadas);

      // Se não há lista atual e há listas disponíveis, seleciona a primeira
      if (!listaAtual && listasAtualizadas.length > 0) {
        setListaAtual(listasAtualizadas[0]);
      }

      // Se a lista atual foi deletada, seleciona a primeira disponível
      if (listaAtual && !listasAtualizadas.find(l => l.id === listaAtual.id)) {
        setListaAtual(listasAtualizadas.length > 0 ? listasAtualizadas[0] : null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [user, listaAtual]);

  const criarLista = async (nome: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { criarLista: criarListaRepo } = await import('@/repositories/listaRepository');
    await criarListaRepo({
      nome: nome.trim(),
      userId: user.uid,
    });
  };

  const atualizarLista = async (id: string, nome: string) => {
    const { atualizarLista: atualizarListaRepo } = await import('@/repositories/listaRepository');
    await atualizarListaRepo(id, { nome: nome.trim() });
  };

  const excluirLista = async (id: string) => {
    const { excluirLista: excluirListaRepo } = await import('@/repositories/listaRepository');
    await excluirListaRepo(id);
  };

  const value = useMemo(
    () => ({
      listas,
      listaAtual,
      setListaAtual,
      criarLista,
      atualizarLista,
      excluirLista,
      loading,
    }),
    [listas, listaAtual, loading]
  );

  return <ListasContext.Provider value={value}>{children}</ListasContext.Provider>;
}

export function useListas() {
  const context = useContext(ListasContext);
  if (context === undefined) {
    throw new Error('useListas must be used within a ListasProvider');
  }
  return context;
}

