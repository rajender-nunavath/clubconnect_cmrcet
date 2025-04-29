// Firebase References
const db = firebase.database();
const firestore = firebase.firestore();
const auth = firebase.auth();

// Authentication Check
auth.onAuthStateChanged((user) => {
    if (user) {
        const uid = user.uid;
        db.ref(`users/${uid}`).once("value").then((snapshot) => {
            const userData = snapshot.val();
            if (!userData || userData.role !== "admin") {
                alert("Access Denied!");
                window.location.href = "index.html";
            } else {
                // Set Admin Details
                document.getElementById("admin-name").innerText = userData.name;
                document.getElementById("admin-email").innerText = userData.email;
                document.getElementById("admin-pic").src = userData.profilePic || "default.png";

                // Fetch Club Members
                fetchMembers(userData.club);

                // Fetch Announcements
                fetchAnnouncements();

                // Fetch and Render Pie Chart
                renderPieChart();
            }
        });
    } else {
        window.location.href = "index.html"; // Redirect if not logged in
    }
});

// Function to Fetch Members of the Admin's Club
function fetchMembers(club) {
    db.ref("users").orderByChild("club").equalTo(club).once("value").then((snapshot) => {
        const membersTable = document.getElementById("members-table-body");
        membersTable.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const member = childSnapshot.val();
            const row = `<tr>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone || "N/A"}</td>
            </tr>`;
            membersTable.innerHTML += row;
        });
    });
}

// Function to Fetch Announcements from Firestore
function fetchAnnouncements() {
    const announcementsContainer = document.getElementById("announcements-container");
    announcementsContainer.innerHTML = "";

    firestore.collection("announcements").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const announcement = doc.data();
            const announcementCard = `<div class="announcement-card">
                <h4>${announcement.title}</h4>
                <p>${announcement.content}</p>
                <small>Posted on: ${new Date(announcement.timestamp.toDate()).toLocaleString()}</small>
            </div>`;
            announcementsContainer.innerHTML += announcementCard;
        });
    });
}

// Function to Render Pie Chart for Club Members
function renderPieChart() {
    firestore.collection("members").get().then((querySnapshot) => {
        let data = {};
        querySnapshot.forEach((doc) => {
            let club = doc.data().club;
            data[club] = (data[club] || 0) + 1;
        });

        const ctx = document.getElementById("pieChart").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f"]
                }]
            }
        });
    });
}

// Logout Function
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// Attach Logout Button Click Event
document.getElementById("logout-btn").addEventListener("click", logout);
