import { Group, Rect, Text } from "react-konva";

const RightClickMenu = ({
  x, y, itemID, setTableData, setRightClickPos, setClickedID, setCanEmit, setItemUpdated
}) => {
  const OPTIONS = ['Flip', 'Rotate', "Disassemble"];
  const PAD = 5;
  const LINE_HEIGHT = 24;
  const WIDTH = 100;

  const handleOptionClick = (option) => {
    let isFlipped;
    if (option === 'Flip') {
      setTableData((prevTable) => {
        const cards = prevTable.cards.map((card) => {
          if (card.id !== itemID) return card;
          isFlipped = !card.isFlipped;
          if (card.pile.length > 0) {
            card.pile.map((cardInPile) => cardInPile.isFlipped = isFlipped)
          }
          card.isFlipped = isFlipped
          return card;
        });
        prevTable.cards = cards;
        return {...prevTable};
      });
      setCanEmit(true);
    }
    else if (option === 'Disassemble') {
      setTableData((prevTable) => {
        prevTable.cards.forEach((card) => {
          if (card.id === itemID && card.pile.length > 0) {
            card.pile.forEach(cardInPile => prevTable.cards.push(cardInPile))
            card.pile.forEach((cardInPile, index) => cardInPile.x = card.x + (index+1)*20)
            card.pile.forEach((cardInPile, index) => cardInPile.y = card.y + (index+1)*20)
            card.pile = []
          };
        });
        return {...prevTable};
      });
      setCanEmit(true);
    }
    setItemUpdated({ itemID, option, isFlipped });
    setRightClickPos({ x: null, y: null });
    setClickedID(null);
  }

  return (
    <Group x={x} y={y} onClick={handleOptionClick}>
      <Rect
        x={0}
        y={0}
        width={WIDTH}
        height={OPTIONS.length * LINE_HEIGHT}
        stroke="black"
        strokeWidth={0.5}
      />
      {OPTIONS.map((option, index) => (
        <Group key={index} >
          <Rect
            x={0}
            y={index * LINE_HEIGHT}
            width={WIDTH}
            height={LINE_HEIGHT}
            fill={index % 2 === 0 ? '#f0f0f0' : '#ffffff'}
            onClick={()=>handleOptionClick(option)}
          />
          <Text
            x={PAD}
            y={index * LINE_HEIGHT + PAD}
            text={option}
            fontSize={14}
            onClick={()=>handleOptionClick(option)}
          />
        </Group>
      ))}
    </Group>
  );
};
export default RightClickMenu;