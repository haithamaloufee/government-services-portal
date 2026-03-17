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
const service = SERVICES[serviceKey] || SERVICES.birth;

document.getElementById("serviceName").textContent = service.name;
document.getElementById("serviceInfo").textContent =
  `الخدمة المختارة: ${service.name} — الرسوم: ${service.price.toFixed(2)} JOD`;

const nidInput = document.getElementById("nid");
const errorBox = document.getElementById("errorBox");

function showError(msg) {
  errorBox.style.display = "block";
  errorBox.textContent = msg;
}
function clearError() {
  errorBox.style.display = "none";
  errorBox.textContent = "";
}

function validateNationalId(v) {
  const s = (v || "").trim();
  if (!/^\d+$/.test(s)) return "الرجاء إدخال أرقام فقط.";
  if (s.length < 8 || s.length > 12) return "الرجاء إدخال رقم وطني بطول صحيح (8 إلى 12 رقم).";
  return null;
}

async function fetchCitizen(nid) {
  const res = await fetch(`/api/citizens/${encodeURIComponent(nid)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "تعذر التحقق من الرقم الوطني.");
  return data.citizen;
}

document.getElementById("continueBtn").addEventListener("click", async () => {
  clearError();

  const nid = nidInput.value.trim();
  const err = validateNationalId(nid);
  if (err) return showError(err);

  try {
    const citizen = await fetchCitizen(nid);
    // نخزن بيانات المواطن مؤقتًا في sessionStorage
    sessionStorage.setItem("citizen", JSON.stringify(citizen));

    // نروح للدفع
    window.location.href = `payment.html?service=${encodeURIComponent(serviceKey)}&nid=${encodeURIComponent(nid)}`;
  } catch (e) {
    showError(e.message || "تعذر التحقق من الرقم الوطني.");
  }
});

nidInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("continueBtn").click();
});
