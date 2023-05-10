import React, { useState, useEffect, useRef } from 'react';
import { Group, Layer, Rect, Text } from "react-konva";

const RightClickMenu = ({ x, y, cardId, setTableData, setRightClickPos, setClickedCardID}) => {
  const options = ['Flip', 'Rotate'];
  const padding = 5;
  const lineHeight = 24;
  const width = 100;

  const handleOptionClick = (option) => {
    if (option == 'Flip') {
      setTableData((prevTable) => {
        const cards = prevTable.cards.map((card) => {
          if (card.id !== cardId) return card;
          const changeCard = card;
          changeCard.isFlipped = !changeCard.isFlipped;
          return changeCard;
        });
        prevTable.cards = cards;
        return prevTable;
      });
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