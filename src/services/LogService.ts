import { getStorage, ICollection } from "./Storage"

type LogData = {
  text: string
  timestamp: number
}

export type LogStorage = LogData[]

export class LogService {
  private static readonly STORAGE_NAME = "logs"
  private static readonly STORAGE_DATA_KEY = "data"

  private static instance: LogService

  private storage: ICollection
  private isStorageSet: boolean = false

  constructor() {
    this.storage = getStorage(LogService.STORAGE_NAME)
  }

  onAdd(cb: (messages?: string) => void) {
    return this.storage.onValue(LogService.STORAGE_DATA_KEY, cb)
  }

  offAdd(cb: (message?: string) => void) {
    return this.storage.offValue(LogService.STORAGE_DATA_KEY, cb)
  }

  static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService()
    }

    return LogService.instance
  }

  private async initStorage(): Promise<this> {
    if (this.isStorageSet) {
      return this
    }

    const data = await this.storage.get<LogStorage>(LogService.STORAGE_DATA_KEY)
    if (typeof data === "undefined") {
      await this.storage.set(LogService.STORAGE_DATA_KEY, [] as LogStorage)
      this.isStorageSet = true
    }

    return this
  }

  async add(message: string) {
    await this.initStorage()
    const storage = (await this.storage.get<LogStorage>(LogService.STORAGE_DATA_KEY)) as LogStorage

    storage.push({
      text: message,
      timestamp: new Date().getTime(),
    })
    await this.storage.set(LogService.STORAGE_DATA_KEY, storage.concat())
  }

  async reset(): Promise<this> {
    await this.storage.set(LogService.STORAGE_DATA_KEY, [])

    return this
  }
}
