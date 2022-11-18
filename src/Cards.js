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
            if(card.hidden != true){
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
            });
    }


    function startGame(){
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
        getDeck()
    }, []);  
    useEffect(() => {
        calculateValue(playercard, setPlayercounter, playercounter)
    }, [playercard]);  
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
               calculateValue(dealercard, setDealercounter, dealercounter)
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
                {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid>
                        <h2>Dealer</h2>
                    </Grid>
                <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {dealercard.map((c,k) => 
                        <Grid item key={k}>
                            {c.hidden
                            ?
                            <>
                            <img height={"80vh"} src="Turnover.png"></img>
                            <p>{c.value}</p>
                            </>
                            :
                            <>
                            <img height={"80vh"} src={c.image}></img>
                            <p>{c.value}</p>
                            </>
                            }
                            
                        </Grid>
                        )}
                    </Grid>
                    <Grid>
                        <h1>{dealercounter}</h1>
                    </Grid>

                    <Grid>
                        <h2>Player</h2>
                    </Grid>
                    <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {playercard.map((c,k) => 
                        <Grid item key={k}>
                            <img height={"80vh"} src={c.image}></img>
                            <p>{c.value}</p>
                        </Grid>
                        )}
                    </Grid>
                    <Grid>
                        <h1>{playercounter}</h1>
                    </Grid>
                    <Grid item>
                        { playercounter <= 21
                        ?<Button variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}>Player</Button>
                        :<h2>Busted</h2>                   
                        }
                    </Grid>


                    <Grid item>
                        <Button variant="contained" onClick={clearCards}>Restart</Button>
                    </Grid>

                </Grid>
            </header>
        </div>

    )
}