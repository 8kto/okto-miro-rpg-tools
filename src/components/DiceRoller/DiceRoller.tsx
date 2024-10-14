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
    text: diceRollResult,
  })

  console.log(message)
}

const DiceBar = ({ dices }: DiceBarProps) => {
  const primaryButtons = dices.filter((d) => !d.type || d.type === "primary")
  const secondaryButtons = dices.filter((d) => d.type === "secondary")

  return (
    <>
      <div className="dice-bar">
        {primaryButtons.map((diceAction, index) => (
          <button
            key={index}
            onClick={() => handleDiceRollAction(diceAction)}
            className={`button button--dice-roller ${diceAction.type === "secondary" ? "button-secondary" : "button-danger"}`}
          >
            {diceAction.title}
          </button>
        ))}
      </div>

      {!!secondaryButtons.length && (
        <div className="dice-bar mt-medium">
          {secondaryButtons.map((diceAction, index) => (
            <button
              key={index}
              onClick={() => handleDiceRollAction(diceAction)}
              className={`button button--dice-roller ${diceAction.type === "secondary" ? "button-secondary" : "button-danger"}`}
            >
              {diceAction.title}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default DiceBar
