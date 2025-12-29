import { db } from '@/services/firebase'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore'

export type ShoppingListDTO = {
  id: string
  name: string
  userId: string
  createdAt: Timestamp
}

type ShoppingList = {
  name: string
  userId: string
}

export async function createList(list: ShoppingList) {
  await addDoc(collection(db, 'lists'), {
    ...list,
    createdAt: Timestamp.now(),
  })
}

export async function listLists(userId: string): Promise<ShoppingListDTO[]> {
  const q = query(
    collection(db, 'lists'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ShoppingListDTO, 'id'>),
  }))
}

export function listenLists(
  userId: string,
  callback: (lists: ShoppingListDTO[]) => void
) {
  const q = query(
    collection(db, 'lists'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, snapshot => {
    const lists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ShoppingListDTO, 'id'>),
    }))
    callback(lists)
  })
}

export async function updateList(
  id: string,
  data: {
    name?: string
  }
) {
  await updateDoc(doc(db, 'lists', id), {
    ...data,
  })
}

export async function deleteList(id: string) {
  await deleteDoc(doc(db, 'lists', id))
}

