import { DiceAction } from "../../data/dices"
import { NotificationService } from "../../services/NotificationService"
import { LogService } from "../../services/LogService"

type DiceBarProps = {
  dices: DiceAction[]
}

const handleDiceRollAction = (item: DiceAction) => {
  const diceRollResult = item.action()
  const message = `Roll (${item.title}): ${diceRollResult}`

  void NotificationService.getInstance().showMessageNamed(message)
  void LogService.getInstance().add({
    title: `Roll (${item.title})`,
    text: diceRollResult
  })

  console.log(message)
}

const DiceBar = ({ dices }: DiceBarProps) => {
  return (
    <div className="dice-bar">
      {dices.map((diceAction, index) => (
        <button
          key={index}
          onClick={() => handleDiceRollAction(diceAction)}
          className="button button-smallxxx button-danger button--dice-roller"
        >
          {diceAction.title}
        </button>
      ))}
    </div>
  )
}

export default DiceBar
