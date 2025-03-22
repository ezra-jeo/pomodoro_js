let intervalId;
let start = false;

function pad(time) {
    return ("0" + time).length > 2 ? time: "0" + time;
}

function restTimer() {
    let time = $("#rest-nums").text().trim().split(":");
    const timeInSec = Number(time[0])*3600 + Number(time[1])*60 + Number(time[2]);
    
    let cur_time = timeInSec;

    console.log(cur_time);

    function intervalBody() {
        let hr = Math.floor(cur_time / 3600); // Get hours
        let min = Math.floor((cur_time % 3600) / 60); // Get remaining minutes
        let sec = cur_time % 60; // Get remaining seconds
    
        $("#rest-nums").text(`${pad(hr)}:${pad(min)}:${pad(sec)}`);
        cur_time--;
    
        if (cur_time <= 0) {
            clearInterval(intervalId);
            $("#rest-nums").text("00:00:00");
            setTimeout(function() {
                location.replace(`/`); // Move to rest
                console.log("Studying..."); 
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
        restTimer();
        $("#start-rest").text("Pause");
        
    }
    else if (start) {
        stopTimer();
        $("#start-rest").text("Start");
    }
    else {
        console.log("Timer already started");
    }
}

function stopTimer() {
    if (start) {
        start = false;
        clearInterval(intervalId);
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
    $("#rest-nums").text("00:05:00");
}

$(document).ready(function() {
    let cycle = $("#timer").data("cycle") || 0; 
    console.log("Cycle from data attribute:", cycle);

    $("#start-rest").click(runTimer);
    $("#start-rest").click();
    $("#stop-rest").click(clearTimer);
    $("#reset-rest").click(resetTimer);
});