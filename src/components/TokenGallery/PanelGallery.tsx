import { TokenDict } from "../../data/tokenExports"

type PanelGallery = {
  tokens: TokenDict
}
const PanelGallery = ({ tokens }: PanelGallery) => {
  return (
    <>
      <h3 className="h2 section-header">Token gallery</h3>
      <div className="grid-container">
        {Object.entries(tokens).map(([tokenTitle, token]) => {
          const title = tokenTitle.replace("Token", "")

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

export default PanelGallery
