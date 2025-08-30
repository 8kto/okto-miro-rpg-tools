import { NotificationService } from "../../services/NotificationService"
import { LogService } from "../../services/LogService"

export const getPrefixedResult = (total: number | null, str: string) => {
  let text = ""

  if (total) {
    text = total.toString() === str ? total.toString() : `${total} = ${str}`
  } else {
    text = str
  }

  return text
}

export const broadcastDiceRollResult = (formula: string, text: string) => {
  void LogService.getInstance().add({
    title: `(${formula})`,
    text,
  })

  const message = `(${formula}): ${text}`
  void NotificationService.getInstance().showMessageNamed(message)
  console.log(message)
}
