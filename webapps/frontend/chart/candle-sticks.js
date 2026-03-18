import Chart from "chart.js/auto";
import {
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
} from "chartjs-chart-financial";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-luxon";

Chart.register(
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
  zoomPlugin
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

const host = window.location;

// กำหนด URL ของ API
const apiUrl = `${host}candle-sticks/PTT/range?start=2025-06-01&end=2026-02-23`;

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
        console.log('ข้อมูลหุ้น PTT:', data);
        
        // ตรงนี้คุณสามารถนำ data ไปวาดกราฟหรือแสดงผลบนหน้าเว็บได้เลย
        return data;

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
}

// เรียกใช้งานฟังก์ชัน
const candle_sticks = await getCandleSticks();
const rsiData = computeRSI(candle_sticks, 14);
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
console.log(candle_sticks[0]);

new Chart(ctx, {
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
        }
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
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x"
        }
      }
    },
    scales: {
      x: {
        type: "time",
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.05)" }
      },

      /* -------- PRICE PANEL (top 60%) -------- */
      price: {
        position: "left",
        weight: 3,
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.05)" }
      },

      /* -------- VOLUME PANEL (middle 20%) -------- */
      volume: {
        position: "left",
        weight: 1,
        grid: { drawOnChartArea: false },
        ticks: { display: false }
      },

      /* -------- RSI PANEL (bottom 20%) -------- */
      rsi: {
        position: "left",
        min: 0,
        max: 100,
        weight: 1,
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.05)" }
      }
    }
  }
});
