import React from 'react';
import { Circle, Text } from 'react-konva';
import * as Constants from '../../util/constants';

// create functional component
const Cursors = ({ cursors }) => {
    const COLORS = ['blue', 'green', 'yellow', 'purple', 'orange'];

    return (
        <>
            {cursors && cursors.length > 0 && cursors
                .filter((cursor) => cursor.y < Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT)
                .map((cursor, index) => {
                    return (
                        <>
                            <Circle
                                key={`cursor_circle_${cursor.username}`}
                                x={cursor.x}
                                y={cursor.y}
                                width={10}
                                height={10}
                                fill={COLORS[index % COLORS.length]}
                            />
                            <Text
                                key={`cursor_text_${cursor.username}`}
                                text={cursor.username} x={cursor.x - 10}
                                y={cursor.y + 12}
                            />
                        </>
                    );
                })}
        </>
    );
}

export default Cursors;