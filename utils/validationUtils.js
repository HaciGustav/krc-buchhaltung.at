/**
 * Avusturya Sozialversicherungsnummer (VSNR) doğrulaması.
 *
 * Yapı: LLL P TTMMJJ  (10 hane)
 *   LLL    = Laufnummer (seri no, 0 ile başlamaz)
 *   P      = Prüfziffer (kontrol hanesi)
 *   TTMMJJ = genellikle doğum tarihi, ama her zaman değil!
 *
 * İstisnalar:
 *   - Doğum günü/ayı bilinmiyorsa veya o tarih için tüm Laufnummer'lar
 *     dolmuşsa, ay alanında 13, 14 veya 15 kullanılır (fingiertes Datum).
 *   - Doğum tarihi sonradan belgeyle düzeltilirse SV-Nummer DEĞİŞMEZ;
 *     yani tarih kısmı gerçek doğum tarihinden tamamen farklı olabilir.
 *   - Yıl 2 haneli olduğu için yüzyıl bilinemez.
 *
 * Bu yüzden: format + kontrol hanesi = kesin kural (hata),
 * doğum tarihi uyumsuzluğu = varsayılan olarak sadece uyarı.
 *
 * Hata/uyarı kodları:
 *   FORMAT                 10 rakam değil
 *   SERIAL_LEADING_ZERO    Laufnummer 0 ile başlıyor
 *   CHECKSUM               kontrol hanesi tutmuyor
 *   CHECKSUM_UNASSIGNABLE  kalan 10 → bu seri no hiç verilmez
 *   DAY                    gün alanı geçersiz
 *   MONTH                  ay alanı 01–15 dışında
 *   BIRTHDATE_MISMATCH     doğum tarihiyle uyuşmuyor
 */

const WEIGHTS = [3, 7, 9, 0, 5, 8, 4, 2, 1, 6];
// Yüzyıl bilinmediği için 29 Şubat her yıl kabul edilir.
const MAX_DAY = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * @param {string|Date|null|undefined} input
 * @returns {{year:number, month:number, day:number}|null}
 */
function parseBirthDate(input) {
  if (!input) return null;
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return null;
    return {
      year: input.getFullYear(),
      month: input.getMonth() + 1,
      day: input.getDate(),
    };
  }
  const s = String(input).trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); // 1980-01-31 (input type="date")
  if (m) return { year: +m[1], month: +m[2], day: +m[3] };
  m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s); // 31.01.1980
  if (m) return { year: +m[3], month: +m[2], day: +m[1] };
  return null;
}

/**
 * @param {string} input                     Kullanıcının girdiği SV-Nummer
 * @param {string|Date|null} [birthDate]     Formdaki doğum tarihi
 * @param {{strictBirthDate?: boolean}} [options]
 *        strictBirthDate: true ise doğum tarihi uyumsuzluğu hata sayılır (önerilmez)
 * @returns {{
 *   valid: boolean,
 *   normalized?: string,
 *   errors: string[],
 *   warnings: string[],
 *   fictitiousBirthDate?: boolean,
 *   birthDateMatch?: 'exact'|'fictitious-month'|'mismatch'
 * }}
 */
function validateSvNummer(input, birthDate, options = {}) {
  const errors = [];
  const warnings = [];

  // Kullanıcılar sık sık "1237 010180" veya "1237-010180" yazar.
  const digits = String(input ?? "").replace(/[\s\-\/.]/g, "");
  if (!/^\d{10}$/.test(digits)) {
    return { valid: false, errors: ["FORMAT"], warnings };
  }

  const d = Array.from(digits, Number);

  if (d[0] === 0) errors.push("SERIAL_LEADING_ZERO");

  // Kontrol hanesi: ağırlıklı toplam mod 11
  const check = d.reduce((sum, n, i) => sum + n * WEIGHTS[i], 0) % 11;
  if (check === 10) errors.push("CHECKSUM_UNASSIGNABLE");
  else if (check !== d[3]) errors.push("CHECKSUM");

  // Tarih kısmı
  const day = +digits.slice(4, 6);
  const month = +digits.slice(6, 8);
  const yy = +digits.slice(8, 10);
  const fictitious = month >= 13 && month <= 15;

  if (month < 1 || month > 15) errors.push("MONTH");
  if (
    day < 1 ||
    day > 31 ||
    (month >= 1 && month <= 12 && day > MAX_DAY[month - 1])
  ) {
    errors.push("DAY");
  }

  // Doğum tarihi karşılaştırması
  let birthDateMatch;
  const bd = parseBirthDate(birthDate);
  if (bd) {
    const yearMatches = bd.year % 100 === yy;
    if (fictitious) {
      birthDateMatch = yearMatches ? "fictitious-month" : "mismatch";
    } else {
      birthDateMatch =
        yearMatches && bd.month === month && bd.day === day
          ? "exact"
          : "mismatch";
    }
    if (birthDateMatch === "mismatch") {
      (options.strictBirthDate ? errors : warnings).push("BIRTHDATE_MISMATCH");
    }
  }

  const valid = errors.length === 0;
  return {
    valid,
    normalized: valid ? `${digits.slice(0, 4)} ${digits.slice(4)}` : undefined,
    errors,
    warnings,
    fictitiousBirthDate: fictitious,
    birthDateMatch,
  };
}

export { validateSvNummer };
