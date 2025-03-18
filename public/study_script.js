let intervalId;
let start = false;
let cycle = 0;

function pad(time) {
    return ("0" + time).length > 2 ? time: "0" + time;
}

function studyTimer() {
    let time = $("#study-nums").text().trim().split(":");
    const timeInSec = Number(time[0])*3600 + Number(time[1])*60 + Number(time[2]);
    
    let cur_time = timeInSec;

    console.log(cur_time);
    function intervalBody() {
        let hr = Math.floor(cur_time / 3600); // Get hours
        let min = Math.floor((cur_time % 3600) / 60); // Get remaining minutes
        let sec = cur_time % 60; // Get remaining seconds
    
        $("#study-nums").text(`${pad(hr)}:${pad(min)}:${pad(sec)}`); // Change html

        cur_time--; // Gecrement time
    
        if (cur_time <= 0) {
            clearInterval(intervalId);
            $("#study-nums").text("00:00:00");

            setTimeout(function() {
                location.replace(`/rest?cycle=${cycle}`); // Move to rest
                console.log("Resting..."); 
            }, 1000);

            start = false;
        }
    }

    intervalBody(); // Preliminary run
    intervalId = setInterval(intervalBody, 10);
}
function runTimer() {
    if (!start) {
        start = true;
        studyTimer();
    }
    else {
        console.log("Timer already started");
    }
}

function stopTimer() {
    if (start) {
        start = false;
        clearInterval(intervalId);
    }
    else {
        console.log("Timer not started");
    }
}

function resetTimer() {
    if (start) {
        stopTimer();
        cycle = 0;
    }

    $("#study-nums").text("00:25:00");
}

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    cycle = Number(urlParams.get("cycle")) || 0;

    $("#start-study").click(runTimer);
    if (cycle > 0) {
        $("#start-study").click();
    }
    $("#pause-study").click(stopTimer);
    $("#reset-study").click(resetTimer);
});