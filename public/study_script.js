let intervalId;
let start = false;


function returnNums(name) {
    return $(`#study-nums input[name='${name}']`).val() != "" ? $(`#study-nums input[name='${name}']`).val(): $(`#study-nums input[name='${name}']`).attr("placeholder");
}

function studyTimer() {
    let hours = Number(returnNums("study-hours"));
    let minutes = Number(returnNums("study-minutes"));
    let seconds = Number(returnNums("study-seconds"));

    timeInSec = hours*3600 + minutes*60 + seconds;

    let cur_time = timeInSec;

    console.log(cur_time);
    function intervalBody() {
        let hr = Math.floor(cur_time / 3600); // Get hours
        let min = Math.floor((cur_time % 3600) / 60); // Get remaining minutes
        let sec = cur_time % 60; // Get remaining seconds
        
        $("#study-nums input[name='study-hours']").val(`${hr}`.padStart(2, "0"));
        $("#study-nums input[name='study-minutes']").val(`${min}`.padStart(2, "0"));
        $("#study-nums input[name='study-seconds']").val(`${sec}`.padStart(2, "0"));

        cur_time--; // Decrement time
    
        if (cur_time <= 0) {
            clearInterval(intervalId);
            
            $("#study-nums input").each(function() {
                $(this).val("00");
            });
            
            let alarm = new Audio("DLSU_BELL.mp3");
            alarm.play();

            setTimeout(function() {
                location.replace(`/rest`); // Move to rest
                console.log("Resting..."); 
            }, 20000);

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
        $("#start-study").text("Pause");
        $("#study-nums input").each(function() {$(this).prop("readonly", true)});
    }
    else if (start) {
        stopTimer();
        $("#start-study").text("Start");

    }
    else {
        console.log("Timer already started");
    }
}

function stopTimer() {
    if (start) {
        start = false;
        clearInterval(intervalId);
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

    let cycle = $("#timer").data("cycle") || 0; 
    console.log("Cycle from data attribute:", cycle);

    $("#start-study").click(runTimer);
    if (cycle > 0) {
        $("#start-study").click();
    }
    $("#stop-study").click(clearTimer);
    $("#reset-study").click(resetTimer);
});