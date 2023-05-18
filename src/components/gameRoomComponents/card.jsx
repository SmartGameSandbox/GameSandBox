import useImage from "use-image";
import { Image } from "react-konva";
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

  const [img] = useImage(`data:image/${src.contentType};base64,${Buffer.from(src.data).toString("base64")}`);
  return (
    <Image
      key={id}
      x={x}
      y={y}
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
