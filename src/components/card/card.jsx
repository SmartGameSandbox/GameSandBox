import React from 'react';
import { Image } from 'react-konva';

class Card extends React.Component {
  state = {
    image: null,
    isFlipped: false,
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

  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState(prevState => ({ image: this.image, isFlipped: prevState.isFlipped }));
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  
  handleClick = () => {
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  render() {
    console.log(this.state.image)
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        image={this.state.image}
        ref={(node) => {
          this.imageNode = node;
        }}
        draggable
        onClick={this.handleClick}
      />
    );
  }
}

export default Card;