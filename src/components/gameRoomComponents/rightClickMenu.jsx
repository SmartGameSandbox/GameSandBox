import { Group, Rect, Text } from "react-konva";
import * as Constants from "../../util/constants";
const { v4: uuidv4 } = require("uuid");

const RightClickMenu = ({
  x, y, itemID, options, setTableData, setRightClickPos, setClickedID, setCanEmit, setItemUpdated
}) => {
  const OPTIONS = options;
  const PAD = 5;
  const LINE_HEIGHT = 24;
  const WIDTH = 100;

  const handleOptionClick = (option) => {
    let isFlipped, isLocked, isUnlocked, shuffledPile, splitPile;

    if (option === 'Flip') {
      setTableData((prevTable) => {
        console.log(prevTable);
        // Iterate through the cards to find the one to flip
        const cards = prevTable.cards.map((card) => {
          if (card.id !== itemID) return card;
          // Toggle the flip state for the selected card
          const isFlipped = !card.isFlipped;
          
          // Flip all cards in the pile if it exists
          if (card.pile.length > 0) {
            card.pile.forEach((cardInPile) => cardInPile.isFlipped = isFlipped);
          }
    
          // Update the flip state for the selected card
          card.isFlipped = isFlipped;
          return card;
        });
    
        // Update the cards array and return the modified table data
        prevTable.cards = cards;
        return { ...prevTable };
      });
      setCanEmit(true);
    }
    else if (option === 'Disassemble') {
      setTableData((prevTable) => {
        // Iterate through the cards to find the one to disassemble
        prevTable.cards.forEach((card) => {
          if (card.id === itemID && card.pile.length > 0) {
            // Define offsets based on the canvas width and height
            const xOffset = card.x > 600 ? -20 : 20;
            const yOffset = card.y > 240 ? -20 : 20;
    
            // Move each card in the pile back to the main cards array
            card.pile.forEach((cardInPile, index) => {
              prevTable.cards.push(cardInPile);
              // Adjust positions for each card from the pile
              cardInPile.x = card.x + (index + 1) * xOffset;
              cardInPile.y = card.y + (index + 1) * yOffset;
            });
            // Clear the pile after disassembling it
            card.pile = [];
          }
        });
        return { ...prevTable };
      });
      setCanEmit(true);
    }
    else if (option === 'Shuffle') {
      setTableData((prevTable) => {
        // Create a new array of cards with updated properties
        const cards = prevTable.cards.map((card) => {
          // Locate the card to be shuffled by matching its ID
          if (card.id === itemID && card.pile.length > 0) {
            // Create a copy of the top card in the pile to reset its properties
            const topCard = { ...card };
            topCard.x = -100;
            topCard.y = -100;
            topCard.pile = [];
            // Push the reset card to the pile
            card.pile.push(topCard);
    
            // Save the current state of the card before shuffling
            const prevCard = {
              x: card.x,
              y: card.y,
              pile: card.pile,
            };
    
            // Fisher-Yates shuffle for the pile array
            for (let i = card.pile.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [card.pile[i], card.pile[j]] = [card.pile[j], card.pile[i]];
            }
    
            // Find a random card from the shuffled pile
            const randomIndex = Math.floor(Math.random() * card.pile.length);
            const randomCard = card.pile[randomIndex];
            const indexToRemove = card.pile.findIndex((c) => c.id === randomCard.id);
    
            // Update the card with the randomly selected card and its properties
            card = { ...randomCard };
            card.x = prevCard.x;
            card.y = prevCard.y;
            card.pile = prevCard.pile;
            // Remove the selected card from the pile
            card.pile.splice(indexToRemove, 1);
            // Create an object to represent the shuffled pile
            const finalCard = { ...card };
            shuffledPile = { finalCard };
            return finalCard;
          }
          return card;
        });
        // Update the cards array in the table data
        prevTable.cards = cards;
        return { ...prevTable };
      });
      setCanEmit(true);
    }
    else if (option === 'Lock') {
      setTableData((prevTable) => {
        // Map through the cards to find the one to lock and update its properties
        const updatedDeck = prevTable.cards.map((card) => {
          if (card.id === itemID && card.pile.length > 0) {
            // Create an updated pile with adjusted positions
            const updatedPile = card.pile.map((item) => {
              return {
                ...item,
                x: card.x - Constants.DECK_PADDING,
                y: card.y - Constants.DECK_PADDING
              };
            });
            card.pile = [];
            card.x = card.x - Constants.DECK_PADDING;
            card.y = card.y - Constants.DECK_PADDING;
            // Add the locked cards to the updated pile
            updatedPile.push(card);
            return updatedPile;
          }
          return null;
        });
        // Filter out null values and create a new deck
        const newDeck = updatedDeck.filter((pile) => pile !== null);
    
        // Create a new deck array and dimensions for the locked cards
        const deckArray = newDeck[0];
        const newDeckDimension = {
          id: uuidv4(),
          x: deckArray[0].x,
          y: deckArray[0].y,
          height: deckArray[0].height,
          width: deckArray[0].width
        };
        
        // Find the index of the card to remove from the cards array
        const indexToRemove = prevTable.cards.findIndex((card) => card.id === itemID);
    
        // Update the table data with the locked cards and deck
        prevTable.deck.push(deckArray);
        prevTable.deckDimension.push(newDeckDimension);
        if (indexToRemove !== -1) prevTable.cards.splice(indexToRemove, 1);
    
        // Store information about the locked state
        isLocked = [prevTable.cards, prevTable.deck, prevTable.deckDimension];
    
        return prevTable;
      });
      setCanEmit(true);
    }
    else if (option === "Unlock") {
      setTableData((prevTable) => {
        // Retrieve the card array from the deck
        const cardArray = prevTable.deck[itemID];
        // Find the newest card added to the deck (last in the array)
        const newCard = cardArray[cardArray.length - 1];
    
        if (cardArray.length > 0) {
          // Move all cards except the newest one to a hidden position
          cardArray.forEach((card) => {
            if (card !== newCard) {
              card.x = -100;
              card.y = -100;
            }
          });
          // Remove the newest card from the deck
          cardArray.pop();
    
          // Reconstruct the pile with remaining cards
          newCard.pile = cardArray;
          newCard.x = newCard.x + Constants.DECK_PADDING;
          newCard.y = newCard.y + Constants.DECK_PADDING;
    
          // Add the newest card back to the main cards array
          prevTable.cards.push(newCard);
        }
    
        // Remove the unlocked deck from the table data
        prevTable.deck.splice(itemID, 1);
        prevTable.deckDimension.splice(itemID, 1);
    
        // Store information about the unlocked state
        isLocked = [prevTable.cards, prevTable.deck, prevTable.deckDimension];
    
        return prevTable;
      });
      setCanEmit(true);
    }
    else if (option === "Split") {
      setTableData((prevTable) => {
        // Map through the cards to find the one to split and update its properties
        const newCard = prevTable.cards.map((card) => {
          if (card.id === itemID && card.pile.length > 0) {
            // Create a copy of the card for the first split
            const newPile = { ...card };
            // Reset properties for the original card
            const newCard = { ...card };
            newCard.x = -100;
            newCard.y = -100;
            newCard.pile = [];
            // Move the new card to a separate pile
            newPile.pile.unshift(newCard);
    
            // Split the pile into two halves
            const splitIndex = Math.ceil(newPile.pile.length / 2);
            const firstHalf = newPile.pile.slice(0, splitIndex);
            const secondHalf = newPile.pile.slice(splitIndex);
    
            // Adjust positions based on canvas dimensions
            const xOffset = card.x > 600 ? -20 : 20;
            const yOffset = card.y > 240 ? -20 : 20;
    
            // Update positions for the first and second halves
            const firstCard = { ...firstHalf[0] };
            firstCard.x = card.x;
            firstCard.y = card.y;
            firstHalf.splice(0, 1);
            firstCard.pile = firstHalf;
    
            const secondCard = { ...secondHalf[0] };
            secondCard.x = card.x + xOffset;
            secondCard.y = card.y + yOffset;
            secondHalf.splice(0, 1);
            secondCard.pile = secondHalf;
    
            // Return the split cards as an array
            return [firstCard, secondCard];
          }
          return card;
        });
        
        // Flatten the array of split cards and update the table data
        const flattenedNewCards = newCard.reduce((acc, val) => acc.concat(val), []);
        const updatedTable = { ...prevTable, cards: flattenedNewCards };
    
        // Store information about the split pile
        splitPile = flattenedNewCards;
        return updatedTable;
      });
      setCanEmit(true);
    }
    setItemUpdated({ itemID, option, isFlipped, isLocked, isUnlocked, shuffledPile, splitPile });
    setRightClickPos({ x: null, y: null });
    setClickedID(null);
  }

  return (
    <Group x={x} y={y} onClick={handleOptionClick}>
      <Rect
        x={0}
        y={0}
        width={WIDTH}
        height={OPTIONS.length * LINE_HEIGHT}
        stroke="black"
        strokeWidth={0.5}
      />
      {OPTIONS.map((option, index) => (
        <Group key={index} >
          <Rect
            x={0}
            y={index * LINE_HEIGHT}
            width={WIDTH}
            height={LINE_HEIGHT}
            fill={index % 2 === 0 ? '#f0f0f0' : '#ffffff'}
            onClick={()=>handleOptionClick(option)}
          />
          <Text
            x={PAD}
            y={index * LINE_HEIGHT + PAD}
            text={option}
            fontSize={14}
            onClick={()=>handleOptionClick(option)}
          />
        </Group>
      ))}
    </Group>
  );
};
export default RightClickMenu;

//  OPTION FUNCTIONALITY: ===============================

// Flip:
// This function toggles the flip state of a card when the 'Flip' option is selected.
// It also ensures that if the card belongs to a pile, it flips all cards within that pile as well. Finally, it updates the table data with the modified flip state.

// Disassemble:
// This function disassembles a pile of cards, moving each card back to the main cards array while adjusting their positions based on the canvas dimensions.
// It clears the pile after disassembling it and updates the table data accordingly.

// Shuffle: 
// This code essentially shuffles a specific card's pile by implementing the Fisher-Yates shuffle algorithm.
// It resets the top card's position and adds it back to the pile before shuffling. Then, it randomly selects a card from the pile, updates its position and removes it from the pile to ensure a proper shuffle effect.

// Lock:
// This function locks a card within a deck by updating its properties and moving it to a separate deck.
// It adjusts the positions of the locked cards and stores information about the locked state within the table data.

// Unlock:
// This function essentially unlocks a deck of cards by moving the top card back to the main cards array and placing the rest of the cards at a hidden position.
// It reconstructs the pile and removes the unlocked deck from the table data while maintaining the unlocked state information.

// Split:
// This function splits a pile of cards into two halves by creating separate piles and adjusting their positions on the canvas.
// It then updates the table data with the split cards and stores information about the split pile for further usage.


// TODO: =============================== 

// Migrate all of this code to server.js so that it runs server side. Then, export the variables from there.