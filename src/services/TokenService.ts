import { getStorage, ICollection } from "./Storage"

type TokenName = string
type TokenId = string
type TokenData = {
  no: number
}

type TokenStorage = Record<TokenName, Record<TokenId, TokenData>>

export class TokenService {
  private static readonly STORAGE_NAME = "tokens"
  private static readonly STORAGE_DATA_KEY = "data"

  private static instance: TokenService
  private storage: ICollection
  private isStorageSet: boolean = false

  constructor() {
    this.storage = getStorage(TokenService.STORAGE_NAME)
  }

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService()
    }

    return TokenService.instance
  }

  private async initStorage(): Promise<this> {
    if (this.isStorageSet) {
      return this
    }

    const data = await this.storage.get(TokenService.STORAGE_DATA_KEY)
    if (typeof data === "undefined") {
      await this.storage.set(TokenService.STORAGE_DATA_KEY, {} as TokenStorage)
      this.isStorageSet = true
    }

    return this
  }

  async addToken(tokenName: TokenName): Promise<TokenId> {
    await this.initStorage()

    const storage = (await this.storage.get<TokenStorage>(TokenService.STORAGE_DATA_KEY)) as TokenStorage
    let tokenNo: number

    if (!storage[tokenName]) {
      storage[tokenName] = {}
      tokenNo = 1
    } else {
      // Linked list would handle that better
      const items = Object.values(storage[tokenName])
      const maxNumber = items.length ? Math.max(...items.map((v) => v.no)) : 0
      tokenNo = maxNumber + 1
    }

    const tokenId = `${tokenName} (${tokenNo})`
    if (!storage[tokenName][tokenId]) {
      storage[tokenName][tokenId] = { no: tokenNo }
    } else {
      throw new Error("Desynced storage items")
    }

    await this.storage.set(TokenService.STORAGE_DATA_KEY, storage)

    return tokenId
  }

  async removeToken(name: TokenName, id: TokenId) {
    await this.initStorage()
    const storage = (await this.storage.get<TokenStorage>(TokenService.STORAGE_DATA_KEY)) as TokenStorage

    const data = storage?.[name]?.[id]
    if (!data) {
      return
    }

    delete storage[name][id]
    await this.storage.set(TokenService.STORAGE_DATA_KEY, storage)
  }

  async reset(): Promise<this> {
    await this.storage.set(TokenService.STORAGE_DATA_KEY, {})

    return this
  }
}
