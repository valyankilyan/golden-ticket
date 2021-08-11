const qrcode1 = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

qrcode1.callback = res => {
  if (res) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/admin/post_id', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log(res);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
        }
    }
    xhr.send("id_code=" + res);
    

    outputData.innerText = res;
    scanning = false;
   

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    
    canvasElement.hidden = true;
    btnScanQR.hidden = false;

    // Где-то здесь редирект, на ту же страницу, андрей
   
    
  setTimeout("window.location.reload();", 1000);
    
    
    
   
  }
};

btnScanQR.onclick = () => {
  console.log(1);
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
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
    qrcode1.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
