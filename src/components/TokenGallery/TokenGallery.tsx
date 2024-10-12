import { TokenDict } from "../../data/tokenExports"
import { formatTokenTitle } from "../Panel/utils"
import { useState } from "preact/compat"
import SearchInput from "../SearchInput/SearchInput"

type TokenGalleryProps = {
  tokens: TokenDict
}
const TokenGallery = ({ tokens }: TokenGalleryProps) => {
  const [searchInputValue, setSearchInputValue] = useState("")

  return (
    <>
      <h3 className="h2 section-header">Token gallery</h3>
      <SearchInput handleInputChange={(value) => setSearchInputValue(value)} />
      <p className="p">Tokens used: Devin Night (immortalnights.com), VTT Token Maker (thefatefulforce.com)</p>
      <div className="grid-container">
        {Object.entries(tokens)
          .filter(([tokenTitle]) => tokenTitle.toLowerCase().includes(searchInputValue.toLowerCase()))
          .map(([tokenTitle, token]) => {
            const title = formatTokenTitle(tokenTitle)

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
    </>
  )
}

export default TokenGallery
