import '/assets/style.css';
import {useEffect} from 'preact/compat';
import {DropEvent} from '@mirohq/websdk-types/stable/api/ui';
import {Image} from "@mirohq/websdk-types/stable/features/widgets/image";

import {tokens} from './data/tokens'

const {board} = miro;

// Function to apply a circular crop effect to the selected image using a custom SVG overlay
const convertImageToToken = async (image?: Image) => {
  const selectedWidgets = await board.getSelection();
  const selectedImage = image || selectedWidgets.find(widget => widget.type === 'image') as Image;

  if (!selectedImage) {
    return;
  }

  // Get the image's dimensions and URL
  const {x, y, alt, width} = selectedImage;

  const titleText = await board.createText({
    content: alt,
    x,
    y: y - 72, // Position the text above the image
    style: {
      textAlign: 'center',
      fontSize: 18,
      fillColor: '#000000',
      color: '#fff'
    },
  });

  const buffer = []
  for (let i = 0; i < 8; i++) {
    const hpText = await board.createText({
      content: "x",
      x: x - width / 2.5 + i * 15,
      y: y + 72, // Position the button below the image
      width: 1,
      style: {
        textAlign: 'center',
        fontSize: 14,
        fillColor: '#000',
        color: '#fff',
      },
    });
    buffer.push(hpText)
  }
  await board.group({items: [selectedImage, titleText, ...buffer]});


  for (let i = 0; i < 8; i++) {
    await board.createText({
      content: " ",
      x: x - width / 2.5 + i * 15,
      y: y + 72, // Position the button below the image
      width: 1,
      style: {
        textAlign: 'left',
        fontSize: 14,
        fillColor: '#fff',
        color: '#000',
      },
    });
  }

  await titleText.sync()
};

// Function to handle image drop event
const handleDropItem = async (e: DropEvent) => {
  const {x, y, target} = e;

  if (target instanceof HTMLImageElement) {
    const image = await board.createImage({x, y, width: 128, url: target.src, title: target.title, alt: target.title});
    await board.viewport.zoomTo(image);
    await convertImageToToken(image)
  }
};

export default function App() {
  useEffect(() => {
    // Register the drop event handler once
    board.ui.on('drop', handleDropItem);

    void board.ui.on("icon:click", async () => {
      // In this example: when the app icon is clicked, a method opens a panel
      await miro.board.ui.openPanel({
        // The content displayed on the panel is fetched from the specified HTML resource
        url: "/?panel=1"
      });
    });

    // Clean up the toolbar item when the component is unmounted
    return () => {
    };
  }, []);

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
  );
}
