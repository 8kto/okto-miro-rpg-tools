import type { DiceRollResults } from "ttrpg-lib-dice"

export const formatDiceRollResult = (diceRoll: DiceRollResults): string => {
  const groups = diceRoll.rolls
  const hasManyGroups = groups.length > 1
  const parts: string[] = []

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    const token = group.formula.trim()
    const isDice = token.toLowerCase().includes("d")
    const sign = i === 0 ? "" : ( token.startsWith("-") ? "-" : "+" )
    const prefix = i === 0 ? "" : ` ${sign} `

    if (!isDice) {
      // Integer term: single value; display absolute
      parts.push(prefix + String(Math.abs(group.total)))
      continue
    }

    // Dice term: show individual rolls as absolute values
    const rolls = group.rolls.map(v => Math.abs(v))
    const body = rolls.join(', ')

    // Parenthesize only if multiple groups overall AND this group has >1 entries
    const withParens = hasManyGroups && rolls.length > 1 ? `(${body})` : body

    parts.push(prefix + withParens)
  }

  return parts.join("")
}
