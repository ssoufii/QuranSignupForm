// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFGsl9m4RJHKA66Hkao76z6SPiGmfa3jI",
    authDomain: "quran-signup.firebaseapp.com",
    databaseURL: "https://quran-signup-default-rtdb.firebaseio.com",
    projectId: "quran-signup",
    storageBucket: "quran-signup.appspot.com",
    messagingSenderId: "68136046532",
    appId: "1:68136046532:web:9454c8b85f3cdc04ee5e91"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Create time slots
  const timeslots = [];
  for (let hour = 19; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h = hour > 12 ? hour - 12 : hour;
      const m = min.toString().padStart(2, '0');
      timeslots.push(`${h}:${m} PM`);
    }
  }
  timeslots.push("9:00 PM");
  
  // Render the slots
  const slotsContainer = document.getElementById('timeslots');
  timeslots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'slot';
    div.innerText = slot;
    div.dataset.time = slot;
    slotsContainer.appendChild(div);
  });
  
  let selectedSlot = null;
  
  // Select slot
  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.classList.contains('booked')) return;
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedSlot = slot.dataset.time;
    });
  });
  
  // Handle form submit
  document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    if (!name || !selectedSlot) {
      alert("Please enter your name and select a timeslot.");
      return;
    }
  
    const sanitizedSlot = selectedSlot.replace(/[: ]/g, '_');
  
    db.ref('slots/' + sanitizedSlot).set({
      name: name,
      time: selectedSlot
    }).then(() => {
      // Hide form
      document.getElementById('signup-form').style.display = 'none';
  
      // Thank you message
      const thankYouDiv = document.createElement('div');
      thankYouDiv.className = 'thank-you';
      thankYouDiv.innerHTML = `<h2>Thank you, ${name}!</h2><p>You booked ${selectedSlot}.</p>`;
      document.querySelector('.container').appendChild(thankYouDiv);
    }).catch((error) => {
      console.error('Error writing to database:', error);
      alert('There was an error booking your time.');
    });
  });
  
  // Listen for bookings
  // Listen for booked slots and update UI + Admin Table
db.ref('slots').on('value', snapshot => {
    const bookings = snapshot.val();
  
    // --- Handle booked slots ---
    document.querySelectorAll('.slot').forEach(div => {
      div.classList.remove('booked');
      div.innerText = div.dataset.time;
    });
  
    if (bookings) {
      Object.keys(bookings).forEach(key => {
        const time = bookings[key].time;
        const slotDiv = Array.from(document.querySelectorAll('.slot')).find(div => div.dataset.time === time);
        if (slotDiv) {
          slotDiv.classList.add('booked');
          slotDiv.innerText = `${time}\n(${bookings[key].name})`;
        }
      });
    }
  
    // --- Handle Admin Table ---
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = ''; // Clear the table first
  
    if (bookings) {
      Object.values(bookings).forEach(booking => {
        const tr = document.createElement('tr');
  
        const nameTd = document.createElement('td');
        nameTd.style.padding = '10px';
        nameTd.textContent = booking.name;
  
        const timeTd = document.createElement('td');
        timeTd.style.padding = '10px';
        timeTd.textContent = booking.time;
  
        tr.appendChild(nameTd);
        tr.appendChild(timeTd);
        bookingsTableBody.appendChild(tr);
      });
    }
  });
  
  

 

