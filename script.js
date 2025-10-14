(()=>{
   const canvas = document.querySelector("canvas");
   const ctx = canvas.getContext("2d",{willReadFrequently:true});
   // ctx is used to read and write pixels to the canvas

   const sizeEl = document.getElementById("size");
   const colorEl = document.getElementById("color");
   const loadBtn = document.getElementById("load-btn");
   const downloadBtn = document.getElementById("download-btn");
   const uploadBtn = document.getElementById("upload-btn");
   const uploadInput = document.getElementById("upload-file");
   const clearBtn = document.getElementById("clear-btn");
   const logoutBtn = document.getElementById("logout-btn");
   
   const STORAGE_USERS_KEY = "users"; // key to store users in localStorage
   const STORAGE_CURRENT_KEY = "currentUser"; // key to store current user in localStorage

   const currentUser = localStorage.getItem(STORAGE_CURRENT_KEY);
   if(!currentUser) {
      window.location.href = "login.html"; // redirect to login if not logged in
      return;
   }

   // canvas setup

   function fitCanvasToContainer() {
      const rect = canvas.getBoundingClientRect();
      // boundingClientRect() returns the size of an element and its position relative to the viewport.
      const dpr = window.devicePixelRatio || 1;
      // devicePixelRatio is the ratio of physical pixels to device-independent pixels (dips) on the device.
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // setTransforms(dpr, 0, 0, dpr, 0, 0) scales the context to account for device pixel ratio.

   }

   window.addEventListener("resize", fitCanvasToContainer);
   // whenever the window is resized that is screen is zoomed in or zoomed out fitCanvasToContainer is called
   fitCanvasToContainer(); // initial call to fit canvas to container

   let drawing = false;
   let lastX = 0;
   let lastY = 0;
   let tool = "brush"; // default tool is brush
   let brushSize = parseInt(sizeEl.value, 10); // default brush size
   let brushColor = colorEl.value; // default brush color
   let lastSaved = "";
   let lastChangeTime = Date.now();

   ctx.lineJoin = "round";
   ctx.lineCap = "round";
   ctx.lineWidth = brushSize;
   ctx.strokeStyle = brushColor;



   function beginStroke(x, y) {
      drawing = true;
      lastX = x;
      lastY = y;
      ctx.beginPath();
      ctx.moveTo(x, y);
   }

   function drawLine(x, y) {
      if (!drawing) return;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (tool === "brush") {
         ctx.save(); // save the current state of the context
         ctx.globalCompositeOperation = "destination-out"; 
         // destination-out makes the new shape cut out from the existing canvas content
         ctx.strokeStyle = "rgba(0,0,0,0.1)"; // transparent brush for eraser
         ctx.lineTo(x, y);
         ctx.stroke(); // draw the line
         ctx.restore(); // restore the context to its original state
      }

      else {
         ctx.globalCompositeOperation = "source-over";
         ctx.strokeStyle = brushColor;
         ctx.lineTo(x, y);
         ctx.stroke(); // draw the line

      }

      lastX = x;
      lastY = y;
      lastChangeTime = Date.now();
   }

   function endStroke() {
      if (!drawing) return;
      drawing = false;
      ctx.closePath();
      saveToCurrentUser();
   }

   function saveToCurrentUser() {
      const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || {};
      users[currentUser] = users[currentUser] || {};
      users[currentUser].drawing = canvas.toDataURL();
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      lastSaved = users[currentUser].drawing;
      console.log("Drawing saved for user:", currentUser);
   }

   const toolButtons = document.querySelectorAll(".tool-buttons .tool");
   toolButtons.forEach(button => {
      button.addEventListener("click", () => {
         toolButtons.forEach(btn => btn.classList.remove("active"));
         button.classList.add("active");
         tool = button.id;
      });
   });

   sizeEl.addEventListener("input", (e) => {
      brushSize = parseInt(e.target.value, 10);
   });
   colorEl.addEventListener("input", (e) => {
      brushColor = e.target.value;
   });

   
})();
// self invoking function