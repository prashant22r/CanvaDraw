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

      if (tool === "eraser") {
         ctx.save(); // save the current state of the context
         ctx.globalCompositeOperation = "destination-out"; 
         // destination-out makes the new shape cut out from the existing canvas content
         ctx.strokeStyle = "rgba(0,0,0,0.2)"; // fully transparent color
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

   function getPointerPos(evt) {
      const rect = canvas.getBoundingClientRect();
      // get bounding rectangle of canvas
      return {x : evt.clientX - rect.left, y: evt.clientY - rect.top};
   }

   canvas.addEventListener("pointerdown", e => {
   const { x, y } = getPointerPos(e);
   beginStroke(x, y);
   });

   canvas.addEventListener("pointermove", e => {
   if (!drawing) return;
   const { x, y } = getPointerPos(e);
   drawLine(x, y);
   });

   canvas.addEventListener("pointerup", endStroke);
   canvas.addEventListener("pointerleave", endStroke);
   canvas.addEventListener("pointercancel", endStroke);



   canvas.addEventListener("pointercancel", endStroke);

   // helper function 
   function loadUsers() {
      return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || "{}");
   }

   function saveUsers(obj) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(obj));
   }


   function saveToCurrentUser() {
      const users = loadUsers();
      users[currentUser] = users[currentUser] || {};
      users[currentUser].drawing = canvas.toDataURL();
      saveUsers(users);
      lastSaved = users[currentUser].drawing;
      console.log("Drawing saved for user:", currentUser);
   }

   function loadFromCurrentUser() {
      const users = loadUsers();
      if (!users[currentUser] || !users[currentUser].drawing) return false;
      const img = new Image();
      img.onload = () => {
         const rect = canvas.getBoundingClientRect();
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         // clear the canvas
         ctx.drawImage(img, 0, 0, rect.width, rect.height);
         // draw the image on the canvas
      }
      img.src = users[currentUser].drawing;
      // set image source to the saved drawing
      lastSaved = users[currentUser].drawing;
      console.log("Drawing loaded for user:", currentUser);
      return true;
   }

   loadBtn.addEventListener("click", () => {
      const ok = loadFromCurrentUser();
      showTemporaryMessage(ok ? "Drawing loaded." : "No saved drawing found.", !ok);
      // show message on web page 
      // based on whether drawing was loaded
   });

   downloadBtn.addEventListener("click", () => {
      saveToCurrentUser(); // save before downloading
      const users = loadUsers();
      const data = {user: currentUser, drawing: users[currentUser].drawing || ""};
      const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
      // create a blob from the drawing data
      // blob is a file-like object of immutable, raw data
      const url = URL.createObjectURL(blob);
      // create a URL for the blob
      const a = document.createElement("a");
      // create a temporary anchor element
      a.href = url;
      a.download = `${currentUser}_drawing.json`;
      // set download attribute with filename
      a.click();
      // trigger download
      URL.revokeObjectURL(url);
      // revoke the object URL to free up memory
      showTemporaryMessage("Drawing downloaded.");
   });

   uploadBtn.addEventListener("click", () => {
      uploadInput.click();
      // trigger click on file input
   });

   uploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      // FileReader is used to read the contents of files
      reader.onload = (event) => { // onload event is triggered when file is read
         try {
            const data = JSON.parse(event.target.result);
            // parse the JSON data
            if (!data.drawing) throw new Error("Invalid drawing data.");
            const img = new Image();
            img.onload = () => {
               const rect = canvas.getBoundingClientRect();
               ctx.clearRect(0, 0, canvas.width, canvas.height);
               const dpr = window.devicePixelRatio || 1;
               ctx.drawImage(img, 0, 0, rect.width, rect.height);
               const users = loadUsers();
               users[currentUser] = users[currentUser] || {};
               users[currentUser].drawing = data.drawing;
               saveUsers(users);
               lastSaved = data.drawing;
               showTemporaryMessage("Drawing uploaded and loaded.");
            };
            img.src = data.drawing;
         } catch (err) {
            alert("INVALID FILE: Unable to load drawing.");
         }

      };
      reader.readAsText(file);
      // it is used to read the contents of the specified Blob or File
      e.target.value = "";
      // reset the input value to allow uploading the same file again if needed
   });

   clearBtn.addEventListener("click", () => {
      if (!confirm("clear the canvas?")) return;
      // confirm before clearing by giving a prompt to the user
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const users = loadUsers();
      if (users[currentUser]) {
         users[currentUser].drawing = "";
         saveUsers(users);
         showTemporaryMessage("Canvas cleared.");
      }
   });

   logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_CURRENT_KEY);
      window.location.href = "login.html";
   });

   function maybeAutoSave() {
      const now = Date.now();
      if (now - lastChangeTime < 1500) return;
      // user is still drawing
      const dataURL = canvas.toDataURL();
      if (dataURL !== lastSaved) {
         saveToCurrentUser();
         showTemporaryMessage("Auto-saved.");
      }
   }
   canvas.addEventListener("pointermove", () => {
      if (drawing) {
         lastChangeTime = Date.now();
      }
   });
   setInterval(maybeAutoSave, 5000);

   function showTemporaryMessage(msg, isError = false) {
      const div = document.createElement("div");
      div.textContent = msg;
      div.style.position = "fixed";
      div.style.right = "16px";
      div.style.bottom = "16px";
      div.style.padding = "10px 14px";
      div.style.borderRadius = "10px";
      div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      div.style.background = isError ? "#fee2e2" : "#e0f2fe";
      div.style.color = isError ? "#b91c1c" : "#0f172a";
      div.style.fontSize = "13px";
      div.style.zIndex = 9999;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 2000);
   }

   setTimeout(() => {
      loadFromCurrentUser();
   }, 100);
   // load drawing after short delay to ensure canvas is ready


})();
// self invoking function