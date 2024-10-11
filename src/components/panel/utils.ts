import { Image } from '@mirohq/websdk-types/stable/features/widgets/image'

import { useBlocksRowStrategy } from '../../strategies'

const { board } = miro


export const getTokenTitle = async ({ x, y, title }: { x: number; y: number; title: string }) => {
  return await board.createText({
    content: title,
    x,
    y, // Position the text above the image
    style: {
      textAlign: 'center',
      fontSize: 18,
      fillColor: '#000000',
      color: '#fff',
    },
  })
}

export const convertImageToToken = async (image?: Image) => {
  const selectedWidgets = await board.getSelection()
  const selectedImage = image || selectedWidgets.find(widget => widget.type === 'image') as Image

  if (!selectedImage) {
    return
  }

  // Get the image's dimensions and URL
  const { alt, width, x, y } = selectedImage
  const titleText = await getTokenTitle({ x, y: y - 72, title: alt || 'NA' })

  const buffer = await useBlocksRowStrategy({ x, y, width, n: 8 })

  await board.group({ items: [selectedImage, titleText, ...buffer] })
  await titleText.sync()
}