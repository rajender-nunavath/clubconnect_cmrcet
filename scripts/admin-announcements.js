// Import the Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your Firebase configuration object
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Admin only: Check if the user is an admin before allowing them to post
function checkAdmin() {
    onAuthStateChanged(auth, function(user) {
        if (user) {
            const userRef = collection(db, "users");
            const userQuery = query(userRef, where("uid", "==", user.uid));

            getDocs(userQuery).then((querySnapshot) => {
                if (!querySnapshot.empty && querySnapshot.docs[0].data().role === 'admin') {
                    // Admin logged in, show the post form
                    document.getElementById('postAnnouncementForm').style.display = 'block';
                    fetchAnnouncements();  // Fetch and display announcements
                } else {
                    alert('You must be an admin to post announcements.');
                }
            });
        }
    });
}

// Handle form submission for posting announcements
document.getElementById("postAnnouncementForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const tags = document.getElementById("tags").value.split(',').map(tag => tag.trim());
    const club = document.getElementById("club").value;
    const pinned = document.getElementById("pinned").checked;
    const timestamp = new Date();

    // Get current user info
    onAuthStateChanged(auth, function(user) {
        if (user) {
            const author = user.email;  // Use the logged-in user's email as the author

            // Save announcement to Firestore
            addDoc(collection(db, "announcements"), {
                title: title,
                content: content,
                tags: tags,
                club: club,
                pinned: pinned,
                timestamp: serverTimestamp(),
                author: author
            }).then(() => {
                alert('Announcement posted successfully');
                document.getElementById("postAnnouncementForm").reset();  // Reset form
                fetchAnnouncements();  // Reload announcements
            }).catch((error) => {
                console.error("Error posting announcement: ", error);
            });
        }
    });
});

// Fetch and display announcements
function fetchAnnouncements() {
    const q = query(collection(db, "announcements"), orderBy("timestamp", "desc"));
    getDocs(q).then((querySnapshot) => {
        const container = document.getElementById("announcementsContainer");
        container.innerHTML = '';  // Clear previous announcements

        if (querySnapshot.empty) {
            container.innerHTML = "<p>No announcements available at the moment.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const announcementDiv = document.createElement('div');
            announcementDiv.classList.add('announcement');

            announcementDiv.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.content}</p>
                <div class="meta">
                    <span>By: ${data.author}</span> | 
                    <span>Club: ${data.club}</span> | 
                    <span>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</span>
                </div>
                <div class="tags">
                    Tags: ${data.tags.join(', ')}
                </div>
                ${data.pinned ? '<div class="pinned">Pinned</div>' : ''}
            `;

            container.appendChild(announcementDiv);
        });
    }).catch((error) => {
        console.error("Error fetching announcements: ", error);
    });
}

// Run admin check when page loads
window.onload = function() {
    checkAdmin();
};
