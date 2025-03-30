
let start = false;
let startTime;
let endTime;

let timeLeft = null;


function returnNums(name) {
    return $(`#study-nums input[name='${name}']`).val() != "" ? $(`#study-nums input[name='${name}']`).val(): $(`#study-nums input[name='${name}']`).attr("placeholder");
}

function updateTimer() {
    timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    
    let hr = Math.floor(timeLeft / 3600); // Get hours
    let min = Math.floor((timeLeft % 3600) / 60); // Get remaining minutes
    let sec = timeLeft % 60; // Get remaining seconds

    $("#study-nums input[name='study-hours']").val(`${hr}`.padStart(2, "0"));
    $("#study-nums input[name='study-minutes']").val(`${min}`.padStart(2, "0"));
    $("#study-nums input[name='study-seconds']").val(`${sec}`.padStart(2, "0"));

    if (timeLeft > 0) {
        if (start)
            requestAnimationFrame(updateTimer);
        else 
            return "Paused";
    }
    else {
        $("#study-nums input").each(function() {
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
        $("#start-study").text("Pause");
        $("#study-nums input").each(function() {$(this).prop("readonly", true)});

        let hours = Number(returnNums("study-hours"));
        let minutes = Number(returnNums("study-minutes"));
        let seconds = Number(returnNums("study-seconds"));

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
        $("#start-study").text("Start");
        $("#study-nums input").each(function() {$(this).prop("readonly", false)});
    }
    else {
        console.log("Timer not started");
    }
}

function clearTimer() {
    if (start) {
        stopTimer();
        timeLeft = 0;
    }
    $.get("/clear-cycle", function(res) {
        if (res.cleared) {
            location.replace("/");
            location.reload();
        }
    }); 
}

function clearTimeFields() {
    $("#study-nums input").each(function() {
        $(this).val("");
    });
}

function resetTimer() {
    if (start) {
        stopTimer();
        timeLeft = 0;
    }
    clearTimeFields();
}

$(document).ready(function() {
    $("#study-nums input").change(function() {
        $("#study-nums input").each(function() {
            if (!($(this).val() >= 0)) {
                clearTimeFields();
            } 
        })
    });

    $("#timer-buttons button").each(function() {$(this).prop("disabled", false)});

    let cycle = $("#timer").data("cycle") || 0; 
    console.log("Cycle from data attribute:", cycle);

    
    $("#start-study").click(() => {
        if (start)
            stopTimer();
        else
            runTimer();
    });

    if (cycle > 0) {
        $("#start-study").click();
    }
    $("#stop-study").click(clearTimer);
    $("#reset-study").click(resetTimer);
});