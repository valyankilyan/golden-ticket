const QRcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

QRcode.callback = (res) => {
    if (res) {
        outputData.innerText = getTicketInfo(res);
        scanning = false;

        video.srcObject.getTracks().forEach(track => {
            track.stop();
        });
           
        qrResult.hidden = false;
        btnScanQR.hidden = false;
        canvasElement.hidden = true;

        var req = new XMLHttpRequest();
        req.open('POST', '/', true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.onreadystatechange = function () { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                req.send(res);
                console.log(res);
            }
        }   
        req.send(res);     
        console.log(res);
    }
};

function getTicketInfo(res) {
    res = res.split('&')[2].split('=')[1];
    digits = [];
    for (i = 0, len = res.length; i < len; i+= 1) {
        digits.push(res.charAt(i) - '0')
    }

    sum = [];
    if (digits.length % 2 == 0) {        
        for (i = 0, len = digits.length; i < len; i += digits.length / 2) {
            s = 0;
            for (j = i; j < i + digits.length / 2; j+= 1) {
                s+= digits[j];
            }
            sum.push(s);
        }
    } else {
        sum = [0, 0];
        for (i = 0; i < digits.length; i+= 1) 
            sum[i%2]+= digits[i];
        
    }

    symbol = sum[0] == sum[1] ? " = " : " != ";
    status = sum[0] == sum[1] ? "У вас счастливый билет!!!" : "К сожалению в этот раз вам не повезло((";

    return res + "\n" + sum[0] + symbol + sum[1] + "\n" + status;
}


btnScanQR.onclick = () => {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            scanning = true;
            qrResult.hidden = true;
            btnScanQR.hidden = true;
            canvasElement.hidden = false;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.srcObject = stream;
            video.play();
            tick();
            scan();
        });
};

function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    scanning && requestAnimationFrame(tick);
}


function scan() {
    try {
        QRcode.decode();
    } catch (e) {
        setTimeout(scan, 100);
    }
}
