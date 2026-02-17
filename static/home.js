
// home page script
// "Start Planning" and "Go To Tasks" buttons ko select karo
document.addEventListener("DOMContentLoaded", function () {
    const startPlanningButton = document.getElementById("start-planning");
    const goToTasksButton = document.getElementById("go-to-tasks");
    
    // Check if elements exist before adding listeners
    if (startPlanningButton) {
        startPlanningButton.addEventListener("click", function () {
            window.location.href = "/notes/";
        });
    }
    
    if (goToTasksButton) {
        goToTasksButton.addEventListener("click", function () {
            window.location.href = "/task/";
        });
    }
});

