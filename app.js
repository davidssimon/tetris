document.addEventListener('DOMContentLoaded', () => {
  const sound = document.createElement("audio")
  sound.src = 'Tetris.mp3'
  sound.setAttribute("preload", "auto")
  sound.setAttribute("controls", "none")
  sound.style.display = "none"
 
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'dark-blue',
    'magenta',
    'purple',
    'black',
    'blue'
  ]
 
  // The tetrominoess
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]
 
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]
 
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]
 
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]
 
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, iTetromino, oTetromino]
 
  let currentPosition = 4
  let currentRotation = 0
 
  //  randomly select a Tetromino
  let random = Math.floor(Math.random()*theTetrominoes.length)
  console.log(random)
  let current = theTetrominoes[random][currentRotation]
 
  //  draw the Tetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }
 
  // undraw the tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }
 
  // make the tetromino move down every second
  //  timerId = setInterval(moveDown, 1000)
 
  // assign function to keyCodes
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)
 
  // move down function
  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }
 
  // freeze function
  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }
 
  // move the tetromino left, im;ess it is at the edge or there is a blockage
  function moveLeft () {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
 
    if (!isAtLeftEdge) currentPosition -= 1
 
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
 
    draw()
  }
 
  // move the tetromino right unless it is at the edge or there is a blockage
  function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
 
    if (!isAtRightEdge) currentPosition += 1
 
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
 
    draw()
  }
 
  // check if can rotate
  function canRotate () {
    let nextRotation = currentRotation + 1
    let nextT
    
    if (nextRotation === current.length) {
      nextRotation = 0
    }
    
    nextT = theTetrominoes[random][nextRotation]

    // check the left edge for the next rotation
    const isOnLeftSide = current.some(index => (currentPosition + index) % width < 2 )
    const nextRotationIsOnLeftSide = nextT.some(index => (currentPosition + index) % width > 8 )
    if (isOnLeftSide && nextRotationIsOnLeftSide) {
      return false
    }
    // check the right edge for the next rotation
    const isOnRightSide = current.some(index => (currentPosition + index) % width > 7 )
    const nextRotationIsOnRightSide = nextT.some(index => (currentPosition + index) % width < 2 )
    if (isOnRightSide && nextRotationIsOnRightSide) {
      return false
    }
    // check if is taken
    const isTaken = nextT.some(index => squares[currentPosition + index + width].classList.contains('taken'))
    if(isTaken) {
      return false
    }
    // check the bottom edge for the next rotation
    return true
  }

  // rotate the tetromino
  function rotate () {
    if(!canRotate()) {
      return
    }
    undraw()
    currentRotation++
    if (currentRotation === current.length) { // if the current rotation gets to 4, make it 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }
 
  // show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0
 
  // the Tetrominos without rotations
  const upNextTetrominoes = [
  // lTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    // zTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    // tTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    // iTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    // oTetromino
    [0, 1, displayWidth, displayWidth + 1]
  ]
 
  //  display the shape in the mini-grid display
  function displayShape () {
    // remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }
 
  // add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
      sound.pause()
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      sound.play()
    }
  })
 
  // add score
  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
 
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }
 
  // game over function boiiiissss
  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
 

