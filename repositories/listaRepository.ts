import { db } from '@/services/firebase'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore'

export type ListaDTO = {
  id: string
  nome: string
  userId: string
  criadoEm: Timestamp
}

type Lista = {
  nome: string
  userId: string
}

export async function criarLista(lista: Lista) {
  await addDoc(collection(db, 'listas'), {
    ...lista,
    criadoEm: Timestamp.now(),
  })
}

export async function listarListas(userId: string): Promise<ListaDTO[]> {
  const q = query(
    collection(db, 'listas'),
    where('userId', '==', userId),
    orderBy('criadoEm', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ListaDTO, 'id'>),
  }))
}

export function escutarListas(
  userId: string,
  callback: (listas: ListaDTO[]) => void
) {
  const q = query(
    collection(db, 'listas'),
    where('userId', '==', userId),
    orderBy('criadoEm', 'desc')
  )

  return onSnapshot(q, snapshot => {
    const listas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ListaDTO, 'id'>),
    }))
    callback(listas)
  })
}

export async function atualizarLista(
  id: string,
  dados: {
    nome?: string
  }
) {
  await updateDoc(doc(db, 'listas', id), {
    ...dados,
  })
}

export async function excluirLista(id: string) {
  await deleteDoc(doc(db, 'listas', id))
}

