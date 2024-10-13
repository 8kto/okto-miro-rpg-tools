import { Image } from "@mirohq/websdk-types/stable/features/widgets/image"
import { DEFAULT_TITLE_FONT_SIZE, DEFAULT_TOKEN_SIZE } from "./consts"
//import { getSpacing } from "./utils.getSpacing"
import { StrategyDef } from "./strategies"

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

export const convertImageToToken = async (options?: { image?: Image; tokenSize: number; strategy: StrategyDef }) => {
  const { board } = miro
  const tokensStorage = board.storage.collection("tokens")
  const { image, tokenSize = DEFAULT_TOKEN_SIZE, strategy } = options || {}

  if (!strategy) {
    throw new Error("convertImageToToken: No strategy found")
  }

  const selectedWidgets = await board.getSelection()
  const selectedImage = image || (selectedWidgets.find((widget) => widget.type === "image") as Image)

  if (!selectedImage) {
    return
  }

  // Get the image's dimensions and URL
  const { width, x, y } = selectedImage
  let { title } = selectedImage

  if (title) {
    let counter = await tokensStorage.get<number>(title)
    if (!counter) counter = 0
    void tokensStorage.set(title, ++counter)

    title = `${selectedImage.title} (${counter})`
    selectedImage.title = title
    selectedImage.alt = title
    void selectedImage.sync()
    // void board.storage.collection("tokens:items").
  }

  const titleText = await getTokenTitle({
    x,
    y: y - tokenSize / 2 - 10,
    title: title || "NA",
    tokenSize,
  })

  const buffer = await strategy.run({ x, y, width, n: 8, tokenSize })

  await board.group({ items: [selectedImage, titleText, ...buffer] })
  await titleText.sync()
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
