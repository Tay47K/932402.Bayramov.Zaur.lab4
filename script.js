"use strict";

/* ============================================================
   Лабораторная работа №4. Основы JavaScript
   Вариант 14 — «Дизайнер и визуализатор» (размеры макетов в px)
   ============================================================ */

// Исходные данные: ширина 6 макетов в пикселях
let layoutWidths = [1280, 1920, 2560, 1100, 3000, 1024];

// Пороговые значения по условию варианта
const WIDE_LIMIT = 1920;   // сверхширокие: строго больше 1920px
const NARROW_LIMIT = 1200; // узкие: меньше либо равно 1200px
const SPLIT_LIMIT = 2560;  // если максимум > 2560px — предупреждение

/* ---------- ФУНКЦИИ ---------- */

// Функция: поиск максимума в массиве (через цикл)
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Функция: фильтрация — вернуть элементы по условию-предикату
function filterBy(arr, predicate) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

// Функция: подсчёт суммы элементов массива
function sum(arr) {
  let total = 0;
  for (const value of arr) {
    total += value;
  }
  return total;
}

/* ---------- ОСНОВНАЯ ЛОГИКА ---------- */

function analyze(name) {
  const widths = layoutWidths;

  // Фильтрация: сверхширокие макеты (> 1920px)
  const wideLayouts = filterBy(widths, (w) => w > WIDE_LIMIT);

  // Цикл: подсчёт узких макетов (<= 1200px)
  let narrowCount = 0;
  for (let i = 0; i < widths.length; i++) {
    if (widths[i] <= NARROW_LIMIT) {
      narrowCount++;
    }
  }
  const narrowShare = (narrowCount / widths.length) * 100;

  // Функции: максимум и средняя ширина (через сумму)
  const maxWidth = findMax(widths);
  const totalWidth = sum(widths);
  const avgWidth = Math.round(totalWidth / widths.length);

  // --- Вывод в консоль ---
  console.log("=== ЛР №4 · Вариант 14 · Дизайнер и визуализатор ===");
  if (name) console.log("Пользователь:", name);
  console.log("Ширина макетов (px):", widths);
  console.log("Сверхширокие (>1920px):", wideLayouts, "— всего", wideLayouts.length);
  console.log("Максимальная ширина:", maxWidth, "px");
  console.log("Средняя ширина:", avgWidth, "px");
  console.log(
    "Доля узких макетов (<=1200px): " + narrowShare.toFixed(1) + "% — " + narrowCount + " шт."
  );

  // Доп.: условие по максимуму
  let splitNote = "";
  if (maxWidth > SPLIT_LIMIT) {
    splitNote = "Такой макет лучше разбить на несколько экранов";
    console.log(splitNote);
  }

  // --- Вывод через alert ---
  const greeting = name ? "Привет, " + name + "! " : "";
  alert(
    greeting +
    "Средняя ширина – " + avgWidth + " px, " +
    wideLayouts.length + " макетов – сверхширокие."
  );

  // Данные для отрисовки на странице
  return {
    widths,
    wideLayouts,
    narrowCount,
    narrowShare,
    maxWidth,
    avgWidth,
    splitNote,
  };
}

/* ---------- ОТРИСОВКА НА СТРАНИЦЕ ---------- */

function renderChips() {
  const box = document.getElementById("data-chips");
  if (!box) return;
  box.innerHTML = "";
  layoutWidths.forEach((w) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    if (w > WIDE_LIMIT) chip.classList.add("is-wide");
    else if (w <= NARROW_LIMIT) chip.classList.add("is-narrow");
    chip.innerHTML = w + '<span class="u">px</span>';
    box.appendChild(chip);
  });
}

function renderResults(r) {
  document.getElementById("results").hidden = false;
  document.getElementById("avg-value").textContent = r.avgWidth;
  document.getElementById("wide-value").textContent = r.wideLayouts.length;
  document.getElementById("narrow-value").textContent = r.narrowCount;
  document.getElementById("share-value").textContent = r.narrowShare.toFixed(1);
  document.getElementById("max-value").textContent = r.maxWidth;

  const note = document.getElementById("split-note");
  if (r.splitNote) {
    note.hidden = false;
    note.textContent = r.splitNote;
  } else {
    note.hidden = true;
  }

  // Дублируем консольный вывод в блок на странице
  const out = document.getElementById("console-out");
  const lines = [
    "Доля узких макетов (<=1200px): " + r.narrowShare.toFixed(1) + "%",
    "Количество узких макетов: " + r.narrowCount + " из " + r.widths.length,
    "Максимальная ширина: " + r.maxWidth + " px",
  ];
  if (r.splitNote) lines.push("⚠ " + r.splitNote);
  out.textContent = lines.join("\n");
}

/* ---------- СОБЫТИЯ ---------- */

function run() {
  // Ввод/вывод: prompt (имя)
  const name = prompt("Как вас зовут, дизайнер?", "");
  const result = analyze(name);
  renderChips();
  renderResults(result);
}

function editData() {
  const input = prompt(
    "Введите ширину макетов в px через запятую (5–7 чисел):",
    layoutWidths.join(", ")
  );
  if (input === null) return;

  const parsed = input
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n > 0);

  if (parsed.length < 5 || parsed.length > 7) {
    alert("Нужно от 5 до 7 корректных чисел. Данные не изменены.");
    return;
  }
  layoutWidths = parsed;
  renderChips();
  console.log("Данные обновлены:", layoutWidths);
}

document.addEventListener("DOMContentLoaded", () => {
  renderChips();
  document.getElementById("run-btn").addEventListener("click", run);
  document.getElementById("edit-btn").addEventListener("click", editData);
});
