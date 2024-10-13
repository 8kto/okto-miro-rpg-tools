import { DiceAction } from "../../data/dices"
import { NotificationService } from "../../services/NotificationService"

type DiceBarProps = {
  dices: DiceAction[]
}

const handleDiceRollAction = (item: DiceAction) => {
  const res = item.action()
  const message = `Roll (${item.title}): ${res}`
  void NotificationService.getInstance().showMessageNamed(message)
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
