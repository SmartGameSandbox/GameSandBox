import React, { Component } from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';
import { color } from '@mui/system';
import { ThirteenMpSharp } from '@mui/icons-material';
export default class Cursor extends Component {
    constructor(props) {
        super(props);
        this.location = React.createRef();
    }
    state = {
        //left: this.location.current.left,
        //top: this.location.current.top
        x: this.props.x,
        y: this.props.y,
        //id: this.props.username,
        //compareTo: this.props.compare
    };

    /*
    compareUsername = (username)=> {
        compareTo(username === this.id)
    }
    */

    render() {
        return (
            <Rect
                ref={this.location}
                x={this.state.x}
                y={this.state.y}
                width={10}
                height={10}
                fill={'red'}
                //shadowBlur={5}
                //draggable="true"
            />
        );
    }
}