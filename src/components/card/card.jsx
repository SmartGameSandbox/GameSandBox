import React from "react";
import { Image } from "react-konva";
import * as Constants from "../../util/constants";
const Buffer = require("buffer").Buffer;

class Card extends React.Component {
  state = {
    image: null,
    imageNode: null,
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
    this.image.removeEventListener("load", this.handleLoad);
  }

  async loadImage() {
    this.image = new window.Image();
    let imageObj = this.props.src;

    this.image.src = `data:image/${imageObj.contentType};base64,${Buffer.from(
      imageObj.data
    ).toString("base64")}`;

    this.image.addEventListener("load", this.handleLoad);
  }

  handleLoad = () => {
    this.setState(() => ({ image: this.image }));
  };

  render() {
    console.log("card props", this.props);
    return (
      <Image
        key={this.props.id}
        x={this.props.x}
        y={this.props.y}
        height={Constants.CARD_HEIGHT}
        width={Constants.CARD_WIDTH}
        image={this.state.image}
        isLandscape={this.props.isLandscape}
        rotation={this.props.isLandscape ? 90 : 0}
        draggable
        onDragMove={(e) => {
          this.props.onDragMove(e, this.props.id);
        }}
        onDragStart={(e) => {
          this.props.onDragStart(e, this.props.id);
        }}
        onClick={(e) => {
          this.props.onClick(e, this.props.id);
        }}
        onDragEnd={(e) => {
          this.props.onDragEnd(e, this.props.id);
        }}
      />
    );
  }
}

export default Card;
