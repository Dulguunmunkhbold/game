//Тоглоомын бүх газар дуудагдах ГЛОБАЛ хувьсагч

var soundFail = new Audio('./spin-fail-295088.mp3');
var soundWin = new Audio('./winner_sound.mp3');
var soundNew = new Audio('./page-flip.mp3');
var activePlayer, scores, roundScore;
var diceNumber;
var isPlaying;
var winNumber;
var random;
const a = function () {

}
//Шооны зургийг үзүүлэх элементийг DOM-оос хайж болоод энд хадгална.
var diceDom = document.querySelector(".dice");
initGame();
function initGame() {
    soundNew.pause();
    soundNew.currentTime = 0; // Дахин тоглуулахад эхнээс нь эхлүүлэх
    soundNew.play();

    // 1.5 секундын дараа дууг зогсоох
    setTimeout(function () {
        soundNew.pause();
        soundNew.currentTime = 0;
    }, 2000); //
    //Тоглогчийн ээлжийг хадгалах хувьсагч, нэгдүгээр тоглогчийг 0, хоёрдугаар тоглогчийг 1 гэе
    activePlayer = 0;

    //Тоглогчдын цуглуулсан оноог хадгалах хувьсагч
    scores = [0, 0];

    //Тоглогчийн ээлжиндээ цуглуулж байгаа оноог хадгалах хувьсагч
    roundScore = 0;

    //Шооны аль талаараа буусныг хадгалах хувьсагч хэрэгтэй, нэгээс зургаа гэсэн утгыг энэ хувьсагчид санамсаргүйгээр үүсгэж өгнө.
    diceNumber = Math.floor(Math.random() * 6) + 1;
    /* <div class="player-score" id="score-0">43</div> */
    // window.document.querySelector('#score-0').textContent = dice;
    // window.document.querySelector('#score-1').innerHTML = "<em> YES </em>";
    isPlaying = true;


    //Программ эхлэхэд бэлтгье
    document.getElementById("score-0").textContent = '0';
    window.document.getElementById('score-1').textContent = '0';
    // <div class="player-current-score" id="current-0">11</div> 
    document.getElementById("current-0").textContent = '0';
    document.getElementById("current-1").textContent = '0';

    //Тоглогчды нэрийг буцааж гаргах
    document.getElementById("name-0").textContent = ("Player 1");
    document.getElementById("name-1").textContent = ("Player 2");


    document.querySelector(".player-0-panel").classList.remove("winner");
    document.querySelector(".player-0-panel").classList.add("active");
    document.querySelector(".player-1-panel").classList.remove("winner");

    var tmpWinNumber = 0;
    while (isNaN(tmpWinNumber) || tmpWinNumber <= 0) {
        var input = prompt("Хэдэн оноонд өрсөлдөх вэ? (Эерэг тоо оруулна уу): ");
        if (input === null) {
            tmpWinNumber = 100; // default утга
            break;
        }
        tmpWinNumber = parseInt(input);
    }
    winNumber = tmpWinNumber;




    // 🏆 Шинээр нэмэгдэх код: winNumber-ийг дэлгэцэнд харуулна.
    document.getElementById("win-number-display").textContent = winNumber;
    diceDom.style.display = "none";

}
// roll dice button дарахад event ажиллах ба шоо шидэх эвэнт байна буюу голын шооны зураг хөдөлнө.
document.querySelector(".btn-roll").addEventListener("click", function () {
    if (isPlaying) {

        // 1. Оноог тооцох эцсийн шооны тоог хадгалах хувьсагчийг зарлах
        var finalDiceNumber;

        // 2. Шоог эргүүлэх эффектийг (6 удаагийн зураг солих) хийх
        for (var i = 0; i < 6; i++) {
            // setTimeout-ыг ашиглан зураг солих.
            setTimeout(function (step) {

                // Зөвхөн зургийг хөдөлгөөн оруулах зорилгоор санамсаргүйгээр үүсгэх.
                var tempDiceNumber = Math.floor(Math.random() * 6) + 1;
                diceDom.style.display = "block";
                diceDom.src = "dice-" + tempDiceNumber + ".png";

                // Эффект дуусах үед (сүүлийн удаагийн setTimeout дуусах үед) 
                // жинхэнэ шооны тоог бодож, оноог тооцно.
                if (step === 5) { // i=5 буюу 6 дахь давталтын setTimeout дуусах үед

                    // a. Жинхэнэ шидсэн тоо
                    finalDiceNumber = Math.floor(Math.random() * 6) + 1;
                    diceDom.src = "dice-" + finalDiceNumber + ".png"; // Эцсийн зургийг харуулах

                    // b. Оноог тооцох логик
                    if (finalDiceNumber !== 1) {
                        roundScore += finalDiceNumber;
                        document.getElementById("current-" + activePlayer).textContent = roundScore;
                    }
                    else {
                        soundFail.pause();
                        soundFail.currentTime = 0; // Дахин тоглуулахад эхнээс нь эхлүүлэх
                        soundFail.play();

                        // 1.5 секундын дараа дууг зогсоох
                        setTimeout(function () {
                            soundFail.pause();
                            soundFail.currentTime = 0;
                        }, 2000); // 1.5 секунд
                        setTimeout(function () {
                            roundScore = 0;
                            document.getElementById("current-" + activePlayer).textContent = roundScore;
                            switchToNextPlayer();
                        }, 2000);

                    }
                }
            }, i * 100, i); // Хурдыг 100ms болгож багасгасан ба 'i'-г дамжуулсан.
        }

    }
});

//hold button event
document.querySelector('.btn-hold').addEventListener("click", function () {
    // global score is added
    scores[activePlayer] += roundScore;
    //eeljiin onoo O bolood , hevlene.
    roundScore = 0;
    document.getElementById("current-" + activePlayer).textContent = roundScore;
    document.getElementById("score-" + activePlayer).textContent = scores[activePlayer];
    if (checkWin() === true) {
        isPlaying = false;
        return;
    }
    switchToNextPlayer();
}

);
//Тоглогчийг өөрлөх
function switchToNextPlayer() {
    //before changing activePlayer. Remove red dote.
    document.querySelector(".player-" + activePlayer + "-panel").classList.remove("active");
    activePlayer = activePlayer === 0 ? 1 : 0;
    // Red dot is add for new active player
    document.querySelector(".player-" + activePlayer + "-panel").classList.add("active");
    diceDom.style.display = "none";
}
function checkWin() {
    //Checking win 
    if (scores[activePlayer] >= winNumber) {
        document.getElementById("name-" + activePlayer).textContent = "WINNER!!!";
        document.querySelector(".player-" + activePlayer + "-panel").classList.remove("active");
        document.querySelector(".player-" + activePlayer + "-panel").classList.add("winner");
        soundWin.pause();
        soundWin.currentTime = 0; // Дахин тоглуулахад эхнээс нь эхлүүлэх
        soundWin.play();

        // 1.5 секундын дараа дууг зогсоох
        setTimeout(function () {
            soundWin.pause();
            soundWin.currentTime = 0;
        }, 5000); // 1.5 секунд
        diceDom.style.display = "none";
        return true;
    }
}

//NEW GAME BUTTON
document.querySelector(".btn-new").addEventListener("click", initGame);