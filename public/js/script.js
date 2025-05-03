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

function getTimeAgo(dateString) {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    console.log(diffMinutes)
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

// Now loop through and update your posts
document.querySelectorAll(".devConnect-post").forEach(postEl => {
    console.log(postEl)
    const timeText = getTimeAgo(postEl.dataset.createdAt);
    console.log(timeText)
    postEl.querySelector(".time").innerText = timeText;
});