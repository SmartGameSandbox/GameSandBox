// This module contains the logic for creating draggable images that represent game objects (Card, Token, etc).
// The name is a relic of the prehistoric time when only cards existed.
// Please do rename this to Component or whatever you see fit.
// Replace (Ctrl + R) Card with the new name if you do. (Check usages to find where to replace)
// Notes: Should be refactored to hold a reference to the object this component represents instead of copying
// their properties (type, isLandscape, etc).
// Notes: Actions (onDragMove, etc) should exist within gameaction.jsx and be assigned when this component is created
// ie: inside deck.jsx.

import useImage from "use-image";
import { Image, Text, Rect, Group } from "react-konva";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../util/constants";
const Buffer = require("buffer").Buffer;

const Card = ({
  src,
  id,
  type,
  x,
  y,
  isLandscape,
  cardCount,
  onMouseEnter,
  onMouseLeave,
  onDragMove,
  onDragEnd,
}) => {

  const [img] = useImage(`data:image/${src.contentType};base64,${Buffer.from(src.data).toString("base64")}`);
  const cardWidth = img ? img.width : 0;
  const cardHeight = img ? img.height : 0;

  return (
    <Group>
      <Image
        key={id}
        x={x}
        y={y}
        image={img}
        isLandscape={isLandscape}
        rotation={isLandscape ? 90: 0}
        draggable
        type={type}
        onMouseEnter={(e) => {onMouseEnter(e, id);}}
        onMouseLeave={(e) => {onMouseLeave(e);}}
        onDragMove={(e) => {onDragMove(e, id);}}
        onDragEnd={(e) => {onDragEnd(e, id);}}
        dragBoundFunc={(pos) => {
          // Define the boundaries of the tabletop
          const tabletopWidth = CANVAS_WIDTH;
          const tabletopHeight = CANVAS_HEIGHT;
      
          // Calculate the restricted position
          const restrictedX = Math.max(0, Math.min(tabletopWidth - img.width, pos.x));
          const restrictedY = Math.max(0, Math.min(tabletopHeight - img.height, pos.y));
      
          return { x: restrictedX, y: restrictedY };
        }}
      />
      {cardCount > 1 && (
        <>
          <Rect
            x={x}
            y={y + cardHeight-1}
            width={cardWidth}
            height={20}
            fill="#163B6E"
          />
          <Text
            x={x + cardWidth / 2 - (cardCount > 9 ? 12 : 5)}
            y={y + cardHeight + 1.5}
            text={cardCount}
            fontSize={16}
             fill="white"
            fontStyle="bold"
            fontFamily="Nunito"
          />
        </>
      )}
    </Group>
  );
}

export default Card;