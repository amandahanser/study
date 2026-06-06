// ===== 三种模式对应的时间（秒）=====
const MODES = {
  focus: 25 * 60, // 专注 25 分钟
  short: 5 * 60,  // 短休息 5 分钟
  long: 15 * 60,  // 长休息 15 分钟
};

// 每种模式对应的提示文字
const STATUS_TEXT = {
  focus: "专注时间，加油！💪",
  short: "短暂休息一下 ☕",
  long: "好好放松一下吧 🌿",
};

// ===== 获取页面元素 =====
const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const countEl = document.getElementById("count");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const modeBtns = document.querySelectorAll(".mode-btn");

// ===== 状态变量 =====
let currentMode = "focus";          // 当前模式
let timeLeft = MODES[currentMode];  // 剩余秒数
let timerId = null;                 // 定时器 id
let isRunning = false;              // 是否正在运行
let pomodoroCount = 0;              // 已完成番茄钟数量

// ===== 把秒数格式化成 mm:ss =====
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ===== 更新倒计时显示 =====
function updateDisplay() {
  timerEl.textContent = formatTime(timeLeft);
  // 同步更新浏览器标签标题
  document.title = `${formatTime(timeLeft)} 🍅 番茄钟`;
}

// ===== 开始倒计时 =====
function startTimer() {
  if (isRunning) return; // 防止重复开始
  isRunning = true;
  statusEl.textContent = STATUS_TEXT[currentMode];

  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    // 倒计时结束
    if (timeLeft <= 0) {
      clearInterval(timerId);
      isRunning = false;
      statusEl.textContent = "时间到！⏰";
      timerEl.textContent = "时间到！";
      document.title = "时间到！🍅";

      // 如果是专注模式，完成数 +1
      if (currentMode === "focus") {
        pomodoroCount++;
        countEl.textContent = pomodoroCount;
      }
    }
  }, 1000);
}

// ===== 暂停倒计时 =====
function pauseTimer() {
  clearInterval(timerId);
  isRunning = false;
  statusEl.textContent = "已暂停 ⏸️";
}

// ===== 重置到当前模式初始时间 =====
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = MODES[currentMode];
  updateDisplay();
  statusEl.textContent = "已重置 🔄";
}

// ===== 切换模式 =====
function switchMode(mode) {
  currentMode = mode;
  clearInterval(timerId);
  isRunning = false;
  timeLeft = MODES[mode];
  updateDisplay();
  statusEl.textContent = STATUS_TEXT[mode];

  // 更新按钮高亮状态
  modeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
}

// ===== 绑定按钮事件 =====
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode));
});

// ===== 页面初始化 =====
updateDisplay();
