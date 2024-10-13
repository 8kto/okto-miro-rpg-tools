export type ICollection = ReturnType<typeof miro.board.storage.collection>

export const getStorage = (name: string): ICollection => {
  const tokensStorage = miro.board.storage.collection(name)

  return tokensStorage
}
