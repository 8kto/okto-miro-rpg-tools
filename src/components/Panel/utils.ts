import { Image } from "@mirohq/websdk-types/stable/features/widgets/image"
import { DEFAULT_TITLE_FONT_SIZE, DEFAULT_TOKEN_SIZE } from "./consts"
import { StrategyDef } from "./strategies"
import { TokenService } from "../../services/TokenService"

export const getTitleFontSize = (input: number): number => {
  const ratio = DEFAULT_TITLE_FONT_SIZE / DEFAULT_TOKEN_SIZE
  return Math.round(input * ratio)
}

export const getTokenTitle = async ({
  x,
  y,
  title,
  tokenSize,
}: {
  x: number
  y: number
  title: string
  tokenSize: number
}) => {
  const { board } = miro

  return await board.createText({
    content: title,
    x,
    y,
    style: {
      textAlign: "center",
      fontSize: getTitleFontSize(tokenSize),
      fillColor: "#000000",
      color: "#fff",
    },
  })
}

export const convertImageToToken = async (options?: {
  image?: Image
  tokenSize: number
  strategy: StrategyDef
}): Promise<Image | null> => {
  const { board } = miro
  const { image, tokenSize = DEFAULT_TOKEN_SIZE, strategy } = options || {}

  if (!strategy) {
    throw new Error("convertImageToToken: No strategy found")
  }

  const selectedWidgets = await board.getSelection()
  const selectedImage = image || (selectedWidgets.find((widget) => widget.type === "image") as Image)

  if (!selectedImage) {
    console.error("No token image found")
    return null
  }

  const { title: tokenUiTitle, width, x, y } = selectedImage

  if (!tokenUiTitle) {
    console.error("No image title found", selectedImage)
    return null
  }

  const tokenId = await TokenService.getInstance().addToken(tokenUiTitle)

  selectedImage.title = tokenUiTitle
  selectedImage.alt = tokenId
  void selectedImage.sync()

  const titleText = await getTokenTitle({
    x,
    y: y - tokenSize / 2 - 10,
    title: tokenId || "NA",
    tokenSize,
  })

  const buffer = await strategy.run({ x, y, width, n: 8, tokenSize })
  await board.group({ items: [selectedImage, titleText, ...buffer] })
  void titleText.sync()

  return selectedImage
}

export const formatTokenTitle = (tokenTitle: string): string => {
  return (
    tokenTitle
      .replace("Token", "")
      .replaceAll("_", "")
      .replaceAll("-", "")
      .replace(/\d+$/, "")
      // Split the camelCase into separate words
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Capitalize the first letter of each word
      .replace(/\b\w/g, (char) => char.toUpperCase())
  )
}
