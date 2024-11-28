//CSS
import './App.css'

//React
import React, { useCallback, useState, useEffect } from 'react'

//Data
import { wordsList } from './data/words'

//Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

//Estágios do game
const stages = [
  {id:1, name:"start"},
  {id:2, name:"game"},
  {id:3, name:"end"},
]

const guessesQty = 5

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const[pickedWord, setPickedWord] = useState("")
  const[pickedCategory, setPickedCategory ] = useState("")
  const[letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)
  


//Funções de lógica do game
  const pickWordAndCategory = useCallback(() => {
    //Escolher categoria aleatoria
    const categories = Object.keys(words)
    const category =
    categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //Escolher palavra aleatoria
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
    
  }, [words])

  // Start game
  const startGame = useCallback(() => {

    clearLetterStates()

    // Escolher categoria e palavra
    const {word, category } = pickWordAndCategory()

    //Criar um array com as letras
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())


    //Setar os estados
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)


    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // processo de letra de entrada
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if(guesses <= 0 ){
      
      //RESETAR OS ESTADOS
      clearLetterStates()


      alert("GAME OVER")
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    //condição de vitorias
    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => (actualScore += 100))
      alert("Parabéns")

      //restart com nova palavra
      startGame()
    }

  }, [guessedLetters])

  // Restart no jogo
  const retry = () => {

    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }


  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame}/>}

      {gameStage === "game" && <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}/>}

      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  )
}

export default App
