function runTimer() {
    // let time = $("#timer-nums").text().trim().split(":");
    let test = ["00", "25", "00"];
    const timeInSec = 25*60;
    let cur_time = timeInSec;

    console.log(cur_time);
    let intervalId = setInterval(function() {
        let hr = Math.floor(cur_time / 3600); // Get hours
        let min = Math.floor((cur_time % 3600) / 60); // Get remaining minutes
        let sec = cur_time % 60; // Get remaining seconds

        console.log(`${hr}:${min}:${sec} ${cur_time}`);            
        cur_time--;

        if (cur_time == 0)
            clearInterval(intervalId);
    }, 1000);
    
}

runTimer();