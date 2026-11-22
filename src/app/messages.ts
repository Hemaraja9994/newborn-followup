/* Draft family reminder messages for each next step, in four languages. {code} and {due} are
   filled in. Translations are drafts for review by native speakers. */
import { addDays, type Baby, type Lang, type NextStep } from "./ehdi";

type MsgKey = "screen" | "rescreen" | "diag" | "interv" | "monitor";
export const MSG: Record<MsgKey, Record<Lang, string>> = {
  screen: {
    en: "Namaste. Your baby {code} needs a hearing screening test. It is quick and painless and is best done before {due}. Please visit the hearing clinic.",
    kn: "ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಮಗು {code} ಗೆ ಶ್ರವಣ ತಪಾಸಣೆ ಬೇಕು. ಇದು ಬೇಗ ಮುಗಿಯುತ್ತದೆ, ನೋವಿಲ್ಲ. {due} ಒಳಗೆ ಮಾಡಿಸುವುದು ಉತ್ತಮ. ದಯವಿಟ್ಟು ಶ್ರವಣ ಚಿಕಿತ್ಸಾಲಯಕ್ಕೆ ಬನ್ನಿ.",
    te: "నమస్కారం. మీ బిడ్డ {code} కి వినికిడి స్క్రీనింగ్ పరీక్ష అవసరం. ఇది త్వరగా అయిపోతుంది, నొప్పి ఉండదు. {due} లోపు చేయించడం మంచిది. దయచేసి వినికిడి క్లినిక్‌కు రండి.",
    hi: "नमस्ते। आपके शिशु {code} की श्रवण जाँच (हियरिंग स्क्रीनिंग) होनी है। यह जल्दी होती है और दर्द नहीं होता। {due} से पहले कराना सबसे अच्छा है। कृपया श्रवण क्लिनिक आएँ।"
  },
  rescreen: {
    en: "Namaste. Your baby {code} needs a repeat hearing screen. Many babies pass the second time, but it is important to do it before {due}. Please visit the hearing clinic.",
    kn: "ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಮಗು {code} ಗೆ ಮತ್ತೊಮ್ಮೆ ಶ್ರವಣ ತಪಾಸಣೆ ಬೇಕು. ಹಲವು ಮಕ್ಕಳು ಎರಡನೇ ಬಾರಿ ಉತ್ತೀರ್ಣರಾಗುತ್ತಾರೆ, ಆದರೆ {due} ಒಳಗೆ ಮಾಡಿಸುವುದು ಮುಖ್ಯ. ದಯವಿಟ್ಟು ಶ್ರವಣ ಚಿಕಿತ್ಸಾಲಯಕ್ಕೆ ಬನ್ನಿ.",
    te: "నమస్కారం. మీ బిడ్డ {code} కి మళ్లీ వినికిడి స్క్రీనింగ్ అవసరం. చాలామంది పిల్లలు రెండోసారి పాస్ అవుతారు, కానీ {due} లోపు చేయించడం ముఖ్యం. దయచేసి వినికిడి క్లినిక్‌కు రండి.",
    hi: "नमस्ते। आपके शिशु {code} की श्रवण जाँच दोबारा होनी है। कई शिशु दूसरी बार में पास हो जाते हैं, पर {due} से पहले कराना ज़रूरी है। कृपया श्रवण क्लिनिक आएँ।"
  },
  diag: {
    en: "Namaste. Your baby {code} did not pass the hearing screen. This does not always mean a hearing problem, but a detailed hearing test (ABR) is needed before {due}. Early testing gives your baby the best chance to learn to talk. Please book with the audiologist.",
    kn: "ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಮಗು {code} ಶ್ರವಣ ತಪಾಸಣೆಯಲ್ಲಿ ಉತ್ತೀರ್ಣವಾಗಿಲ್ಲ. ಇದರರ್ಥ ಯಾವಾಗಲೂ ಶ್ರವಣದೋಷ ಎಂದಲ್ಲ, ಆದರೆ {due} ಒಳಗೆ ವಿವರವಾದ ಶ್ರವಣ ಪರೀಕ್ಷೆ (ABR) ಅಗತ್ಯ. ಬೇಗನೆ ಪರೀಕ್ಷಿಸಿದರೆ ಮಗು ಮಾತು ಕಲಿಯಲು ಉತ್ತಮ ಅವಕಾಶ. ದಯವಿಟ್ಟು ಶ್ರವಣಶಾಸ್ತ್ರಜ್ಞರ ಭೇಟಿ ನಿಗದಿಪಡಿಸಿ.",
    te: "నమస్కారం. మీ బిడ్డ {code} వినికిడి స్క్రీనింగ్‌లో పాస్ కాలేదు. దీని అర్థం ఎప్పుడూ వినికిడి లోపం అని కాదు, కానీ {due} లోపు వివరమైన వినికిడి పరీక్ష (ABR) అవసరం. త్వరగా పరీక్షిస్తే బిడ్డ మాట్లాడటం నేర్చుకోవడానికి మంచి అవకాశం. దయచేసి ఆడియాలజిస్ట్ అపాయింట్‌మెంట్ తీసుకోండి.",
    hi: "नमस्ते। आपका शिशु {code} श्रवण जाँच में पास नहीं हुआ। इसका मतलब हमेशा सुनने में कमी नहीं होता, पर {due} से पहले विस्तृत श्रवण जाँच (ABR) ज़रूरी है। जल्दी जाँच से शिशु को बोलना सीखने का सबसे अच्छा मौका मिलता है। कृपया ऑडियोलॉजिस्ट से समय लें।"
  },
  interv: {
    en: "Namaste. The tests show that your baby {code} has hearing loss. Starting hearing aids and support before {due} helps your baby learn to listen and talk. Please meet the audiologist to plan the next steps.",
    kn: "ನಮಸ್ಕಾರ. ಪರೀಕ್ಷೆಗಳ ಪ್ರಕಾರ ನಿಮ್ಮ ಮಗು {code} ಗೆ ಶ್ರವಣದೋಷವಿದೆ. {due} ಒಳಗೆ ಶ್ರವಣ ಸಾಧನ ಮತ್ತು ಬೆಂಬಲ ಆರಂಭಿಸಿದರೆ ಮಗು ಕೇಳಲು ಮತ್ತು ಮಾತನಾಡಲು ಕಲಿಯಲು ಸಹಾಯವಾಗುತ್ತದೆ. ಮುಂದಿನ ಹಂತ ಯೋಜಿಸಲು ದಯವಿಟ್ಟು ಶ್ರವಣಶಾಸ್ತ್ರಜ್ಞರನ್ನು ಭೇಟಿ ಮಾಡಿ.",
    te: "నమస్కారం. పరీక్షల ప్రకారం మీ బిడ్డ {code} కి వినికిడి లోపం ఉంది. {due} లోపు వినికిడి యంత్రాలు, సహాయం మొదలుపెడితే బిడ్డ వినడం, మాట్లాడటం నేర్చుకోవడానికి సహాయపడుతుంది. తదుపరి దశలు ప్లాన్ చేయడానికి దయచేసి ఆడియాలజిస్ట్‌ను కలవండి.",
    hi: "नमस्ते। जाँच से पता चला है कि आपके शिशु {code} को सुनने में कमी है। {due} से पहले हियरिंग एड और सहायता शुरू करने से शिशु को सुनना और बोलना सीखने में मदद मिलती है। अगले कदम तय करने के लिए कृपया ऑडियोलॉजिस्ट से मिलें।"
  },
  monitor: {
    en: "Namaste. Your baby {code} passed the hearing screen. Because of a known risk factor, a hearing check is advised before {due}. Please book a visit with the audiologist.",
    kn: "ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಮಗು {code} ಶ್ರವಣ ತಪಾಸಣೆಯಲ್ಲಿ ಉತ್ತೀರ್ಣವಾಗಿದೆ. ಒಂದು ಅಪಾಯಕಾರಿ ಅಂಶ ಇರುವುದರಿಂದ {due} ಒಳಗೆ ಮತ್ತೊಮ್ಮೆ ಶ್ರವಣ ಪರೀಕ್ಷೆ ಸಲಹೆ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಶ್ರವಣಶಾಸ್ತ್ರಜ್ಞರ ಭೇಟಿ ನಿಗದಿಪಡಿಸಿ.",
    te: "నమస్కారం. మీ బిడ్డ {code} వినికిడి స్క్రీనింగ్‌లో పాస్ అయింది. ఒక ప్రమాద కారకం ఉన్నందున {due} లోపు మళ్లీ వినికిడి పరీక్ష చేయించాలని సూచిస్తున్నాం. దయచేసి ఆడియాలజిస్ట్ అపాయింట్‌మెంట్ తీసుకోండి.",
    hi: "नमस्ते। आपका शिशु {code} श्रवण जाँच में पास हो गया है। एक जोखिम कारक होने के कारण {due} से पहले फिर से श्रवण जाँच की सलाह है। कृपया ऑडियोलॉजिस्ट से समय लें।"
  }
};

const localeFor = (lang: Lang) => (lang === "en" ? "en-IN" : `${lang}-IN`);

export function reminder(b: Baby, n: NextStep, today: string): string {
  const tpl = (MSG as Record<string, Record<Lang, string>>)[n.key]?.[b.lang] ?? (MSG as Record<string, Record<Lang, string>>)[n.key]?.en;
  if (!tpl || !n.due) return "";
  const due = n.due < today ? addDays(today, 7) : n.due;   // overdue: ask for the coming week, not a past date
  const dueTxt = new Date(due).toLocaleDateString(localeFor(b.lang), { day: "numeric", month: "long", year: "numeric" });
  return tpl.split("{code}").join(b.code).split("{due}").join(dueTxt);
}
