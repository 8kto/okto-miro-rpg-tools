import { Image } from "@mirohq/websdk-types/stable/features/widgets/image"
import { DEFAULT_TITLE_FONT_SIZE, DEFAULT_TOKEN_SIZE } from "./consts"
import { getSpacing } from "./utils.getSpacing"
import { StrategyDef } from "./strategies"

const { board } = miro

const getTitleFontSize = (input: number): number => {
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
  const { alt, width, x, y } = selectedImage
  const titleText = await getTokenTitle({
    x,
    y: y - getSpacing(tokenSize),
    title: alt || "NA",
    tokenSize,
  })

  const buffer = await strategy.run({ x, y, width, n: 8, tokenSize })

  await board.group({ items: [selectedImage, titleText, ...buffer] })
  await titleText.sync()
}
