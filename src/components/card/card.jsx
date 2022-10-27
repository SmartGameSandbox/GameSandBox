import React from 'react';
import { Image } from 'react-konva';
import * as Constants from '../../util/constants';


class Card extends React.Component {
  state = {
    value: null,
    image: null,
    isFlipped: false,
    isDragging: this.props.isDragging,
    tableHeight: this.props.tableHeight,
    tableWidth: this.props.tableWidth
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

  checkPosition(event) {
    console.log(event)
  }

  handleLoad = (e) => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState(prevState => ({ image: this.image, isFlipped: prevState.isFlipped }));
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };

  onDragStart= () => {
    this.setState({
      isDragging: true,
    });
  }

  onDragEnd = (e) => {
    this.setState({
      isDragging: false,
      x: e.target.x(),
      y: e.target.y(),
    });
    console.log("X: ", this.state.x)
    console.log("Y: ", this.state.y)
    this.checkPosition()

  }

  handleClick = (e) => {
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  placeCardInHand() {
    //remove this card from table place in hand
    this.placeCardInHand()
  }


checkPosition() {

    if ((this.state.y >= (this.state.tableHeight / Constants.HAND_BOX_HEIGHT_DIVIDER) && (this.state.x >= (this.state.tableWidth / Constants.HAND_BOX_WIDTH_DIVIDER)))) {
        // placeCardInHand(pos)
        console.log("Card moved from Table into Hand")
    }
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
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      />
    );
  }
}

export default Card;