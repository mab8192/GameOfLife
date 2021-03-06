var ctx, canvas, delayElement

var gridSize = 50
var sqSize = 15

var squares = []

var running = false

function draw(){
    var i, j
    for(i = 0; i < gridSize; i++){
        for(j = 0; j < gridSize; j++){
            if (squares[i][j] == 1) {
                ctx.fillStyle = "#000000"
            }
            else {
                ctx.fillStyle = "#FFFFFF"
            }
            ctx.fillRect(i*sqSize, j*sqSize, (i*sqSize)+sqSize, (j*sqSize)+sqSize)
        }
    }
}

function create_board(){
    squares = []
    var i, j
    for(i = 0; i < gridSize; i++){
        row = []
        for(j = 0; j < gridSize; j++){
            row.push(Math.floor(Math.random()*2))
        }
        squares.push(row)
    }
}

function count_neighbors(x, y){

    var i, j, count = 0
    for(i = x-1; i <= x+1; i++){
        for(j = y-1; j <= y+1; j++){
            if (i < 0 || i >= gridSize || j < 0 || j >= gridSize || (i==x && j==y)){
                continue
            }

            count += squares[i][j]
        }
    }

    return count
}

function update_board(){
    new_squares = []
    var i, j
    for(i = 0; i < gridSize; i++){
        row = []
        for(j = 0; j < gridSize; j++){

            neighbors = count_neighbors(i, j)

            // Apply Conway's Game of Life rules
            if (squares[i][j] == 1) // cell was alive last frame
            {
                if (neighbors == 2 || neighbors == 3){
                    row.push(1) // continues living
                } else {
                    row.push(0) // dies to over-/under-population
                }
            } else { // cell was dead last frame
                if (neighbors == 3){
                    row.push(1) // comes alive if neighbors is exactly 3
                } else {
                    row.push(0)
                }
            }

        }
        new_squares.push(row)
    }

    squares = new_squares
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop(){
    // Update the board
    update_board()

    // Redraw the board
    draw(ctx)

    pause = parseInt(delayElement.value)

    if (Number.isNaN(pause) || pause < 1)
        pause = 100

    await sleep(pause)

    if (running) window.requestAnimationFrame(loop)
}

// Button events
function start(){
    if (!running){
        running = true
        window.requestAnimationFrame(loop)
    }
}

function regenerate(){
    create_board()
    draw()
    console.log("Regenerated board")
}

function clear_board(){
    console.log("entered cleaer")
    var i, j
    for(i = 0; i < gridSize; i++){
        for(j = 0; j < gridSize; j++){
            squares[i][j] = 0
        }
    }
    draw()
}

function stop(){
    running = false
}

function board_click(event){

    if (!running){
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        boardX = Math.floor(x/sqSize)
        boardY = Math.floor(y/sqSize)

        squares[boardX][boardY] = !squares[boardX][boardY]
        draw()
    }

}

// Main
function main(){
    create_board()
    canvas = document.getElementById("mainCanvas")
    canvas.addEventListener('mousedown', function(e){
        board_click(e)
    })

    ctx = canvas.getContext("2d")

    delayElement = document.getElementById("delayBox")

    draw()
}

main()