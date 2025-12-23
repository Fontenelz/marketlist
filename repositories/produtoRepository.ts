import { db } from '@/services/firebase'
import { eFilterStatus } from '@/types/FIlterStatus'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp, updateDoc } from 'firebase/firestore'

export type ProdutoDTO = {
  id: string
  nome: string
  quantidade: number
  status: eFilterStatus
  tipo: string
  valor: number
}

type Produto = {
  nome: string
  quantidade: number
  status: string
  tipo: string
  valor: number
}

export async function salvarProduto(produto: Produto) {
  await addDoc(collection(db, 'produtos'), {
    ...produto,
    criadoEm: Timestamp.now(),
  })
}

export async function listarProdutos(): Promise<ProdutoDTO[]> {
  const q = query(
    collection(db, 'produtos'),
    orderBy('criadoEm', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ProdutoDTO, 'id'>),
  }))
}

export async function atualizarProduto(
  id: string,
  dados: {
    quantidade?: number
    status?: string
  }
) {
  await updateDoc(doc(db, 'produtos', id), {
    ...dados,
  })
}

export function escutarProdutos(
  callback: (produtos: ProdutoDTO[]) => void
) {
  const q = query(
    collection(db, 'produtos'),
    orderBy('criadoEm', 'desc')
  )

  return onSnapshot(q, snapshot => {
    const produtos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ProdutoDTO, 'id'>),
    }))
    callback(produtos)
  })
}

export async function excluirProduto(id: string) {
  await deleteDoc(doc(db, 'produtos', id))
}