const formTitle = document.getElementById('form-title');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const actionBtn = document.getElementById('action-btn');
const toggleLink = document.getElementById('toggle-link');
const message = document.getElementById('message');
const toggleText = document.getElementById('toggle-text');

let isLogin = true; // true for login, false for signup

toggleLink.addEventListener('click', ()=> {
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = 'Login';
        actionBtn.textContent = 'Login';
        toggleText.innerHTML = `Don't have an account ? <span id="toggle-link">Sign Up</span>`; 
    }
    else {
        formTitle.textContent = 'Sign Up';
        actionBtn.textContent = 'Sign Up';
        toggleText.innerHTML = `Already have an account ? <span id="toggle-link">Login</span>`; 
    }
    message.textContent ="";
    document.getElementById("toggle-link").addEventListener("click", toggleLink.click);
    // toggle-link calls itself to re-attach event listener
});

actionBtn.addEventListener('click', ()=>{
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        message.textContent = 'Please enter both username and password.';
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    // Retrieve existing users or initialize an empty object

    if (isLogin) {
        // login mode

        if (!users[username]) {
            // User does not exist
            message.textContent = 'User does not exist. Please sign up first.';
            return;
        }

        if (users[username].password !== password) {
            // Incorrect password
            message.textContent = 'Incorrect password. Please try again.';
            return;
        }

        // Successful login
        localStorage.setItem('currentUser', username);
        message.style.color = 'green';
        message.textContent = 'Login successful! Redirecting...';
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1000);
    }

    else {
        // signup mode
        if (users[username]) {
            // User already exists
            message.textContent = 'Username already exists.';
            return;
        }

        // Create new user
        users[username] ={password,drawings :""}; 
        // Initialize drawings as an empty string
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        message.style.color = 'green';
        message.textContent = 'Sign up successful! Redirecting...';
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1000);

    }
});
