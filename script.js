// ==========================================================
// 1. إعدادات السيرفر والربط بـ Supabase وبيانات ديسبكورد وجوجل
// ==========================================================
const SUPABASE_URL = 'https://jjricvhhkgvqbkgbnwtp.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqcmljdmhoa2d2cWJrZ2Jud3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTcyNjcsImV4cCI6MjA5NTQ3MzI2N30.W-lSd89t6LHnlpUBhlM8Lkm80Rycq6THgWBUkdLBfcY'; 

// المعطيات والـ IDs المحدثة الخاصة بك
const GOOGLE_CLIENT_ID = '989832657643-phqgqpbbpdtspu095701rmbmbbldahoi.apps.googleusercontent.com';
const DISCORD_CLIENT_ID = '1509883460473454602';

// تحديد رابط العودة تلقائياً ليتوافق تماماً وبشكل مرن مع استضافة GitHub Pages
const REDIRECT_URL = window.location.origin + window.location.pathname;

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (e) {
  console.error("Supabase fail:", e);
}

let currentUser = null;

// ==========================================================
// 2. بنك الأسئلة المعتمد والكامل لـ Z3Z3 Tactics (105 سؤال بدون تكرار)
// ==========================================================
const questionsDatabase = [
  // ==================== مستوى المبتدئين (من 1 إلى 35) ====================
  { id: 1, text: "من هو أكثر مدرب فوزًا بدوري أبطال أوروبا؟", options: ["أليكس فيرغسون", "بيب غوارديولا", "كارلو أنشيلوتي", "زين الدين زيدان"], correct: 2, minLevel: 0 },
  { id: 2, text: "ما هو النادي الأكثر تتويجًا بالدوري الإنجليزي الممتاز؟", options: ["ليفربول", "مانشستر يونايتد", "أرسنال", "مانشستر سيتي"], correct: 1, minLevel: 0 },
  { id: 3, text: "من سجل هدف 'يد الله' الشهير في كأس العالم 1986؟", options: ["بيليه", "مارادونا", "زين الدين زيدان", "جيف هيرست"], correct: 1, minLevel: 0 },
  { id: 4, text: "أي نادٍ إيطالي يُعجبه ويلقب باسم 'البيانكونيري'؟", options: ["إنتر ميلان", "يوفنتوس", "ميلان", "روما"], correct: 1, minLevel: 0 },
  { id: 5, text: "من فاز بجائزة أفضل لاعب في العالم (ذا بيست) لعام 2023؟", options: ["كيليان مبابي", "إيرلينغ هالاند", "ليونيل ميسي", "فينيسيوس جونيور"], correct: 2, minLevel: 0 },
  { id: 6, text: "كم عدد أندية الدوري الإنجليزي الممتاز (البريميرليغ) في الموسم الواحد؟", options: ["18", "20", "22", "24"], correct: 1, minLevel: 0 },
  { id: 7, text: "من هو الهداف التاريخي لبطولات كأس العالم؟", options: ["رونالدو (البرازيلي)", "ميروسلاف كلوزه", "غيرد مولر", "جاست فونتين"], correct: 1, minLevel: 0 },
  { id: 8, text: "أين أقيمت بطولة كأس العالم لكرة القدم لعام 2022؟", options: ["قطر", "روسيا", "البرازيل", "جنوب أفريقيا"], correct: 0, minLevel: 0 },
  { id: 9, text: "أي منتخب أمريكي جنوبي يلقب بـ 'السامبا'؟", options: ["الأرجنتين", "البرازيل", "أوروغواي", "كولومبيا"], correct: 1, minLevel: 0 },
  { id: 10, text: "ما هو النادي الذي يرتدي قميصاً أحمر وأبيض في مدينة مدريد؟", options: ["ريال مدريد", "أتلتيكو مدريد", "خيتافي", "رايو فايكانو"], correct: 1, minLevel: 0 },
  { id: 11, text: "كم عدد بطولات كأس العالم التي فازت بها إيطاليا في تاريخها؟", options: ["2", "3", "4", "5"], correct: 2, minLevel: 0 },
  { id: 12, text: "من هو هداف نادي ريال مدريد التاريخي في كل المسابقات？", options: ["راؤول غونزاليس", "كريم بنزيما", "كريستيانو رونالدو", "ألفريدو دي ستيفانو"], correct: 2, minLevel: 0 },
  { id: 13, text: "من هو هداف نادي برشلونة التاريخي؟", options: ["رونالدينيو", "ليونيل ميسي", "لويس سواريز", "صامويل إيتو"], correct: 1, minLevel: 0 },
  { id: 14, text: "ما هي الدولة التي فازت بأول نسخة لبطولة كأس العالم عام 1930؟", options: ["الأرجنتين", "البرازيل", "أوروغواي", "إيطاليا"], correct: 2, minLevel: 0 },
  { id: 15, text: "أي نادٍ إنجليزي يقع في لندن ويلقب بـ 'المدفعجية'؟", options: ["تشيلسي", "توتنهام", "أرسنال", "وست هام"], correct: 2, minLevel: 0 },
  { id: 16, text: "ما هو النادي الفرنسي الأكثر تتويجاً بلقب الدوري المحلي؟", options: ["باريس سان جيرمان", "مارسيليا", "ليون", "سانت إتيان"], correct: 0, minLevel: 0 },
  { id: 17, text: "كم عدد الكرات الذهبية (Ballon d'Or) التي حققها كريستيانو رونالدو؟", options: ["3", "4", "5", "6"], correct: 2, minLevel: 0 },
  { id: 18, text: "أي لاعب برازيلي شهير يلقب بـ 'الظاهرة'؟", options: ["رونالدينيو", "كريستيانو رونالدو", "رونالدو نازاريو", "روماريو"], correct: 2, minLevel: 0 },
  { id: 19, text: "ما هي الدولة الأكثر فوزاً ببطولة كأس العالم على مر التاريخ؟", options: ["ألمانيا", "إيطاليا", "الأرجنتين", "البرازيل"], correct: 3, minLevel: 0 },
  { id: 20, text: "في أي نادٍ إنجليزي بدأ كريستيانو رونالدو مسيرته في البريميرليغ؟", options: ["أرسنال", "تشيلسي", "مانشستر يونايتد", "ليفربول"], correct: 2, minLevel: 0 },
  { id: 21, text: "من هو هداف الدوري الإنجليزي الممتاز التاريخي (البريميرليغ)؟", options: ["هاري كين", "ألان شيرر", "واين روني", "تييري هنري"], correct: 1, minLevel: 0 },
  { id: 22, text: "ما هو اللقب الشهير لنادي تشيلسي الإنجليزي؟", options: ["البلوز", "الريدز", "السبيرز", "التوفيز"], correct: 0, minLevel: 0 },
  { id: 23, text: "أي نادٍ عربي وأفريقي يسمى بنادي القرن في أفريقيا؟", options: ["الزمالك", "الرجاء", "الأهلي المصري", "الترجي"], correct: 2, minLevel: 0 },
  { id: 24, text: "ملعب 'الكامب نو' هو المعقل التاريخي لأي نادٍ أوروبي؟", options: ["ريال مدريد", "أتلتيكو مدريد", "برشلونة", "فالنسيا"], correct: 2, minLevel: 0 },
  { id: 25, text: "من هو المدرب الأسطوري لمانشستر يونايتد الذي قادهم لأكثر من 26 عاماً؟", options: ["أليكس فيرغسون", "أرسين فينجر", "جوزيه مورينيو", "مات بسبي"], correct: 0, minLevel: 0 },
  { id: 26, text: "ما هو النادي المصري الذي يلقب بـ 'الدراويش'؟", options: ["الزمالك", "الإسماعيلي", "الاتحاد السكندري", "المصري"], correct: 1, minLevel: 0 },
  { id: 27, text: "من هو اللاعب الذي يلقب بـ 'البرغوث'؟", options: ["كريستيانو رونالدو", "نيمار داسيلفا", "ليونيل ميسي", "لويس سواريز"], correct: 2, minLevel: 0 },
  { id: 28, text: "أي منتخب فاز بكأس أمم أوروبا (يورو 2020) التي أقيمت في 2021؟", options: ["إنجلترا", "إيطاليا", "إسبانيا", "فرنسا"], correct: 1, minLevel: 0 },
  { id: 29, text: "ما هو اللون الأساسي لقميص نادي ليفربول على أرضه؟", options: ["الأزرق", "الأبيض", "الأحمر", "الأخضر"], correct: 2, minLevel: 0 },
  { id: 30, text: "من هو شريك النجم محمد صلاح التاريخي في هجوم ليفربول وغادر لبايرن ثم النصر؟", options: ["ساديو ماني", "روبرتو فيرمينو", "لويس دياز", "ديوغو جوتا"], correct: 0, minLevel: 0 },
  { id: 31, text: "كم عدد شوطي المباراة الرسمية في كرة القدم بدون أشواط إضافية؟", options: ["شوط واحد", "شوطين", "3 أشواط", "4 أشواط"], correct: 1, minLevel: 0 },
  { id: 32, text: "أي نادٍ سعودي يلقب بـ 'العالمي' ويلعب له كريستيانو رونالدو؟", options: ["الهلال", "الاتحاد", "النصر", "الأهلي"], correct: 2, minLevel: 0 },
  { id: 33, text: "ما هي المدة الزمنية للشوط الواحد الأصلي في مباراة كرة القدم؟", options: ["30 دقيقة", "40 دقيقة", "45 دقيقة", "60 دقيقة"], correct: 2, minLevel: 0 },
  { id: 34, text: "من هو النجم البلجيكي الذي كان قائداً لمانشستر سيتي واعتزل في أندرلخت؟", options: ["إيدين هازارد", "فينسنت كومباني", "كيفين دي بروين", "روميلو لوكاكو"], correct: 1, minLevel: 0 },
  { id: 35, text: "أي لاعب يحمل شارة القيادة لمنتخب مصر الأول حالياً؟", options: ["محمود تريزيغيه", "أحمد حجازي", "محمد صلاح", "مصطفى محمد"], correct: 2, minLevel: 0 },

  // ==================== المستوى المتوسط التكتيكي (من 36 إلى 70) ====================
  { id: 36, text: "من هو اللاعب الوحيد الذي فاز بالكرة الذهبية وهو يلعب في مركز حارس مرمى؟", options: ["مانويل نوير", "جانلويجي بوفون", "ليف ياشين", "بيتر شمايكل"], correct: 2, minLevel: 20 },
  { id: 37, text: "من هو هداف الدوري الإسباني (لا ليغا) تاريخيًا؟", options: ["كريستيانو رونالدو", "ليونيل ميسي", "تيلمو زارا", "راؤول غونزاليس"], correct: 1, minLevel: 20 },
  { id: 38, text: "من صاحب أطول سلسلة عدم خسارة في تاريخ الدوري الإنجليزي الممتاز؟", options: ["أرسنال", "مانشستر يونايتد", "تشيلسي", "ليفربول"], correct: 0, minLevel: 20 },
  { id: 39, text: "أي نادٍ فاز بلقب كأس العالم للأندية لعام 2023؟", options: ["ريال مدريد", "مانشستر سيتي", "تشيلسي", "فلامنغو"], correct: 1, minLevel: 20 },
  { id: 40, text: "من هو المدرب الذكي الذي قاد اليونان للفوز الإعجازي بـ يورو 2004؟", options: ["أوتو ريهاغل", "غوس هيدينك", "فابيو كابيلو", "كلود لو روا"], correct: 0, minLevel: 20 },
  { id: 41, text: "أي دولة فازت ببطولة كأس العالم 2014 التي أقيمت في البرازيل؟", options: ["الأرجنتين", "البرازيل", "ألمانيا", "هولندا"], correct: 2, minLevel: 20 },
  { id: 42, text: "من هو أكثر لاعب ظهوراً ومشاركة في مباريات تاريخ كأس العالم؟", options: ["ليونيل ميسي", "كريستيانو رونالدو", "لوثار ماتيوس", "جانلويجي بوفون"], correct: 0, minLevel: 20 },
  { id: 43, text: "أي نادٍ إيطالي عريق وعالمي يُلقب بـ 'السيدة العجوز'؟", options: ["ميلان", "إنتر ميلان", "يوفنتوس", "روما"], correct: 2, minLevel: 20 },
  { id: 44, text: "من هو اللاعب الأفريقي الوحيد في التاريخ الذي فاز بجائزة الكرة الذهبية؟", options: ["صامويل إيتو", "ديديه دروغبا", "جورج ويا", "محمد صلاح"], correct: 2, minLevel: 20 },
  { id: 45, text: "أي منتخب عربي توج بلقب كأس أمم أفريقيا لعام 2019 في مصر؟", options: ["مصر", "السنغال", "الجزائر", "نيجيريا"], correct: 2, minLevel: 20 },
  { id: 46, text: "ما هو النادي الألماني الوحيد الذي فاز بدوري الأبطال غير بايرن ميونخ وهامبورغ؟", options: ["بوروسيا دورتموند", "باير ليفركوزن", "شالكه", "فيردر بريمن"], correct: 0, minLevel: 20 },
  { id: 47, text: "من هو هداف دوري أبطال أوروبا التاريخي؟", options: ["ليونيل ميسي", "كريستيانو رونالدو", "روبرت ليفاندوفسكي", "كريم بنزيما"], correct: 1, minLevel: 20 },
  { id: 48, text: "أي لاعب يلقب بـ 'النفاثة الفنلندية' وصنع مجداً كبيراً مع ليفربول؟", options: ["ياري ليتمانن", "سامي هيبيا", "تيمو بوكي", "ميكائيل فورسيل"], correct: 0, minLevel: 20 },
  { id: 49, text: "من المدرب الذي قاد تشيلسي كبديل لتحقيق أول لقب دوري أبطال أوروبا عام 2012؟", options: ["جوزيه مورينيو", "روبرتو دي ماتيو", "توماس توخيل", "كارلو أنشيلوتي"], correct: 1, minLevel: 20 },
  { id: 50, text: "من هو اللاعب العربي الأكثر تسجيلاً للأهداف في تاريخ دوري أبطال أوروبا؟", options: ["rabah madjer", "رياض محرز", "محمد صلاح", "حكيم زياش"], correct: 2, minLevel: 20 },
  { id: 51, text: "أي نادٍ إنجليزي هو الوحيد من لندن الذي فاز بدوري الأبطال قبل عام 2020؟", options: ["أرسنال", "توتنهام", "تشيلسي", "وست هام"], correct: 2, minLevel: 20 },
  { id: 52, text: "من هو أصغر لاعب يسجل هدفاً في تاريخ بطولات كأس العالم لكرة القدم؟", options: ["بيليه", "كيليان مبابي", "ليونيل ميسي", "مايكل أوين"], correct: 0, minLevel: 20 },
  { id: 53, text: "ما هو النادي الاسكتلندي العريق الذي حقق لقب دوري أبطال أوروبا عام 1967؟", options: ["رينجرز", "سلتيك", "أبردين", "هارتس"], correct: 1, minLevel: 20 },
  { id: 54, text: "كم عدد ألقاب منتخب ألمانيا (الماكينات) في بطولة كأس العالم؟", options: ["3", "4", "5", "2"], correct: 1, minLevel: 20 },
  { id: 55, text: "لاعب دولي كبير ومثير للجدل لعب لبرشلونة، ريال مدريد، إنتر ميلان، وميلان؟", options: ["لويس فيغو", "رونالدو نازاريو", "زلاتان إبراهيموفيتش", "أندريا بيرلو"], correct: 1, minLevel: 20 },
  { id: 56, text: "أي نادٍ إنجليزي فاجأ العالم وحقق لقب البريميرليغ الإعجازي عام 2016؟", options: ["توتنهام", "ليستر سيتي", "إيفرتون", "وست هام"], correct: 1, minLevel: 20 },
  { id: 57, text: "من هو هداف بطولة كأس العالم 2022 التي أقيمت في قطر؟", options: ["ليونيل ميسي", "إيرلينغ هالاند", "كيليان مبابي", "أوليفيه جيرو"], correct: 2, minLevel: 20 },
  { id: 58, text: "أي منتخب فاز بلقب كأس أمم أفريقيا ثلاث مرات متتالية (2006, 2008, 2010)؟", options: ["الكاميرون", "غانا", "مصر", "نيجيريا"], correct: 2, minLevel: 20 },
  { id: 59, text: "ما هو الملعب الشهير الذي يعتبر المعقل الأساسي لمنتخب إنجلترا؟", options: ["أولد ترافورد", "أنفيلد", "ويمبلي", "ستامفورد بريدج"], correct: 2, minLevel: 20 },
  { id: 60, text: "من هو اللاعب الفرنسي الأسطوري الفائز بالكرة الذهبية 1998 ورئيس اليويفا السابق؟", options: ["زين الدين زيدان", "ميشيل بلاتيني", "تييري هنري", "ديديه ديشامب"], correct: 1, minLevel: 20 },
  { id: 61, text: "أي نادٍ إيطالي يلقب بـ 'الروسونيري'؟", options: ["إنتر ميلان", "ميلان", "روما", "لاتسيو"], correct: 1, minLevel: 20 },
  { id: 62, text: "من هو المدرب البرتغالي الشهير الملقب بـ 'السبيشال وان'؟", options: ["بيب غوارديولا", "جوزيه مورينيو", "يورغن كلوب", "أنتونيو كونتي"], correct: 1, minLevel: 20 },
  { id: 63, text: "أي منتخب فاز بأول نسخة لبطولة كأس الأمم الأوروبية عام 1960؟", options: ["الاتحاد السوفيتي", "يوغوسلافيا", "إسبانيا", "ألمانيا الغربية"], correct: 0, minLevel: 20 },
  { id: 64, text: "من هو هداف منتخب إيطاليا التاريخي في كل العصور؟", options: ["روبرتو باجيو", "أليساندرو ديل بييرو", "لويجي ريفا", "فرانشيسكو توتي"], correct: 2, minLevel: 20 },
  { id: 65, text: "أي نادٍ إسباني يقع في إقليم الباسك ويعتمد فقط على لاعبين من الإقليم؟", options: ["ريال سوسيداد", "أتلتيك بيلباو", "أوساسونا", "إيبار"], correct: 1, minLevel: 20 },
  { id: 66, text: "كم عدد الكرات الذهبية التي نالها الأسطورة الأرجنتينية ليونيل ميسي؟", options: ["5 الكرات", "7 الكرات", "8 الكرات", "9 الكرات"], correct: 2, minLevel: 20 },
  { id: 67, text: "من هو حارس المرمى الأسطوري والشهير لنادي ريال مدريد والملقب بـ 'القديس'؟", options: ["إيكر كاسياس", "كيلور نافاس", "جيانلويجي بوفون", "أوليفر كان"], correct: 0, minLevel: 20 },
  { id: 68, text: "أي لاعب سجل أسرع هدف في تاريخ بطولات كأس العالم (بعد 11 ثانية)؟", options: ["هاكان شوكور", "بريان روبسون", "بيليه", "كلينت ديمبسي"], correct: 0, minLevel: 20 },
  { id: 69, text: "من هو النجم الإيفواري الهداف التاريخي للأجانب في نادي تشيلسي؟", options: ["يايا توريه", "ديديه دروغبا", "سالومون كالو", "جون أوبي ميكل"], correct: 1, minLevel: 20 },
  { id: 70, text: "أي نادٍ برتغالي نشأ فيه وترعرع الأسطورة كريستيانو رونالدو؟", options: ["بنفيكا", "بورتو", "سبورتينغ لشبونة", "براغا"], correct: 2, minLevel: 20 },

  // ==================== مستوى أساطير الـ Z3Z3 (من 71 إلى 105) ====================
  { id: 71, text: "من هو هداف نادي إنتر ميلان التاريخي في كل المسابقات؟", options: ["خافيير زانيتي", "جوزيبي مياتزا", "أليساندرو ألتوبيلي", "روبيرتو بونينسينيا"], correct: 1, minLevel: 40 },
  { id: 72, text: "أي نادٍ فاز بلقب الدوري الإيطالي عام 1970 لأول مرة والوحيدة في تاريخه؟", options: ["كالياري", "بولونيا", "تورينو", "سامبدوريا"], correct: 0, minLevel: 40 },
  { id: 73, text: "لاعب سجل في نهائي دوري أبطال أوروبا مع ناديين مختلفين وفاز باللقب معهما؟", options: ["كريستيانو رونالدو", "ليونيل ميسي", "راؤول غونزاليس", "صامويل إيتو"], correct: 0, minLevel: 40 },
  { id: 74, text: "من هو أول منتخب أفريقي يصل إلى ربع نهائي كأس العالم لكرة القدم؟", options: ["المغرب", "الكاميرون", "السنغال", "غانا"], correct: 1, minLevel: 40 },
  { id: 75, text: "ما هو المنتخب الوحيد الذي تأهل لجميع بطولات كأس العالم دون غياب واحد؟", options: ["ألمانيا", "إيطاليا", "الأرجنتين", "البرازيل"], correct: 3, minLevel: 40 },
  { id: 76, text: "من هو اللاعب الذي طُرد في المباراة النهائية لكأس العالم 2006؟", options: ["تييري هنري", "باتريك فييرا", "زين الدين زيدان", "ماركو ماتيراتزي"], correct: 2, minLevel: 40 },
  { id: 77, text: "ما هو النادي الأوروبي الوحيد الذي حقق السداسية التاريخية بجانب برشلونة؟", options: ["ريال مدريد", "بايرن ميونخ", "مانشستر سيتي", "ليفربول"], correct: 1, minLevel: 40 },
  { id: 78, text: "من هو المدرب التكتيكي العبقري صاحب لقب البروفيسور ومؤسس ثورة أرسنال؟", options: ["أرسين فينجر", "أليكس فيرغسون", "جوزيه مورينيو", "يوب هاينكس"], correct: 0, minLevel: 40 },
  { id: 79, text: "أي منتخب فاز بلقب كأس العالم لكرة القدم عام 1998 على أرضه؟", options: ["البرازيل", "إيطاليا", "فرنسا", "كرواتيا"], correct: 2, minLevel: 40 },
  { id: 80, text: "ما هو الرقم القياسي لأكثر عدد أهداف سجلها لاعب في مباراة واحدة بكأس العالم؟", options: ["4 أهداف", "5 أهداف", "6 أهداف", "7 أهداف"], correct: 1, minLevel: 40 },
  { id: 81, text: "من هو الهداف التاريخي لمنتخب فرنسا الأول؟", options: ["تييري هنري", "زين الدين زيدان", "أوليفيه جيرو", "ميشيل بلاتيني"], correct: 2, minLevel: 40 },
  { id: 82, text: "من هو اللاعب الإنجليزي الشهير الذي فاز بالكرة الذهبية عام 2001 مع ليفربول؟", options: ["ديفيد بيكهام", "ستيفن جيرارد", "مايكل أوين", "فرانك لامبارد"], correct: 2, minLevel: 40 },
  { id: 83, text: "أي نادٍ إسباني يلقب بـ 'الغواصات الصفراء'؟", options: ["فالنسيا", "إشبيلية", "فياريال", "سيلتا فيغو"], correct: 2, minLevel: 40 },
  { id: 84, text: "من هو هداف بطولة دوري أبطال أوروبا في موسم واحد تاريخياً (17 هدفاً)؟", options: ["ليونيل ميسي", "كريستيانو رونالدو", "كريم بنزيما", "روبرت ليفاندوفسكي"], correct: 1, minLevel: 40 },
  { id: 85, text: "ما هي الدولة التي استضافت بطولة كأس العالم لعام 1994؟", options: ["إيطاليا", "الولايات المتحدة", "فرنسا", "المكسيك"], correct: 1, minLevel: 40 },
  { id: 86, text: "من هو النجم الهولندي الأسطوري الذي اخترع الكرة الشاملة وحمل رقم 14؟", options: ["ماركو فان باستن", "رود خوليت", "يوهان كرويف", "دنيس بيركامب"], correct: 2, minLevel: 40 },
  { id: 87, text: "أي نادٍ أوروبي فاز بلقب دوري أبطال أوروبا 7 مرات في تاريخه؟", options: ["ريال مدريد", "ميلان", "بايرن ميونخ", "ليفربول"], correct: 1, minLevel: 40 },
  { id: 88, text: "من هو اللاعب الأرجنتيني الأسطوري الهداف التاريخي لنادي فيورنتينا الإيطالي؟", options: ["دييغو مارادونا", "غابرييل باتيستوتا", "هرنان كريسبو", "خافيير زانيتي"], correct: 1, minLevel: 40 },
  { id: 89, text: "ما هو النادي الألماني الذي كسر هيمنة بايرن ميونخ وفاز بالبوندسليغا بلا هزيمة 2024؟", options: ["بوروسيا دورتموند", "لايبزيغ", "باير ليفركوزن", "شتوتغارت"], correct: 2, minLevel: 40 },
  { id: 90, text: "من هو الحكم الإيطالي الأسطوري الشهير والأصلع الذي أدار نهائي كأس العالم 2002؟", options: ["بييرلويجي كولينا", "هاوارد ويب", "مارك كلاتنبرغ", "نستور بيتانا"], correct: 0, minLevel: 40 },
  { id: 91, text: "أي نادٍ إنجليزي يلقب بـ 'التوفيز' ويقع في مدينة ليفربول？", options: ["ليفربول", "إيفرتون", "ترانمير روفرز", "أستون فيلا"], correct: 1, minLevel: 40 },
  { id: 92, text: "من هو اللاعب الآسيوي الأعلى ترتيباً وتتويجاً بالجوائز في البريميرليغ مع توتنهام؟", options: ["PARK JI SUNG", "سون هيونغ مين", "شينجي كاغاوا", "مينامينو"], correct: 1, minLevel: 40 },
  { id: 93, text: "من هو الهداف التاريخي لمنتخب البرازيل في المباريات الرسمية للفيفا؟", options: ["بيليه", "رونالدو نازاريو", "نيمار داسيلفا", "روماريو"], correct: 2, minLevel: 40 },
  { id: 94, text: "أي منتخب فاز بكأس العالم لكرة القدم عام 2010 في جنوب أفريقيا؟", options: ["هولندا", "ألمانيا", "إسبانيا", "الأوروغواي"], correct: 2, minLevel: 40 },
  { id: 95, text: "من هو المدافع التاريخي الوحيد الذي فاز بالكرة الذهبية في القرن الحالي (2006)؟", options: ["باولو مالديني", "فابيو كانافارو", "سيرجيو راموس", "جون تيري"], correct: 1, minLevel: 40 },
  { id: 96, text: "ما هو لقب نادي نيوكاسل يونايتد الإنجليزي؟", options: ["الماكبايس (القماري)", "الثعالب", "الذئاب", "الفيلانز"], correct: 0, minLevel: 40 },
  { id: 97, text: "كم عدد ألقاب نادي ريال مدريد في بطولة دوري أبطال أوروبا حتى نهاية عام 2024؟", options: ["13 لقباً", "14 لقباً", "15 لقباً", "16 لقباً"], correct: 2, minLevel: 40 },
  { id: 98, text: "من هو اللاعب الذي سجل هدف الفوز القاتل لإسبانيا في نهائي كأس العالم 2010؟", options: ["تشافي هيرنانديز", "أندريس إنييستا", "ديفيد فيا", "فرناندو توريس"], correct: 1, minLevel: 40 },
  { id: 99, text: "أي نادٍ فرنسي هو الوحيد الذي توج بلقب دوري أبطال أوروبا في التاريخ (عام 1993)؟", options: ["باريس سان جيرمان", "أولمبيك مارسيليا", "ليون", "موناكو"], correct: 1, minLevel: 40 },
  { id: 100, text: "من هو الهداف التاريخي لبطولة كأس أمم أوروبا (اليورو)؟", options: ["ميشيل بلاتيني", "كريستيانو رونالدو", "تييري هنري", "ألان شيرر"], correct: 1, minLevel: 40 },
  { id: 101, text: "من هو اللاعب الوحيد الذي فاز بكأس العالم 3 مرات كلاعب؟", options: ["مارادونا", "بيليه", "رونالدو نازاريو", "روماريو"], correct: 1, minLevel: 40 },
  { id: 102, text: "أي نادٍ إيطالي يلقب بـ 'النسور' ويلعب في العاصمة روما؟", options: ["روما", "لاتسيو", "تورينو", "فيورنتينا"], correct: 1, minLevel: 40 },
  { id: 103, text: "من هو اللاعب الأفريقي الفائز بالحذاء الذهبي للبريميرليغ مع بلاكبرن وسندرلاند قديماً؟", options: ["ديديه دروغبا", "بيني ماكارثي", "توني يبواه", "حسام حسن"], correct: 1, minLevel: 40 },
  { id: 104, text: "ما هي الدولة الأفريقية التي نظمت أول بطولة لكأس العالم في القارة السمراء عام 2010؟", options: ["مصر", "المغرب", "جنوب أفريقيا", "نيجيريا"], correct: 2, minLevel: 40 },
  { id: 105, text: "من هو العبقري الإيطالي الذي يعتبر المدرب الأكثر فوزاً بالدوري الإيطالي (7 مرات)؟", options: ["جوفاني تراباتوني", "مارتشيلو ليبي", "كارلو أنشيلوتي", "ماسيمليانو أليغري"], correct: 0, minLevel: 40 }
];

// المتغيرات الديناميكية
let gameQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswersCount = 0;
let totalAnsweredCount = 0;
let hearts = 5;

// ربط الـ DOM
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const feedbackMsg = document.getElementById("feedbackMsg");
const nextBtn = document.getElementById("nextBtn");
const scoreValue = document.getElementById("scoreValue");
const correctCount = document.getElementById("correctCount");
const answeredCount = document.getElementById("answeredCount");
const heartsContainer = document.getElementById("heartsContainer");
const difficultyTag = document.getElementById("difficultyTag");

const googleLoginBtn = document.getElementById("googleLoginBtn");
const discordLoginBtn = document.getElementById("discordLoginBtn");
const manualSaveBtn = document.getElementById("manualSaveBtn");
const userProfileInfo = document.getElementById("userProfileInfo");
const userAvatarImg = document.getElementById("userAvatarImg");
const userProfileName = document.getElementById("userProfileName");
const logoutBtn = document.getElementById("logoutBtn");
const guestModeMsg = document.getElementById("guestModeMsg");
const leaderboardList = document.getElementById("leaderboardList");

const quizCard = document.getElementById("quizCard");
const gameOverScreen = document.getElementById("gameOverScreen");
const prizeScreen = document.getElementById("prizeScreen");
const lostAnsweredCount = document.getElementById("lostAnsweredCount");

const hamburgerBtn = document.getElementById("hamburgerBtn");
const menuDropdown = document.getElementById("menuDropdown");

window.onload = function() {
  initAuthCheck();
  initGame();
  loadLeaderboard();
};

function initAuthCheck() {
  if (!supabaseClient) return;
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session && session.user) handleUserIn(session.user);
    else handleUserOut();
  });
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session && session.user) handleUserIn(session.user);
    else handleUserOut();
  });
}

function handleUserIn(user) {
  currentUser = user;
  if (guestModeMsg) guestModeMsg.style.display = "none";
  if (googleLoginBtn) googleLoginBtn.style.display = "none";
  if (discordLoginBtn) discordLoginBtn.style.display = "none";
  if (manualSaveBtn) manualSaveBtn.style.display = "block"; 
  if (userProfileInfo) userProfileInfo.classList.remove("hidden");
  if (logoutBtn) logoutBtn.classList.remove("hidden");
  if (userProfileName) userProfileName.innerText = user.user_metadata.full_name || user.user_metadata.name || "بطل تكتيكي";
  if (userAvatarImg) userAvatarImg.src = user.user_metadata.avatar_url || "https://placeholder.co/100";
  saveUserScore(score);
}

function handleUserOut() {
  currentUser = null;
  if (guestModeMsg) guestModeMsg.style.display = "block";
  if (googleLoginBtn) googleLoginBtn.style.display = "block";
  if (discordLoginBtn) discordLoginBtn.style.display = "block";
  if (manualSaveBtn) manualSaveBtn.style.display = "none";
  if (userProfileInfo) userProfileInfo.classList.add("hidden");
  if (logoutBtn) logoutBtn.classList.add("hidden");
}

if (googleLoginBtn) {
  googleLoginBtn.onclick = async function() {
    if (!supabaseClient) return alert("سيرفر السوبابيس غير متصل!");
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { queryParams: { client_id: GOOGLE_CLIENT_ID }, redirectTo: REDIRECT_URL }
    });
  };
}

if (discordLoginBtn) {
  discordLoginBtn.onclick = async function() {
    if (!supabaseClient) return alert("سيرفر السوبابيس غير متصل!");
    await supabaseClient.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: REDIRECT_URL }
    });
  };
}

if (logoutBtn) {
  logoutBtn.onclick = async function() {
    if (supabaseClient) await supabaseClient.auth.signOut();
    window.location.reload();
  };
}

if (manualSaveBtn) {
  manualSaveBtn.onclick = function() {
    if (!currentUser) return alert("⚠️ سجل دخولك أولاً!");
    saveUserScore(score, true);
  };
}

async function saveUserScore(currentScore, isManual = false) {
  if (!supabaseClient || !currentUser) return;
  const userId = currentUser.id;
  const userName = currentUser.user_metadata.full_name || currentUser.user_metadata.name || "بطل مجهول";
  const userAvatar = currentUser.user_metadata.avatar_url || "";

  try {
    let { data, error } = await supabaseClient.from('leaderboard').select('high_score').eq('user_id', userId).single();
    let previousHighScore = data ? data.high_score : 0;

    if (currentScore > previousHighScore || !data) {
      const { error: upsertError } = await supabaseClient.from('leaderboard').upsert({
        user_id: userId, username: userName, avatar_url: userAvatar, high_score: currentScore, updated_at: new Date()
      }, { onConflict: 'user_id' });

      if (!upsertError) {
        loadLeaderboard();
        if (isManual) alert("💾 تم حفظ رصيدك القياسي بنجاح في لوحة الصدارة!");
      }
    } else {
      if (isManual) alert(`💡 رصيدك الحالي (${currentScore}) لم يتخطى رقمك القياسي السابق (${previousHighScore})!`);
    }
  } catch (err) { console.error(err); }
}

async function loadLeaderboard() {
  if (!supabaseClient) return;
  try {
    let { data: leaderboard, error } = await supabaseClient.from('leaderboard').select('*').order('high_score', { ascending: false }).limit(10);
    if (!error) renderLeaderboard(leaderboard);
  } catch (e) { console.error(e); }
}

function renderLeaderboard(list) {
  if (!leaderboardList) return;
  if (list && list.length > 0) {
    leaderboardList.innerHTML = list.map((player, index) => {
      let medal = index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
      return `<li style="display: flex; align-items: center; justify-content: space-between; padding: 6px 4px; border-bottom: 1px solid #111;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: bold; color: #d4af37; width: 22px;">${medal}</span>
                  <img src="${player.avatar_url || 'https://placeholder.co/30'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
                  <span style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #eee;">${player.username}</span>
                </div>
                <span style="color: #d4af37; font-weight: bold;">${player.high_score}</span>
              </li>`;
    }).join("");
  } else {
    leaderboardList.innerHTML = `<li style="text-align: center; color: #555;">كن أول من يتصدر اللوحة! 🔥</li>`;
  }
}

function initGame() {
  score = 0; correctAnswersCount = 0; totalAnsweredCount = 0; hearts = 5;
  if (quizCard) quizCard.classList.remove("hidden");
  if (gameOverScreen) gameOverScreen.classList.add("hidden");
  if (prizeScreen) prizeScreen.classList.add("hidden");
  updateStatsUI();
  buildMatchQuestions();
  loadQuestion();
}

function buildMatchQuestions() {
  gameQuestions = [...questionsDatabase].sort(() => 0.5 - Math.random()).slice(0, 50); 
}

function updateStatsUI() {
  if (scoreValue) scoreValue.innerText = score;
  if (correctCount) correctCount.innerText = correctAnswersCount;
  if (answeredCount) answeredCount.innerText = totalAnsweredCount;
  
  if (heartsContainer) {
    heartsContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      let hSpan = document.createElement("span");
      hSpan.className = "heart";
      hSpan.innerText = i < hearts ? "❤️" : "🖤";
      heartsContainer.appendChild(hSpan);
    }
  }

  if (difficultyTag) {
    if (totalAnsweredCount < 15) { difficultyTag.innerText = "📘 مستوى المبتدئين"; difficultyTag.style.background = "#1e3a8a"; }
    else if (totalAnsweredCount < 35) { difficultyTag.innerText = "📙 المستوى المتوسط التكتيكي"; difficultyTag.style.background = "#b45309"; }
    else { difficultyTag.innerText = "🟥 مستوى أساطير الـ Z3Z3"; difficultyTag.style.background = "#7f1d1d"; }
  }
}

function loadQuestion() {
  if (totalAnsweredCount >= 50) { showWinningScreen(); return; }
  if (currentQuestionIndex >= gameQuestions.length) { buildMatchQuestions(); currentQuestionIndex = 0; }

  let currentQuestion = gameQuestions[currentQuestionIndex];
  if (questionText) questionText.innerText = `${totalAnsweredCount + 1}. ${currentQuestion.text}`;
  
  if (optionsContainer) {
    optionsContainer.innerHTML = "";
    currentQuestion.options.forEach((opt, idx) => {
      let btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerText = opt;
      btn.onclick = function() { checkPlayerAnswer(idx, btn); };
      optionsContainer.appendChild(btn);
    });
  }
  if (feedbackMsg) { feedbackMsg.innerText = "✨ فكّر جيداً قبل اختيار تكتيك الإجابة الصحيحة!"; feedbackMsg.style.color = "#aaa"; }
  if (nextBtn) nextBtn.classList.add("hidden");
}

function checkPlayerAnswer(selectedIdx, clickedButton) {
  let currentQuestion = gameQuestions[currentQuestionIndex];
  let allButtons = optionsContainer.querySelectorAll(".option-btn");
  allButtons.forEach(b => b.disabled = true);

  if (selectedIdx === currentQuestion.correct) {
    clickedButton.style.background = "#238636"; clickedButton.style.borderColor = "#2ea043";
    if (feedbackMsg) { feedbackMsg.innerText = "🔥 إجابة صحيحة تكتيكية مذهلة! زاد رصيدك +2 نقاط."; feedbackMsg.style.color = "#2ea043"; }
    score += 2; correctAnswersCount++;
    saveUserScore(score);
  } else {
    clickedButton.style.background = "#da3637"; clickedButton.style.borderColor = "#f85149";
    if (allButtons[currentQuestion.correct]) allButtons[currentQuestion.correct].style.background = "#238636";
    if (feedbackMsg) { feedbackMsg.innerText = "❌ إجابة خاطئة! فقدت قلباً تكتيكياً واحداً."; feedbackMsg.style.color = "#f85149"; }
    hearts--;
  }

  totalAnsweredCount++;
  updateStatsUI();

  if (hearts <= 0) setTimeout(showGameOverScreen, 1200);
  else { currentQuestionIndex++; if (nextBtn) nextBtn.classList.remove("hidden"); }
}

function showGameOverScreen() {
  if (quizCard) quizCard.classList.add("hidden");
  if (gameOverScreen) { gameOverScreen.classList.remove("hidden"); if (lostAnsweredCount) lostAnsweredCount.innerText = correctAnswersCount; }
  saveUserScore(score);
}

function showWinningScreen() {
  if (quizCard) quizCard.classList.add("hidden");
  if (prizeScreen) prizeScreen.classList.remove("hidden");
  saveUserScore(score);
}

if (nextBtn) { nextBtn.onclick = function() { loadQuestion(); }; }
if (hamburgerBtn && menuDropdown) {
  hamburgerBtn.onclick = function(e) { e.stopPropagation(); menuDropdown.classList.toggle("hidden"); };
  document.addEventListener("click", function(e) { if (!hamburgerBtn.contains(e.target) && !menuDropdown.contains(e.target)) menuDropdown.classList.add("hidden"); });
}
if (menuReset) menuReset.onclick = function(e) { e.preventDefault(); initGame(); menuDropdown.classList.add("hidden"); };
if (menuInfo) menuInfo.onclick = function(e) { e.preventDefault(); alert("🏆 كأس المعرفة:\n• نظام متصدرين لحساب عدد الأسئلة الصحيحة مدمج بالكامل!"); menuDropdown.classList.add("hidden"); };

document.querySelectorAll(".restart-action-btn").forEach(btn => { btn.onclick = function() { initGame(); }; });