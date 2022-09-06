import {useEffect, useState, useCallback} from "react";
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
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)


    // ----- FUNCTIONS TO CHECK ROWS AND COLUMNS -----

    const checkForRowsOfFour = useCallback(() => {

        // For every square in the gameplay
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentColorArrangement[i]
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
            const isBlank = currentColorArrangement[i] === blank

            // Don't watch for row match if is one element is on next line
            if (notValid.includes(i)) continue

            // If every square in the array is the same color (decidedColor) and none is blank
            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                // Set every square blank
                rowOfFour.forEach(square => currentColorArrangement[square] = blank)
                // Increment the score
                setScoreDisplay((prevState) => prevState + 4)
                // Need it in dragend function below
                return true
            }
        }
    }, [currentColorArrangement])

    const checkForColumnsOfFour = useCallback(() => {
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
    }, [currentColorArrangement])

    const checkForColumnOfThree = useCallback(() => {
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
    }, [currentColorArrangement])

    const checkForRowsOfThree = useCallback(() => {
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
    }, [currentColorArrangement])


    // ----- FUNCTION TO HANDLE WHITESPACES -----

    const moveIntoSquareBelow = useCallback(() => {
        for (let i = 0; i <= 55; i++) {
            // Select elements in first row (top)
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)

            // If an element is in first row (top) and is blank
            if (isFirstRow && currentColorArrangement[i] === blank) {
                // Select a random color
                let randomNumber = Math.floor(Math.random() * candyColors.length)
                // Assign new random color to blank square
                currentColorArrangement[i] = candyColors[randomNumber]
            }

            /* If the same square in column below is blank too, assign the value to this and turn the upper square blank
            (change in dependencies cause the rerender) */
            if (currentColorArrangement[i + width] === blank) {
                currentColorArrangement[i + width] = currentColorArrangement[i]
                currentColorArrangement[i] = blank
            }
        }
    }, [currentColorArrangement])

    // ----- FUNCTIONS TO MOVE CANDIES -----

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }

    const dragEnd = () => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        const validMoves = [
            // Move in rows
            squareBeingDraggedId - 1,
            squareBeingDraggedId + 1,
            // Move in columns
            squareBeingDraggedId - width,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        if (validMove) {
            // Invert images with source attribute
            currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
            currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

            // If one of these functions return true (see above)
            const isAColumnOfFour = checkForColumnsOfFour()
            const isARowOfFour = checkForRowsOfFour()
            const isAColumnOfThree = checkForColumnOfThree()
            const isARowOfThree = checkForRowsOfThree()

            // Reset the values after the candies movements
            if (squareBeingReplacedId &&
                (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
                setSquareBeingDragged(null)
                setSquareBeingReplaced(null)

            // Otherwise leave the candies in the same places
            } else {
                currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
                currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            }
        }
    }


    // ----- CREATE THE GAME -----

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

    // ----- GAMEPLAY -----

    useEffect(() => {

        const timer = setInterval(() => {
            checkForColumnsOfFour()
            checkForRowsOfFour()
            checkForColumnOfThree()
            checkForRowsOfThree()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnsOfFour, checkForRowsOfFour, checkForColumnOfThree, checkForRowsOfThree, moveIntoSquareBelow, currentColorArrangement])


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
