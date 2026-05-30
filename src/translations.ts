import { TranslationSet } from './types';

export const translations: Record<'sw' | 'en', TranslationSet> = {
  sw: {
    navBenefits: "Manufaa",
    navScience: "Sayansi ya Seli",
    navReviews: "Maoni ya Wateja",
    navBuyNow: "Nunua Sasa",
    heroBadge: "Ubora wa Hali ya Juu & Sayansi",
    heroTitle: "Bidhaa Bora Inayoongoza kwa Matibabu Duniani",
    heroSub: "Imetengenezwa kwa Seli za Mimea Asili kwa kutumia Teknolojia ya Kisasa kuleta suluhisho la Magonjwa zaidi ya 100+ la afya ya seli kwa kina.",
    heroCTA: "Chukua Hatua Sasa",
    heroSecondary: "Jifunze Zaidi",
    benefitsTitle: "Faida Kuu za Renolife+",
    benefitsSub: "Seli Hai za Mimea zilizotengenezwa kisasa kufufua nidhamu yote ya mwili na kukabiliana na changamoto za kiafya kuanzia kwenye seli.",
    benefitsItems: [
      {
        title: "Huboresha Seli Zilizochoka na Kuzeeka",
        description: "Inarudisha uhai wa seli na kuamsha mifumo ya mwili iliyolala, ikisaidia kurejesha ujana na nguvu mwilini.",
        icon: "zap"
      },
      {
        title: "Husafisha Mishipa ya Damu",
        description: "Inaondoa mrundikano wa sumu na mafuta mabaya mwilini, ikiongeza mzunguko mzuri wa damu na oksijeni.",
        icon: "droplet"
      },
      {
        title: "Huchochea Uzalishaji Mpya wa Seli",
        description: "Inasaidia uboreshaji wa seli mama (stem cells) za asili za mwili kujikarabati zenyewe na kuzalisha seli mpya zenye afya.",
        icon: "activity"
      },
      {
        title: "Hurekebisha Seli za Ngozi",
        description: "Inasaidia kupunguza kasi ya uzee, makunyanzi, na kurejesha mng'ao wa asili wa ngozi kutoka ndani.",
        icon: "sparkles"
      }
    ],
    specTitle: "Vigezo vya Kikemia & Viwango",
    specSub: "Kila sanduku na sachet vimepimwa kwa usahihi wa kipekee ili kuhakikisha kiwango cha juu cha ufyonzwaji mwilini mako.",
    specs: [
      {
        label: "Viambata Asilia",
        value: "20",
        description: "Mchanganyiko kamili wa matunda na mimea tiba yenye uwezo mkubwa wa antioxidant.",
        icon: "leaf"
      },
      {
        label: "Ujazo kwa Sachet",
        value: "3g",
        description: "Unyumbufu kamili wa unga wa seli uliochemshwa na kufyonzwa haraka chini ya ulimi.",
        icon: "scale"
      },
      {
        label: "Sachets kwa Box",
        value: "30",
        description: "Kiwango cha kutosha cha matumizi ya mwezi mmoja ili kupata matokeo endelevu ya kibayolojia.",
        icon: "box"
      },
      {
        label: "Idadi ya Mimea-Seli",
        value: "1,350",
        description: "Seli milioni 45 zenye ufanisi mkubwa katika kila sachet ya matumizi ya kila siku.",
        icon: "dna"
      }
    ],
    reviewsTitle: "Maoni ya Kweli Kutoka kwa Watumiaji wetu",
    reviewsSub: "Soma mashuhuda waliopata nafuu na afya bora kupitia Renolife+. Michango yote imethibitishwa.",
    reviewsFilterAll: "Zote",
    newsTitle: "Ufuatiliaji wa Seli",
    ingredientTitle: "Viambata 20 Vyenye Nguvu",
    ingredientSub: "Gundua virutubisho vikuu asilia vilivyojumuishwa katika fomula yetu bunifu ya seli mama za mimea.",
    ingredients: [
      { name: "PhytoCellTec™ Malus Domestica", sciName: "Apple Stem Cell", desc: "Seli mama ya tofaa la Uswisi linalookoa na kurefusha maisha ya seli mama za binadamu.", category: "Stem Cell" },
      { name: "PhytoCellTec™ Solar Vitis", sciName: "Grape Stem Cell", desc: "Seli mama za zabibu kulinda ngozi dhidi ya mionzi hatari ya jua (UV).", category: "Stem Cell" },
      { name: "Argania Spinosa Stem Cell", sciName: "Argan Stem Cell", desc: "Inasaidia kurejesha uimara na uzalishaji wa collagen kwenye ngozi.", category: "Stem Cell" },
      { name: "Solanum Lycopersicum", sciName: "Tomato Extract", desc: " एंटीऑक्सीडेंट yenye nguvu ya kulinda seli dhidi ya saratani na uharibifu wa mazingira.", category: "Antioxidant" },
      { name: "Vaccinium Myrtillus", sciName: "Bilberry Extract", desc: "Huboresha uwezo wa macho, mzunguko wa damu na kusaidia afya ya moyo.", category: "Superfood" },
      { name: "Euterpe Oleracea", sciName: "Acai Berry", desc: "Inajulikana sana kwa kuzuia kuzeeka na kuongeza kinga ya mwili kwa haraka.", category: "Superfood" },
      { name: "Lycium Barbarum", sciName: "Goji Berry", desc: "Huongeza kiwango cha nguvu mwilini na kuimarisha utendaji kazi wa ini na figo.", category: "Superfood" }
    ],
    orderModalTitle: "Kamilisha Agizo Lako la Renolife+",
    orderFormName: "Jina Kamili",
    orderFormPhone: "Namba ya Simu",
    orderFormAddress: "Mkoa/Anwani ya Uwasilishaji",
    orderFormQuantity: "Idadi ya Maboksi",
    orderFormSubmit: "Thibitisha na Agiza Sasa",
    orderFormSuccess: "Hongera! Agizo lako limepokelewa. Mshauri wetu wa afya atakupigia simu ndani ya masaa 2 ili kukamilisha usafirishaji mkoani kwako.",
    orderPriceCalc: "Jumla ya Malipo (Inakadiriwa):",
    currency: "TZS",
    footerTerms: "Vigezo na Masharti",
    footerPrivacy: "Sera ya Faragha",
    footerScience: "Sayansi kwa Kina",
    footerWholesale: "Mauzo ya Jumla",
    footerCopyright: "© 2026 Renolife+. Sayansi ya Mimea kwa Afya ya Seli. Haki zote zimehifadhiwa.",
    submitReview: "Weka Maoni Yako",
    reviewPlaceholderName: "Jina lako...",
    reviewPlaceholderText: "Shiriki uzoefu wako baada ya kutumia Renolife+...",
    reviewRating: "Kiwango cha Nyota",
    reviewCategoryLabel: "Jamii ya Changamoto"
  },
  en: {
    navBenefits: "Benefits",
    navScience: "Cellular Science",
    navReviews: "Testimonials",
    navBuyNow: "Buy Now",
    heroBadge: "Premium Quality & Science",
    heroTitle: "The World's Leading Cell Treatment Solution",
    heroSub: "Formulated with Natural Plant Stem Cells using modern technology to provide solutions for over 100+ cellular health challenges.",
    heroCTA: "Take Action Now",
    heroSecondary: "Learn More",
    benefitsTitle: "Core Benefits of Renolife+",
    benefitsSub: "Active plant stem cells engineered with precision to revive the entire bodily system and fight challenges at the cellular root level.",
    benefitsItems: [
      {
        title: "Revitalizes Tired & Aging Cells",
        description: "Restores cell vitality and activates latent bodily systems, helping regain youthfulness and absolute health vigor.",
        icon: "zap"
      },
      {
        title: "Cleanses Cardiovascular Pathways",
        description: "Removes accumulated toxins and harmful cholesterol build-up, improving clean blood circulation and oxygenation.",
        icon: "droplet"
      },
      {
        title: "Stimulates Pure Cell Regeneration",
        description: "Assists the body's natural stem cells in self-repair processes, fostering the continuous output of fresh, healthy cells.",
        icon: "activity"
      },
      {
        title: "Repairs and Restores Skin Cells",
        description: "Actively works to slow aging, eliminate fine lines, and recover a pristine natural skin radiance from within.",
        icon: "sparkles"
      }
    ],
    specTitle: "Clinical Specifications & Metrics",
    specSub: "Every single box and sachet is measured with absolute accuracy to guarantee the highest bio-absorption rate in your body.",
    specs: [
      {
        label: "Natural Bioactive Ingredients",
        value: "20",
        description: "A perfect blend of active super-fruits and healing herbs packed with ultra-high antioxidant potential.",
        icon: "leaf"
      },
      {
        label: "Dispensation Weight",
        value: "3g",
        description: "Optimized fine cellular powder design for instantaneous absorption under the tongue (sublingual).",
        icon: "scale"
      },
      {
        label: "Sachets Per Box",
        value: "30",
        description: "A comprehensive single-month therapeutic dosage calculated for lasting biological transformation.",
        icon: "box"
      },
      {
        label: "Aggregate Stem Cells",
        value: "1,350",
        description: "45 million high-potency cells in every daily sachet serving for steady cell replenishment.",
        icon: "dna"
      }
    ],
    reviewsTitle: "Verified Feedback from Real Users",
    reviewsSub: "Browse through testimonials of those who restored their cellular wellness and health using Renolife+. All reviews are validated.",
    reviewsFilterAll: "All",
    newsTitle: "Stem Cell Tracking",
    ingredientTitle: "20 High-Potency Ingredients",
    ingredientSub: "Discover the premium raw bio-actives formulated in our advanced plant stem cell solution.",
    ingredients: [
      { name: "PhytoCellTec™ Malus Domestica", sciName: "Swiss Apple Stem Cells", desc: "Extracted from rare Swiss apples, shown to dramatically safeguard and extend human stem cell longevity.", category: "Stem Cell" },
      { name: "PhytoCellTec™ Solar Vitis", sciName: "Gamay Grape Stem Cells", desc: "A powerful skin protective shield fighting daily UV light degradation and cell destruction.", category: "Stem Cell" },
      { name: "Argania Spinosa Stem Cell", sciName: "Argan Stem Cell", desc: "Penetrates the deepest skin layers to spark collagen synthesis and structural firmness.", category: "Stem Cell" },
      { name: "Solanum Lycopersicum", sciName: "Tomato Extract", desc: "A masterful antioxidant protecting core body cell matrix structures from degenerative oxidation.", category: "Antioxidant" },
      { name: "Vaccinium Myrtillus", sciName: "European Bilberry Extract", desc: "Supports microcirculation, visual acuity, capillary strength, and metabolic support.", category: "Superfood" },
      { name: "Euterpe Oleracea", sciName: "Acai Berry Concentrate", desc: "Renowned for cell-renewing anthocyanins that support swift, vital immune defense responses.", category: "Superfood" },
      { name: "Lycium Barbarum", sciName: "Goji Berry Compound", desc: "Supports natural immune defense networks, kidney efficiency, and sustained energy output.", category: "Superfood" }
    ],
    orderModalTitle: "Finalize Your Renolife+ Order",
    orderFormName: "Full Name",
    orderFormPhone: "Phone Number",
    orderFormAddress: "Region / Delivery Address",
    orderFormQuantity: "Number of Boxes",
    orderFormSubmit: "Confirm & Order Now",
    orderFormSuccess: "Congratulations! Your order has been placed. Our health consultant will call you within 2 hours to confirm your region's delivery options.",
    orderPriceCalc: "Total Billing (Estimated):",
    currency: "USD",
    footerTerms: "Terms & Conditions",
    footerPrivacy: "Privacy Policy",
    footerScience: "Deep Cellular Research",
    footerWholesale: "Wholesale & Distribution",
    footerCopyright: "© 2026 Renolife+. Plant Science for Cell Health. All rights reserved.",
    submitReview: "Publish Review",
    reviewPlaceholderName: "Your name...",
    reviewPlaceholderText: "Detailed feedback on your Renolife+ health improvement...",
    reviewRating: "Star Rating",
    reviewCategoryLabel: "Wellness Area"
  }
};

export const defaultReviews: Record<'sw' | 'en', { name: string; rating: number; text: string; category: 'general' | 'skin' | 'energy' | 'chronic'; date: string }[]> = {
  sw: [
    { name: "Asha Omari", rating: 5, text: "Nilitumia boksi mbili kwa ajili ya maumivu makali ya viungo na uchovu wa mwili. Sasa hivi naamka nikiwa na nguvu na viungo haviumi kabisa. Bidhaa hii ni muujiza wa seli!", category: "chronic", date: "Machi 14, 2026" },
    { name: "John Mwita", rating: 5, text: "Ngozi yangu ilikuwa na madoa na ilionekana kavu sana. Baada ya wiki tatu za kutumia Renolife+, mke wangu amesema ninaonekana kijana zaidi na ngozi imeng'aa vizuri sana.", category: "skin", date: "Aprili 02, 2026" },
    { name: "Mama Clara", rating: 4, text: "Unyaufu wa seli mwilini umenisaidia sana kudhibiti viwango vya sukari mwilini. Ninajisikia mtulivu na daktari ameshangaa maendeleo yangu mazuri.", category: "chronic", date: "Mei 10, 2026" },
    { name: "Peter Swai", rating: 5, text: "Nilitafuta kitu asilia kinachoweza kunisaidia kuongeza kinga ya mwili tangu nipone malaria kali. Nguvu imerudi kwa kiwango cha juu sana. Asante sana Renolife+.", category: "energy", date: "Mei 18, 2026" }
  ],
  en: [
    { name: "Asha Omari", rating: 5, text: "I used two boxes to address chronic joint pain and general fatigue. Today I wake up feeling extremely energetic and absolutely pain-free. A cellular miracle!", category: "chronic", date: "March 14, 2026" },
    { name: "John Mwita", rating: 5, text: "My skin had blemishes and was extremely dry. After three weeks of Renolife+, my wife says I look years younger and my skin is glowing naturally.", category: "skin", date: "April 02, 2026" },
    { name: "Mama Clara", rating: 4, text: "Stem cell rejuvenation helped me perfectly stabilize my cellular sugar values. I feel great and my physician is amazed by the steady cellular progress.", category: "chronic", date: "May 10, 2026" },
    { name: "Peter Swai", rating: 5, text: "I wanted a raw natural compound to raise my immunity since recovering from dense malaria. My energy recovery has been exceptionally swift. Thanks Renolife+.", category: "energy", date: "May 18, 2026" }
  ]
};
