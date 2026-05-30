import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Dna, 
  Sparkles, 
  Flame, 
  Heart, 
  Activity, 
  Leaf, 
  Eye, 
  ShieldCheck, 
  Sun, 
  Coffee, 
  UserPlus, 
  Phone,
  Briefcase,
  Star,
  CheckCircle,
  Gem,
  Award,
  Zap,
  Check,
  Globe
} from 'lucide-react';
import { Language } from '../types';

interface LearnMorePageProps {
  lang: Language;
  onBack: () => void;
  onOrderClick: () => void;
}

export default function LearnMorePage({ lang, onBack, onOrderClick }: LearnMorePageProps) {
  // Auto-scroll to top when page is mounted
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const t = {
    sw: {
      backBtn: "Rudi Nyuma",
      welcome: "KARIBU",
      orderNow: "Agiza Sasa",
      
      introTitle: "Kuhusu RenoLife",
      introSub: "Sisi ni kampuni ya kimataifa inayoaminika katika teknolojia ya kisasa ya kurejesha afya (regenerative biotechnology).",
      introDesc: "Tunatoa suluhisho za kuboresha maisha kupitia teknolojia ya stem cell, pamoja na kuwawezesha watu kiuchumi kwa kutumia mifumo ya biashara iliyo halali na yenye maadili.",
      
      productsHeader: "Bidhaa Zetu Kuu",
      productsSub: "Teknolojia ya Kurejesha Afya na Kupunguza Umri",
      prodIntro1: "► Jione tofauti kupitia bidhaa zetu za asili kwa 100%, zenye ubora wa hali ya juu katika teknolojia ya kurejesha afya.",
      prodIntro2: "► Kila bidhaa imeandaliwa kwa kutumia teknolojia ya kisasa ili kutoa matokeo halisi na yanayoonekana katika afya yako, nguvu ya mwili, na mwonekano wako.",

      renocellTitle: "Renocell+ Stemcell",
      renocellSub: "Hii ndiyo bidhaa yetu kuu.",
      renocellFormula: "Inatumia mchanganyiko maalumu wa: Tufaa la Uswisi (Swiss Apple), Super Berries, Dondoo la stem cell ya zabibu na vitu vingine adimu vipatavyo 20.",
      
      creamTitle: "Reno Anti-Aging Cream",
      creamSub: "Tiba ya hali ya juu ya kupaka kwenye ngozi iliyoundwa kusaidia kurudisha nyuma dalili za kuzeeka.",
      
      powerCoffeeTitle: "Reno Power Coffee",
      powerCoffeeSub: "Imeandaliwa mahsusi kwa ajili ya nguvu na utendaji wa wanaume.",
      
      femCoffeeTitle: "Reno Fem Coffee",
      femCoffeeSub: "Imeundwa mahsusi kwa ajili ya afya ya jumla ya wanawake.",
      
      universalCoffeeTitle: "Reno Universal Coffee",
      universalCoffeeSub: "Mchanganyiko wenye ladha tamu na wenye utajiri wa viondoasumu (antioxidants) kwa kila mtu.",
      
      oppTitle: "Fursa katika RenoLife",
      oppSub: "Badilisha afya yako na kipato chako kwa wakati mmoja."
    },
    en: {
      backBtn: "Go Back",
      welcome: "WELCOME TO",
      orderNow: "Order Now",
      
      introTitle: "About RenoLife",
      introSub: "We are a trusted global pioneer in regenerative biotechnology and premium life solutions.",
      introDesc: "We offer life-enhancing health products through plant stem cell technology, while empowering people financially via moral and ethical business methodologies.",
      
      productsHeader: "Our Premium Products",
      productsSub: "Advanced Biological Stem Cell & Rejuvenation Solutions",
      prodIntro1: "► Experience the remarkable transformation through our 100% natural, premium biological health products.",
      prodIntro2: "► Every formulation is bio-engineered using cellular biotechnology to deliver visible, rapid results in immunity, strength, and life span.",

      renocellTitle: "Renocell+ Stemcell",
      renocellSub: "This is our flagship product.",
      renocellFormula: "Utilizes a highly potent, proprietary blend of: Swiss Apple, Super Berries, Grape Stem Cell Extract, and close to 20 other rare, botanical extracts.",
      
      creamTitle: "Reno Anti-Aging Cream",
      creamSub: "Advanced cell-reviving topical treatment designed to smoothly reverse external aging indicators.",
      
      powerCoffeeTitle: "Reno Power Coffee",
      powerCoffeeSub: "Meticulously engineered to naturally raise male performance, energy, and mental stamina.",
      
      femCoffeeTitle: "Reno Fem Coffee",
      femCoffeeSub: "Formulated to balance feminine hormones, promote emotional well-being, and nourish the body.",
      
      universalCoffeeTitle: "Reno Universal Coffee",
      universalCoffeeSub: "A delicious, antioxidant-dense coffee formula crafted for immune defense and deep cellular detox for the whole family.",
      
      oppTitle: "Opportunity in RenoLife",
      oppSub: "Double your biological defense and financial freedom simultaneously."
    }
  };

  const curr = t[lang];

  // Specific Square Cards Data Arrays
  const introSquares = [
    {
      icon: <Globe className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kampuni ya Kimataifa' : 'Global Reach & Trust',
      desc: lang === 'sw' 
        ? 'Sisi ni kampuni ya kimataifa inayoaminika katika teknolojia ya kisasa ya kurejesha afya (regenerative biotechnology).'
        : 'We are a trusted multinational enterprise at the absolute cutting edge of regenerative biotechnology.'
    },
    {
      icon: <Activity className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kuboresha Maisha' : 'Enhancing Life Integrity',
      desc: lang === 'sw'
        ? 'Tunatoa suluhisho za kuboresha maisha kupitia teknolojia ya stem cell na bidhaa zenye mng\'ao asilia.'
        : 'Our core focus is developing life-transforming, therapeutic cellular formulations designed to rejuvenate systems from root levels.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Mifumo ya Biashara' : 'Ethical Wealth Methods',
      desc: lang === 'sw'
        ? 'Tunawawezesha watu kiuchumi kwa kutumia mifumo ya biashara iliyo halali, yenye maadili na malipo ya haraka.'
        : 'We build durable financial paths, enabling regular people to thrive ethically through verified global commercial pipelines.'
    }
  ];

  const coreProductsIntroSquares = [
    {
      icon: <Leaf className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Asili 100%' : '100% Natural Wellness',
      desc: lang === 'sw'
        ? 'Jione tofauti kupitia bidhaa zetu za asili kwa 100%, zenye ubora wa hali ya juu katika afya ya seli.'
        : 'Experience rapid biological restoration using pure plant cells with absolutely zero chemical additives.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Teknolojia ya Sasa' : 'Bio-Tech Precision',
      desc: lang === 'sw'
        ? 'Kila bidhaa imeandaliwa kwa kutumia teknolojia ya kisasa ili kutoa matokeo halisi na yanayoonekana mwilini.'
        : 'Every drop and powder is precision-crafted to manifest tangible results on your biological markers, joints, and look.'
    }
  ];

  const renocellSquares = [
    {
      icon: <Award className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Bidhaa Kuu' : 'Our Flagship Formula',
      desc: lang === 'sw'
        ? 'Hii ndiyo bidhaa yetu kuu ya mapinduzi ya seli ambayo hukua kwa kasi katika soko la afya.'
        : 'Renocell+ acts as our cellular pinnacle, spearheading biological regeneration across global markets.'
    },
    {
      icon: <Dna className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kurejesha Upya Seli' : 'Deep Cell Rejuvenation',
      desc: lang === 'sw'
        ? 'Ni tiba ya kurejesha upya seli kwa kina tangu kiwango cha chini kabisa cha DNA.'
        : 'Revolutionary organic plant stem cell therapy targeting cell repair at deep genetic, systemic root layers.'
    },
    {
      icon: <Activity className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Ukarabati wa Tishu' : 'Swift Tissue Repair',
      desc: lang === 'sw'
        ? 'Huharakisha ukarabati wa tishu za mwili zilizochoka au zilizoharibika kutokana na maradhi au umri.'
        : 'Accelerates biological recovery of damaged body organs, worn-out tissues, and cellular functions.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kuamsha Kinga ya Mwili' : 'Immune Re-Awakening',
      desc: lang === 'sw'
        ? 'Huamsha upya na kurejesha nidhamu imara ya mfumo wa kinga asilia ya mwili kukaa imara.'
        : 'Proactively strengthens cellular resistance networks to dynamically shield internal defense organs.'
    },
    {
      icon: <Flame className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kuhimili Kuzeeka' : 'Cellular Anti-Aging',
      desc: lang === 'sw'
        ? 'Hupambana na kasi ya kuzeeka katika kiwango cha seli ili kukuacha ukiwa na nguvu na mwonekano wa ujana.'
        : 'Inhibits age-induced cell oxidation, improving vitality indices and promoting longevity.'
    },
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Afya ya Viungo' : 'Joint & Organ Health',
      desc: lang === 'sw'
        ? 'Huimarisha kwa ufanisi mkubwa afya ya viungo vyote vya ndani na mifupa kwa ujumla.'
        : 'Significantly improves joint lubrication, mobility, bone density, and standard visceral operations.'
    },
    {
      icon: <LightningIcon />, // inline icon
      title: lang === 'sw' ? 'Uponyaji wa Haraka' : 'Accelerated Healing',
      desc: lang === 'sw'
        ? 'Huongeza kasi ya uponyaji wa asili wa mwili kurejesha usawa bila madhara ya kikemikali.'
        : 'Boosts the natural rate at which your body restores its dynamic equilibrium without synthetic stress.'
    }
  ];

  const antiAgingCreamSquares = [
    {
      icon: <Sparkles className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kuzuia Kuzeeka' : 'Age Reverse Action',
      desc: lang === 'sw'
        ? 'Tiba ya hali vya juu ya kupaka kwenye ngozi iliyoundwa kusaidia kurudisha nyuma dalili zote za uzee.'
        : 'Advanced topical formulation designed to reverse major dermis aging factors, fine lines, and blemishes.'
    },
    {
      icon: <Eye className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kupenya kwa Kina' : 'Deep Layer Penetration',
      desc: lang === 'sw'
        ? 'Hupenya kwa kina hadi kwenye tabaka za ndani za ngozi ili kupunguza mistari na mikunjo.'
        : 'Reaches internal cells, feeding nutrients to reduce prominent lines, circles, and surface spots.'
    },
    {
      icon: <Sun className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Mng\'ao wa Ngozi' : 'Radiant Elasticity',
      desc: lang === 'sw'
        ? 'Husaidia kurejesha unyumbufu wa ngozi na kuamsha mwonekano wenye mng\'ao mkuu asilia.'
        : 'Reclaims elastic strength and generates a bright, youthful, and naturally hydrated surface.'
    },
    {
      icon: <Leaf className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Ulinzi wa Virutubisho' : 'Eco Dermal Shield',
      desc: lang === 'sw'
        ? 'Imechanganywa na virutubisho asilia vya mimea ambavyo husaidia kulainisha na kulinda dhidi ya mazingira.'
        : 'Shields delicate skin from solar damage, dry atmospheres, toxins, and environmental hazards.'
    }
  ];

  const powerCoffeeSquares = [
    {
      icon: <Flame className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Nguvu ya Wanaume' : 'True Male Performance',
      desc: lang === 'sw'
        ? 'Imeandaliwa mahsusi kabisa kwa ajili ya kuongeza nguvu, stamini na utendaji thabiti wa wanaume.'
        : 'Meticulously balanced to boost essential testosterone output and restore male stamina.'
    },
    {
      icon: <Activity className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Uvumilivu Muda Mrefu' : 'Sustained Endurance',
      desc: lang === 'sw'
        ? 'Huongeza nguvu ya mwili kuanzia kwenye seli kwa muda mrefu pamoja na uimara wa akili.'
        : 'Magnifies cognitive alertness and athletic stamina with high clean cell glucose conversion.'
    },
    {
      icon: <Coffee className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Tofauti na Kafeini' : 'No Coffee Crashes',
      desc: lang === 'sw'
        ? 'Tofauti na kahawa ya kawaida, inampa mtumiaji nguvu laini bila kusababisha msisimko usiotulia.'
        : 'Avoids chemical crash, providing clean focus over prolonged timelines.'
    },
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Mzunguko wa Damu' : 'Healthy Circulation',
      desc: lang === 'sw'
        ? 'Imeongezewa mimea asilia kusaidia afya ya uzazi, kuboresha mzunguko wa damu mwilini kwa ufanisi.'
        : 'Enriched with organic root plants that support clean cardiovascular pathways and reproductive health.'
    }
  ];

  const femCoffeeSquares = [
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Afya ya Wanawake' : 'Holistic Female Care',
      desc: lang === 'sw'
        ? 'Imeundwa kusaidia kurejesha au kudumisha afya ya uzazi na ustawi wa jumla wa wanawake.'
        : 'Formulated explicitly to support complex endocrine health and physical strength.'
    },
    {
      icon: <Activity className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kusawazisha Homoni' : 'Hormonal Equilibrium',
      desc: lang === 'sw'
        ? 'Husaidia kusawazisha homoni vizuri, kutoa nishati ya taratibu yenye lishe asilia.'
        : 'Provides direct plant-nutrients that smooth out natural cycle peaks and stress hormone spikes.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kupunguza Machungu' : 'Ease Body Discomforts',
      desc: lang === 'sw'
        ? 'Mchanganyiko wa kipekee unaosaidia kupunguza usumbufu wa kila mwezi na kuimarisha hisia chanya.'
        : 'Soothes cyclic cramps, lower back fatigue, and supports general body fluid balance.'
    },
    {
      icon: <Sun className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Ushirikiano Bora' : 'Daily Radiant Partner',
      desc: lang === 'sw'
        ? 'Ni mwenza mzuri wa kila siku kwa mkaazi wa sasa kuleta uwiano wa ndani na mng\'ao wa nje.'
        : 'A wonderful daily ritual to cultivate serene emotional stability and clear skin radiance.'
    }
  ];

  const universalCoffeeSquares = [
    {
      icon: <Coffee className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Familia Nzima' : 'Universal Celebration',
      desc: lang === 'sw'
        ? 'Mchanganyiko mtamu sana na wenye utajiri mkubwa wa antioxidants muhimu kwa watu wote.'
        : 'A highly delicious, antioxidant-dense healthy extract that everyone in the family can enjoy.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kuongeza Kinga' : 'Immune Shielding',
      desc: lang === 'sw'
        ? 'Hutoa afya bora, kusafisha sumu mwilini na kuimarisha seli za ulinzi wa familia dhabiti.'
        : 'Infuses cells with high radical-scavengers to lock down and sustain immune defenses.'
    },
    {
      icon: <Leaf className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Safi ya Mwili (Detox)' : 'Total Cell Detox',
      desc: lang === 'sw'
        ? 'Imejaa virutubisho asilia kusaidia kusafisha mifumo ya ndani (detox) kwa usalama na nguvu.'
        : 'Flushes heavy metals, biological waste, and toxic deposits out of deep visceral pathways.'
    },
    {
      icon: <Activity className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Mwanzo Bora' : 'Kickstart Defense',
      desc: lang === 'sw'
        ? 'Anza siku yako vizuri na kikombe kitamu chenye kuimarisha ulinzi na stamina thabiti.'
        : 'The finest aromatic start to defend digestive walls, raise bio-energy, and feel clean.'
    }
  ];

  const opportunitySquares = [
    {
      icon: <Gem className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Afya na Kipato' : 'Health & Wealth Sync',
      desc: lang === 'sw'
        ? 'Badilisha afya ya seli zako na kuimarisha kipato chako cha kifedha kwa wakati mmoja.'
        : 'Improve your biological health while simultaneously constructing an ethical wealth channel.'
    },
    {
      icon: <UserPlus className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Kujenga Utajiri' : 'Proven Support System',
      desc: lang === 'sw'
        ? 'Mfumo wetu uliothibitishwa unakupa zana, elimu na uongozi thabiti wa kufanikiwa kama msambazaji.'
        : 'We deliver comprehensive digital tools, leadership modules, and solid blueprints to win.'
    },
    {
      icon: <Activity className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Malipo ya kila Siku' : 'Daily Uncapped Income',
      desc: lang === 'sw'
        ? 'Ufurahie kipato kisicho na kikomo, malipo ya uwajibikaji kila siku, na jamii ya kimataifa.'
        : 'Secure absolute financial leverage with borderless payouts, commissions, and daily clearings.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-secondary" />,
      title: lang === 'sw' ? 'Urithi wa Familia' : 'Leave a Freedom Legacy',
      desc: lang === 'sw'
        ? 'Shiriki bidhaa asilia unazozipenda ukiwa unajenga urithi na usalama wa kifedha wa kizazi kijacho.'
        : 'Build a durable, transferable distribution estate that guarantees your offspring stability.'
    }
  ];

  return (
    <div className="py-8 px-margin-mobile md:px-margin-desktop bg-surface dark:bg-primary text-on-surface dark:text-white transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Navigation / Header controls */}
        <div className="mb-10 flex flex-wrap gap-4 justify-between items-center border-b border-outline-variant/40 pb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-on-surface-variant dark:text-white/80 hover:text-secondary group transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            <span>{curr.backBtn}</span>
          </button>
        </div>

        {/* Section 1: Welcome Header Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-tr from-surface-container-low to-surface-container border border-outline-variant/40 dark:from-tertiary-container/10 dark:to-tertiary-container/5 rounded-3xl p-8 md:p-12 text-center mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl -z-10"></div>

          <Dna className="w-12 h-12 text-secondary mx-auto mb-4 animate-spin-slow" />
          <p className="text-xs uppercase font-extrabold tracking-[0.3em] text-secondary">{curr.welcome}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-primary dark:text-secondary-fixed mt-2 mb-4">
            RenoLife
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto rounded mb-6"></div>
          
          <h2 className="text-sm md:text-lg font-medium max-w-2xl mx-auto text-on-surface-variant dark:text-white/80 leading-relaxed">
            {curr.introSub}
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant/80 dark:text-white/65 max-w-xl mx-auto mt-4 leading-relaxed">
            {curr.introDesc}
          </p>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={onOrderClick}
              className="bg-primary-container dark:bg-secondary-fixed text-on-primary dark:text-on-secondary-fixed font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-secondary dark:hover:bg-opacity-90 transition-all shadow-md group hover:scale-[1.02]"
            >
              {curr.orderNow}
            </button>
          </div>
        </motion.div>

        {/* Section 2: Fursa Kwanza (Company intro in custom square elements) */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-secondary inline-block">
              {lang === 'sw' ? 'MALENGO YETU MISINGI' : 'OUR FOUNDATIONAL PILLARS'}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-primary dark:text-white mt-1.5 mb-2">
              {curr.introTitle}
            </h2>
            <div className="w-12 h-0.5 bg-secondary mx-auto rounded"></div>
          </div>

          {/* SQUARES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-center">
            {introSquares.map((sq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl aspect-square p-7 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[310px] w-full mx-auto"
              >
                <div className="w-12 h-12 rounded-xl bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  {sq.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-primary dark:text-primary-fixed mb-2.5 text-center">
                  {sq.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center">
                  {sq.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 3: Bidhaa Zetu Kuu Intro (Squares) */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-secondary inline-block">
              {lang === 'sw' ? 'MIONGOZO YA UBORA' : 'QUALITY BENCHMARKS'}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-primary dark:text-white mt-1.5 mb-2">
              {curr.productsHeader}
            </h2>
            <p className="text-xs text-on-surface-variant/80 dark:text-white/60 uppercase tracking-widest">{curr.productsSub}</p>
            <div className="w-12 h-0.5 bg-secondary mx-auto rounded mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {coreProductsIntroSquares.map((sq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl aspect-square p-8 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[310px] w-full mx-auto"
              >
                <div className="w-12 h-12 rounded-xl bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  {sq.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-primary dark:text-primary-fixed mb-2.5 text-center">
                  {sq.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center">
                  {sq.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 4: Renocell+ Stemcell Detail squares */}
        <div className="mb-20 bg-surface-container-lowest dark:bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-outline-variant/30">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-block bg-primary/10 dark:bg-secondary-fixed/10 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-3">
              FLAGSHIP PRODUCT
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-primary dark:text-white mb-2">
              {curr.renocellTitle}
            </h2>
            <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-3">{curr.renocellSub}</p>
            <p className="text-xs text-on-surface-variant dark:text-gray-300 bg-surface dark:bg-tertiary/45 p-4 rounded-xl border border-outline-variant/50 italic leading-relaxed">
              {curr.renocellFormula}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {renocellSquares.map((sq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl aspect-square p-5 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[275px] w-full mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  {sq.icon}
                </div>
                <h3 className="font-serif text-[13px] font-bold text-primary dark:text-primary-fixed mb-1.5 text-center">
                  {sq.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center line-clamp-4">
                  {sq.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 5: Reno Anti-Aging Cream */}
        <div className="mb-20">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-block bg-primary/10 dark:bg-secondary-fixed/10 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-3">
              CELULLAR BEAUTY
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-primary dark:text-white mb-2">
              {curr.creamTitle}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-gray-300 leading-relaxed">
              {curr.creamSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {antiAgingCreamSquares.map((sq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl aspect-square p-5 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[275px] w-full mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  {sq.icon}
                </div>
                <h3 className="font-serif text-[13px] font-bold text-primary dark:text-primary-fixed mb-1.5 text-center">
                  {sq.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center line-clamp-4">
                  {sq.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 6: Reno Power Coffee */}
        <div className="mb-20">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-block bg-primary/10 dark:bg-secondary-fixed/10 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-3">
              MALE PERFORMANCE
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-primary dark:text-white mb-2">
              {curr.powerCoffeeTitle}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-gray-300 leading-relaxed">
              {curr.powerCoffeeSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {powerCoffeeSquares.map((sq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl aspect-square p-5 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[275px] w-full mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  {sq.icon}
                </div>
                <h3 className="font-serif text-[13px] font-bold text-primary dark:text-primary-fixed mb-1.5 text-center">
                  {sq.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center line-clamp-4">
                  {sq.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 7: Reno Fem Coffee */}
        <div className="mb-20">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-block bg-primary/10 dark:bg-secondary-fixed/10 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-3">
              FEMININE BALANCE
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-primary dark:text-white mb-2">
              {curr.femCoffeeTitle}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-gray-300 leading-relaxed">
              {curr.femCoffeeSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {femCoffeeSquares.map((sq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl aspect-square p-5 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[275px] w-full mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  {sq.icon}
                </div>
                <h3 className="font-serif text-[13px] font-bold text-primary dark:text-primary-fixed mb-1.5 text-center">
                  {sq.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center line-clamp-4">
                  {sq.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 8: Reno Universal Coffee */}
        <div className="mb-20">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-block bg-primary/10 dark:bg-secondary-fixed/10 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-3">
              FAMILY DEFENSE
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-primary dark:text-white mb-2">
              {curr.universalCoffeeTitle}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-gray-300 leading-relaxed">
              {curr.universalCoffeeSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {universalCoffeeSquares.map((sq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl aspect-square p-5 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[275px] w-full mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  {sq.icon}
                </div>
                <h3 className="font-serif text-[13px] font-bold text-primary dark:text-primary-fixed mb-1.5 text-center">
                  {sq.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center line-clamp-4">
                  {sq.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>



        {/* Back Button Footer Section */}
        <div className="flex flex-col items-center gap-4 mt-8 pb-10 border-t border-outline-variant/40 pt-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-on-surface-variant dark:text-white/80 hover:text-secondary group transition-colors px-6 py-3 border border-outline/30 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            <span>{curr.backBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// Custom inline SVG replacement icon representing Lightning
function LightningIcon() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-secondary"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );
}
