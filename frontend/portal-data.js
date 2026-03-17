(function initPortalData(global) {
  const SERVICES = {
    birth: { name: "شهادة ميلاد", price: 1.0 },
    noc: { name: "شهادة عدم محكومية", price: 2.0 },
    health: { name: "شهادة صحة", price: 1.25 },
    military: { name: "دفتر خدمة علم", price: 1.75 },
    residence: { name: "شهادة سكن", price: 0.5 },
    life: { name: "شهادة حياة", price: 0.5 },
  };

  const CITIZENS = [
    {
      national_id: "100000001",
      full_name: "أحمد محمد العوفي",
      dob: "1998-03-12",
      nationality: "أردني",
      address: "عمّان - تلاع العلي",
    },
    {
      national_id: "100000002",
      full_name: "محمد خالد السالم",
      dob: "1995-11-02",
      nationality: "أردني",
      address: "إربد - الحي الشرقي",
    },
    {
      national_id: "100000003",
      full_name: "ليان فؤاد الحسن",
      dob: "2001-07-21",
      nationality: "أردني",
      address: "الزرقاء - حي الأمير حسن",
    },
    {
      national_id: "100000004",
      full_name: "نور علي الزعبي",
      dob: "1999-01-09",
      nationality: "أردني",
      address: "الكرك - المركز",
    },
    {
      national_id: "100000005",
      full_name: "يزن سامي العجارمة",
      dob: "1997-05-30",
      nationality: "أردني",
      address: "مادبا - المدينة",
    },
    {
      national_id: "100000006",
      full_name: "رهف محمود العتوم",
      dob: "2000-09-18",
      nationality: "أردني",
      address: "جرش - سوف",
    },
    {
      national_id: "100000007",
      full_name: "سارة عمر بني سلامة",
      dob: "1996-12-25",
      nationality: "أردني",
      address: "عجلون - عين جنا",
    },
    {
      national_id: "100000008",
      full_name: "حمزة ناصر القضاة",
      dob: "1994-06-14",
      nationality: "أردني",
      address: "الطفيلة - القادسية",
    },
    {
      national_id: "100000009",
      full_name: "لمى محمود الرواشدة",
      dob: "2002-02-03",
      nationality: "أردني",
      address: "معان - الشارع الرئيسي",
    },
    {
      national_id: "100000010",
      full_name: "خالد يحيى الحراحشة",
      dob: "1993-08-19",
      nationality: "أردني",
      address: "العقبة - الشاطئ الجنوبي",
    },
    ...Array.from({ length: 40 }, (_, i) => {
      const n = i + 11;
      const firstNames = [
        "سيف الدين",
        "ريم",
        "عبدالله",
        "تالا",
        "حسين",
        "جود",
        "عمر",
        "ميس",
        "فارس",
        "دانا",
        "رامي",
        "آية",
        "معاذ",
        "هبة",
        "إياد",
        "شهد",
        "زيد",
        "لين",
        "أنس",
        "مرح",
      ];
      const lastNames = [
        "العبدلات",
        "الشمري",
        "السرحان",
        "الخطايبة",
        "الربابعة",
        "النعيمي",
        "المومني",
        "المعاني",
        "الرفاعي",
        "الطراونة",
      ];
      const cities = [
        "عمّان",
        "إربد",
        "الزرقاء",
        "الكرك",
        "الطفيلة",
        "جرش",
        "عجلون",
        "مادبا",
        "معان",
        "العقبة",
      ];
      const areas = [
        "وسط البلد",
        "المدينة",
        "الشارع الرئيسي",
        "الحي الغربي",
        "الحي الشرقي",
        "المركز",
        "الجامعة",
        "الزهراء",
        "الهاشمي",
        "الرمثا",
      ];

      return {
        national_id: String(100000000 + n),
        full_name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        dob: `${1988 + (i % 15)}-${String((i % 12) + 1).padStart(2, "0")}-${String(((i * 3) % 28) + 1).padStart(2, "0")}`,
        nationality: "أردني",
        address: `${cities[i % cities.length]} - ${areas[i % areas.length]}`,
      };
    }),
  ];

  const citizensByNationalId = new Map(
    CITIZENS.map((citizen) => [citizen.national_id, citizen]),
  );

  function normalizeNationalId(value) {
    return String(value || "").trim();
  }

  function findCitizenByNationalId(nid) {
    const citizen = citizensByNationalId.get(normalizeNationalId(nid));
    return citizen ? { ...citizen } : null;
  }

  async function fetchCitizenByNationalId(nid) {
    const normalized = normalizeNationalId(nid);
    const canUseApi =
      typeof global.fetch === "function" &&
      global.location &&
      typeof global.location.protocol === "string" &&
      /^https?:$/i.test(global.location.protocol);

    let apiError = null;

    if (canUseApi) {
      try {
        const response = await global.fetch(
          `/api/citizens/${encodeURIComponent(normalized)}`,
          { headers: { Accept: "application/json" } },
        );
        const data = await response.json().catch(() => ({}));

        if (response.ok && data?.citizen) {
          return data.citizen;
        }

        if (response.status === 400) {
          apiError = new Error("صيغة الرقم الوطني غير صحيحة.");
        } else if (response.status === 404) {
          apiError = new Error("المواطن غير موجود.");
        } else {
          apiError = new Error(data?.error || "تعذر التحقق من الرقم الوطني.");
        }
      } catch (error) {
        apiError =
          error instanceof Error
            ? error
            : new Error("تعذر التحقق من الرقم الوطني.");
      }
    }

    const fallbackCitizen = findCitizenByNationalId(normalized);
    if (fallbackCitizen) {
      return fallbackCitizen;
    }

    throw apiError || new Error("المواطن غير موجود.");
  }

  global.GOV_PORTAL = {
    SERVICES,
    CITIZENS,
    findCitizenByNationalId,
    fetchCitizenByNationalId,
  };
})(window);
