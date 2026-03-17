const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "gov.db");
const db = new sqlite3.Database(dbPath);

const citizens = [
  { national_id: "100000001", full_name: "أحمد محمد العوفي", dob: "1998-03-12", nationality: "أردني", address: "عمّان - تلاع العلي" },
  { national_id: "100000002", full_name: "محمد خالد السالم", dob: "1995-11-02", nationality: "أردني", address: "إربد - الحي الشرقي" },
  { national_id: "100000003", full_name: "ليان فؤاد الحسن", dob: "2001-07-21", nationality: "أردني", address: "الزرقاء - حي الأمير حسن" },
  { national_id: "100000004", full_name: "نور علي الزعبي", dob: "1999-01-09", nationality: "أردني", address: "الكرك - المركز" },
  { national_id: "100000005", full_name: "يزن سامي العجارمة", dob: "1997-05-30", nationality: "أردني", address: "مادبا - المدينة" },
  { national_id: "100000006", full_name: "رهف محمود العتوم", dob: "2000-09-18", nationality: "أردني", address: "جرش - سوف" },
  { national_id: "100000007", full_name: "سارة عمر بني سلامة", dob: "1996-12-25", nationality: "أردني", address: "عجلون - عين جنا" },
  { national_id: "100000008", full_name: "حمزة ناصر القضاة", dob: "1994-06-14", nationality: "أردني", address: "الطفيلة - القادسية" },
  { national_id: "100000009", full_name: "لمى محمود الرواشدة", dob: "2002-02-03", nationality: "أردني", address: "معان - الشارع الرئيسي" },
  { national_id: "100000010", full_name: "خالد يحيى الحراحشة", dob: "1993-08-19", nationality: "أردني", address: "العقبة - الشاطئ الجنوبي" },

  // نكرر نمط الأسماء لتكملة 50
  ...Array.from({ length: 40 }).map((_, i) => {
    const n = i + 11;
    const id = String(100000000 + n);
    const names = [
      "سيف الدين", "ريم", "عبدالله", "تالا", "حسين", "جود", "عمر", "ميس", "فارس", "دانا",
      "رامي", "آية", "معاذ", "هبة", "إياد", "شهد", "زيد", "لين", "أنس", "مرح"
    ];
    const last = ["العبدلات", "الشمري", "السرحان", "الخطايبة", "الربابعة", "النعيمي", "المومني", "المعاني", "الرفاعي", "الطراونة"];
    const first = names[i % names.length];
    const l = last[i % last.length];
    const year = 1988 + (i % 15);
    const month = String((i % 12) + 1).padStart(2, "0");
    const day = String(((i * 3) % 28) + 1).padStart(2, "0");
    const cities = ["عمّان", "إربد", "الزرقاء", "الكرك", "الطفيلة", "جرش", "عجلون", "مادبا", "معان", "العقبة"];
    const areas = ["وسط البلد", "المدينة", "الشارع الرئيسي", "الحي الغربي", "الحي الشرقي", "المركز", "الجامعة", "الزهراء", "الهاشمي", "الرمثا"];
    const city = cities[i % cities.length];
    const area = areas[i % areas.length];
    return {
      national_id: id,
      full_name: `${first} ${l}`,
      dob: `${year}-${month}-${day}`,
      nationality: "أردني",
      address: `${city} - ${area}`,
    };
  }),
];

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS citizens`);

  db.run(`
    CREATE TABLE citizens (
      national_id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      dob TEXT NOT NULL,
      nationality TEXT NOT NULL,
      address TEXT NOT NULL
    )
  `);

  const stmt = db.prepare(`
    INSERT INTO citizens (national_id, full_name, dob, nationality, address)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const c of citizens) {
    stmt.run(c.national_id, c.full_name, c.dob, c.nationality, c.address);
  }

  stmt.finalize();

  db.get(`SELECT COUNT(*) AS count FROM citizens`, (err, row) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`✅ Seed done. Citizens count: ${row.count}`);
      console.log(`✅ DB path: ${dbPath}`);
    }
    db.close();
  });
});
