import React from 'react';
import { Image } from 'react-konva';
import PokerBack from '../../images/PokerBack.png';
import useImage from "use-image";


const CardBack = () => {
    const [backImage] = useImage(PokerBack);
    return <Image image={backImage}
    width={180}
    height={240}
    shadowBlur={5}
    draggable="true"
     />;
  };

export default class BackImage extends React.Component {
    constructor() {
      super();
    }
  
    render() {
      return (
        <Draggable>
        <img src={PokerBack}>
        </img>
        </Draggable>
      )
    }
}