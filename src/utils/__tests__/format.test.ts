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
          },{
            formula: "+d6",
            rolls: [3],
            total: 3,
          },{
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
          },{
            formula: "+2d6",
            rolls: [3, 6],
            total: 9,
          },{
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
          },{
            formula: "-2d6",
            rolls: [3, 6],
            total: -9,
          },{
            formula: "-1",
            rolls: [1],
            total: -1,
          },
        ],
      }),
    ).toBe("(3, 1, 16, 20, 9) - (3, 6) - 1")
  })
})

export {}
