let start = false;
let startTime;
let endTime;

let timeLeft = null;

function returnNums(name) {
    return $(`#rest-nums input[name='${name}']`).val() != "" ? $(`#rest-nums input[name='${name}']`).val(): $(`#rest-nums input[name='${name}']`).attr("placeholder");
}

function updateTimer() {
    timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    
    let hr = Math.floor(timeLeft / 3600); // Get hours
    let min = Math.floor((timeLeft % 3600) / 60); // Get remaining minutes
    let sec = timeLeft % 60; // Get remaining seconds

    $("#rest-nums input[name='rest-hours']").val(`${hr}`.padStart(2, "0"));
    $("#rest-nums input[name='rest-minutes']").val(`${min}`.padStart(2, "0"));
    $("#rest-nums input[name='rest-seconds']").val(`${sec}`.padStart(2, "0"));

    if (timeLeft > 0) {
        if (start)
            requestAnimationFrame(updateTimer);
        else 
            return "Paused";
    }
    else {
        $("#rest-nums input").each(function() {
            $(this).val("00");
        });
        
        $("#timer-buttons button").each(function() {$(this).prop("disabled", true)});

        let alarm = new Audio("DLSU_BELL.mp3");
        alarm.volume = 0.5;
        alarm.play();

        setTimeout(function() {
            location.replace(`/rest`); // Move to rest
            console.log("Resting..."); 
        }, 20000);

        start = false;
    }
}

function runTimer() {
    if (!start) {
        start = true;
        $("#start-rest").text("Pause");
        $("#rest-nums input").each(function() {$(this).prop("readonly", true)});

        let hours = Number(returnNums("rest-hours"));
        let minutes = Number(returnNums("rest-minutes"));
        let seconds = Number(returnNums("rest-seconds"));
        const timeInSec = hours*3600 + minutes*60 + seconds;

        startTime = Date.now();
        endTime = startTime + timeInSec * 1000;
    
        console.log(`Timer started at ${startTime} and end ${endTime} time sec ${timeInSec}`);
    

        requestAnimationFrame(updateTimer);
    }
    else {
        console.log("Timer already started");
    }
}

function stopTimer() {
    if (start) {
        start = false;
        $("#start-rest").text("Start");
    }
    else {
        console.log("Timer not started");
    }
}

function clearTimer() {
    if (start) {
        stopTimer();
    }
    $.get("/clear-cycle", function(res) {
        if (res.cleared) {
            setTimeout(function() {
                location.replace("/");
                console.log("Studying..."); 
            }, 1000);

        }
    }); 
}

function resetTimer() {
    if (start) {
        stopTimer();
    }

    $("#rest-nums input").each(function() {
        $(this).val("");
    });
}
$(document).ready(function() {
    $("#timer-buttons button").each(function() {$(this).prop("disabled", false)});

    let cycle = $("#timer").data("cycle") || 0; 
    console.log("Cycle from data attribute:", cycle);

        
    $("#start-rest").click(() => {
        if (start)
            stopTimer();
        else
            runTimer();
    });

    $("#start-rest").click();
    $("#stop-rest").click(clearTimer);
    $("#reset-rest").click(resetTimer);
});