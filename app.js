const id = (x) => document.getElementById(x); // shortcut

document.addEventListener('click', function (event) // records click
{
   let id = event.target.id;

	if (isNaN(id) || id == "") // checks if click is a square
      return;               // if it isn't, return
   else
      Click(id); // registers click

}, false);

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
   let check = CheckIfCheck(startPos[0], startPos[1], endPos[0], endPos[1]); // checks if there's no check

   if (check) console.log("CHECK!");

   let legality = CheckMove(board, startPos[0], startPos[1], endPos[0], endPos[1]); // checks if the move is legal

   if (legality && !check) // MOVE IS LEGAL
   {
      turn = !turn; // changes player turn (white/black)

      id(startPos[0] + "" + startPos[1]).src = "Pieces/" + "%20.png"; // removes image on game board
      id(endPos[0] + "" + endPos[1]).src = "Pieces/" + figure + ".png"; // sets image on game board

      id("turn").innerHTML = (turn ? "White" : "Black") + " turn"; // displayes player's turn

      board[endPos[0]][endPos[1]] = board[startPos[0]][startPos[1]]; // sets new position on game board
      board[startPos[0]][startPos[1]] = " "; // removes old position on game board
      figure = ""; // resets selected piece
      startPos = endPos = [0,0]; // resets selected squares
   }
   else // MOVE IS ILLEGAL
   {
      console.log("move " + startPos[0] + startPos[1] + " to " + endPos[0] + endPos[1] + " is illegal.");
   }
   //figure = ""; // resets figure
}

function CheckMove(_board, x1, y1, x2, y2) // checks if move is illegal
{
   let target = _board[x2][y2];
   let subbed = figure.substring(1); // removes color code from figure (1/0)

   if (figure[0] != turn) // wrong figure color
       return false;
   if (figure == "1pawn") {// WHITE PAWN
      if (y1 == 6 && y2 == 4 && x2 == x1) // starting pos, walk 2
         return true;
      if (y1 - 1 == y2 && x2 == x1) // standard walk 1
         return true;
      if (target != " " && y1 - 1 == y2 && (x2 - 1 == x1 || x2 - (-1) == x1)) // take diagonal
         return true;
   }
   if (figure == "0pawn") {// BLACK PAWN

      if (y1 == 1 && y2 == 3 && x2 == x1) // starting pos, walk 2
         return true;
      if (y1 - (-1) == y2 && x2 == x1) // standard walk 1
         return true;
      if (target[0] != " " && y1 - (-1) == y2 && (x2 - 1 == x1 || x2 - (-1) == x1)) // take diagonal
         return true;
   }
   if (subbed == "knight") {// KNIGHT

      if (x1 - 2 == x2 && y1 - 1 == y2) // x-2, y-1
         return true;
      if (x1 - 2 == x2 && y1 - (-1) == y2) // x-2, y+1
         return true;
      if (x1 - 1 == x2 && y1 - 2 == y2) // x-1, y-2
         return true;
      if (x1 - 1 == x2 && y1 - (-2) == y2) // x-1, y+2
         return true;
      if (x1 - (-1) == x2 && y1 - 2 == y2) // x+1, y-2
         return true;
      if (x1 - (-1) == x2 && y1 - (-2) == y2) // x+1, y+2
         return true;
      if (x1 - (-2) == x2 && y1 - 1 == y2) // x+2, y-1
         return true;
      if (x1 - (-2) == x2 && y1 - (-1) == y2) // x+2, y+1
         return true;
   }
   if (subbed == "bishop") {// BISHOP

   }
   if (subbed == "rook") {// ROOK

   }
   if (subbed == "queen") { // QUEEN

   }
   if (subbed == "king") { // KING

   }

   return false; // it survived, somehow (move is legal)
}

function CheckIfCheck(x1, y1, x2, y2)
{
   let clone = board.slice(0); // clones board
   let kingPos = [8,8]; // position of king
   let king = (turn ? "1king" : "0king"); // selects king of player who just moved

   /*** Applies move for clone board ***/
   clone[x2][y2] = clone[x1][y1];
   clone[x1][y1] = " ";

   for (let i = 0; i < 8; i++)
   {
      for (let j = 0; j < 8; j++)
      {
         if (clone[i][j] == king)
         {
            kingPos[0] = i; // assigns x pos of king
            kingPos[1] = j; // assings y pos of king
            console.log(king + " is in " + kingPos[0] + "" + kingPos[1]);
            break;
         }
      }
   }

   for (let i = 0; i < 8; i++)
   {
      for (let j = 0; j < 8; j++)
      {
         if (board[i][j] != " " && clone[i][j][0] != king[0]) // selected square is not empty and different color as king
         {
            if (CheckMove(clone, i, j, kingPos[0], kingPos[1])) // king can be attacked, therefore check
               return true;
         }
      }
   }

   return false;
}
