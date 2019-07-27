$(document).ready(function() {
  const timeoutSeconds        =   20;
  const progressBar         =     document.getElementById("progressBar");
  const responseInput         =   $("#responseInput");
  const submittedBinary       =   $("#submittedBinary");
  const submittedDecimal      =   $("#submittedDecimal");
  const submittedResponse     =   $("#submittedResponse");
  const submittedResult       =   $("#submittedResult");
  const q = {decimal: 0, bits: ""};
  const score = {correct: 0, attempts: 0};
  var paused = false

  function init(){
    $("#score").text(`Score: 0/0`);
    score.correct = 0;
    score.attempts = 0;
    progressBar.value = timeoutSeconds;
    progressBar.max = timeoutSeconds;

  }
  
  function newQuestion(){
    q.decimal = Math.floor((Math.random() * 255) + 1);
    var rawBits = "00000000" + q.decimal.toString(2);
    q.bits = rawBits.slice(-8);
    $("#bits").text(q.bits);
  };
  
  
  init();
  newQuestion();

  

  
  

  function processAnswer(timedOut){
    submittedBinary.text(q.bits);
    submittedDecimal.text(q.decimal);
    if(timedOut){
      submittedResponse.text("Timeout");
      submittedResult.text("Incorrect");
      return 0
    }
    else{
      let response =  parseInt(responseInput.val());
      let result = response === q.decimal;
      submittedResponse.text(response);
      submittedResult.text(result ? "Correct" : "Incorrect");
      console.log("Process Anser: " + result)
      return result
    }
  }
  
  
  function updateScore(result){
    console.log("update Score: " + result)
     score.attempts ++;
      score.correct +=  result;
      $("#score").text(`Score: ${score.correct}/${score.attempts}`);

  }


  function startCountdown(secondsRemaining) {
    setInterval(() => {
      $("#progressBar").val(secondsRemaining);
      secondsRemaining = paused ? secondsRemaining : secondsRemaining - 1
      if(restartCounter){
        secondsRemaining = timeoutSeconds
        restartCounter = false;
      }
      if (secondsRemaining < 0) {
        secondsRemaining = timeoutSeconds;
        processAnswer(true)
        updateScore(0);
        newQuestion();
      }
    }, 1000);
  }

  
  $("#pause").click(function(e){
    e.preventDefault();
    paused = !paused
    $(this).text(paused ? "Resume" : "Pause")
})


  function responseSubmitHandler(event) {
    event.preventDefault();
    updateScore(processAnswer(false))
    responseInput.val("")
    paused = false;
    restartCounter = true
    $("#pause").text("Pause")
    newQuestion()

  }

  $("#responseSubmit").click(responseSubmitHandler)


  startCountdown(timeoutSeconds);



 
});

