import React, {Component} from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { getCards } from './cards';

class App extends Component {
  constructor(props) {
    super(props);

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
    this.pushResult = false;

    this.state = {
      showButtons: false,
      showStartButton: true,
      result: false
    }
    this.resultText = String;
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
      this.resultText = "YOU BUST";
      console.log("YOU BUST");
    }
    else if (this.playerWon === true) {
      if(this.blackjack === true){
        this.resultText = "BLACKJACK";
        console.log("BLACKJACK")
      }
      else {
        this.resultText = "YOU WON";
        console.log("YOU WON");
      }
    }
    else if (this.dealerBust === true) {
      this.resultText = "DEALER BUST";
      console.log("DEALER BUST");
    }
    else if (this.pushResult === true) {
      this.resultText = "PUSH";
      console.log("PUSH");
    }
    else if (this.dealerWon === true) {
      if(this.blackjack === true){
        let flipCard = document.getElementById("dealerSecondCard");
        flipCard.src = `card-Images/${this.dealerHand.cards[1].src}`;
        this.resultText = "DEALER HAS BLACKJACK";
        console.log("DEALER HAS BLACKJACK")
      }
      else {
        this.resultText = "DEALER WON";
        console.log("DEALER WON")
      }
    }
    this.setState({result: true})
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
      let flipCard = document.getElementById("dealerSecondCard");
      flipCard.src = `card-Images/${this.dealerHand.cards[1].src}`;
      this.endGame();
    }
    if(this.playerHand.value === 21) {
      this.stand();
    }
    console.log(this.playerHand);
  }

  //Stand button functionality
  stand = () => {
    let flipCard = document.getElementById("dealerSecondCard");
    flipCard.src = `card-Images/${this.dealerHand.cards[1].src}`;

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
    else if (this.playerHand.value === this.dealerHand.value) {
      this.pushResult = true;
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
    hand.cards.push(drawnCard);
    if(hand.cards[0].value === 10) {
      this.checkForBlackJack(drawnCard, hand);
    }
    if (drawnCard.name === "ace") {
      this.aceValue(drawnCard, hand);
    }
    

    var cardImage = document.createElement("img");
    if (hand.name === "dealer" && hand.cards.length === 2) {

      cardImage.id = `dealerSecondCard`;
      cardImage.src = `card-Images/BACK.png`;
      cardImage.className += `deal-${hand.name}`;
      document.getElementById(`${hand.name}Hand`).appendChild(cardImage);
    }

    else { 
      cardImage = document.createElement("img");
      cardImage.src = `card-Images/${drawnCard.src}`;
      cardImage.className += `deal-${hand.name}`;
      document.getElementById(`${hand.name}Hand`).appendChild(cardImage);
    }
    
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
  aceValue = (card, hand) => {
    if (hand.value > 10) {
      card.value = 1;
    }
    else if (hand.value <=10) {
      card.value = 11;
    }

    return card.value;
  }

  checkForBlackJack = (card, hand) => {
    if (card.name === "ace" && hand.cards[0].value === 10) {
      if (hand.name === "player") {
        this.playerWon = true;
      }
      else if (hand.name === "dealer") {
        this.dealerWon = true;
      }
      this.blackjack = true;
      this.endGame();
    }
    else if (card.value === 10 && hand.cards[0].name === "ace") {
      this.blackjack = true;
      this.endGame();
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

    document.querySelectorAll("#dealerHand img")
      .forEach(img => img.remove());
    document.querySelectorAll("#playerHand img")
      .forEach(img => img.remove());
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
    this.pushResult = false;
    this.setState({result: false});

    
  }
;
  render() {
    
    return (
      
      <div className="App">
        <div className="header-container">
          <h5>BLACKJACK</h5>
          {this.state.showStartButton && (<Button id="startButton" onClick={this.startGame} variant="contained">Start Game</Button>)}
        </div>
        <div id="deck" className="deck-container">
          <img src="card-Images/BACK.png" alt='deck' id="deck-pile" ></img>
        </div>
        <div id="hands" className="hands-container">
          <div id="dealerHand" className="row">

          </div>
          <div id="playerHand" className="row">

          </div>
        </div>
        {this.state.result && (<div className="result-container">{this.resultText}</div>)}
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
