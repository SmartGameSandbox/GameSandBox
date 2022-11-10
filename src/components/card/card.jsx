import React from 'react';
import { Image } from 'react-konva';
import * as Constants from '../../util/constants';

class Card extends React.Component {
  state = {
    image: null,
  };
  
  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }

  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }

  /**
   * After setState react-konva will update canvas and redraw the layer
   * because "image" property is changed.
   * if you keep same image object during source updates you will have to update layer manually:
   * this.imageNode.getLayer().batchDraw();
   */
  handleLoad = () => {
    this.setState(() => ({ image: this.image }));
  };

  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        height={Constants.CARD_HEIGHT}
        width={Constants.CARD_WIDTH}
        image={this.state.image}
        ref={(node) => {
          this.imageNode = node;
        }}
      />
    );
  }
}

export default Card;