import React from 'react';
import { Layer } from 'react-konva';
import Card from '../card/card'

// deck data


const Hand = (socket) => {
    return (
        <>
            <Layer>
                <Card></Card>
            </Layer>
        </>
    );
};

export default Hand;
