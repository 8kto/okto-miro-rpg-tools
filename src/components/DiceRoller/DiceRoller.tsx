import { DiceAction } from "../../data/dices"
import { NotificationService } from "../../services/NotificationService"
import { LogService } from "../../services/LogService"
import { useState } from "preact/hooks"
import { rollDiceFormula } from "ttrpg-lib-dice"

type DiceBarProps = {
  dices: DiceAction[]
}

const handleDiceRollAction = (item: DiceAction) => {
  const diceRollResult = item.action()
  const message = `Roll (${item.title}): ${diceRollResult}`

  void NotificationService.getInstance().showMessageNamed(message)
  void LogService.getInstance().add({
    title: `(${item.title})`,
    text: diceRollResult,
  })

  console.log(message)
}

const handleCustomFormulaEnter = (event: Event) => {
  const target = event.target as HTMLInputElement
  if ((event as KeyboardEvent).key === "Enter") {
    const formula = target.value
    const diceRollResult = rollDiceFormula(formula)

    const message = `Roll (${formula}): ${diceRollResult}`

    void NotificationService.getInstance().showMessageNamed(message)
    void LogService.getInstance().add({
      title: `Roll (${formula})`,
      text: diceRollResult,
    })

    console.log(message)
  }
}

const DiceBar = ({ dices }: DiceBarProps) => {
  const primaryButtons = dices.filter((d) => !d.type || d.type === "primary")
  const secondaryButtons = dices.filter((d) => d.type === "secondary")

  const [customFormula, setCustomFormula] = useState("")

  const handleCustomFormulaChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    setCustomFormula(target.value)
  }

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
      <div className="form-group m-medium">
        <input
          className="input input-small"
          type="text"
          placeholder="Custom formula"
          onChange={handleCustomFormulaChange}
          onKeyDown={handleCustomFormulaEnter}
          value={customFormula}
        />
      </div>
    </>
  )
}

export default DiceBar
