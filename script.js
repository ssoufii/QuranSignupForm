const firebaseConfig = {
    apiKey: "AIzaSyCFGsl9m4RJHKA66Hkao76z6SPiGmfa3jI",
    authDomain: "quran-signup.firebaseapp.com",
    databaseURL: "https://quran-signup-default-rtdb.firebaseio.com",
    projectId: "quran-signup",
    storageBucket: "quran-signup.appspot.com",
    messagingSenderId: "68136046532",
    appId: "1:68136046532:web:9454c8b85f3cdc04ee5e91"
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    
    console.log("Firebase initialized");
    
    // Generate time slots
    const timeslots = [];
    for (let hour = 19; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const h = hour > 12 ? hour - 12 : hour;
        const m = min.toString().padStart(2, '0');
        timeslots.push(`${h}:${m} ${hour >= 12 ? 'PM' : 'AM'}`);
      }
    }
    timeslots.push("9:00 PM");
    
    // Render time slots
    const slotsContainer = document.getElementById('timeslots');
    timeslots.forEach(slot => {
      const div = document.createElement('div');
      div.className = 'slot';
      div.innerText = slot;
      div.dataset.time = slot;
      slotsContainer.appendChild(div);
    });
    
    let selectedSlot = null;
    document.querySelectorAll('.slot').forEach(slot => {
      slot.addEventListener('click', () => {
        if (slot.classList.contains('booked')) return;
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedSlot = slot.dataset.time;
        console.log("Selected slot:", selectedSlot);
      });
    });
    
    const form = document.getElementById('signup-form');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Form submitted");
      
      const name = document.getElementById('name').value.trim();
      if (!name || !selectedSlot) {
        alert("Please enter your name and select a timeslot.");
        return;
      }
      
      console.log(`Saving booking: ${name} at ${selectedSlot}`);
      
      // Create a sanitized key for the database
      const slotKey = selectedSlot.replace(/[:.]/g, '_').replace(/ /g, '_');
      
      db.ref('slots/' + slotKey).set({
        name: name,
        time: selectedSlot
      }).then(() => {
        console.log("Booking saved successfully");
        form.style.display = 'none';
        const thankYouDiv = document.createElement('div');
        thankYouDiv.className = 'thank-you';
        thankYouDiv.innerHTML = `<h2>Thank you, ${name}!</h2><p>You booked ${selectedSlot}.</p>`;
        document.querySelector('.container').appendChild(thankYouDiv);
      }).catch((error) => {
        console.error('Error saving booking:', error);
        alert('Error saving booking: ' + error.message);
      });
    });
    
    // Mark booked slots
    db.ref('slots').on('value', snapshot => {
      console.log("Received bookings data");
      const bookings = snapshot.val();
      if (bookings) {
        console.log("Existing bookings:", bookings);
        Object.keys(bookings).forEach(key => {
          const time = bookings[key].time;
          const slotDiv = Array.from(document.querySelectorAll('.slot')).find(div => div.dataset.time === time);
          if (slotDiv) {
            slotDiv.classList.add('booked');
            slotDiv.classList.remove('selected'); // In case it was selected
            slotDiv.innerText = `${time}\n(${bookings[key].name})`;
          }
        });
      } else {
        console.log("No existing bookings found");
      }
    });
});
