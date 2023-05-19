import { Group, Rect, Text } from "react-konva";

const RightClickMenu = ({
  x, y, cardId, setTableData, setRightClickPos, setClickedCardID, setCanEmit, setItemBeingUpdated
}) => {
  const options = ['Flip', 'Rotate', "Disassemble"];
  const padding = 5;
  const lineHeight = 24;
  const width = 100;

  const handleOptionClick = (option) => {
    setItemBeingUpdated(null);
    if (option === 'Flip') {
      setTableData((prevTable) => {
        const cards = prevTable.cards.map((card) => {
          if (card.id !== cardId) return card;
          if (card.pile.length > 0) {
            card.pile.map((cardInPile) => cardInPile.isFlipped = !cardInPile.isFlipped)
          }
          card.isFlipped = !card.isFlipped
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
          if (card.id === cardId && card.pile.length > 0) {
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
    setRightClickPos({ x: null, y: null });
    setClickedCardID(null);
  }

  return (
    <Group x={x} y={y} onClick={handleOptionClick}>
      <Rect
        x={0}
        y={0}
        width={width}
        height={options.length * lineHeight}
        stroke="black"
        strokeWidth={0.5}
      />
      {options.map((option, index) => (
        <Group key={index} >
          <Rect
            x={0}
            y={index * lineHeight}
            width={width}
            height={lineHeight}
            fill={index % 2 === 0 ? '#f0f0f0' : '#ffffff'}
            onClick={()=>handleOptionClick(option)}
          />
          <Text
            x={padding}
            y={index * lineHeight + padding}
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