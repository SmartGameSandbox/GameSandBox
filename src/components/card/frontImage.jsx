import React from 'react';
import { Image } from 'react-konva';
import PokerFront from '../../images/PokerFront_2Heart.jpg';
import useImage from "use-image";

const CardFront = () => {
    const [frontImage] = useImage(PokerFront);
    return <Image image={frontImage}
    width={180}
    height={240}
    shadowBlur={5}
    draggable="true"
     />;
  };

export default class FrontImage extends React.Component {
    constructor() {
      super();
    }
  
    render() {
      return (
        <CardFront/>
      )
    }
  }