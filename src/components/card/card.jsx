import React, { Component } from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';
import { Image } from 'react-konva';
import CardImage from './cardImage'
import PokerBack from '../../images/PokerBack.png'

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.shapeRef = React.createRef();
    }
    state = {
        x: 50,
        y: 50,
    };
    handleDragMove = (data) => {
        this.props.onDragMove(data);
    }
    moveToPosition = (data) => {
        this.shapeRef.current.setX(data.x);
        this.shapeRef.current.setY(data.y);
    }
    render() {
        return (
            <CardImage src='https://konvajs.org/assets/yoda.jpg'/>
            // {/* <Rect
            //     ref={this.shapeRef}
            //     x={this.state.x}
            //     y={this.state.y}
            //     width={50}
            //     height={50}
            //     fill={Konva.Util.getRandomColor}
            //     shadowBlur={5}
            //     draggable="true"
            //     onDragMove={this.handleDragMove}
            // />             */}
        );
    }
}