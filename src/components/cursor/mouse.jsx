import React, { Component } from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';
import { color } from '@mui/system';
export default class Cursor extends Component {
    constructor(props) {
        super(props);
        this.location = React.createRef();
    }
    state = {
        //left: this.location.current.left,
        //top: this.location.current.top
        left: this.props.left,
        top: this.props.top ,
        id: this.props.id,
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
                x={this.props.left}
                y={this.props.top}
                width={10}
                height={10}
                fill={'red'}
                shadowBlur={5}
                //draggable="true"
            />
        );
    }
}