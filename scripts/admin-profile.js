import { auth, database, storage } from "./firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { uploadBytes, getDownloadURL, ref as storageRef } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const userRef = ref(database, `users/${userId}`);
    get(userRef).then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById("name").value = data.name || "";
            document.getElementById("phone").value = data.phone || "";
            document.getElementById("address").value = data.address || "";
            if (data.profilePic) {
                document.getElementById("profile-pic").src = data.profilePic;
            }
        }
    });
});

window.updateProfile = function () {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const imageInput = document.getElementById("profile-image").files[0];

    let updates = { name, phone, address };

    if (imageInput) {
        const imageRef = storageRef(storage, `profile_pictures/${userId}`);
        uploadBytes(imageRef, imageInput).then(() => {
            return getDownloadURL(imageRef);
        }).then(url => {
            updates.profilePic = url;
            return update(ref(database, `users/${userId}`), updates);
        }).then(() => {
            document.getElementById("status").innerText = "Profile updated successfully!";
        }).catch(error => alert(error.message));
    } else {
        update(ref(database, `users/${userId}`), updates)
            .then(() => {
                document.getElementById("status").innerText = "Profile updated successfully!";
            })
            .catch(error => alert(error.message));
    }
};
