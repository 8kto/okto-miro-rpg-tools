import { useState } from "preact/hooks"
import { createSticker, getPhaseTitle, updateStickerText } from "./utils"
import { PCOMBAT_DEFAULT_TITLE, PHASES } from "./consts"

const PhasedCombat = () => {
  const [roundNum, setRoundNum] = useState(1)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [busy, setBusy] = useState(false)

  const nextPhase = () => {
    setBusy(true)

    setPhaseIndex((i) => {
      const nextIndex = (i + 1) % PHASES.length

      let rOptimistic = roundNum
      if (nextIndex === 0 && i === PHASES.length - 1) {
        rOptimistic = rOptimistic + 1
        setRoundNum((r) => r + 1)
      }

      void updateStickerText(getPhaseTitle(rOptimistic, nextIndex))

      return nextIndex
    })

    setBusy(false)
  }

  const reset = () => {
    setPhaseIndex(0)
    setRoundNum(1)
    void updateStickerText(PCOMBAT_DEFAULT_TITLE)
  }

  return (
    <div className="grid-full-width okto-ttrpg-phased-combat-panel">
      <button disabled={busy} className="button button-secondary w-100" onClick={nextPhase}>
        {">>>"} Next phase
      </button>

      <div className="bordered p-medium my-medium">
        <h3>{getPhaseTitle(roundNum, phaseIndex)}</h3>
        {PHASES[phaseIndex] && <p>{PHASES[phaseIndex].description}</p>}
      </div>

      <button className="button button-danger w-100" onClick={createSticker}>
        Create Combat Sticker
      </button>
      <button className="button button-secondary w-100" onClick={reset}>
        Reset
      </button>
    </div>
  )
}

export default PhasedCombat
