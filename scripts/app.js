// Your Firebase configuration object (replace with your actual config from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyCJ9vaClojHn_IIY2YC8XOBlY7JtHmt5vM",
    authDomain: "check-e4504.firebaseapp.com",
    databaseURL: "https://check-e4504-default-rtdb.firebaseio.com",
    projectId: "check-e4504",
    storageBucket: "check-e4504.appspot.com",  // ✅ Fixed storageBucket
    messagingSenderId: "753492063096",
    appId: "1:753492063096:web:e499ee4f211f8f9f82ce8d",
    measurementId: "G-5TRQEHS5WM"
};

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Function to fetch announcements for a specific club (e.g., "PCC")
function fetchAnnouncementsForClub(clubName) {
  db.collection("announcements")
    .where("club", "==", clubName) // Query by club name
    .orderBy("timestamp", "desc") // Order by timestamp (desc = latest first)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No announcements found for this club.");
      }
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Fetched announcement: ", data); // Debug log

        displayAnnouncement(data); // Function to display the announcement
      });
    })
    .catch((error) => {
      console.error("Error fetching announcements: ", error); // Error handling
    });
}

// Call the function for the "PCC" club (adjust as needed)
fetchAnnouncementsForClub("PCC");

// Function to display the fetched announcement
function displayAnnouncement(data) {
  const announcementDiv = document.createElement('div');
  announcementDiv.classList.add('announcement');

  announcementDiv.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.content}</p>
    <span>By: ${data.author}</span>
    <span>Timestamp: ${new Date(data.timestamp.seconds * 1000).toLocaleString()}</span>
    <span>Tags: ${data.tags.join(", ")}</span>
    <span>Pinned: ${data.pinned ? "Yes" : "No"}</span>
  `;

  document.getElementById('announcementsContainer').appendChild(announcementDiv);
}

function fetchAllAnnouncements() {
  db.collection("announcements")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No announcements found.");
      }
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Fetched announcement: ", data); // Debug log
        displayAnnouncement(data); // Display the announcement
      });
    })
    .catch((error) => {
      console.error("Error fetching announcements: ", error);
    });
}

fetchAllAnnouncements(); // Call the function to fetch all announcements
