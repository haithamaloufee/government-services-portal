const SERVICES = window.GOV_PORTAL?.SERVICES || {
  birth: { name: "شهادة ميلاد" },
  noc: { name: "شهادة عدم محكومية" },
  health: { name: "شهادة صحة" },
  military: { name: "دفتر خدمة علم" },
  residence: { name: "شهادة سكن" },
  life: { name: "شهادة حياة" },
};

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const serviceKey = getParam("service") || "birth";
const nid = getParam("nid") || "";
const paid = getParam("paid") || "";

const service = SERVICES[serviceKey] || SERVICES.birth;

const errorBox = document.getElementById("errorBox");

function showError(msg) {
  errorBox.style.display = "block";
  errorBox.textContent = msg;
}

if (paid !== "1") {
  showError("لم يتم تأكيد الدفع. الرجاء العودة لصفحة الدفع وإتمام العملية.");
}

document.getElementById("serviceName").textContent = service.name;
document.getElementById("docTitle").textContent = service.name;
document.getElementById("nidOut").textContent = nid || "—";

function makeRef() {
  const rnd = Math.floor(100000 + Math.random() * 900000);
  const year = new Date().getFullYear();
  return `GOV-${year}-${rnd}`;
}

document.getElementById("refNo").textContent = makeRef();

const currentDate = new Date();
const issueDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
document.getElementById("issueDate").textContent = issueDate;

const docTextMap = {
  birth:
    "تشهد الدائرة بأن بيانات الميلاد واردة وفق السجلات الرسمية وذلك بناءً على طلب صاحب العلاقة.",
  noc:
    "تشهد الدائرة بأنه لا يوجد بحق صاحب العلاقة أحكام أو ملاحقات وفق البيانات المتاحة في هذا النظام التجريبي.",
  health:
    "تشهد الجهة المختصة بأن صاحب العلاقة يتمتع بحالة صحية عامة صالحة للاستخدامات الرسمية (نسخة مشروع).",
  military:
    "تفيد الدائرة بأن بيانات خدمة العلم لصاحب العلاقة واردة وفق السجلات (نسخة مشروع).",
  residence:
    "تشهد الدائرة بأن صاحب العلاقة مقيم وفق العنوان المذكور أعلاه (نسخة مشروع).",
  life:
    "تشهد الدائرة بإثبات حياة صاحب العلاقة بتاريخ الإصدار (نسخة مشروع).",
};

document.getElementById("docText").textContent =
  docTextMap[serviceKey] || docTextMap.birth;

async function loadCitizen() {
  const cached = sessionStorage.getItem("citizen");
  if (cached) {
    try {
      const citizen = JSON.parse(cached);
      if (citizen?.national_id === nid) {
        return citizen;
      }
    } catch {}
  }

  return window.GOV_PORTAL.fetchCitizenByNationalId(nid);
}

(async () => {
  if (!nid) return showError("الرقم الوطني غير موجود.");

  try {
    const citizen = await loadCitizen();
    document.getElementById("fullName").textContent = citizen.full_name || "—";
    document.getElementById("dob").textContent = citizen.dob || "—";
    document.getElementById("address").textContent = citizen.address || "—";
    document.getElementById("nationality").textContent =
      citizen.nationality || "—";
  } catch (error) {
    showError(error.message || "خطأ في تحميل بيانات المواطن.");
  }
})();

document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("downloadBtn").addEventListener("click", () => window.print());
