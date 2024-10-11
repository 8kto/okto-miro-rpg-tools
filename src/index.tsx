import '/assets/style.css'

import { DropEvent } from '@mirohq/websdk-types/stable/api/ui'
import { Image } from '@mirohq/websdk-types/stable/features/widgets/image'
import { useEffect } from 'preact/compat'

import { tokens } from './data/tokens'
import { useSpanRowsStrategy } from './strategies'

const { board } = miro

const getTokenTitle = async ({ x, y, title }: { x: number; y: number; title: string }) => {
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

const convertImageToToken = async (image?: Image) => {
  const selectedWidgets = await board.getSelection()
  const selectedImage = image || selectedWidgets.find(widget => widget.type === 'image') as Image

  if (!selectedImage) {
    return
  }

  // Get the image's dimensions and URL
  const { alt, width, x, y } = selectedImage
  const titleText = await getTokenTitle({ x, y: y - 72, title: alt || 'NA' })

  const buffer = await useSpanRowsStrategy({ x, y, width, n: 8 })

  await board.group({ items: [selectedImage, titleText, ...buffer] })
  await titleText.sync()
}

// Function to handle image drop event
const handleDropItem = async (e: DropEvent) => {
  const { target, x, y } = e

  if (target instanceof HTMLImageElement) {
    const image = await board.createImage({ x, y, width: 128, url: target.src, title: target.title, alt: target.title })
    await convertImageToToken(image)
  }
}

export default function App() {
  useEffect(() => {
    // Register the drop event handler once
    board.ui.on('drop', handleDropItem)

    void board.ui.on('icon:click', async () => {
      // In this example: when the app icon is clicked, a method opens a panel
      await miro.board.ui.openPanel({
        // The content displayed on the panel is fetched from the specified HTML resource
        url: '/?panel=1',
      })
    })

    // Clean up the toolbar item when the component is unmounted
    return () => {
    }
  }, [])

  return (
    <div id="root">
      <p className="my-medium">Drag and drop token or convert existing images on the board.</p>
      <div className="grid-full-width my-medium">
        <button className="button button-primary" onClick={() => convertImageToToken()}>
          Convert selected image to token
        </button>
      </div>
      <div className="grid-container">
        {tokens.map((token) => (
          <div key={token.title} className="grid-item">
            <img
              src={token.src}
              draggable={false}
              className="miro-draggable draggable-item draggable-item--image"
              alt={token.title}
              title={token.title}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
