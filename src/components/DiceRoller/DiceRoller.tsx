import { DiceAction } from "../../data/dices"
import { useState } from "preact/hooks"
import { rollDiceFormulaDetailed } from "ttrpg-lib-dice"
import { formatDiceRollResult } from "../../utils/format"
import { broadcastDiceRollResult, getPrefixedResult } from "./utils"

type DiceBarProps = {
  dices: DiceAction[]
}

const handleDiceRollAction = (item: DiceAction) => {
  const formula = item.title
  const text = getPrefixedResult(...item.action())

  broadcastDiceRollResult(formula, text)
}

const handleCustomFormulaEnter = (event: Event) => {
  const target = event.target as HTMLInputElement
  if ((event as KeyboardEvent).key === "Enter") {
    const formula = target.value
    const res = rollDiceFormulaDetailed(formula)
    const text = getPrefixedResult(res.total, formatDiceRollResult(res))

    broadcastDiceRollResult(formula, text)
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
