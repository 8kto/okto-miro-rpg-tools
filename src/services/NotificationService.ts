import { LogService } from "./LogService"

export class NotificationService {
  private static instance: NotificationService

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
    void LogService.getInstance().add(message)
  }

  async showMessageNamed(message: string) {
    const user = await miro.board.getUserInfo()
    this.showMessage(`${user.name}: ${message}`)
  }
}
