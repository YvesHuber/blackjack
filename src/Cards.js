import './App.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';
import { sizeHeight } from '@mui/system';

export default function Cards() {
    const [deck, setDeck] = useState([]);
    const [deckID, setDeckID] = useState();
    const [dealercard, setDealercard] = useState([])
    const [playercard, setPlayercard] = useState([])
    const [playercounter, setPlayercounter] = useState([0])

    function getDeck() {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
                console.error('Error:', error);
            });
        console.log(deckID);
    }

    function calculateValue(cards, setcounter,counter){
        setcounter(0)
        let value = 0
        for(let card of cards){
            console.log(typeof(card.value))
            if (card.value == "KING"){
               value = 10
            }
            else if (card.value == "QUEEN"){
                value = 10
            }
            else if (card.value == "JACK"){
                value = 10
            }
            else if(card.value == "ACE"){
                value = 11
            }
            else {
                value = parseInt(card.value)
            }
            setcounter(counter + value)
        }

    }

    function getCard(setCard, currentCards) {
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => setCard(currentCards => [...currentCards, data.cards[0]]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
                console.error('Error:', error);
            });
    }
   

    function getHiddenCard(setCard, currentCards) {
        let cards = []
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => cards.push(data.cards[0]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
                console.error('Error:', error);
            });
        console.log(cards)
    }

    function startGame(){
        getCard(setPlayercard, playercard)
        getCard(setPlayercard, playercard)
    }

    function clearCards() {
        setPlayercard([]);
        setDealercard([]);
        startGame()
    }

    useEffect(() => {
        getDeck()
    }, []);  
    useEffect(() => {
        calculateValue(playercard, setPlayercounter, playercounter)
    }, [playercard]);  

    useEffect(() => {
        console.log(deckID)
        if(deckID != undefined){
            startGame()
        }
    }, [deckID]);              
    //Ruft beim starten der Seite die function getDeck () auf

    useEffect(() => {
        console.log(playercard)
    }, [playercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde
    
    useEffect(() => {
        console.log(dealercard)
    }, [dealercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde

    return (<div className="App">
            <header className="App-header">
                {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
                <Grid container rowSpacing={3} alignItems="flex-start" justifyContent="center">
                    <Grid>
                        <h2>Dealer</h2>
                    </Grid>
                <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {dealercard.map((c) => <Grid item>
                            <img height={"80vh"} src={c.image}></img>
                            <p>{c.value}</p>
                        </Grid>)}
                    </Grid>


                    <Grid>
                        <h2>Player</h2>
                    </Grid>
                    <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {playercard.map((c) => <Grid item>
                            <img height={"80vh"} src={c.image}></img>
                            <p>{c.value}</p>
                        </Grid>)}
                    </Grid>
                    <Grid>
                        <h1>{playercounter}</h1>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}>Player</Button>
                    </Grid>


                    <Grid item>
                        <Button variant="contained" onClick={clearCards}>Restart</Button>
                    </Grid>

                </Grid>
            </header>
        </div>

    )
}