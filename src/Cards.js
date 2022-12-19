/* eslint-disable jsx-a11y/alt-text */
import './App.css';
import './Cards.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { sizeHeight } from '@mui/system';
import LinearProgress from '@mui/material/LinearProgress';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';


export default function Cards() {

    const [deck, setDeck] = useState([]);
    const [deckID, setDeckID] = useState();
    const [betfield, setBetField] = useState(0);
    const [bet, setBet] = useState(0);
    const [dealercard, setDealercard] = useState([])
    const [playercard, setPlayercard] = useState([])
    const [playercounter, setPlayercounter] = useState([0])
    const [dealercounter, setDealercounter] = useState([0])
    const [loading, setLoading] = useState(true)
    const [hiddencard, sethiddencard] = useState(true)

    const [win, setWin] = useState(false)
    const [lost, setLost] = useState(false)

    const handlewinshow = () => { setWin(true); };
    const handlewinclose = () => { setWin(false); };

    const handlelostshow = () => { setLost(true); };
    const handlelostclose = () => { setLost(false); };

    const [value, setValue] = useState(10);



    function getDeck() {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
            });
    }


    function calculateValue(cards, setcounter, counter) {
        setcounter(0)
        let value = 0
        for (let card of cards) {
            console.log(card)
            if (card.value == "KING") {
                value = 10
            }
            else if (card.value == "QUEEN") {
                value = 10
            }
            else if (card.value == "JACK") {
                value = 10
            }
            else if (card.value == "ACE") {
                if (counter + 11 > 21) {
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
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => setCard(currentCards => [...currentCards, data.cards[0]]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
            });
    }
    function call() {
        getCard(setPlayercard, playercard)
        checkloss()
    }

    function checkloss(){
        let playervalue = 0
        for (let card of playercard) {
            if (card.value == "KING") {
                playervalue += 10
            }
            else if (card.value == "QUEEN") {
                playervalue += 10
            }
            else if (card.value == "JACK") {
                playervalue += 10
            }
            else if (card.value == "ACE") {
                if (playervalue + 11 > 21) {
                    playervalue += 1
                }
                else {
                    playervalue += 11
                }
            }
            else {
                playervalue += parseInt(card.value)
            }
        }
        console.log(playervalue)
        if(playervalue > 21){
            handlelostshow()
        }
    }

    function checkwin(){

        let playervalue = 0
        for (let card of playercard) {
            if (card.value == "KING") {
                playervalue += 10
            }
            else if (card.value == "QUEEN") {
                playervalue += 10
            }
            else if (card.value == "JACK") {
                playervalue += 10
            }
            else if (card.value == "ACE") {
                if (playervalue + 11 > 21) {
                    playervalue += 1
                }
                else {
                    playervalue += 11
                }
            }
            else {
                playervalue += parseInt(card.value)
            }
        }

        let dealervalue = 0
        for (let card of dealercard) {
            if (card.value == "KING") {
                dealervalue += 10
            }
            else if (card.value == "QUEEN") {
                dealervalue += 10
            }
            else if (card.value == "JACK") {
                dealervalue += 10
            }
            else if (card.value == "ACE") {
                if (dealervalue + 11 > 21) {
                    dealervalue += 1
                }
                else {
                    dealervalue += 11
                }
            }
            else {
                dealervalue += parseInt(card.value)
            }
        }

        console.log(dealervalue)
        console.log(playervalue)
        
        if (dealervalue > playervalue && dealervalue <= 21) {
            handlelostshow()
        }
        else if (dealervalue < playervalue && playervalue <= 21) {
            handlewinshow()

        }
    }

    function checkdealer(){


        let dealervalue = 0
        for (let card of dealercard) {
            if (card.value == "KING") {
                dealervalue += 10
            }
            else if (card.value == "QUEEN") {
                dealervalue += 10
            }
            else if (card.value == "JACK") {
                dealervalue += 10
            }
            else if (card.value == "ACE") {
                if (dealervalue + 11 > 21) {
                    dealervalue += 1
                }
                else {
                    dealervalue += 11
                }
            }
            else {
                dealervalue += parseInt(card.value)
            }
        }

        console.log(dealervalue)
        
        if (dealervalue < 17) {
            getCard(setDealercard, dealercard)
        }
    }

    function stay() {
        if (dealercounter < 17) {
            getCard(setDealercard, dealercard)
        }
        checkdealer()
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
        getDeck()
    }, []);

    useEffect(() => {
        console.log(betfield)
    }, [betfield]);
    useEffect(() => {
        calculateValue(playercard, setPlayercounter, playercounter)
    }, [playercard]);
    useEffect(() => {
        if(playercounter > 21){
            stay()
        }
    }, [playercounter]);
    useEffect(() => {
        calculateValue(dealercard, setDealercounter, dealercounter)
    }, [dealercard]);

    useEffect(() => {
        if (deckID != undefined) {
            startGame()
            setLoading(false)
        }
    }, [deckID]);

    useEffect(() => {
        if (dealercard != undefined) {
            if (dealercard.length == 2) {
                let cards = dealercard
                let obj = dealercard[1]
                obj.hidden = true
                cards[1] = obj;
                setDealercard(cards)
                calculateValue(cards, setDealercounter, dealercounter)

            }
            else if (dealercard.length > 2) {
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

    if (loading) {
        return (
            <LinearProgress></LinearProgress>
        )
    }


    return (<div className="App">
        <header className="App-header">
            <audio id='vid' autoplay controls loop >
                <source src="/mudick.mp3" type="audio/ogg" />
            </audio>

            <script>
            </script>
            {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
            <Grid container rowSpacing={3} alignItems="flex-start" justifyContent="center">

            <Grid>
 
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                </Grid>

                <Grid>
                    <h2 className='dealerTitle'>Dealer</h2>

                </Grid>
                <Grid container spacing={5} alignItems="center" justifyContent="center">
                    {dealercard.map((c) =>
                        <Grid item>
                            {c.hidden
                                ? <img height={"80vh"} src="Turnover.png"></img>
                                :
                                <>
                                    <img height={"80vh"} src={c.image}></img>
                                    <p style={{ color: "white" }}>{c.value}</p>
                                </>
                            }
                        </Grid>)}
                </Grid>
    

                <Grid>
                    <h2 className='playerTitle'>Player</h2>
                </Grid>

                <Grid container spacing={5} alignItems="center" justifyContent="center">

                    {playercard.map((c) => <Grid item >
                        <img class="cards" height={"80vh"} src={c.image}></img>
                        <p style={{ color: "white" }}>{c.value}</p>
                    </Grid>
                    )}
                    <img height={"150vh"} src='/dick2.png' class="dick"></img>

                </Grid>

                <Grid item style={{
                    color: "white", fontWeight: "bold", fontSize: "45px", radius: "100px",padding:"15px" }}>
                    <p style={{border: "2px solid gold", borderRadius: "100px",padding: "15px"}}>{playercounter}</p>   
                </Grid>


                <Grid item>
                    <Button class="CallBtn" variant="contained" onClick={(e) => call()}><img class="drawImg" />Call</Button>
                </Grid>
                <Grid item>
                    <Button class="StayBtn" variant="contained" onClick={(e) => stay()}><img class="drawImg" />Stay</Button>
                </Grid>

                <Grid item>
                    <Button class="RestartBtn" variant="contained" onClick={clearCards}>Restart</Button>
                </Grid>

            </Grid>
            <Dialog open={win} onClose={handlewinclose}>
        <DialogTitle id="alert-dialog-title">
          {"You Won"}
        </DialogTitle>
        <DialogContent>
        You won {bet *2}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlewinclose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={lost} onClose={handlelostclose}>
        <DialogTitle id="alert-dialog-title">
          {"You Lost"}
        </DialogTitle>
        <DialogContent>
            You lost {bet}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlelostclose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
        </header>
    </div>

    )
}