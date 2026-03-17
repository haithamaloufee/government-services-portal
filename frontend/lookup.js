const SERVICES = window.GOV_PORTAL?.SERVICES || {
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

function validateNationalId(value) {
  const normalized = (value || "").trim();
  if (!/^\d+$/.test(normalized)) return "الرجاء إدخال أرقام فقط.";
  if (normalized.length < 8 || normalized.length > 12) {
    return "الرجاء إدخال رقم وطني بطول صحيح (8 إلى 12 رقمًا).";
  }
  return null;
}

async function fetchCitizen(nid) {
  return window.GOV_PORTAL.fetchCitizenByNationalId(nid);
}

document.getElementById("continueBtn").addEventListener("click", async () => {
  clearError();

  const nid = nidInput.value.trim();
  const err = validateNationalId(nid);
  if (err) return showError(err);

  try {
    const citizen = await fetchCitizen(nid);
    sessionStorage.setItem("citizen", JSON.stringify(citizen));
    window.location.href = `payment.html?service=${encodeURIComponent(serviceKey)}&nid=${encodeURIComponent(nid)}`;
  } catch (error) {
    showError(error.message || "تعذر التحقق من الرقم الوطني.");
  }
});

nidInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.getElementById("continueBtn").click();
  }
});
