import { useState, useEffect, useRef } from "preact/compat"
import type { TokenDict } from "../../data/tokenExports"
import { formatTokenTitle } from "../Panel/utils"
import SearchInput from "../SearchInput/SearchInput"

type TokenGalleryProps = {
  tokens: TokenDict
}

const ITEMS_PER_FRAME = 8

const TokenGallery = ({ tokens }: TokenGalleryProps) => {
  const [searchInputValue, setSearchInputValue] = useState("")
  const [loadedTokens, setLoadedTokens] = useState<{ [key: string]: string }>({})
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_FRAME)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const loadTokenImage = async (tokenTitle: string, tokenLoader: () => Promise<{ default: string }>) => {
    try {
      const module = await tokenLoader() // Load the image dynamically using import()
      setLoadedTokens((prevState) => ({
        ...prevState,
        [tokenTitle]: module.default,
      }))
    } catch (error) {
      console.error(`Failed to load token: ${tokenTitle}`, error)
    }
  }

  // Load visible tokens based on the search input or current displayCount
  useEffect(() => {
    let tokenEntries = Object.entries(tokens)

    if (searchInputValue) {
      // If search is active, load all matched tokens
      tokenEntries = tokenEntries.filter(([tokenTitle]) =>
        tokenTitle.toLowerCase().includes(searchInputValue.toLowerCase()),
      )
    } else {
      // Else, load only up to the current displayCount
      tokenEntries = tokenEntries.slice(0, displayCount)
    }

    tokenEntries.forEach(([tokenTitle, tokenLoader]) => {
      if (!loadedTokens[tokenTitle]) {
        loadTokenImage(tokenTitle, tokenLoader)
      }
    })
  }, [searchInputValue, tokens, loadedTokens, displayCount])

  // Intersection Observer to load more tokens when the container becomes visible
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !searchInputValue) {
        setDisplayCount((prev) => prev + ITEMS_PER_FRAME) // Load the next portion of tokens
      }
    })

    const currentLoadMoreRef = loadMoreRef.current
    if (currentLoadMoreRef && observerRef.current) {
      observerRef.current.observe(currentLoadMoreRef)
    }

    return () => {
      if (currentLoadMoreRef && observerRef.current) {
        observerRef.current.unobserve(currentLoadMoreRef)
      }
    }
  }, [searchInputValue])

  return (
    <>
      <h3 className="h2 section-header">Token gallery</h3>
      <p className="p">Tokens used: Devin Night (immortalnights.com), VTT Token Maker (thefatefulforce.com)</p>

      <SearchInput handleInputChange={(value) => setSearchInputValue(value)} />

      <div className="grid-container">
        {Object.entries(tokens)
          .filter(([tokenTitle]) => {
            return searchInputValue ? tokenTitle.toLowerCase().includes(searchInputValue.toLowerCase()) : true // If no search input, load progressively
          })
          .slice(0, searchInputValue ? undefined : displayCount)
          .map(([tokenTitle]) => {
            const title = formatTokenTitle(tokenTitle)
            const tokenSrc = loadedTokens[tokenTitle]

            return (
              <div key={tokenTitle} className="grid-item">
                {tokenSrc ? (
                  <img
                    src={tokenSrc}
                    draggable={false}
                    className="miro-draggable draggable-item draggable-item--image"
                    alt={title}
                    title={title}
                    data-token-id={tokenTitle}
                  />
                ) : (
                  <div className="loading-placeholder">Loading...</div> // Placeholder while loading
                )}
                <span className="token-title">{title}</span>
              </div>
            )
          })}
      </div>

      {/* Invisible div that triggers loading the next set of tokens when visible */}
      {!searchInputValue && <div ref={loadMoreRef} style={{ visibility: "hidden", height: "1px" }}></div>}
    </>
  )
}

export default TokenGallery
