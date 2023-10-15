import React, {Component} from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { getCards } from './cards';

class App extends Component {
  constructor(props) {
    super(props);

    // this.playerHand = [];
    // this.playerHandTotal = 0;
    // this.dealerHand = [];
    // this.dealerHandTotal = 0;
    this.playerHand = {
      name: "player",
      value: 0,
      cards: []
    }
    this.dealerHand = {
      name: "dealer",
      value: 0,
      cards: []
    }
    this.deck = getCards().cards;
    this.sum = 0;
    this.playerBust = false;
    this.dealerBust = false;
    this.playerWon = false;
    this.dealerWon = false;
    this.blackjack = false;

    this.state = {
      showButtons: false,
      showStartButton: true
    }
  }

  //Button functionality
  startGame = () => {
    this.setState({showButtons: true})
    this.setState({showStartButton: false})
    this.reset();
    this.shuffleDeck();
    this.dealCards();
    
  }

  endGame = () => {
    if (this.playerBust === true) {
      console.log("YOU BUST");
    }
    else if (this.playerWon === true) {
      if(this.blackjack === true){
        console.log("BLACKJACK")
      }
      console.log("YOU WON");
    }
    else if (this.dealerBust === true) {
      console.log("DEALER BUST");
    }
    else if (this.dealerWon === true) {
      if(this.blackjack === true){
        console.log("DEALER HAS BLACKJACK")
      }
      console.log("DEALER WON");
    }
    this.setState({showButtons: false})
    this.setState({showStartButton: true})

  }
  //shuffle deck
  shuffleDeck() {
    
    let currentIndex = this.deck.length,  randomIndex;
  
    while (currentIndex > 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [this.deck[currentIndex], this.deck[randomIndex]] = [
        this.deck[randomIndex], this.deck[currentIndex]];
    }
  
    this.deck.splice(0, -4);
    return this.deck;
  }

  //Hit button functionality
  hit = () => {
    this.dealCard(this.playerHand);
    this.playerHand.value = this.getCardPointsTotal(this.playerHand);

    if(this.playerHand.value > 21) {
      this.playerBust = true;
      this.endGame();
    }
    if(this.playerHand.value === 21) {
      this.stand();
    }
    console.log(this.playerHand);
  }

  //Stand button functionality
  stand = () => {
    while(this.dealerHand.value < 17) {
      this.dealCard(this.dealerHand);
      this.dealerHand.value = this.getCardPointsTotal(this.dealerHand)
    }

    if(this.dealerHand.value > 21) {
      this.dealerBust = true;
    }

    else if(this.playerHand.value > this.dealerHand.value) {
      this.playerWon = true;
    }
    else if(this.playerHand.value < this.dealerHand.value) {
      this.dealerWon = true;
    }
    console.log(this.dealerHand);
    this.endGame();
  }

  //Double button functionality
  double = () => {
    this.hit();
    this.stand();
  }
  //function to deal card to given hand
  dealCard = hand => {
    
    let drawnCard = this.deck.pop();
    this.checkForAce(drawnCard, hand);
    hand.cards.push(drawnCard);

    var cardImage = document.createElement("img");
    cardImage.src = `card-Images/${drawnCard.src}`;
    cardImage.className += `deal-${hand.name}`;
    document.getElementById("playerHand").appendChild(cardImage);
    
  }

  dealCards = () => {
    
    this.dealCard(this.playerHand);
    this.playerHand.value = this.getCardPointsTotal(this.playerHand);
    console.log(this.playerHand);

    setTimeout(() => {
      this.dealCard(this.dealerHand);
    this.dealerHand.value = this.getCardPointsTotal(this.dealerHand);
    console.log(this.dealerHand);
    }, 1000);

    setTimeout(() => {
      this.dealCard(this.playerHand);
    this.playerHand.value = this.getCardPointsTotal(this.playerHand);
    console.log(this.playerHand);
    }, 2000);

    setTimeout(() => {
      this.dealCard(this.dealerHand);
    this.dealerHand.value = this.getCardPointsTotal(this.dealerHand);
    console.log(this.dealerHand);
    }, 3000);

    if(this.dealerHand.value || this.playerHand.value === 21) {
      this.blackjack = true;
      this.endGame();
    }
  }

  //Check if dealt card is an ace and evaluate it's point value
  checkForAce = (card, hand) => {
    if(card.name === "ace") {
      if(this.getCardPointsTotal(hand) === 10){
        //BlackJack
        if(hand.cards.length === 1) {
          this.blackjack = true;
          if(hand.name === "player"){
            this.playerWon = true;
          }
          if(hand.name === "dealer"){
            this.dealerWon = true;
          }
          this.endGame();
        }
        else {

          if(hand.name === "player"){
            this.playerWon = true;
          }
          if(hand.name === "dealer"){
            this.dealerWon = true;
          }
          this.endGame();
        }
      }

      if(this.getCardPointsTotal(hand) >= 11){
        card.value = 1;
      }
    }
  }

  getCardPointsTotal = hand => {
    
    this.sum = 0;
    for(let i = 0; i <= hand.cards.length-1; i++) {
      this.sum += hand.cards[i].value;
    }
    return this.sum;
  }

  reset = () => {
    this.playerHand = {
      name: "player",
      value: 0,
      cards: []
    }
    this.dealerHand = {
      name: "dealer",
      value: 0,
      cards: []
    }
    this.playerBust = false;
    this.dealerBust = false;
    this.playerWon = false;
    this.dealerWon = false;
    this.blackjack = false;
  }
;
  render() {
    
    return (
      
      <div className="App">
        <div>
            <h5>BLACKJACK</h5>
            {this.state.showStartButton && (<Button id="startButton" onClick={this.startGame} variant="contained">Start Game</Button>)}
            <div id="deck">
              <img src="card-Images/BACK.png" alt='deck' id="deck-pile" ></img>
            </div>
        </div>
        <div>
            <div id="dealerHand">

            </div>
            <div/>
            <div id="playerHand">

            </div>
        
        </div>
        {this.state.showButtons && (<div className='buttonPosition'><Stack direction="row" spacing={2}>
        <Button id="doubleButton" onClick={this.double} variant="contained">DOUBLE</Button>
        <Button id="hitButton" onClick={this.hit} variant="contained"> HIT</Button>
        <Button id="standButton" onClick={this.stand} variant="contained">STAND</Button>
      </Stack></div>
      )}
        
      </div>
    );
  }
}

export default App;
