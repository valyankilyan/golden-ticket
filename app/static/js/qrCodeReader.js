const QRcode = window.qrcode

const video = document.createElement('video')
const canvasElement = document.getElementById('qr-canvas')
const canvas = canvasElement.getContext('2d')

const qrResult = document.getElementById('qr-result')
const outputData = document.getElementById('outputData')
const btnScanQR = document.getElementById('btn-scan-qr')

let scanning = false

QRcode.callback = res => {
  if (res) {
    outputData.innerText = getTicketLuckiness(res)
    scanning = false

    video.srcObject.getTracks().forEach(track => {
      track.stop()
    })

    qrResult.hidden = false
    btnScanQR.hidden = false
    canvasElement.hidden = true

    var req = new XMLHttpRequest()
    req.open('POST', '/', true)
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    req.onreadystatechange = function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        req.send(res)
        console.log(res)
      }
    }
    req.send(res)
    console.log(res)
  }
}

function getTicketLuckiness (url, divisor) {
  const numbers = getTicketInfo(url)

  if (!numbers) {
    return 'Это либо не билет, либо у вас в городе там чота поменялось.'
  }

  const concatenatedNumber = numbers.join('')
  console.log(concatenatedNumber)

  const luckiness = getLuckinessPercentage(concatenatedNumber)
  console.log(luckiness)

  if (luckiness > 100 || luckiness < 0) {
    return 'чота пошло не так'
  }

  msg = ''
  if (luckiness > 99) {
    msg =
      'ЭТО УЛЬТРАСЧАСТЛИВЫЙ БИЛЕТ, ТЕБЕ ОЧЕНЬ ПОВЕЗЛО, У ТЕБЯ СКОРО ПОЯВИТСЯ ЖЕНА НЕ ИЗ АНИМЕ И ТЫ БУДЕШЬ ЖИТЬ СВОЮ САМУЮ ЛУЧШУЮ ЖИЗНЬ БЛАГОДАРЯ ЭТОМУ БИЛЕТУ!!!'
  } else if (luckiness > 90) {
    msg =
      'Ещё чуть-чуть и суперсчастливый был бы,,, Скорее всего у тебя получится сегодня найти деньги на дороге или тебе подарят кофе'
  } else if (luckiness > 75) {
    msg = 'Нууу хороший билет, возможно тебе сегодня улыбнется кассир пятерочки'
  } else if (luckiness > 50) {
    msg = 'Норм.. Но стоит попробовать ещё раз проехать на троллейбусе'
  } else if (luckiness > 25) {
    msg = 'Ну такоеее... В следующий твой кофе плюнет бариста'
  } else if (luckiness > 10) {
    msg = 'оуууу... Не ходи рядом с домами, на тебя может что-то упасть'
  } else if (luckiness > 0) {
    msg = 'жеееееесть... Готовься прощаться с жизнью'
  }

  return 'Билет счастливый на ' + luckiness.toFixed(1) + '%. ' + msg
}

function splitNumberIntoArray (num) {
  return num.toString().split('').map(Number)
}

function getMax (a, b) {
  if (a > b) {
    return a
  }
  return b
}

function abc (a) {
  if (a < 0) {
    return -a
  }
  return a
}

function getLuckinessPercentage (num) {
  const nums = splitNumberIntoArray(num)
  console.log(nums)
  sum1 = 0
  sum2 = 0
  for (let i = 0; i < nums.length; i += 2) {
    sum1 += nums[i]
    if (i + 1 < nums.length) {
      sum2 += nums[i + 1]
    }
  }
  console.log(sum1, sum2)

  max = getMax(sum1, sum2)
  diff = abc(sum1 - sum2)
  luckiness = max - diff
  return (luckiness / max) * 100
}

function getTicketInfo (url) {
  const urlParts = url.split('/')

  const num = urlParts[urlParts.length - 1]
  console.log('num:', num)

  const match = num.match(/(\d{4}-\d{4}-\d{4}-\d{1})/)

  if (match) {
    const numbers = match[0].split('-').map(Number)
    console.log('numbers:', numbers)
    return numbers
  } else {
    return null
  }
}

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'environment' } })
    .then(function (stream) {
      scanning = true
      qrResult.hidden = true
      btnScanQR.hidden = true
      canvasElement.hidden = false
      video.setAttribute('playsinline', true) // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream
      video.play()
      tick()
      scan()
    })
}

function tick () {
  canvasElement.height = video.videoHeight
  canvasElement.width = video.videoWidth
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)

  scanning && requestAnimationFrame(tick)
}

function scan () {
  try {
    QRcode.decode()
  } catch (e) {
    setTimeout(scan, 20)
  }
}
