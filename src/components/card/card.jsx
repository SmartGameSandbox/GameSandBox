import React, { Component } from 'react';
import CardImage from './cardImage';
import PokerFront from '../../images/PokerFront_2Heart.jpg';
import { Rect } from 'react-konva';
import Draggable from 'react-draggable';
import PokerBack from '../../images/PokerBack.png';
import { Image } from 'react-konva';
import useImage from 'use-image';


const CardBack = () => {
    const [backImage] = useImage(PokerBack);
    return <Image image={backImage}
    width={140}
    height={200}
    shadowBlur={5}
    draggable="true"
     />;
  };

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.shapeRef = React.createRef();
        this.state = {
            x: 50,
            y: 50,
            isFlipped: false,
        }
    }

    handleDragMove = (data) => {
        this.props.onDragMove(data);
    }
    handleClick(event) {
      console.log(this.state.isFlipped);
      event.preventDefault();
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    moveToPosition = (data) => {
        this.shapeRef.current.setX(data.x);
        this.shapeRef.current.setY(data.y);
    }
    flipCard(data) {
        console.log(data);
    }
    render() {
        return (
            <CardBack></CardBack>
        )

        // if (this.state.flipped) {
        //     return (
        //         <CardImage
        //         onClick ={this.handleClick}/>
        //     )
        // } else {
            // return (
            //     <Rect
            //         ref={this.shapeRef}
            //         x={this.state.x}
            //         y={this.state.y}
            //         width={50}
            //         height={50}
            //         fillPatternImage={this.state.fillPatternImage}
            //         shadowBlur={5}
            //         draggable="true"
            //         onDragMove={this.handleDragMove}
            //         onClick={this.handleClick}
            //     />             
            // );
        }
    }