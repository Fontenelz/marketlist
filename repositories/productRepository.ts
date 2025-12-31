import { db } from '@/services/firebase'
import { eFilterStatus } from '@/types/FIlterStatus'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore'

export type ProductDTO = {
  id: string
  name: string
  quantity: number
  status: eFilterStatus
  type: string
  price: number
  listId: string
  userId: string
}

type Product = {
  name: string
  quantity: number
  status: string
  type: string
  price: number
  listId: string
  userId: string
}

export async function saveProduct(product: Product) {
  await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: Timestamp.now(),
  })
}

export async function listProducts(): Promise<ProductDTO[]> {
  const q = query(
    collection(db, 'products'),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ProductDTO, 'id'>),
  }))
}

export async function updateProduct(
  id: string,
  data: {
    quantity?: number
    status?: string
  }
) {
  await updateDoc(doc(db, 'products', id), {
    ...data,
  })
}

export function listenProducts(
  listId: string,
  callback: (products: ProductDTO[]) => void
) {
  const q = query(
    collection(db, 'products'),
    where('listId', '==', listId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, snapshot => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ProductDTO, 'id'>),
    }))
    callback(products)
  })
}

export function listenAllProducts(
  userId: string,
  callback: (products: ProductDTO[]) => void
) {
  const q = query(
    collection(db, 'products'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, snapshot => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ProductDTO, 'id'>),
    }))
    callback(products)
  })
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id))
}

