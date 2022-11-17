import React from 'react';
import { Image } from 'react-konva';
import * as Constants from '../../util/constants';

class Card extends React.Component {
  state = {
    image: null,
    imageNode: null
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
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }

  handleLoad = () => {
    this.setState(() => ({ image: this.image }));
  };

  bringToTop = (isInHand) => {
    if (!isInHand) {
      this.imageNode.moveToTop();
    }
  }

  render() {
    return (
      <Image
        key={this.props.id}
        x={this.props.x}
        y={this.props.y}
        height={Constants.CARD_HEIGHT}
        width={Constants.CARD_WIDTH}
        image={this.state.image}
        draggable
        onDragMove={(e) => this.props.onDragMove(e, this.props.id)}
        onDragStart={() => this.bringToTop()}
        onClick={(e) => {this.props.onClick(e, this.props.id); this.bringToTop(this.props.isInHand)}}
        onDragEnd={(e) => this.props.onDragEnd(e, this.props.id)}
        ref={(node) => {
          this.imageNode = node;
        }}
      />
    );
  }
}

export default Card;