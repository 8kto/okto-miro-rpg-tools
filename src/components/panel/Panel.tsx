import { DropEvent } from '@mirohq/websdk-types/stable/api/ui'
import { useCallback, useEffect, useState } from 'preact/compat'
import { convertImageToToken } from './utils'
import { TokenDict } from '../../data/tokenExports'
import { DEFAULT_TOKEN_SIZE } from './consts'

const { board } = miro

const handleAppClick = async () => {
  await board.ui.openPanel({
    url: '/?panel=1',
  })
}

const Panel = ({ tokens }: { tokens: TokenDict }) => {
  const [tokenSize, setTokenSize] = useState(DEFAULT_TOKEN_SIZE)

  const handleDropItem = useCallback(async (event: DropEvent) => {
    const { target, x, y } = event

    if (target instanceof HTMLImageElement) {
      const image = await board.createImage({
        x,
        y,
        width: tokenSize,
        url: target.src,
        title: target.title,
        alt: target.title,
      })
      await convertImageToToken({ image, tokenSize })
    }
  }, [tokenSize])

  useEffect(() => {
    void board.ui.on('drop', handleDropItem)

    return () => {
      void board.ui.off('drop', handleDropItem)
    }
  }, [handleDropItem])

  useEffect(() => {
    void board.ui.on('icon:click', handleAppClick)

    return () => {
      void board.ui.off('icon:click', handleAppClick)
    }
  }, [])

  const handleTokenSizeChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    setTokenSize(+target.value)
  }

  return (
    <div className="space-y-1">
      <p className="my-medium">Drag and drop token or convert existing images on the board.</p>

      <div className="form-group">
        <label htmlFor="token-size-input">Token size</label>
        <input
          className="input"
          type="text"
          placeholder={DEFAULT_TOKEN_SIZE.toString()}
          onChange={handleTokenSizeChange}
          value={tokenSize}
          id="token-size-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="select-1">Strategy</label>
        <select className="select" id="select-1">
          <option value="useBlocksRowStrategy">Blocks row</option>
          <option value="useDamageNumberStrategy">Damage numbers</option>
        </select>
      </div>

      <div className="grid-full-width">
        <button className="button button-primary w-100" onClick={() => convertImageToToken({ tokenSize })}>
          Convert selected image to token
        </button>
      </div>

      <h3 className="section-header">Tokens gallery</h3>
      <div className="grid-container">
        {Object.entries(tokens).map(([tokenTitle, token]) => {
          const title = tokenTitle.replace('Token', '')

          return (
            <div key={title} className="grid-item">
              <img
                src={token}
                draggable={false}
                className="miro-draggable draggable-item draggable-item--image"
                alt={title}
                title={title}
              />
              <span className="token-title">{title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Panel
