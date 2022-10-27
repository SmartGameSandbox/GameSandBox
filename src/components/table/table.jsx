import React from 'react';
import { Layer } from 'react-konva';
import Deck from '../deck/deck';

// deck data

const Table = (socket) => {
    return (
        <>
            <Layer>
                <Deck socket={socket} />
            </Layer>
        </>
    );
};

export default Table;
