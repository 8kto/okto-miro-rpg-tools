import { UserService } from "./UserService"

export class NotificationService {
  private static instance: NotificationService
  private readonly userService: UserService

  constructor() {
    this.userService = UserService.getInstance()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }

    return NotificationService.instance
  }

  async showMessage(message: string) {
    void miro.board.events.broadcast("message", message)
    void miro.board.notifications.show({
      message: message,
      // @ts-ignore
      type: "info",
    })
  }

  async showMessageNamed(message: string) {
    const user = await this.userService.getCurrentUser()
    return this.showMessage(`${user.name}: ${message}`)
  }
}
