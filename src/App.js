import {useEffect, useState} from "react";
import ScoreBoard from "./Components/Scoreboard";

import blueCandy from "./images/blue-candy.png"
import greenCandy from "./images/green-candy.png"
import orangeCandy from "./images/orange-candy.png"
import purpleCandy from "./images/purple-candy.png"
import redCandy from "./images/red-candy.png"
import yellowCandy from "./images/yellow-candy.png"
import blank from "./images/blank.png"

const width = 8
const candyColors = [
    blueCandy,
    greenCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yellowCandy
]

function App() {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingPlaced, setSquareBeingPlaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)


    const checkForRowsOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentColorArrangement[i]
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
            const isBlank = currentColorArrangement[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                rowOfFour.forEach(square => currentColorArrangement[square] = blank)
                setScoreDisplay((prevState) => prevState + 4)
                return true
            }
        }
    }

    const checkForColumnsOfFour = () => {
        for (let i = 0; i < 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                columnOfFour.forEach(square => currentColorArrangement[square] = blank)
                setScoreDisplay((prevState) => prevState + 4)
                return true
            }
        }
    }

    const checkForColumnsOfThree = () => {
        for (let i = 0; i < 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                columnOfThree.forEach(square => currentColorArrangement[square] = blank)
                setScoreDisplay((prevState) => prevState + 3)
                return true
            }
        }
    }

    const checkForRowsOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = currentColorArrangement[i]
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
            const isBlank = currentColorArrangement[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                rowOfThree.forEach(square => currentColorArrangement[square] = blank)
                setScoreDisplay((prevState) => prevState + 3)
                return true
            }
        }
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)

            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(Math.random() * candyColors.length)
                currentColorArrangement[i] = candyColors[randomNumber]
            }

            if (currentColorArrangement[i + width] === blank) {
                currentColorArrangement[i + width] = currentColorArrangement[i]
                currentColorArrangement[i] = blank
            }
        }
    }

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        setSquareBeingPlaced(e.target)
    }

    const dragEnd = () => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingPlaced.getAttribute('data-id'))

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        if (validMove) {
            currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
            currentColorArrangement[squareBeingDraggedId] = squareBeingPlaced.getAttribute('src')
            const isAColumnOfFour = checkForColumnsOfFour()
            const isARowOfFour = checkForRowsOfFour()
            const isAColumnOfThree = checkForColumnsOfThree()
            const isARowOfThree = checkForRowsOfThree()
            if (squareBeingReplacedId &&
                (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
                setSquareBeingDragged(null)
                setSquareBeingPlaced(null)
            } else {
                currentColorArrangement[squareBeingReplacedId] = squareBeingPlaced.getAttribute('src')
                currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            }
        }

    }

    const createBoard = () => {
        const randomColorArrangement = []
        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(randomColorArrangement)
    }

    useEffect(() => {
        createBoard()
    }, [])


    useEffect(() => {

        const timer = setInterval(() => {
            checkForColumnsOfFour()
            checkForRowsOfFour()
            checkForColumnsOfThree()
            checkForRowsOfThree()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnsOfFour, checkForRowsOfFour, checkForColumnsOfThree, checkForRowsOfThree, moveIntoSquareBelow, currentColorArrangement])


    return (
        <div className="app">
            <div className="game">
                {currentColorArrangement.map((candyColor, index) => (
                        <img
                            key={index}
                            src={candyColor}
                            alt={candyColor}
                            data-id={index}
                            draggable={true}
                            onDragStart={dragStart}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => e.preventDefault()}
                            onDragLeave={(e) => e.preventDefault()}
                            onDrop={dragDrop}
                            onDragEnd={dragEnd}
                        />
                    )
                )}
            </div>
            <ScoreBoard score={scoreDisplay}/>
        </div>
    );
}

export default App;
