import { formatDiceRollResult } from "../format"

describe("format utils", () => {
  it("formats singular rolls", () => {
    expect(
      formatDiceRollResult({
        formula: "d6",
        total: 3,
        rolls: [
          {
            formula: "d6",
            rolls: [3],
            total: 3,
          },
        ],
      }),
    ).toBe("3")
  })

  it("formats complex rolls - grouped", () => {
    expect(
      formatDiceRollResult({
        formula: "3d6 + 2",
        total: 12,
        rolls: [
          {
            formula: "3d6",
            rolls: [3, 1, 6],
            total: 10,
          },
          {
            formula: "+2",
            rolls: [2],
            total: 2,
          },
        ],
      }),
    ).toBe("(3, 1, 6) + 2")
  })

  it("formats complex rolls - no groups", () => {
    expect(
      formatDiceRollResult({
        formula: "5d20",
        total: 49,
        rolls: [
          {
            formula: "5d20",
            rolls: [3, 1, 16, 20, 9],
            total: 49,
          },
        ],
      }),
    ).toBe("3, 1, 16, 20, 9")
  })

  it("formats complex rolls - groups with single entries", () => {
    expect(
      formatDiceRollResult({
        formula: "5d20 + d6 + 1",
        total: 53,
        rolls: [
          {
            formula: "5d20",
            rolls: [3, 1, 16, 20, 9],
            total: 49,
          },
          {
            formula: "+d6",
            rolls: [3],
            total: 3,
          },
          {
            formula: "+1",
            rolls: [1],
            total: 1,
          },
        ],
      }),
    ).toBe("(3, 1, 16, 20, 9) + 3 + 1")
  })

  it("formats complex rolls - groups with few entries", () => {
    expect(
      formatDiceRollResult({
        formula: "5d20 + 2d6 + 1",
        total: 59,
        rolls: [
          {
            formula: "5d20",
            rolls: [3, 1, 16, 20, 9],
            total: 49,
          },
          {
            formula: "+2d6",
            rolls: [3, 6],
            total: 9,
          },
          {
            formula: "+1",
            rolls: [1],
            total: 1,
          },
        ],
      }),
    ).toBe("(3, 1, 16, 20, 9) + (3, 6) + 1")
  })

  it("supports signed entries", () => {
    expect(
      formatDiceRollResult({
        formula: "5d20 - 2d6 - 1",
        total: 39,
        rolls: [
          {
            formula: "5d20",
            rolls: [3, 1, 16, 20, 9],
            total: 49,
          },
          {
            formula: "-2d6",
            rolls: [3, 6],
            total: -9,
          },
          {
            formula: "-1",
            rolls: [1],
            total: -1,
          },
        ],
      }),
    ).toBe("(3, 1, 16, 20, 9) - (3, 6) - 1")
  })

  it("does not parenthesize when there is only one group with multiple dice (2d6)", () => {
    expect(
      formatDiceRollResult({
        formula: "2d6",
        total: 9,
        rolls: [{ formula: "2d6", rolls: [3, 6], total: 9 }],
      }),
    ).toBe("3, 6")
  })

  it("does not parenthesize single-die groups even when there are multiple groups (d6 + d6)", () => {
    expect(
      formatDiceRollResult({
        formula: "d6 + d6",
        total: 7,
        rolls: [
          { formula: "d6", rolls: [3], total: 3 },
          { formula: "+d6", rolls: [4], total: 4 },
        ],
      }),
    ).toBe("3 + 4")
  })

  it("parenthesizes only the groups with >1 entries when multiple groups exist (2d6 + d4)", () => {
    expect(
      formatDiceRollResult({
        formula: "2d6 + d4",
        total: 13,
        rolls: [
          { formula: "2d6", rolls: [3, 6], total: 9 },
          { formula: "+d4", rolls: [4], total: 4 },
        ],
      }),
    ).toBe("(3, 6) + 4")
  })

  it("parenthesizes the second group if it has >1 entries (d4 + 2d6)", () => {
    expect(
      formatDiceRollResult({
        formula: "d4 + 2d6",
        total: 13,
        rolls: [
          { formula: "d4", rolls: [4], total: 4 },
          { formula: "+2d6", rolls: [3, 6], total: 9 },
        ],
      }),
    ).toBe("4 + (3, 6)")
  })

  it("handles a longer mixed chain with signs", () => {
    expect(
      formatDiceRollResult({
        formula: "d6 - d6 + 2d6 - 1 + d4",
        total: 13,
        rolls: [
          { formula: "d6", rolls: [3], total: 3 },
          { formula: "-d6", rolls: [-4], total: -4 },
          { formula: "+2d6", rolls: [5, 6], total: 11 },
          { formula: "-1", rolls: [-1], total: -1 },
          { formula: "+d4", rolls: [4], total: 4 },
        ],
      }),
    ).toBe("3 - 4 + (5, 6) - 1 + 4")
  })
})

export {}
