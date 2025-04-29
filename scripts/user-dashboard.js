import { database, auth } from "../../scripts/firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const userName = sessionStorage.getItem("userName");
    const userClub = sessionStorage.getItem("userClub");

    if (!userName || !userClub) {
        window.location.href = "../../login.html"; // Redirect if session data is missing
        return;
    }

    // Set User Details
    document.getElementById("welcomeMessage").innerText = `Welcome, ${userName}`;
    document.getElementById("clubInfo").innerText = `Club: ${userClub}`;
    document.getElementById("club-logo").src = `../../images/${userClub.toLowerCase()}-logo.png`; // Club logo

    // Fetch Announcements for Feed
    fetchAnnouncements(userClub);
});

function fetchAnnouncements(club) {
    const announcementsRef = ref(database, `clubs/${club}/announcements`);
    get(announcementsRef).then(snapshot => {
        const announcements = snapshot.val() ? Object.values(snapshot.val()) : [];
        const feedSection = document.getElementById("feed-section");
        feedSection.innerHTML = "";

        announcements.forEach(announcement => {
            let div = document.createElement("div");
            div.classList.add("announcement-item");
            div.innerHTML = `<p>${announcement}</p>`;
            feedSection.appendChild(div);
        });
    });
}

// Logout Function
window.logout = function () {
    signOut(auth).then(() => {
        sessionStorage.clear();
        alert("Logged out successfully!");
        window.location.href = "../../login.html";
    }).catch(error => alert(error.message));
};
