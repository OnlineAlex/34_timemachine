var TIMEOUT_IN_SECS =  3 * 60
var TEMPLATE = '<h1 style="margin: 0"><span class="js-timer-minutes">00</span>:<span class="js-timer-seconds">00</span></h1>'
var MOTIVATIONAL_QUOTES = [
  'Не ждите. Подходящее время никогда не наступит.\n~ Наполеон Хилл',
  'Унция действия стоит тонны теории.\n~ Фридрих Энгельс',
  'Откладывайте на завтра лишь то, что вы не хотите завершить до самой смерти.\n~ Пабло Пикассо',
  'Прокрастинация — вор времени. Держите ее в узде.\n~ Чарльз Диккенс',
  'Не прокрастинируйте — чем дольше вы оставляете важное на потом, тем больше оно покажется, когда на вас обрушится час «X».\n ~ Аурора МакКлеллан',
  'Откладывание легких вещей делает их трудными. Откладывание трудных вещей делает их невозможными.\n~ Джордж Х. Лоример',
  'Вы не сможете избежать завтрашней ответственности, уконяясь от нее сегодня.\n~ Авраам Линкольн',
  'Начните. Делайте что-нибудь… Движение — лучшее лекарство от прокрастинации.\n~ Энтони Геррера',
  'Через год ты будешь думать о том, что лучше бы ты начал сегодня.\n~ Карен Лэмб',
  'Еще не все колеса изобретены: мир слишком удивителен, чтобы сидеть сложа руки.\n~ Ричард Брэнсон',
  'Когда люди заняты работой, у них бывает лучшее настроение.\n~ Бенджамин Франклин'
]

function padZero(number){
  return ("00" + String(number)).slice(-2);
}

class Timer{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  constructor(timeout_in_secs){
    this.initial_timeout_in_secs = timeout_in_secs

    this.reset()
  }
  getTimestampInSecs(){
    var timestampInMilliseconds = new Date().getTime()
    return Math.round(timestampInMilliseconds/1000)
  }
  start(){
    if (this.isRunning)
      return
    this.timestampOnStart = this.getTimestampInSecs()
    this.isRunning = true
  }
  stop(){
    if (!this.isRunning)
      return
    this.timeout_in_secs = this.calculateSecsLeft()
    this.timestampOnStart = null
    this.isRunning = false
  }
  reset(timeout_in_secs){
    this.isRunning = false
    this.timestampOnStart = null
    this.timeout_in_secs = this.initial_timeout_in_secs
  }
  restart(second){
    this.timeout_in_secs = second
    this.timestampOnStart = this.getTimestampInSecs()

    this.isRunning = true

  }
  calculateSecsLeft(){
    if (!this.isRunning)
      return this.timeout_in_secs
    var currentTimestamp = this.getTimestampInSecs()
    var secsGone = currentTimestamp - this.timestampOnStart
    return Math.max(this.timeout_in_secs - secsGone, 0)
  }
}

class TimerWidget{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  construct(){
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
  mount(rootTag){
    if (this.timerContainer)
      this.unmount()

    // adds HTML tag to current page
    this.timerContainer = document.createElement('div')

    this.timerContainer.setAttribute("style",
      "font-size: 15px;" +
      "padding: 26px 5px;" +
      "color: #ff6666;" +
      "top: 10px;" +
      "left: 10px;" +
      "position: fixed;" +
      "z-index: 5001;" +
      "background-color: #f6f6f6;" +
      "border-radius: 50%;" +
      "border: 5px dashed #505050;"
    )


    this.timerContainer.innerHTML = TEMPLATE

    rootTag.insertBefore(this.timerContainer, rootTag.firstChild)

    this.minutes_element = this.timerContainer.getElementsByClassName('js-timer-minutes')[0]
    this.seconds_element = this.timerContainer.getElementsByClassName('js-timer-seconds')[0]
  }
  update(secsLeft){
    var minutes = Math.floor(secsLeft / 60);
    var seconds = secsLeft - minutes * 60;

    this.minutes_element.innerHTML = padZero(minutes)
    this.seconds_element.innerHTML = padZero(seconds)
  }
  unmount(){
    if (!this.timerContainer)
      return
    this.timerContainer.remove()
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
}


function main(){

  var timer = new Timer(TIMEOUT_IN_SECS)
  var timerWiget = new TimerWidget()
  var intervalId = null
  var timeoutAlert = 30
  var notice = MOTIVATIONAL_QUOTES.slice()
  timerWiget.mount(document.body)


  function noticeAlert() {
    var notification = Math.floor(Math.random() * notice.length)

    window.alert(notice[notification])
    notice.splice(notification, 1)

    if (notice.length < 1){
      notice = MOTIVATIONAL_QUOTES.slice()
    }
  }


  function handleIntervalTick(){
    var secsLeft = timer.calculateSecsLeft()
    timerWiget.update(secsLeft)

    if (secsLeft === 0) {
      noticeAlert()
      timer.restart(timeoutAlert)
    }
  }


  function handleVisibilityChange(){
    if (document.hidden) {
      timer.stop()
      clearInterval(intervalId)
      intervalId = null
    } else {
      timer.start()
      intervalId = intervalId || setInterval(handleIntervalTick, 300)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener("visibilitychange", handleVisibilityChange, false);
  handleVisibilityChange()
}


// initialize timer when page ready for presentation
window.addEventListener('load', main)