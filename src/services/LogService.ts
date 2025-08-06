import { getStorage, ICollection } from "./Storage"
import { UserService } from "./UserService"

export type LogRecord = {
  title: string
  text: string | number
  timestamp: number
  user: string
}

export type LogStorage = LogRecord[]

export class LogService {
  private static readonly STORAGE_NAME = "logs"
  private static readonly STORAGE_DATA_KEY = "data"

  private static instance: LogService

  private readonly userService: UserService
  private readonly storage: ICollection

  private isStorageSet: boolean = false
  private handleAddLog: (records?: LogRecord[]) => void = () => {
    /* noop */
  }

  constructor() {
    this.storage = getStorage(LogService.STORAGE_NAME)
    this.userService = UserService.getInstance()
  }

  onAdd(cb: (messages?: LogRecord[]) => void) {
    this.handleAddLog = cb
    void this.storage.onValue(LogService.STORAGE_DATA_KEY, this.handleAddLog)

    return () => {
      this.handleAddLog = () => {
        /*noop*/
      }
    }
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

    const logs = await this.storage.get<LogStorage>(LogService.STORAGE_DATA_KEY)
    if (typeof logs === "undefined") {
      await this.storage.set(LogService.STORAGE_DATA_KEY, [] as LogStorage)
      this.isStorageSet = true
    }

    return this
  }

  async add(log: Omit<LogRecord, "timestamp" | "user">) {
    await this.initStorage()
    const [logs, user] = await Promise.all([
      this.storage.get<LogStorage>(LogService.STORAGE_DATA_KEY),
      this.userService.getCurrentUser(),
    ])

    if (!logs) {
      // massage tsc
      return
    }

    const record = {
      ...log,
      user: user.name,
      timestamp: new Date().getTime(),
    }
    logs.push(record)

    await this.storage.set(LogService.STORAGE_DATA_KEY, logs)
  }

  async reset(): Promise<this> {
    await this.storage.set(LogService.STORAGE_DATA_KEY, [])

    return this
  }

  async getLogs(): Promise<LogStorage> {
    const logs = await this.storage.get<LogStorage>(LogService.STORAGE_DATA_KEY)

    return (logs || []) as LogStorage
  }
}
