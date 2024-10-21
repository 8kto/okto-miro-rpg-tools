export enum Dice {
  d4 = 4,
  d6 = 6,
  d8 = 8,
  d10 = 10,
  d12 = 12,
  d20 = 20,
  d100 = 100,
}

type DiceOperationFn = (a: number, b: number) => number

type Operator = '+' | '-'

const Operations: Record<Operator, DiceOperationFn> = {
  '+': (a: number, b: number): number => a + b,
  '-': (a: number, b: number): number => a - b,
}

const operationRegExp = /([-+])/

/**
 * Generates a cryptographically secure random integer between min (inclusive) and max (inclusive)
 */
export const secureRandomInteger = (min: number, max: number): number => {
  const range = max - min + 1
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % range)
  let randomValue

  do {
    randomValue = crypto.getRandomValues(new Uint32Array(1))[0]
  } while (randomValue >= limit)

  return min + (randomValue % range)
}

export const roll = (dice = Dice.d100): number => secureRandomInteger(1, dice)

const isDiceRoll = (formula: string): boolean => /^d\d+$/.test(formula.trim())

const isInteger = (formula: string): boolean => !Number.isNaN(Number.parseInt(formula.trim(), 10))

const rollNumberOfDice = (formula: string): number => {
  const [numDice, numSides] = formula.split('d').map(Number)

  if (isNaN(numDice) || isNaN(numSides)) {
    throw new Error('Invalid dice formula')
  }

  let total = 0
  let i = 0
  do {
    total += roll(numSides)
  } while (++i < numDice)

  return total
}

const getTokens = (formula: string): string[] => formula.split(operationRegExp)

const resolveToken = (token: string): number | DiceOperationFn => {
  if (isDiceRoll(token)) {
    return rollNumberOfDice(token)
  }
  if (isInteger(token)) {
    return parseInt(token, 10)
  }
  if (token in Operations) {
    return Operations[token as Operator]
  }

  throw new Error(`Invalid token: ${token}`)
}

export const isValidDiceFormula = (formula: string): boolean => {
  const diceRollPattern = /^(\d*d\d+|\d+)((\s*[-+]\s*(\d*d\d+|\d+))\s*)*$/

  return diceRollPattern.test(formula.trim())
}

export const rollDiceFormula = (formula: string): number => {
  if (!isValidDiceFormula(formula)) {
    throw new Error('Invalid dice formula, allowed characters are +-, numbers and dices (d6 etc.)')
  }

  const tokens = getTokens(formula).map(resolveToken)

  let total = tokens[0] as number

  for (let i = 1; i < tokens.length; i += 2) {
    const operation = tokens[i] as DiceOperationFn
    const value = tokens[i + 1] as number

    if (!Number.isInteger(value) || !Number.isInteger(total) || typeof operation !== 'function') {
      console.error({ operation, tokens, total, value })
      throw new Error('Logic error, cannot parse tokens')
    }

    total = operation(total, value)
  }

  return total
}
