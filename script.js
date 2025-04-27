import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCFGsl9m4RJHKA66Hkao76z6SPiGmfa3jI",
    authDomain: "quran-signup.firebaseapp.com",
    projectId: "quran-signup",
    storageBucket: "quran-signup.firebasestorage.app",
    messagingSenderId: "68136046532",
    appId: "1:68136046532:web:9454c8b85f3cdc04ee5e91"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Timeslots
  const timeslots = [];
  for (let hour = 19; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h = hour > 12 ? hour - 12 : hour;
      const m = min.toString().padStart(2, '0');
      timeslots.push(`${h}:${m} ${hour >= 12 ? 'PM' : 'AM'}`);
    }
  }
  timeslots.push(`9:00 PM`);
  
  // Render slots
  const slotsContainer = document.getElementById('timeslots');
  timeslots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'slot';
    div.innerText = slot;
    div.dataset.time = slot;
    slotsContainer.appendChild(div);
  });
  
  // Handle slot selection
  let selectedSlot = null;
  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.classList.contains('booked')) return;
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedSlot = slot.dataset.time;
    });
  });
  
  // Submit
  document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    if (!name || !selectedSlot) {
      alert("Please enter your name and select a timeslot.");
      return;
    }
    db.ref('slots/' + selectedSlot.replace(/[: ]/g, '_')).set({
      name: name,
      time: selectedSlot
    }).then(() => {
      alert("Successfully booked!");
      location.reload();
    });
  });
  
  // Listen for updates
  db.ref('slots').on('value', snapshot => {
    const bookings = snapshot.val();
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
  });
  