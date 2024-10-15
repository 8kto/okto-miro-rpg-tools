import { useCallback, useEffect, useState } from "preact/compat"
import { convertImageToToken } from "./utils"
import tokens from "../../data/tokenExports"
import { DEFAULT_STRATEGY_ID, DEFAULT_TOKEN_SIZE } from "./consts"
import TokenGallery from "../TokenGallery/TokenGallery"
import { DropEvent, ItemsDeleteEvent } from "@mirohq/websdk-types/stable/api/ui"
import strategiesMap, { StrategyId } from "./strategies"
import { Image } from "@mirohq/websdk-types/stable/features/widgets/image"
import { TokenService } from "../../services/TokenService"
import { NotificationService } from "../../services/NotificationService"

const handleAppClick = async () => {
  await miro.board.ui.openPanel({
    url: "/?panel=1",
  })
}

const handleItemDelete = async (event: ItemsDeleteEvent) => {
  const createdItems = event.items
  const tokenService = TokenService.getInstance()
  createdItems
    .filter((item): item is Image => item.type === "image")
    .forEach((token) => {
      void tokenService.removeToken(token.title, token.alt as string)
    })
}

const handleBroadcastMessages = (message: string) => {
  void miro.board.notifications.showInfo(message)
}

const TokenPanel = () => {
  const { board } = miro
  const [tokenSize, setTokenSize] = useState(DEFAULT_TOKEN_SIZE)
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyId>(DEFAULT_STRATEGY_ID)

  const handleDropItem = useCallback(
    async (event: DropEvent) => {
      const { target, x, y } = event

      if (target instanceof HTMLImageElement) {
        const { title, src, dataset } = target
        const image = await board.createImage({
          x,
          y,
          width: tokenSize,
          url: src,
          title: title,
          alt: dataset.tokenId,
        })

        void convertImageToToken({
          image,
          tokenSize,
          strategy: strategiesMap[selectedStrategyId],
        })
      }
    },
    [tokenSize, selectedStrategyId],
  )

  useEffect(() => {
    void board.ui.on("drop", handleDropItem)

    return () => {
      void board.ui.off("drop", handleDropItem)
    }
  }, [handleDropItem])

  useEffect(() => {
    void board.ui.on("icon:click", handleAppClick)
    void board.ui.on("items:delete", handleItemDelete)
    void board.events.on("message", handleBroadcastMessages)

    return () => {
      void board.ui.off("icon:click", handleAppClick)
      void board.ui.off("items:delete", handleItemDelete)
      void board.events.off("message", handleBroadcastMessages)
    }
  }, [])

  const handleTokenSizeChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    setTokenSize(+target.value)
  }

  const handleStrategyChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.value in strategiesMap) {
      setSelectedStrategyId(target.value as StrategyId)
    }
  }

  const handleResetCounters = async () => {
    await TokenService.getInstance().reset()
    await NotificationService.getInstance().showMessage("Token counters have been reset.")
  }

  return (
    <div className="space-y-1">
      <p className="my-medium">Drag and drop token or convert existing images on the board.</p>

      <details>
        <summary className="h3 accordion-item">Settings</summary>

        <div className="app-card py-medium">
          <div className="form-group">
            <label htmlFor="token-size-input">Token size</label>
            <input
              className="input"
              type="number"
              step="10"
              placeholder={DEFAULT_TOKEN_SIZE.toString()}
              onChange={handleTokenSizeChange}
              value={tokenSize}
              id="token-size-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="select-1">Hit points tracking strategy</label>
            <select className="select" id="select-1" onChange={handleStrategyChange}>
              {Object.values(strategiesMap).map(({ name, id }) => (
                <option key={id} value={id} selected={id === selectedStrategyId}>
                  {name}
                </option>
              ))}
            </select>
            <p>
              {" "}
              <span className="label label-info">INFO</span> {strategiesMap[selectedStrategyId].details}
            </p>
          </div>
        </div>
      </details>

      <div className="grid-full-width">
        <button
          className="button button-primary w-100"
          onClick={() =>
            convertImageToToken({
              tokenSize,
              strategy: strategiesMap[selectedStrategyId],
            })
          }
        >
          Convert selected image to token
        </button>
      </div>

      <div className="grid-full-width">
        <button className="button button-secondary w-100" onClick={handleResetCounters}>
          Reset token counters
        </button>
      </div>

      <TokenGallery tokens={tokens} />
    </div>
  )
}
export default TokenPanel
