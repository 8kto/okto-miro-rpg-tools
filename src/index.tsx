import '/assets/style.css';

import {Component} from 'preact';

async function addSticky() {
  const stickyNote = await miro.board.createStickyNote({
    content: 'Hello, World!',
  });

  await miro.board.viewport.zoomTo(stickyNote);
}

export default class App extends Component {
  componentDidMount() {
    addSticky();
  }

  render() {
    return (
      <div id="root">
        <div className="grid container">
          <div className="cs1 ce12">
            <img src="/assets/congratulations.png" alt="congratulations" />
          </div>
          <div className="cs1 ce12">
            <h1>Congratulations!</h1>
            <p>You've just created your first Miro app!</p>
            <p>
              To explore more and build your own app, see the Miro Developer
              Platform documentation.
            </p>
          </div>
          <div className="cs1 ce12">
            <a
              className="button button-primary"
              target="_blank"
              href="https://developers.miro.com"
            >
              Read the documentation
            </a>
          </div>
        </div>
      </div>
    );
  }
}
