let intervalId;
let start = false;

function returnNums(name) {
    return $(`#rest-nums input[name='${name}']`).val() != "" ? $(`#rest-nums input[name='${name}']`).val(): $(`#rest-nums input[name='${name}']`).attr("placeholder");
}

function restTimer() {
    let hours = Number(returnNums("rest-hours"));
    let minutes = Number(returnNums("rest-minutes"));
    let seconds = Number(returnNums("rest-seconds"));

    timeInSec = hours*3600 + minutes*60 + seconds;

    let cur_time = timeInSec;

    console.log(cur_time);
    function intervalBody() {
        let hr = Math.floor(cur_time / 3600); // Get hours
        let min = Math.floor((cur_time % 3600) / 60); // Get remaining minutes
        let sec = cur_time % 60; // Get remaining seconds
        
        $("#rest-nums input[name='rest-hours']").val(`${hr}`.padStart(2, "0"));
        $("#rest-nums input[name='rest-minutes']").val(`${min}`.padStart(2, "0"));
        $("#rest-nums input[name='rest-seconds']").val(`${sec}`.padStart(2, "0"));

        cur_time--; // Decrement time
    
        if (cur_time <= 0) {
            clearInterval(intervalId);
            
            $("#rest-nums input").each(function() {
                $(this).val("00");
            });
            
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
        $("#rest-nums input").each(function() {$(this).prop("readonly", true)});

        
    }
    else if (start) {
        stopTimer();
        $("#start-rest").text("Start");
        $("#rest-nums input").each(function() {$(this).prop("readonly", false)});

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

    $("#rest-nums input").each(function() {
        $(this).val("");
    });
}
$(document).ready(function() {
    let cycle = $("#timer").data("cycle") || 0; 
    console.log("Cycle from data attribute:", cycle);

    $("#start-rest").click(runTimer);
    $("#start-rest").click();
    $("#stop-rest").click(clearTimer);
    $("#reset-rest").click(resetTimer);
});