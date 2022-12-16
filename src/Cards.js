/* eslint-disable jsx-a11y/alt-text */
import './App.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';
import { sizeHeight } from '@mui/system';
import LinearProgress from '@mui/material/LinearProgress';


export default function Cards() {
    const [deck, setDeck] = useState([]);
    const [deckID, setDeckID] = useState();
    const [dealercard, setDealercard] = useState([])
    const [playercard, setPlayercard] = useState([])
    const [playercounter, setPlayercounter] = useState([0])
    const [dealercounter, setDealercounter] = useState([0])
    const [loading, setLoading] = useState(true)
    const [hiddencard, sethiddencard] = useState(true)

    function getDeck() {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
            });
    }

    function calculateValue(cards, setcounter,counter){
        setcounter(0)
        let value = 0
        for(let card of cards){
            console.log(card)
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
                     if(counter + 11 >= 21){
                         value = 1
                     }
                     else {
                         value = 11
                     }
                 }
                 else {
                     value = parseInt(card.value)
                 }
            
            setcounter(counter + value)

        }

    }

    function getCard(setCard, currentCards) {
        document.getElementById("vid").play();
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => setCard(currentCards => [...currentCards, data.cards[0]]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
            });
    }
    function call(){
        getCard(setPlayercard, playercard)
    }
    function stay(){
        if (dealercounter <= 16){
            getCard(setDealercard, dealercard)
        }
        if(dealercounter > playercounter && dealercounter <= 21){
            alert("you lost")
        }
        else if (dealercounter < playercounter && playercounter <= 21 ){
            alert("you won")

        }
    }




    function startGame() {
        getCard(setPlayercard, playercard)
        getCard(setPlayercard, playercard)
        getCard(setDealercard, dealercard)
        getCard(setDealercard, dealercard)
    }

    function clearCards() {
        setPlayercard([]);
        setDealercard([]);
        startGame()
    }

    useEffect(() => {
        document.getElementById("vid").play();
        getDeck()
    }, []);
    useEffect(() => {
        calculateValue(playercard, setPlayercounter, playercounter)
    }, [playercard]);  
    useEffect(() => {
        if(playercounter > 21){
            alert("you lost")
        }
    }, [playercounter]);  
    useEffect(() => {
        calculateValue(dealercard, setDealercounter, dealercounter)
    }, [dealercard]);  

    useEffect(() => {
        if(deckID != undefined){
            startGame()
            setLoading(false)
        }
    }, [deckID]);              

    useEffect(() => {
        if(dealercard != undefined){
            if (dealercard.length == 2){
                let cards = dealercard
               let obj = dealercard[1]
               obj.hidden = true
               cards[1] = obj;
               setDealercard(cards)
               calculateValue(cards, setDealercounter, dealercounter)

            }
            else if (dealercard.length > 2){
                let cards = dealercard
               let obj = dealercard[1]
               obj.hidden = false
               cards[1] = obj;
               setDealercard(cards)
               sethiddencard(false)
               calculateValue(cards, setDealercounter, dealercounter)

            }
            /*
            if (dealercounter <= 16 && dealercard.length == 2){
                getCard(setDealercard, dealercard)
            }
            */
        }

        
    }, [dealercard]);  

    if(loading){
        return (
            <LinearProgress></LinearProgress>
        )
    }


    return (<div className="App">
        <header className="App-header">
            <audio id='vid'autoplay controls loop >
                <source  src="/mudick.mp3" type="audio/ogg" />
            </audio>

            <script>
            </script>
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

                    {playercard.map((c) => <Grid item >
                        <img class="cards" height={"80vh"} src={c.image}></img>
                        <p>{c.value}</p>
                    </Grid>
                    )}
                    <img height={"150vh"} src='/dick2.png' class="dick"></img>

                </Grid>
                <Grid item>
                    <Button class="PlayerBtn" variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}><img class="drawImg"  />Player</Button>
                </Grid>


                <Grid item>
                    <Button class="RestartBtn" variant="contained" onClick={clearCards}>Restart</Button>
                </Grid>

            </Grid>
        </header>
    </div>

    )
}