// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCFGsl9m4RJHKA66Hkao76z6SPiGmfa3jI",
    authDomain: "quran-signup.firebaseapp.com",
    databaseURL: "https://quran-signup-default-rtdb.firebaseio.com",
    projectId: "quran-signup",
    storageBucket: "quran-signup.appspot.com",
    messagingSenderId: "68136046532",
    appId: "1:68136046532:web:9454c8b85f3cdc04ee5e91"
  };
  
  // Initialize
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Hardcoded admin login (simple for now)
  const ADMIN_USERNAME = "ashakour";
  const ADMIN_PASSWORD = "Quran123";
  
  
  
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
  
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('admin-actions').style.display = 'block';
    } else {
      alert('Incorrect Username or Password.');
    }
  });
  
  document.getElementById('reset-button').addEventListener('click', function() {
    const newClassDate = document.getElementById('new-class-date').value.trim();
    if (!newClassDate) {
      alert('Please enter the new class date.');
      return;
    }
  
    // Clear all slots
    db.ref('slots').remove().then(() => {
      // Set new class date
      db.ref('classDate').set(newClassDate).then(() => {
        alert('Submissions reset and new class date set!');
        window.location.href = 'index.html'; // Go back to signup form
      });
    }).catch(error => {
      console.error('Error:', error);
      alert('There was an error.');
    });
  });
  