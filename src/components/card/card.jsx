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
    if (oldProps.src !== this.props.src || oldProps.isFlipped !== this.props.isFlipped) {
      this.loadImage();
    }
    console.log("componentDidUpdate");
  }

  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }

  async loadImage() {
    this.image = new window.Image();
    let imageObj = this.props.src;
    if(this.props.isFlipped){
      this.image.src = `data:image/${imageObj.front.contentType};base64,${Buffer.from(
        imageObj.front.data
      ).toString("base64")}`;
    }else{
      this.image.src = `data:image/${imageObj.back.contentType};base64,${Buffer.from(
        imageObj.back.data
      ).toString("base64")}`;
    }

    this.image.addEventListener("load", this.handleLoad);
  }

  handleLoad = () => {
    this.setState(() => ({ image: this.image }));
  };

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
        onDragMove={(e) => {
          this.props.onDragMove(e, this.props.id);
        }}
        onDragStart={(e) => {
          this.props.onDragStart(e, this.props.id);
        }}

        onDragEnd={(e) => {
          this.props.onDragEnd(e, this.props.id);
        }}
      />
    );
  }
}

export default Card;
