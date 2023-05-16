import useImage from "use-image";
import { useState, useEffect } from "react";
import { Image } from "react-konva";
import * as Constants from "../../util/constants";
const Buffer = require("buffer").Buffer;

const Card = ({
  src,
  id,
  type,
  x,
  y,
  isLandscape,
  onDragMove,
  onDragEnd,
}) => {
  const sizeAdjust = {
    Card: 1,
    Token: 0.6,
    Piece: 0.8,
  }
  const [itemType, setItemType] = useState(type);
  useEffect(() => {
    setItemType(type);
  }, [type]);

  const [img] = useImage(`data:image/${src.contentType};base64,${Buffer.from(src.data).toString("base64")}`);
  return (
    <Image
      key={id}
      x={x}
      y={y}
      height={Constants.CARD_HEIGHT * (sizeAdjust[itemType] || 1)}
      width={Constants.CARD_WIDTH * (sizeAdjust[itemType] || 1)}
      image={img}
      isLandscape={isLandscape}
      rotation={isLandscape ? 90: 0}
      draggable
      onDragMove={(e) => {onDragMove(e, id);}}
      onDragEnd={(e) => {onDragEnd(e, id);}}
    />
  );
}

export default Card;
