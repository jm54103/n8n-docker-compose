import Chart from "chart.js/auto";
import {
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
} from "chartjs-chart-financial";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-luxon";
import 'chartjs-adapter-date-fns';


Chart.register(
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
  zoomPlugin,
);

/* ================= RSI (Wilder) ================= */
function computeRSI(data, period = 14) {
  const closes = data.map(d => d.c);
  const rsi = [];

  let gains = 0, losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  gains /= period;
  losses /= period;

  rsi[period] = 100 - (100 / (1 + gains / losses));

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    gains = (gains * (period - 1) + gain) / period;
    losses = (losses * (period - 1) + loss) / period;

    rsi[i] = 100 - (100 / (1 + gains / losses));
  }

  return data.map((d, i) => ({
    x: d.x,
    y: rsi[i] ?? null
  }));
}

/* ================= Shared Crosshair ================= */
const sharedCrosshair = {
  id: "sharedCrosshair",
  afterDraw(chart) {
    const { ctx, chartArea, tooltip } = chart;
    if (!tooltip?._active?.length) return;

    const x = tooltip._active[0].element.x;

    ctx.save();

    // Vertical (full height across panels)
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#888";
    ctx.stroke();

    ctx.restore();
  }
};

//Chart.register(sharedCrosshair);

/* ================= Sample Data ================= */
const raw = [];
for (let i = 0; i < 60; i++) {
  const base = 100 + i * 0.5 + Math.sin(i / 5) * 5;
  raw.push({
    x: Date.UTC(2026, 1, 1 + i),
    o: base,
    h: base + Math.random() * 5,
    l: base - Math.random() * 5,
    c: base + (Math.random() - 0.5) * 4,
    v: 5000 + Math.random() * 4000
  });
}

const hostname = window.location.hostname;
const port = window.location.port;



// 1. รับค่า symbol จาก URL Query Parameter (เช่น ?symbol=^SET)
const urlParams = new URLSearchParams(window.location.search);
// ถ้าใน URL ไม่มี ?symbol=... จะให้ Default เป็น "^SET"
const symbol = urlParams.get('symbol') || "^SET";

// 2. คำนวณช่วงเวลาแบบ Dynamic (อิงตามเวลาปัจจุบันของระบบ)
const today = new Date();

// หา Date ของเมื่อวาน (End Date: ย้อนหลัง 1 วัน)
const endDateObj = new Date(today);
endDateObj.setDate(today.getDate() - 1);
const end = endDateObj.toISOString().split('T')[0]; // แปลงเป็นฟอร์แมต YYYY-MM-DD

// หา Date ของปีที่แล้ว (Start Date: ย้อนหลัง 1 ปี)
const startDateObj = new Date(today);
startDateObj.setFullYear(today.getFullYear() - 1);
const start = startDateObj.toISOString().split('T')[0]; // แปลงเป็นฟอร์แมต YYYY-MM-DD

// 3. สร้าง API URL (ใช้ Relative Path เพื่อความปลอดภัยเรื่อง Host/Port/Protocol)
const apiUrl = `http://${hostname}:${port}/api/candle-sticks/${encodeURIComponent(symbol)}/range?start=${start}&end=${end}`;

console.log('Symbol ที่ได้รับ:', symbol);
console.log('ช่วงเวลา:', `${start} ถึง ${end}`);
console.log('URL ของ API:', apiUrl);


async function getCandleSticks() {
  try {
    const response = await fetch(apiUrl);

    // ตรวจสอบว่า Response สำเร็จหรือไม่ (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // แปลงข้อมูลที่ได้เป็น JSON
    const data = await response.json();

    // แสดงผลข้อมูลใน Console
    console.log(`ข้อมูลหุ้น ${symbol}:`, data);

    // ตรงนี้คุณสามารถนำ data ไปวาดกราฟหรือแสดงผลบนหน้าเว็บได้เลย
    return data;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
  }
}

/**
 * คำนวณค่า EMA จากข้อมูล Candle Stick
 * @param {Array} candles - Array ของข้อมูล candle stick [{x, o, h, l, c, v}, ...]
 * @param {number} period - จำนวนช่วงเวลาที่ต้องการคำนวณ (เช่น 50)
 * @returns {Array} Array ของวัตถุพร้อมวาดกราฟ [{x: timestamp, y: emaValue}, ...]
 */
function computeEMA(candles, period) {
  if (!candles || candles.length < period) {
    return []; // ข้อมูลไม่เพียงพอสำหรับคำนวณ EMA period นี้
  }

  const k = 2 / (period + 1);
  const emaData = [];

  // 1. คำนวณค่า SMA เป็นจุดเริ่มต้นของ EMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].c; // ใช้ราคาปิด (c)
  }
  let prevEMA = sum / period;

  // ใส่ค่า EMA วันแรกที่คำนวณได้ลงใน Array
  emaData.push({
    x: candles[period - 1].x,
    y: Number(prevEMA.toFixed(2)) // ปัดเศษ 2 ตำแหน่ง
  });

  // 2. คำนวณค่า EMA สำหรับวันต่อๆ มา
  for (let i = period; i < candles.length; i++) {
    const currentClose = candles[i].c;
    const currentEMA = (currentClose * k) + (prevEMA * (1 - k));

    emaData.push({
      x: candles[i].x,
      y: Number(currentEMA.toFixed(2))
    });

    prevEMA = currentEMA; // อัปเดต EMA ล่าสุดเพื่อใช้ในรอบถัดไป
  }

  return emaData;
}

// เรียกใช้งานฟังก์ชัน
const candle_sticks = await getCandleSticks();
const rsiData = computeRSI(candle_sticks, 14);
const ema50Data = computeEMA(candle_sticks, 50);
const ema100Data = computeEMA(candle_sticks, 100);
//const ema200Data = computeEMA(candle_sticks, 200);
const volumeData = candle_sticks.map(d => ({
  x: d.x,
  y: d.v,
  backgroundColor: d.c >= d.o
    ? "rgba(0,200,100,0.4)"
    : "rgba(200,0,0,0.4)"
}));


/* ================= Chart ================= */
const ctx = document.getElementById("chart");

console.log(candle_sticks.length);
//console.log(candle_sticks[0]);

// ตรวจสอบให้แน่ใจว่าตัวแปร myChart คือตัวแปรที่คุณใช้ new Chart(...)
// const myChart = new Chart(ctx, config); 

// จับคู่ ID ของ Checkbox กับ Index ของ Datasets ที่คุณเรียงไว้
const toggleConfigs = [
  { id: 'cb-price', index: 0 },   // Price (candlestick)
  { id: 'cb-volume', index: 1 },  // Volume (bar)
  { id: 'cb-rsi', index: 2 },     // RSI (line)
  { id: 'cb-ema50', index: 3 },   // EMA 50 (line)
  { id: 'cb-ema100', index: 4 }   // EMA 100 (line)
];

const myChart = new Chart(ctx, {
  data: {
    datasets: [
      {
        type: "candlestick",
        label: "Price",
        data: candle_sticks,
        yAxisID: "price",
        color: {
          up: "#00C853",
          down: "#D50000",
          unchanged: "#999"
        },
      },
      {
        type: "bar",
        label: "Volume",
        data: volumeData,
        yAxisID: "volume",
        parsing: false
      },
      {
        type: "line",
        label: "RSI",
        data: rsiData,
        yAxisID: "rsi",
        borderColor: "#FFD600",
        borderWidth: 1,
        pointRadius: 0,
        parsing: false
      },
      {
        type: "line",
        label: "EMA 50",
        data: ema50Data,
        yAxisID: "price",
        borderColor: "#4ab5dfff",
        borderWidth: 1,
        pointRadius: 0,
        parsing: false
      },
      {
        type: "line",
        label: "EMA 100",
        data: ema100Data,
        yAxisID: "price",
        borderColor: "#b86e28ff",
        borderWidth: 1,
        pointRadius: 0,
        parsing: false
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    parsing: false,

    interaction: {
      mode: "index",
      intersect: false
    },

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        mode: "index",
        intersect: false,

        callbacks: {
          title(items) {
            const date = new Date(items[0].parsed.x);

            return date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            });
          },

          label(context) {

            // Candlestick (OHLC)
            if (context.dataset.type === "candlestick") {
              const d = context.raw;

              return [
                `Open : ${d.o.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`,
                `High : ${d.h.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`,
                `Low  : ${d.l.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`,
                `Close: ${d.c.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              ];
            }

            const label = context.dataset.label ?? "";
            const value = context.parsed.y;

            // Volume
            if (context.dataset.yAxisID === "volume") {
              return `${label}: ${Number(value).toLocaleString("en-US")}`;
            }

            // Price / EMA / RSI
            return `${label}: ${Number(value).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        }
      },

      zoom: {
        pan: {
          enabled: true,
          mode: "x"
        },
        zoom: {
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          },
          mode: "x"
        }
      }
    },

    scales: {
      x: {
        type: "time",

        time: {
          unit: "month",
          displayFormats: {
            month: "MMM yyyy"
          }
        },

        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,

          color: (context) => {
            if (!context.tick) return "#a1a1aa";

            const date = new Date(context.tick.value);

            return date.getMonth() === 11
              ? "#FFD600"
              : "#a1a1aa";
          },

          callback(value, index, ticks) {
            const date = new Date(ticks[index].value);

            if (date.getMonth() === 11) {
              return `สิ้นปี ${date.getFullYear()}`;
            }

            return date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric"
            });
          }
        },

        grid: {
          color: (context) => {
            if (!context.tick) {
              return "rgba(255,255,255,0.1)";
            }

            const date = new Date(context.tick.value);

            return date.getMonth() === 11
              ? "rgba(255,214,0,0.4)"
              : "rgba(255,255,255,0.1)";
          },

          lineWidth: (context) => {
            if (!context.tick) return 1;

            const date = new Date(context.tick.value);

            return date.getMonth() === 11 ? 2 : 1;
          }
        }
      },

      price: {
        position: "left",
        weight: 3,
        ticks: {
          color: "#aaa",
          callback(value) {
            return Number(value).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          }
        },
        grid: {
          color: "rgba(255,255,255,0.05)"
        }
      },

      volume: {
        position: "left",
        weight: 1,
        ticks: {
          display: false
        },
        grid: {
          drawOnChartArea: false
        }
      },
      rsi: {
        position: "left",
        min: 0,
        max: 100,
        weight: 1,
        ticks: {
          color: "#aaa",
          callback(value) {
            return Number(value).toFixed(2);
          }
        },
        grid: {
          color: "rgba(255,255,255,0.05)"
        }
      },
    }
  }
});

// เพิ่ม Event Listener ให้กับ Checkbox แต่ละตัว
toggleConfigs.forEach(config => {
  const checkbox = document.getElementById(config.id);
  if (checkbox) {
    checkbox.addEventListener('change', function (e) {
      const isChecked = e.target.checked;

      // ใช้คำสั่งของ Chart.js เพื่อกำหนดสถานะการมองเห็น
      myChart.setDatasetVisibility(config.index, isChecked);

      // อัปเดตกราฟเพื่อแสดงผลการเปลี่ยนแปลง
      myChart.update();
    });
  }
});
const checkbox_rsi = document.getElementById('cb-rsi');
const checkbox_ema50 = document.getElementById('cb-ema50');
const checkbox_ema100 = document.getElementById('cb-ema100');

checkbox_rsi.checked = false;
checkbox_ema50.checked = true;
checkbox_ema100.checked = false;

myChart.setDatasetVisibility(2, false);
myChart.setDatasetVisibility(3, true);
myChart.setDatasetVisibility(4, false);
