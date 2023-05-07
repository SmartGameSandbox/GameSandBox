import { useState, useEffect } from "react";
import { Image } from "react-konva";
import * as Constants from "../../util/constants";
const Buffer = require("buffer").Buffer;

const Card = ({
  username,
  roomID,
  src,
  id,
  x,
  y,
  isFlipped,
  deckIndex,
  onDragMove,
  onClick,
  onDragEnd,
}) => {

  const [image, setImage] = useState(null);

  
  useEffect(() => {
    if(!src) return;
    const image = new window.Image();
    console.log('here')
    image.src = `data:image/${src.contentType};base64,${Buffer.from(
      src.data
    ).toString("base64")}`;
    image.addEventListener("load", setImage(image));
    setImage(image);
  },[])

  useEffect(() => {
    return () => {
      image?.removeEventListener("load", setImage(image));
    }
  },[image])

  return (
    <Image
      key={id}
      x={x}
      y={y}
      height={Constants.CARD_HEIGHT}
      width={Constants.CARD_WIDTH}
      image={image}
      draggable
      onDragMove={(e) => {onDragMove(e, id);}}
      onClick={(e) => {onClick(e, id);}}
      onDragEnd={(e) => {onDragEnd(e, id);}}
    />
  );
}

export default Card;
