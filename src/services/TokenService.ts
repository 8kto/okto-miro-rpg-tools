import { getStorage, ICollection } from "./Storage"

type TokenName = string
type TokenId = string
type TokenData = {
  damage: number
  no: number
}

type TokenStorage = Record<TokenName, Record<TokenId, TokenData>>
const STORAGE_KEY = "data"

export class TokenService {
  private static instance: TokenService
  private storage: ICollection
  private isStorageSet: boolean = false

  constructor() {
    this.storage = getStorage("tokens")
  }

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService()
    }

    return TokenService.instance
  }

  private async initStorage() {
    if (this.isStorageSet) {
      return
    }

    const data = await this.storage.get(STORAGE_KEY)
    if (typeof data === "undefined") {
      await this.storage.set(STORAGE_KEY, {} as TokenStorage)
      this.isStorageSet = true
    }
  }

  async addToken(tokenName: TokenName): Promise<string> {
    await this.initStorage()

    const storage = (await this.storage.get<TokenStorage>(STORAGE_KEY)) as TokenStorage
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

    let tokenId = `${tokenName} (${tokenNo})`
    if (!storage[tokenName][tokenId]) {
      storage[tokenName][tokenId] = { damage: 0, no: tokenNo }
    } else {
      throw new Error("Desynced storage items")
    }

    await this.storage.set(STORAGE_KEY, storage)

    return tokenId
  }

  async removeToken(name: TokenName, id: TokenId) {
    await this.initStorage()
    const storage = (await this.storage.get<TokenStorage>(STORAGE_KEY)) as TokenStorage

    const data = storage?.[name]?.[id]
    if (!data) {
      return
    }

    delete storage[name][id]
    await this.storage.set(STORAGE_KEY, storage)
  }
}
