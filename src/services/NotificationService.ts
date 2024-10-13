export class NotificationService {
  private static instance: NotificationService

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }

    return NotificationService.instance
  }

  async showMessage(message: string) {
    await miro.board.events.broadcast("message", message)
    await miro.board.notifications.show({
      message: message,
      // @ts-ignore
      type: "info",
    })
  }
}
