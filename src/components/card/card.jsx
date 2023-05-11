import { Image } from "react-konva";
import useImage from "use-image";
import * as Constants from "../../util/constants";
const Buffer = require("buffer").Buffer;

const Card = ({
  src,
  id,
  x,
  y,
  isLandscape,
  onDragMove,
  onDragEnd,
}) => {

  const [img] = useImage(`data:image/${src.contentType};base64,${Buffer.from(src.data).toString("base64")}`);

  return (
    <Image
      key={id}
      x={x}
      y={y}
      height={Constants.CARD_HEIGHT}
      width={Constants.CARD_WIDTH}
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
