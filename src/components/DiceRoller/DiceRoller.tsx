import { DiceAction } from "../../data/dices"
import { useEffect, useState } from "preact/hooks"
import { rollDiceFormulaDetailed } from "ttrpg-lib-dice"
import { formatDiceRollResult } from "../../utils/format"
import { broadcastDiceRollResult, getPrefixedResult } from "./utils"
import { useRef } from "preact/compat"

type DiceBarProps = {
  dices: DiceAction[]
}

const HISTORY_STORAGE_KEY = "diceFormulaHistory"
const MAX_HISTORY = 100

const handleDiceRollAction = (item: DiceAction) => {
  const formula = item.title
  const text = getPrefixedResult(...item.action())
  broadcastDiceRollResult(formula, text)
}

const DiceBar = ({ dices }: DiceBarProps) => {
  const primaryButtons = dices.filter((d) => !d.type || d.type === "primary")
  const secondaryButtons = dices.filter((d) => d.type === "secondary")

  const [customFormula, setCustomFormula] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  // Load history from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setHistory(parsed.filter((x) => typeof x === "string"))
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, [])

  const persistHistory = (next: string[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage may be unavailable; ignore
    }
  }

  const pushToHistory = (value: string) => {
    const v = value.trim()
    if (!v) return

    // de-duplicate; keep latest occurrence at the end
    let next = history.filter((h) => h !== v)
    next.push(v)
    if (next.length > MAX_HISTORY) {
      next = next.slice(next.length - MAX_HISTORY)
    }

    setHistory(next)
    persistHistory(next)
  }

  const rollNow = (formulaRaw: string) => {
    const formula = formulaRaw.trim()
    if (!formula) return

    const res = rollDiceFormulaDetailed(formula)
    const text = getPrefixedResult(res.total, formatDiceRollResult(res))
    broadcastDiceRollResult(formula, text)

    pushToHistory(formula)
  }

  const handleCustomFormulaChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    setCustomFormula(target.value)
    // Typing cancels an active history selection
    if (historyIndex !== -1) setHistoryIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const formula = customFormula.trim()
      if (formula.length > 0) {
        const res = rollDiceFormulaDetailed(formula)
        const text = getPrefixedResult(res.total, formatDiceRollResult(res))
        broadcastDiceRollResult(formula, text)

        pushToHistory(formula)
        setHistoryIndex(-1)
        setIsHistoryOpen(false)
      }
      return
    }

    if (event.key === "ArrowUp") {
      if (history.length === 0) return
      event.preventDefault()
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setCustomFormula(history[nextIndex] ?? "")
      return
    }

    if (event.key === "ArrowDown") {
      if (history.length === 0) return
      event.preventDefault()
      if (historyIndex === -1) {
        // already at blank; keep it blank
        return
      }
      const nextIndex = historyIndex + 1
      if (nextIndex >= history.length) {
        // move to blank line after last item
        setHistoryIndex(-1)
        setCustomFormula("")
      } else {
        setHistoryIndex(nextIndex)
        setCustomFormula(history[nextIndex] ?? "")
      }
      return
    }
  }

  const onHistoryPick = (value: string) => {
    setCustomFormula(value)
    setHistoryIndex(-1)
    setIsHistoryOpen(false)
    // keep focus on input for quick Enter
    inputRef.current?.focus()
    rollNow(value)
  }

  const clearHistory = () => {
    setHistory([])
    persistHistory([])
  }

  return (
    <>
      {/* Primary dice grid */}
      <div className="diceui-grid mb-small">
        {primaryButtons.map((diceAction, index) => (
          <button
            key={index}
            onClick={() => handleDiceRollAction(diceAction)}
            className="diceui-btn diceui-btn--primary"
            title={`Roll ${diceAction.title}`}
          >
            {diceAction.title}
          </button>
        ))}
      </div>

      {!!secondaryButtons.length && (
        <div className="diceui-grid">
          {secondaryButtons.map((diceAction, index) => (
            <button
              key={index}
              onClick={() => handleDiceRollAction(diceAction)}
              className="diceui-btn diceui-chip"
              title={`Roll ${diceAction.title}`}
            >
              {diceAction.title}
            </button>
          ))}
        </div>
      )}

      {/* Command bar */}
      <div className="diceui-command">
        <label className="sr-only" htmlFor="diceui-input">
          Custom formula
        </label>
        <input
          id="diceui-input"
          ref={inputRef}
          className="diceui-input"
          type="text"
          placeholder="Custom formula"
          onChange={handleCustomFormulaChange}
          onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent)}
          value={customFormula}
          autoComplete="off"
          title="Enter: roll • ↑/↓: browse history"
        />

        <button
          className="diceui-action"
          onClick={() => {
            rollNow(customFormula)
            setHistoryIndex(-1)
            setIsHistoryOpen(false)
          }}
          aria-label="Roll"
          title="Roll (Enter)"
        >
          Roll
        </button>

        <div className="diceui-historywrap" ref={historyRef}>
          <button
            className="diceui-action diceui-action--ghost"
            onClick={() => setIsHistoryOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={isHistoryOpen}
            title="Show recent formulas"
          >
            History
          </button>

          {isHistoryOpen && (
            <div className="diceui-popover" role="listbox">
              <div className="diceui-popoverhead">
                <span>Recent formulas</span>
                {history.length > 0 && (
                  <button className="diceui-link" onClick={clearHistory}>
                    Clear
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <div className="diceui-empty">No history yet</div>
              ) : (
                <ul className="diceui-list">
                  {[...history]
                    .slice()
                    .reverse()
                    .map((entry, i) => {
                      return (
                        <li key={i}>
                          <button
                            className="diceui-listitem"
                            onClick={() => onHistoryPick(entry)}
                            title={`Use ${entry}`}
                          >
                            {entry}
                          </button>
                        </li>
                      )
                    })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default DiceBar
