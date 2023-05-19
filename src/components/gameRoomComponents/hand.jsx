// This module the actions that can be performed on the hand zone of a player.
// Notes: Card should be renamed (see card.jsx).
// Notes: OnDragEndCard should be renamed as any game object (token, etc) can exist within a player's hand.
// Notes: Potentially refactor into gameaction.jsx.

import React from 'react';
import Card from './card'
import { onDragMoveGA, onDragEndGA } from "../gameaction/gameaction";

// deck data
const Hand = (props) => {
    const { tableData } = props;

    return (
        <>
            {tableData?.hand?.map((card) => (
                <Card
                    key={"hand_" + card.id}
                    src={card.isFlipped
                            ? card.imageSource.front
                            : card.imageSource.back?.data
                                ? card.imageSource.back
                                : card.imageSource.front}
                    id={card.id}
                    type={card.type}
                    x={card.x}
                    y={card.y}
                    isLandscape={card.isLandscape}
                    onDragEnd={(e, id) => onDragEndGA(e, id, props, "hand")}
                    onDragMove={(e, id) => onDragMoveGA(e, id, props, "hand")}
                    draggable
                />
            ))}
        </>
    );
};

export default Hand;
