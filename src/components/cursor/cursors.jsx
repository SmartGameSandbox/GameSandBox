import React from 'react';
import { Circle, Text, Group } from 'react-konva';

// create functional component
const Cursors = (props) => {
    const [displayCursors, setDisplayCursors] = React.useState([]);
    const COLORS = ['blue', 'green', 'yellow', 'purple', 'orange'];
    React.useEffect(() => {
        setDisplayCursors(props.cursors);
    }, [props.cursors]);

    return (
        <>
            {displayCursors.map((cursor, index) => {
                if (props.username !== cursor.username) {
                    return (
                        <>
                            <Group key={`cursor_group_${cursor.username}`}>
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
                            </Group>
                        </>
                    );
                } else {
                    return null;
                }
            })}
        </>
    );
}

export default Cursors;