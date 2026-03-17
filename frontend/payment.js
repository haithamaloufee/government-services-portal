const SERVICES = {
  birth: { name: "شهادة ميلاد", price: 1.0 },
  noc: { name: "شهادة عدم محكومية", price: 2.0 },
  health: { name: "شهادة صحة", price: 1.25 },
  military: { name: "دفتر خدمة علم", price: 1.75 },
  residence: { name: "شهادة سكن", price: 0.5 },
  life: { name: "شهادة حياة", price: 0.5 },
};

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const serviceKey = getParam("service") || "birth";
const nid = getParam("nid") || "";
const service = SERVICES[serviceKey] || SERVICES.birth;

document.getElementById("serviceName").textContent = service.name;
document.getElementById("sumService").textContent = service.name;
document.getElementById("sumNid").textContent = nid || "—";
document.getElementById("sumPrice").textContent = `${service.price.toFixed(2)} JOD`;

// رابط الرجوع للـ lookup مع نفس الباراميترز
document.getElementById("backLink").href =
  `lookup.html?service=${encodeURIComponent(serviceKey)}`;

const errorBox = document.getElementById("errorBox");
function showError(msg) {
  errorBox.style.display = "block";
  errorBox.textContent = msg;
}
function clearError() {
  errorBox.style.display = "none";
  errorBox.textContent = "";
}

function onlyDigits(s){ return (s || "").replace(/\D/g, ""); }

function validateCardNo(v) {
  const d = onlyDigits(v);
  if (d.length !== 16) return "رقم البطاقة يجب أن يكون 16 رقمًا.";
  return null;
}

function validateExp(v) {
  const s = (v || "").trim();
  if (!/^\d{2}\/\d{2}$/.test(s)) return "تاريخ الانتهاء يجب أن يكون بصيغة MM/YY.";
  const [mm, yy] = s.split("/").map(Number);
  if (mm < 1 || mm > 12) return "شهر الانتهاء غير صحيح.";
  // تحقق بسيط: نعتبر أي سنة >= الحالية-1 مقبولة (وهمي)
  return null;
}

function validateCvv(v) {
  const d = onlyDigits(v);
  if (d.length !== 3) return "CVV يجب أن يكون 3 أرقام.";
  return null;
}

function validateHolder(v) {
  const s = (v || "").trim();
  if (s.length < 3) return "يرجى إدخال اسم حامل البطاقة.";
  return null;
}

document.getElementById("payBtn").addEventListener("click", () => {
  clearError();

  if (!nid) return showError("الرقم الوطني غير موجود. الرجاء الرجوع وإدخاله.");

  const cardNo = document.getElementById("cardNo").value;
  const exp = document.getElementById("exp").value;
  const cvv = document.getElementById("cvv").value;
  const holder = document.getElementById("holder").value;

  const err =
    validateCardNo(cardNo) ||
    validateExp(exp) ||
    validateCvv(cvv) ||
    validateHolder(holder);

  if (err) return showError(err);

  // ✅ دفع وهمي ناجح (لاحقًا سنسجله في DB)
  // انتقال لصفحة الوثيقة
  window.location.href =
    `document.html?service=${encodeURIComponent(serviceKey)}&nid=${encodeURIComponent(nid)}&paid=1`;
});
