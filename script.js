const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const ctx = canvas.getContext("2d");


//global variables with default values
let isDrawing = false; // flag to track whether the user is drawing or not
let brushWidth = 5; // default brush width
let selectedTool = "brush"; // default tool is brush
let prevMouseX, prevMouseY, snapshot; // prevMouseX and prevMouseY to store previous mouse coordinates

const drawRectangle = (event) => {
    ctx.strokeRect(event.offsetX, event.offsetY, prevMouseX - event.offsetX, prevMouseY - event.offsetY);;
    // take x-cordinate y-cordinate width and height for rectangle as parameter
}

window.addEventListener("load", () =>{
    // setting canvas width/height according to window
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const drawing = (event) => { // event is what is triggered while drawing
    if (!isDrawing) return; // if isDrawing is false return from here

    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
    if (selectedTool === "brush") {
        ctx.lineTo(event.offsetX, event.offsetY); // creates new line to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    }
    else if (selectedTool === "rectangle") {
        drawRectangle(event);
    }
    
}


const startDrawing = (event) => {
    isDrawing = true;
    prevMouseX = event.offsetX; // passing current mouseX position as prevMouseX
    prevMouseY = event.offsetY; // passing current mouseY position as prevMouseY
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // copying canvas data & passing as snapshot value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
}

const stopDrawing = () => {
    isDrawing = false;
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () =>{ // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active ").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
})
canvas.addEventListener("mousedown", startDrawing); // starting point of drawing
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);

