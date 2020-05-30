const id = (x) => document.getElementById(x); // shortcut

let board = [], // 2D arrays cannot be defined in JS
    turn = true; // true = white
    startPos = [0,0], // x, y of old position in move
    endPos = [0,0], // x, y of new position in move
    figure = "", // figure of piece (e.g. "knight1" = black pawn)
    selected = " "; // currently selected square

function StartGame()
{
   for (let i = 0; i < 8; i++)
      board[i] = [" "," "," "," "," "," "," "," "]; // defining 2D board array

    /*** Setting black pieces ***/
    board[0][0] = board[7][0] = "0rook";
    board[1][0] = board[6][0] = "0knight";
    board[2][0] = board[5][0] = "0bishop";
    board[3][0] = "0queen";
    board[4][0] = "0king";

    /*** Setting white pieces ***/
    board[0][7] = board[7][7] = "1rook";
    board[1][7] = board[6][7] = "1knight";
    board[2][7] = board[5][7] = "1bishop";
    board[3][7] = "1queen";
    board[4][7] = "1king";

    /*** Setting pawns ***/
    for (let i = 0; i < 8; i++)
    {
        board[i][1] = "0pawn"; // black pawns
        board[i][6] = "1pawn"; // white pawns
    }

    /*** Setting UI board elements ***/
    for (let y = 0; y < 8; y++)
    {
        for (let x = 0; x < 8; x++)
        {
            if ((x + y) % 2)
               id(x + "" + y).parentElement.style.background = "#b5651d"; // sets checker square color

            id(x + "" + y).src = "Pieces/" + board[x][y] + ".png"; // sets sets all correct images on board
        }
    }

    id("turn").innerHTML = "White turn";
}

document.addEventListener('click', function (event) // records click
{
   let id = event.target.id;

	if (isNaN(id) || id == "") // checks if click is a square
      return;               // if it isn't, return
   else
      Click(id); // registers click

}, false);

function Click(id)
{
   // id: 1st char is X, 2nd char is Y
   selected = board[id[0]][id[1]];

   if (selected[0].toString() == turn && selected != " ") // checks if the selected square is not empty
   {
      startPos = id;
      figure = selected;
      console.log("selected " + id);
   }
   else if (figure != "" && selected[0] != turn.toString()) // if a figure is selected and not clicking on self's piece
   {
      endPos = id;
      console.log("moving to " + id);
      Move();
   }
}

function Move() // makes move, displays move
{
   if (!CheckMove()) // move is illegal
   {
      console.log("startPos " + startPos[0] + startPos[1] + " endPos " + endPos[0] + endPos[1] + " is illegal.");
      return;
   }

   turn = !turn; // changes player turn (white/black)

   id(startPos[0] + "" + startPos[1]).src = "Pieces/" + " .png"; // removes image on game board
   id(endPos[0] + "" + endPos[1]).src = "Pieces/" + figure + ".png"; // sets image on game board

   id("turn").innerHTML = (turn ? "White" : "Black") + " turn"; // displayes player's turn

   board[endPos[0]][endPos[1]] = board[startPos[0]][startPos[1]]; // sets new position on game board
   board[startPos[0]][startPos[1]] = " "; // removes old position on game board
   figure = ""; // resets selected piece
   startPos = endPos = [0,0]; // resets selected squares
}

function CheckMove() // checks if move is illegal
{
   if (figure[0] != turn) // if the selected square is not the right color, illegal
      return false;

   return false; // it survived, somehow (move is legal)
}
