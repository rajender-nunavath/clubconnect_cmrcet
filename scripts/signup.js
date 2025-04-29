import { auth, database } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

window.signup = function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const club = sessionStorage.getItem("selectedClub");

    if (!club) {
        alert("Please select a club before signing up.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;

            set(ref(database, `users/${userId}`), {
                name: name,
                email: email,
                club: club,
                role: "user"
            }).then(() => {
                sessionStorage.setItem("userName", name);
                sessionStorage.setItem("userEmail", email);
                sessionStorage.setItem("userRole", "user");
                sessionStorage.setItem("userClub", club);

                // Show success message
                alert("🎉 Successfully registered! Redirecting to login...");

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = "/login.html";
                }, 1000); // 2 seconds delay
            }).catch((error) => {
                alert("Database error: " + error.message);
            });
        })
        .catch((error) => {
            alert("Signup failed: " + error.message);
        });
};
