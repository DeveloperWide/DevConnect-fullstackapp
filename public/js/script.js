// Bootstrap Validation Script
(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()


setTimeout(() => {
    const flashDiv = document.getElementById('flash-div');
    if (flashDiv) {
        location.reload()
    }
}, 2000); // 5 seconds


function getTimeAgo(dateString) {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

// Now loop through and update your posts
document.querySelectorAll(".devConnect-post").forEach(postEl => {
    const timeText = getTimeAgo(postEl.dataset.createdAt);
    postEl.querySelector(".time").innerText = timeText;
});

const moreBtn = document.getElementById('moreBtn');
const menuCard = document.getElementById('menuCard');

if (moreBtn || menuCard) {
    // Toggle the card when icon is clicked
    moreBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop event from bubbling to document
        menuCard.classList.toggle('show');
    });

    // Close the card if clicked outside
    document.addEventListener('click', (e) => {
        if (!menuCard.contains(e.target) && e.target !== moreBtn) {
            menuCard.classList.remove('show');
        }
    });
}

let followingBtn = document.querySelector(".following");

if (followingBtn.innerText.trim() === ("Following")) {
    followingBtn.style.backgroundColor = "transparent";
    followingBtn.style.fontWeight = "800";

    followingBtn.addEventListener("mouseover", () => {
        followingBtn.style.border = "1px solid red";
        followingBtn.style.color = "red";
        followingBtn.innerText = "Unfollow";
    });

    followingBtn.addEventListener("mouseout", () => {
        followingBtn.style.border = "1px solid white";
        followingBtn.style.color = "white"; // or your default color
        followingBtn.innerText = "Following"
    });
}
