import React from 'react';
import ReactCardFlip from 'react-card-flip';
import PokerFront from '../../images/PokerFront_2Heart.jpg';
import PokerBack from '../../images/PokerBack.png';


export default class CardImage extends React.Component {
    constructor() {
      super();
        this.state = {
        isFlipped: false
      };
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick(e) {
      e.preventDefault();
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
  
    render() {
      return (
            <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
                <img src={PokerBack} onClick={this.handleClick}>
                </img>
                <img src={PokerFront} onClick={this.handleClick}>
                </img>
            </ReactCardFlip>
      )
    }
  }