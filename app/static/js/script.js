window.onload = init;

function init(){
    var button = document.getElementById("cod_send")
    button.onclick = handleButtonClick;
}

function handleButtonClick() {
    alert("Вы запросили повторную отправку");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/login/send_again', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    console.log(document.location.pathname);

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
        }
    }
    xhr.send("email=" + document.location.pathname);
}