let start = false;
let study = false;
let rest = false;
let intervalId = {
    start: 0,
    rest: 0
};

function studyRestTimer() {
    $("#timer-nums").text("00:10:00");

    let time = $("#timer-nums").text().trim().split(":");
    const timeInSec = Number(time[0])*3600 + Number(time[1])*60 + Number(time[2]);
    
    let cur_time = timeInSec;

    console.log(cur_time);
    function intervalBody() {
        let hr = Math.floor(cur_time / 3600); // Get hours
        let min = Math.floor((cur_time % 3600) / 60); // Get remaining minutes
        let sec = cur_time % 60; // Get remaining seconds
    
        $("#timer-nums").text(`${pad(hr)}:${pad(min)}:${pad(sec)}`);
        cur_time--;
    
        function pad(time) {
            return ("0" + time).length > 2 ? time: "0" + time;
        }
    
        if (cur_time <= 0) {
            clearInterval(intervalId.start);
            setTimeout(restTimer, 500);
        }
    }

    intervalBody(); // Preliminary run
    intervalId.start = setInterval(intervalBody, 10);
}

function restTimer() {
    $("#timer-nums").text("00:05:00");
    let time = $("#timer-nums").text().trim().split(":");
    const timeInSec = Number(time[0])*3600 + Number(time[1])*60 + Number(time[2]);
    
    let cur_time = timeInSec;

    console.log(cur_time);
    function intervalBody() {
        let hr = Math.floor(cur_time / 3600); // Get hours
        let min = Math.floor((cur_time % 3600) / 60); // Get remaining minutes
        let sec = cur_time % 60; // Get remaining seconds
    
        $("#timer-nums").text(`${pad(hr)}:${pad(min)}:${pad(sec)}`);
        cur_time--;
    
        function pad(time) {
            return ("0" + time).length > 2 ? time: "0" + time;
        }
    
        if (cur_time <= 0) {
            clearInterval(intervalId.rest);
            start = false;
        }
    }

    intervalBody(); // Preliminary run
    intervalId.rest = setInterval(intervalBody, 100);
}

function runTimer() {
    if (!start) {
        start = true;
        studyRestTimer();
    }
    else {
        console.log("Timer already started");
    }
}

function stopTimer() {
    if (start) {
        start = false;
        clearInterval(intervalId.start);
        clearInterval(intervalId.rest);
    }
    else {
        console.log("Timer not started");
    }
}

function resetTimer() {
    if (start) {
        stopTimer();
    }

    $("#timer-nums").text("00:25:00");
}

$(document).ready(function() {
    $("#start").click(runTimer);
    $("#stop").click(stopTimer);
    $("#reset").click(resetTimer);
});