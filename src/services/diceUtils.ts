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

type Operator = "+" | "-"

const Operations: Record<Operator, DiceOperationFn> = {
  "+": (a: number, b: number): number => a + b,
  "-": (a: number, b: number): number => a - b,
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

export const getRandomArrayItem = <T = unknown>(arr: Array<T>): T => {
  if (!arr.length) {
    throw new Error("Empty array")
  }

  return arr[secureRandomInteger(0, arr.length - 1)]
}

export const getRandomArrayItems = <T = unknown>(arr: Array<T>, count: number): Array<T> => {
  if (count > arr.length) {
    throw new Error("Requested more elements than are present in the array")
  }
  if (!count) {
    throw new Error("Count should be more than 0")
  }

  const result: Array<T> = []
  const usedIndices = new Set<number>()

  while (result.length < count) {
    const index = secureRandomInteger(0, arr.length - 1)
    if (!usedIndices.has(index)) {
      usedIndices.add(index)
      result.push(arr[index])
    }
  }

  return result
}

export const roll = (dice = Dice.d100): number => secureRandomInteger(1, dice)

const isDiceRoll = (formula: string): boolean => /^\d*d\d+$/.test(formula.trim())

const isInteger = (formula: string): boolean => /^\d+$/.test(formula.trim())

const rollNumberOfDice = (formula: string): number => {
  const [numDice, numSides] = formula.split("d").map(Number)

  if (isNaN(numDice) || isNaN(numSides)) {
    throw new Error("Invalid dice formula")
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
    throw new Error("Invalid dice formula, allowed characters are +-, numbers and dices (d6 etc.)")
  }

  const tokens = getTokens(formula).map(resolveToken)

  let total = tokens[0] as number

  for (let i = 1; i < tokens.length; i += 2) {
    const operation = tokens[i] as DiceOperationFn
    const value = tokens[i + 1] as number

    if (!Number.isInteger(value) || !Number.isInteger(total) || typeof operation !== "function") {
      console.error({ operation, tokens, total, value })
      throw new Error("Logic error, cannot parse tokens")
    }

    total = operation(total, value)
  }

  return total
}

type DiceRollResult = [string, number, number[]]
type DiceRollResultsList = DiceRollResult[]

export const rollDiceFormulaDetailed = (formula: string): DiceRollResultsList => {
  if (!isValidDiceFormula(formula)) {
    // throw new Error('Invalid dice formula, allowed characters are +-, numbers and dices (d6 etc.)')
  }

  const subFormulas = formula.split(",")
  const res = subFormulas.map((subFormula) => {
    const tokens = getTokens(subFormula).map(resolveToken) // FIXME

    const res: DiceRollResult = [subFormula, tokens[0] as number, [tokens[0] as number]]

    for (let i = 1; i < tokens.length; i += 2) {
      const operation = tokens[i] as DiceOperationFn
      const value = tokens[i + 1] as number

      if (!Number.isInteger(value) || !Number.isInteger(res) || typeof operation !== "function") {
        console.error({ operation, tokens, total: res, value })
        throw new Error("Logic error, cannot parse tokens")
      }

      res[1] = operation(res[1], value)
      res[2].push(value)
    }

    return res
  })

  return res as object as DiceRollResultsList
}
