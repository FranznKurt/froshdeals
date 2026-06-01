(() => {
  const BLOCKED_DEAL_HOSTS = new Set([
  "studentbeans.com",
  "www.studentbeans.com",
  "unidays.com",
  "www.unidays.com",
  "myunidays.com",
  "www.myunidays.com"
]);

  function validateDealsData(deals) {
    const seenBrands = new Set();

    return deals.map((deal) => {
      if (!deal || typeof deal !== "object") {
        throw new Error("Invalid deal entry encountered");
      }

      const requiredFields = ["brand", "icon", "discount", "category", "desc", "affiliate", "commission", "dealUrl"];
      for (const field of requiredFields) {
        if (!deal[field]) {
          throw new Error(`Missing ${field} for ${deal.brand || "unknown brand"}`);
        }
      }

      const normalizedBrand = deal.brand.trim().toLowerCase();
      if (seenBrands.has(normalizedBrand)) {
        throw new Error(`Duplicate brand in deal data: ${deal.brand}`);
      }
      seenBrands.add(normalizedBrand);

      let host;
      try {
        host = new URL(deal.dealUrl).hostname.toLowerCase();
      } catch {
        throw new Error(`Invalid deal URL for ${deal.brand}: ${deal.dealUrl}`);
      }

      if (BLOCKED_DEAL_HOSTS.has(host)) {
        throw new Error(`Blocked third-party host for ${deal.brand}: ${host}`);
      }

      return Object.freeze({ ...deal });
    });
  }

  window.validateDealsData = validateDealsData;
  window.DEALS_DATA = Object.freeze([
  {
    "brand": "Amazon Prime",
    "icon": "📦",
    "discount": "6 months FREE + 50% off",
    "category": "Shopping",
    "desc": "6 months free, then $7.49/mo. Free 2-day shipping, Prime Video, Prime Music & more.",
    "affiliate": "Amazon Associates",
    "commission": "3–10% on purchases",
    "dealUrl": "https://www.amazon.com/joinstudent?tag=campusunlock-20"
  },
  {
    "brand": "Spotify",
    "icon": "🎵",
    "discount": "50% off Premium",
    "category": "Music",
    "desc": "$2.99/mo Spotify Premium — half price. The #1 student deal in music streaming.",
    "affiliate": "Impact.com",
    "commission": "$7.35 per signup",
    "dealUrl": "https://www.spotify.com/us/student/"
  },
  {
    "brand": "Hulu",
    "icon": "📺",
    "discount": "$1.99/mo",
    "category": "Entertainment",
    "desc": "Hulu with Ads for just $1.99/month — one of the best streaming deals for students.",
    "affiliate": "FlexOffers",
    "commission": "$2–$4 CPA",
    "dealUrl": "https://www.hulu.com/student"
  },
  {
    "brand": "Apple Music",
    "icon": "🎵",
    "discount": "50% off",
    "category": "Music",
    "desc": "Apple Music for $5.99/mo instead of $10.99 — great if you're in the Apple ecosystem.",
    "affiliate": "Apple Partners",
    "commission": "Apple affiliate program",
    "dealUrl": "https://www.apple.com/apple-music"
  },
  {
    "brand": "YouTube Premium",
    "icon": "▶️",
    "discount": "Student Rate",
    "category": "Entertainment",
    "desc": "Ad-free YouTube + YouTube Music at a reduced student rate. No more ads ever.",
    "affiliate": "Partnerize",
    "commission": "$5–$10 CPA",
    "dealUrl": "https://www.youtube.com/premium/student"
  },
  {
    "brand": "Apple",
    "icon": "🍎",
    "discount": "10-20% off + free AirPods",
    "category": "Tech",
    "desc": "Save on MacBooks, iPads, AirPods. Seasonal free AirPods with Mac purchase.",
    "affiliate": "Apple Partners",
    "commission": "2.5% hardware / 400% apps",
    "dealUrl": "https://www.apple.com/shop/buy-mac/mac-laptop/students"
  },
  {
    "brand": "Nike",
    "icon": "👟",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off most items on Nike.com and in the Nike App after student verification on Nike's official help page.",
    "affiliate": "Partnerize",
    "commission": "5–11% on sales",
    "dealUrl": "https://www.nike.com/help/a/student-discount/promo-apply"
  },
  {
    "brand": "Chegg",
    "icon": "📚",
    "discount": "Textbook Savings",
    "category": "Education",
    "desc": "Rent textbooks, step-by-step homework help, and tutoring at student rates.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$15 per sub",
    "dealUrl": "https://www.chegg.com/"
  },
  {
    "brand": "Adobe Creative Cloud",
    "icon": "🎨",
    "discount": "60% off",
    "category": "Software",
    "desc": "Photoshop, Illustrator, Premiere Pro — the full suite for creators.",
    "affiliate": "CJ Affiliate",
    "commission": "85% of 1st month",
    "dealUrl": "https://www.adobe.com/creativecloud/plans/students.html"
  },
  {
    "brand": "Microsoft 365",
    "icon": "💼",
    "discount": "Free",
    "category": "Software",
    "desc": "Word, Excel, PowerPoint, Teams — full Microsoft 365 free through your school.",
    "affiliate": "CJ Affiliate",
    "commission": "7–10% on paid subs",
    "dealUrl": "https://www.microsoft.com/en-us/education/products/office"
  },
  {
    "brand": "DoorDash",
    "icon": "🛵",
    "discount": "DashPass free trial",
    "category": "Food & Delivery",
    "desc": "DashPass for $0 delivery — extended free trial for students. Save $9.99/mo.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$10 per signup",
    "dealUrl": "https://www.doordash.com/dashpass/"
  },
  {
    "brand": "Grubhub",
    "icon": "🍔",
    "discount": "Free Grubhub+",
    "category": "Food & Delivery",
    "desc": "Free Grubhub+ with $0 delivery fees for Amazon Prime Student members.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$10 per sub",
    "dealUrl": "https://www.grubhub.com/plus"
  },
  {
    "brand": "ASOS",
    "icon": "🛍️",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off everything on ASOS — fashion, shoes, accessories.",
    "affiliate": "CJ Affiliate",
    "commission": "5–7% on sales",
    "dealUrl": "https://www.asos.com/discover/student-discount/"
  },
  {
    "brand": "Notion",
    "icon": "📝",
    "discount": "Free Personal Pro",
    "category": "Software",
    "desc": "Full Notion Personal Pro plan completely free with a .edu email.",
    "affiliate": "Featured Listing",
    "commission": "Sponsored opportunity",
    "dealUrl": "https://www.notion.so/students"
  },
  {
    "brand": "GitHub",
    "icon": "🐙",
    "discount": "Free Pro + Copilot",
    "category": "Tech",
    "desc": "GitHub Student Dev Pack: free Pro, Copilot AI, and $200k+ in partner tools.",
    "affiliate": "Partner Indirect",
    "commission": "Drives partner affiliate traffic",
    "dealUrl": "https://education.github.com/pack"
  },
  {
    "brand": "Figma",
    "icon": "🖌️",
    "discount": "Free Professional",
    "category": "Software",
    "desc": "Figma Professional plan free for students and educators.",
    "affiliate": "Featured Listing",
    "commission": "Sponsored opportunity",
    "dealUrl": "https://www.figma.com/education/"
  },
  {
    "brand": "Headspace",
    "icon": "🧘",
    "discount": "85% off",
    "category": "Health",
    "desc": "$9.99/year (normally $69.99). Meditation and mindfulness for students.",
    "affiliate": "Impact.com",
    "commission": "$10 per sub",
    "dealUrl": "https://www.headspace.com/studentplan"
  },
  {
    "brand": "Calm",
    "icon": "😌",
    "discount": "40% off",
    "category": "Health",
    "desc": "Premium meditation and sleep app at a big discount for students.",
    "affiliate": "Impact.com",
    "commission": "$5–$10 per sub",
    "dealUrl": "https://www.calm.com/students"
  },
  {
    "brand": "Canva",
    "icon": "✨",
    "discount": "Free Pro",
    "category": "Software",
    "desc": "Canva Pro free for students. Premium templates, brand kits, unlimited storage.",
    "affiliate": "Impact.com",
    "commission": "$36 per new Pro sub",
    "dealUrl": "https://www.canva.com/education/"
  },
  {
    "brand": "Skillshare",
    "icon": "🎬",
    "discount": "1 Month Free",
    "category": "Education",
    "desc": "Free 1-month trial to Skillshare's entire creative course library.",
    "affiliate": "Impact.com",
    "commission": "$7 per trial",
    "dealUrl": "https://www.skillshare.com/en/student"
  },
  {
    "brand": "NY Times",
    "icon": "📰",
    "discount": "$1/week",
    "category": "Entertainment",
    "desc": "Full digital access to the New York Times for just $1/week.",
    "affiliate": "CJ Affiliate",
    "commission": "$10–$15 per sub",
    "dealUrl": "https://www.nytimes.com/subscription/student"
  },
  {
    "brand": "Dell",
    "icon": "💻",
    "discount": "10-20% off",
    "category": "Tech",
    "desc": "Student discount on laptops, monitors, and accessories through Dell's student store.",
    "affiliate": "CJ Affiliate",
    "commission": "1–3% on hardware",
    "dealUrl": "https://www.dell.com/en-us/shop/dell-advantage/cp/students"
  },
  {
    "brand": "Lenovo",
    "icon": "🖥️",
    "discount": "10% off",
    "category": "Tech",
    "desc": "Lenovo Education Store with 10%+ off laptops and accessories.",
    "affiliate": "FlexOffers",
    "commission": "1–5% on sales",
    "dealUrl": "https://www.lenovo.com/us/en/landingpage/studentdiscount/"
  },
  {
    "brand": "1Password",
    "icon": "🔐",
    "discount": "Free for 1 year",
    "category": "Software",
    "desc": "1Password password manager free for students for the first year.",
    "affiliate": "PartnerStack",
    "commission": "25% recurring",
    "dealUrl": "https://1password.com/students/"
  },
  {
    "brand": "Autodesk",
    "icon": "📐",
    "discount": "Free",
    "category": "Software",
    "desc": "AutoCAD, Maya, and 100+ tools free for verified students.",
    "affiliate": "CJ Affiliate",
    "commission": "9% on subs",
    "dealUrl": "https://www.autodesk.com/education/edu-software/overview"
  },
  {
    "brand": "JetBrains",
    "icon": "🧑‍💻",
    "discount": "Free All IDEs",
    "category": "Software",
    "desc": "PyCharm, IntelliJ, WebStorm, and all JetBrains IDEs — free for students.",
    "affiliate": "Featured Listing",
    "commission": "Sponsored opportunity",
    "dealUrl": "https://www.jetbrains.com/community/education/"
  },
  {
    "brand": "Coursera",
    "icon": "🎓",
    "discount": "Free Courses",
    "category": "Education",
    "desc": "Hundreds of free courses from top universities. Paid certs available.",
    "affiliate": "Impact.com",
    "commission": "45% on purchases",
    "dealUrl": "https://www.coursera.org/"
  },
  {
    "brand": "Dropbox",
    "icon": "📂",
    "discount": "Free via campus",
    "category": "Tech",
    "desc": "Many schools offer Dropbox Business through campus licenses — check yours.",
    "affiliate": "CJ Affiliate",
    "commission": "~20% on paid plans",
    "dealUrl": "https://www.dropbox.com/education"
  },
  {
    "brand": "Backblaze",
    "icon": "💾",
    "discount": "Free Trial",
    "category": "Tech",
    "desc": "Cloud backup for your laptop — essential for protecting school work.",
    "affiliate": "ShareASale",
    "commission": "$5 trial + 10% on paid",
    "dealUrl": "https://www.backblaze.com/cloud-backup.html"
  },
  {
    "brand": "Wolfram Alpha",
    "icon": "🧮",
    "discount": "Student Pricing",
    "category": "Education",
    "desc": "Step-by-step math, science, and computation. Essential for STEM students.",
    "affiliate": "ShareASale",
    "commission": "Varies",
    "dealUrl": "https://www.wolframalpha.com/pro/pricing/"
  },
  {
    "brand": "Duolingo",
    "icon": "🦉",
    "discount": "Reduced Super",
    "category": "Education",
    "desc": "Duolingo Super (ad-free + offline) at a reduced price for students.",
    "affiliate": "Featured Listing",
    "commission": "Sponsored opportunity",
    "dealUrl": "https://www.duolingo.com/"
  },
  {
    "brand": "Bodybuilding.com",
    "icon": "💪",
    "discount": "10% off",
    "category": "Health",
    "desc": "10% off supplements and gym gear with student verification.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.bodybuilding.com/"
  },
  {
    "brand": "Ray-Ban",
    "icon": "😎",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off sunglasses with student verification through Ray-Ban's official student offer page.",
    "affiliate": "CJ Affiliate",
    "commission": "~5% on sales",
    "dealUrl": "https://www.ray-ban.com/usa/student-discount"
  },
  {
    "brand": "The Economist",
    "icon": "📖",
    "discount": "50% off",
    "category": "Entertainment",
    "desc": "Stay informed on global affairs at half the regular subscription price.",
    "affiliate": "CJ Affiliate",
    "commission": "$10–$20 per sub",
    "dealUrl": "https://www.economist.com/student"
  },
  {
    "brand": "LinkedIn Learning",
    "icon": "💡",
    "discount": "Free Access",
    "category": "Education",
    "desc": "Many schools offer free LinkedIn Learning access — check your institution.",
    "affiliate": "Impact.com",
    "commission": "$10–$30 per signup",
    "dealUrl": "https://www.linkedin.com/learning/"
  },
  {
    "brand": "Peacock",
    "icon": "🦚",
    "discount": "$2/mo (was $8)",
    "category": "Entertainment",
    "desc": "Peacock Premium at $2/month for verified students — 75% off.",
    "affiliate": "CJ / FlexOffers",
    "commission": "$5–$10 CPA",
    "dealUrl": "https://www.peacocktv.com/student"
  },
  {
    "brand": "Tidal",
    "icon": "🎶",
    "discount": "Free for 6 months",
    "category": "Music",
    "desc": "Tidal HiFi student plan — lossless audio streaming free for 6 months, then 50% off.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://tidal.com/store/student"
  },
  {
    "brand": "Pandora",
    "icon": "📻",
    "discount": "Free Premium",
    "category": "Music",
    "desc": "Pandora Premium free for 3 months, then 50% off for verified students.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.pandora.com/upgrade/student"
  },
  {
    "brand": "Deezer",
    "icon": "🎼",
    "discount": "50% off Premium",
    "category": "Music",
    "desc": "Deezer Premium at 50% off with student verification.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.deezer.com/us/offers/student"
  },
  {
    "brand": "Best Buy",
    "icon": "🛒",
    "discount": "Exclusive deals",
    "category": "Tech",
    "desc": "Student-exclusive tech deals via My Best Buy account. Extra savings on laptops, tablets, and more.",
    "affiliate": "Impact.com",
    "commission": "1–4% on sales",
    "dealUrl": "https://www.bestbuy.com/site/misc/back-to-school/pcmcat334100050000.c"
  },
  {
    "brand": "HP",
    "icon": "🖨️",
    "discount": "Student pricing",
    "category": "Tech",
    "desc": "HP Education Store with exclusive student pricing on laptops, printers, and accessories.",
    "affiliate": "CJ Affiliate",
    "commission": "2–4% on sales",
    "dealUrl": "https://www.hp.com/us-en/shop/cv/hp-education"
  },
  {
    "brand": "Bose",
    "icon": "🎧",
    "discount": "10% off",
    "category": "Tech",
    "desc": "10% off everything in your cart with .edu or ID.me student verification.",
    "affiliate": "CJ Affiliate",
    "commission": "3–5% on sales",
    "dealUrl": "https://www.bose.com/idme-group-discounts-program"
  },
  {
    "brand": "Logitech",
    "icon": "🖱️",
    "discount": "Student pricing",
    "category": "Tech",
    "desc": "Exclusive student pricing on keyboards, mice, webcams, and headsets via UNiDAYS.",
    "affiliate": "CJ Affiliate",
    "commission": "3% on sales",
    "dealUrl": "https://www.logitech.com/en-us/promo/students.html"
  },
  {
    "brand": "Samsung",
    "icon": "📱",
    "discount": "Up to 30% off",
    "category": "Tech",
    "desc": "Samsung Education Store — discounts on Galaxy phones, tablets, laptops, and TVs.",
    "affiliate": "CJ Affiliate",
    "commission": "1–3% on sales",
    "dealUrl": "https://www.samsung.com/us/smartphones/galaxy-s/all-galaxy-s-phones/?galaxy-for=education"
  },
  {
    "brand": "GoPro",
    "icon": "📷",
    "discount": "5% off + free SD card",
    "category": "Tech",
    "desc": "GoPro student discount plus a free SD card with select camera purchases.",
    "affiliate": "Impact.com",
    "commission": "4% on sales",
    "dealUrl": "https://gopro.com/en/us/info/static/student-discount"
  },
  {
    "brand": "Adorama",
    "icon": "📸",
    "discount": "Student pricing",
    "category": "Tech",
    "desc": "Camera gear, audio equipment, and studio essentials at student prices.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.adorama.com/students"
  },
  {
    "brand": "Avid",
    "icon": "🎬",
    "discount": "Education pricing",
    "category": "Software",
    "desc": "Pro Tools, Media Composer, and Sibelius at massive education discounts for music/film students.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.avid.com/avid-for-education/avid-education-discounts"
  },
  {
    "brand": "Codecademy",
    "icon": "💻",
    "discount": "35% off Pro",
    "category": "Education",
    "desc": "Learn to code with 35% off Codecademy Pro for eligible college students.",
    "affiliate": "Impact.com",
    "commission": "$10–$20 per signup",
    "dealUrl": "https://www.codecademy.com/student-center"
  },
  {
    "brand": "Grammarly",
    "icon": "✍️",
    "discount": "20% off Premium",
    "category": "Software",
    "desc": "Grammarly Premium for writing assistance — student discount available.",
    "affiliate": "Impact.com",
    "commission": "$0.20 per free + $20 per premium",
    "dealUrl": "https://www.grammarly.com/edu"
  },
  {
    "brand": "Evernote",
    "icon": "📒",
    "discount": "Student discount",
    "category": "Software",
    "desc": "Evernote Personal at reduced student pricing for note-taking and organization.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://evernote.com/"
  },
  {
    "brand": "LastPass",
    "icon": "🔑",
    "discount": "Free Premium",
    "category": "Software",
    "desc": "LastPass Premium password manager free for students through campus programs.",
    "affiliate": "Impact.com",
    "commission": "Referral",
    "dealUrl": "https://www.lastpass.com/solutions/students"
  },
  {
    "brand": "Malwarebytes",
    "icon": "🛡️",
    "discount": "Student pricing",
    "category": "Software",
    "desc": "Malwarebytes Premium antivirus at student rates to keep your devices secure.",
    "affiliate": "CJ Affiliate",
    "commission": "Referral",
    "dealUrl": "https://www.malwarebytes.com/"
  },
  {
    "brand": "H&M",
    "icon": "👗",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off at H&M for students verified through UNiDAYS. Applies online and in-store.",
    "affiliate": "CJ Affiliate",
    "commission": "5–7% on sales",
    "dealUrl": "https://www.hm.com/us/member/student-discount/"
  },
  {
    "brand": "Reebok",
    "icon": "👟",
    "discount": "Student & teacher discount",
    "category": "Clothing",
    "desc": "Reebok's official current offers page includes a student and teacher discount section with the current terms on reebok.com.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.reebok.com/pages/current-offers"
  },
  {
    "brand": "Adidas",
    "icon": "🎽",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off adidas purchases for verified students through UNiDAYS.",
    "affiliate": "CJ Affiliate",
    "commission": "5–7% on sales",
    "dealUrl": "https://www.adidas.com/us/student-discount"
  },
  {
    "brand": "PacSun",
    "icon": "🌊",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% student discount at PacSun via its official student page on pacsun.com.",
    "affiliate": "CJ Affiliate",
    "commission": "5% on sales",
    "dealUrl": "https://www.pacsun.com/unidays.html?externalId=IdpV2"
  },
  {
    "brand": "Converse",
    "icon": "👟",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off Converse footwear and apparel for verified students.",
    "affiliate": "CJ Affiliate",
    "commission": "3–5% on sales",
    "dealUrl": "https://www.converse.com/student-discount"
  },
  {
    "brand": "Madewell",
    "icon": "👜",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off full-price items at Madewell with student ID or .edu email.",
    "affiliate": "ShareASale",
    "commission": "5% on sales",
    "dealUrl": "https://www.madewell.com/insiders/student-discount.html"
  },
  {
    "brand": "Vans",
    "icon": "🛹",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off shoes and apparel at Vans for verified students via UNiDAYS.",
    "affiliate": "CJ Affiliate",
    "commission": "3–5% on sales",
    "dealUrl": "https://www.vans.com/en-us/student-discount.html"
  },
  {
    "brand": "Redbubble",
    "icon": "🎨",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off unique artist-designed merch, stickers, phone cases, and more.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.redbubble.com/"
  },
  {
    "brand": "Purple Mattress",
    "icon": "🛏️",
    "discount": "10% off",
    "category": "Shopping",
    "desc": "10% off mattresses and bedding — perfect for your first apartment or dorm.",
    "affiliate": "Impact.com",
    "commission": "5% on sales",
    "dealUrl": "https://purple.com/"
  },
  {
    "brand": "Gymshark",
    "icon": "🏋️",
    "discount": "Student discount",
    "category": "Clothing",
    "desc": "Student discount on Gymshark activewear via Student Beans.",
    "affiliate": "Student Beans",
    "commission": "5% on sales",
    "dealUrl": "https://www.gymshark.com/"
  },
  {
    "brand": "Chipotle",
    "icon": "🌯",
    "discount": "BOGO deals",
    "category": "Food & Delivery",
    "desc": "Chipotle runs student-exclusive BOGO and free guac offers through campus campaigns.",
    "affiliate": "Direct",
    "commission": "Brand deal opportunity",
    "dealUrl": "https://www.chipotle.com/"
  },
  {
    "brand": "Domino's",
    "icon": "🍕",
    "discount": "Student deals",
    "category": "Food & Delivery",
    "desc": "Domino's frequently runs student discount nights and campus promotions.",
    "affiliate": "Direct",
    "commission": "Brand deal opportunity",
    "dealUrl": "https://www.dominos.com/"
  },
  {
    "brand": "Papa John's",
    "icon": "🍕",
    "discount": "Student discount",
    "category": "Food & Delivery",
    "desc": "Special student pricing on orders via student discount codes.",
    "affiliate": "CJ Affiliate",
    "commission": "Referral",
    "dealUrl": "https://www.papajohns.com/"
  },
  {
    "brand": "StudentUniverse",
    "icon": "✈️",
    "discount": "Up to 30% off flights",
    "category": "Travel",
    "desc": "Exclusive student flight deals — cheaper than any other booking site for .edu holders.",
    "affiliate": "Direct / CJ",
    "commission": "2–5% on bookings",
    "dealUrl": "https://www.studentuniverse.com/"
  },
  {
    "brand": "Amtrak",
    "icon": "🚂",
    "discount": "15% off",
    "category": "Travel",
    "desc": "15% off Amtrak train tickets with a valid student ID — great for going home.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.amtrak.com/student-discounts"
  },
  {
    "brand": "Greyhound",
    "icon": "🚌",
    "discount": "10% off",
    "category": "Travel",
    "desc": "10% off bus tickets with student ID — budget travel between cities.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.greyhound.com/en/deals-and-promotions/student-advantage"
  },
  {
    "brand": "Hostelworld",
    "icon": "🏨",
    "discount": "Student rates",
    "category": "Travel",
    "desc": "Cheapest hostels worldwide — built for student travel budgets.",
    "affiliate": "CJ Affiliate",
    "commission": "$2–$4 per booking",
    "dealUrl": "https://www.hostelworld.com/"
  },
  {
    "brand": "Hertz",
    "icon": "🚗",
    "discount": "Student pricing",
    "category": "Travel",
    "desc": "Hertz car rental student discount through campus programs and AAA.",
    "affiliate": "CJ Affiliate",
    "commission": "3–5% on bookings",
    "dealUrl": "https://www.hertz.com/rentacar/discounts/student-discounts"
  },
  {
    "brand": "Discover Student Card",
    "icon": "💳",
    "discount": "5% cash back",
    "category": "Finance",
    "desc": "No annual fee student credit card with 5% rotating cash back categories. Build credit now.",
    "affiliate": "CJ Affiliate",
    "commission": "$50–$100 per approved app",
    "dealUrl": "https://www.discover.com/credit-cards/student/"
  },
  {
    "brand": "Chase Freedom Student",
    "icon": "💳",
    "discount": "$50 bonus",
    "category": "Finance",
    "desc": "Chase Freedom Student card — no annual fee, $50 bonus after first purchase.",
    "affiliate": "CJ Affiliate",
    "commission": "$50–$100 per approved app",
    "dealUrl": "https://creditcards.chase.com/freedom-credit-cards/freedom-rise"
  },
  {
    "brand": "Deserve EDU Card",
    "icon": "💳",
    "discount": "Amazon Prime free",
    "category": "Finance",
    "desc": "Student credit card that gives you a free year of Amazon Prime Student. No SSN required.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.deserve.com/edu/"
  },
  {
    "brand": "SoFi",
    "icon": "🏦",
    "discount": "Student loan refinancing",
    "category": "Finance",
    "desc": "Refinance student loans at lower rates — save thousands over the life of your loans.",
    "affiliate": "Impact.com",
    "commission": "$100–$200 per funded loan",
    "dealUrl": "https://www.sofi.com/refinance-student-loan/"
  },
  {
    "brand": "US Mobile",
    "icon": "📱",
    "discount": "20% off phone plans",
    "category": "Tech",
    "desc": "20% off any mobile plan with .edu email. Great budget alternative to big carriers.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.usmobile.com/"
  },
  {
    "brand": "Peloton",
    "icon": "🚴",
    "discount": "Student discount",
    "category": "Health",
    "desc": "Peloton app membership at a reduced student rate — yoga, cycling, strength classes.",
    "affiliate": "Impact.com",
    "commission": "$10–$20 per signup",
    "dealUrl": "https://www.onepeloton.com/"
  },
  {
    "brand": "Planet Fitness",
    "icon": "💪",
    "discount": "$10/mo student rate",
    "category": "Health",
    "desc": "Planet Fitness summer pass and ongoing low rates for students — no contract.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.planetfitness.com/"
  },
  {
    "brand": "Noom",
    "icon": "🥗",
    "discount": "Student discount",
    "category": "Health",
    "desc": "Noom weight management program at a discounted rate for students.",
    "affiliate": "Impact.com",
    "commission": "$15–$30 per signup",
    "dealUrl": "https://www.noom.com/"
  },
  {
    "brand": "Insurance",
    "icon": "🏥",
    "discount": "Student health plans",
    "category": "Health",
    "desc": "Many states offer low-cost health insurance for students — check healthcare.gov.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.healthcare.gov/young-adults/"
  },
  {
    "brand": "Xbox Game Pass",
    "icon": "🎮",
    "discount": "$1 first month",
    "category": "Gaming",
    "desc": "Xbox Game Pass Ultimate for $1 first month — hundreds of games including EA Play.",
    "affiliate": "Microsoft/CJ",
    "commission": "5–10% on subscriptions",
    "dealUrl": "https://www.xbox.com/en-US/xbox-game-pass"
  },
  {
    "brand": "EA Play",
    "icon": "🕹️",
    "discount": "Student pricing",
    "category": "Gaming",
    "desc": "EA Play Pro at a reduced student rate — FIFA, Madden, Apex Legends vault.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.ea.com/ea-play"
  },
  {
    "brand": "Twitch",
    "icon": "📡",
    "discount": "Free Turbo trial",
    "category": "Gaming",
    "desc": "Twitch Turbo free trial for students — no ads, exclusive emotes.",
    "affiliate": "Amazon Associates",
    "commission": "Part of Amazon ecosystem",
    "dealUrl": "https://www.amazon.com/twitch?tag=campusunlock-20"
  },
  {
    "brand": "Discord Nitro",
    "icon": "💬",
    "discount": "Student rate via GitHub",
    "category": "Gaming",
    "desc": "Discord Nitro free 3 months via GitHub Student Dev Pack.",
    "affiliate": "GitHub Pack",
    "commission": "Indirect",
    "dealUrl": "https://education.github.com/pack"
  },
  {
    "brand": "Target",
    "icon": "🎯",
    "discount": "20% off + 50% off Circle 360",
    "category": "Shopping",
    "desc": "Target Circle members get 20% off one purchase + 50% off Circle 360 subscription.",
    "affiliate": "Impact.com",
    "commission": "1–5% on purchases",
    "dealUrl": "https://www.target.com/l/target-circle-college-student-appreciation/"
  },
  {
    "brand": "Chegg Study",
    "icon": "📖",
    "discount": "Student pricing",
    "category": "Education",
    "desc": "Step-by-step textbook solutions, expert Q&A, and writing help at student rates.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$15 per sub",
    "dealUrl": "https://www.chegg.com/study"
  },
  {
    "brand": "Course Hero",
    "icon": "🎓",
    "discount": "Free documents",
    "category": "Education",
    "desc": "Unlock study guides, class notes, and tutoring at student rates.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$10 per signup",
    "dealUrl": "https://www.coursehero.com/"
  },
  {
    "brand": "iD.me",
    "icon": "🪪",
    "discount": "Verification hub",
    "category": "Shopping",
    "desc": "Set up your ID.me student verification once — use it to unlock 100s of student discounts.",
    "affiliate": "Direct",
    "commission": "Platform partner",
    "dealUrl": "https://www.id.me/"
  },
  {
    "brand": "Hollister",
    "icon": "🌊",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "Hollister gives students 10% off sitewide via UNiDAYS. Casual California vibes at a discount.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.hollisterco.com/shop/us"
  },
  {
    "brand": "Urban Outfitters",
    "icon": "🏙️",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% student discount at Urban Outfitters via UNiDAYS. Covers clothing, home decor, and vinyl.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.urbanoutfitters.com/"
  },
  {
    "brand": "The North Face",
    "icon": "🏔️",
    "discount": "20% off",
    "category": "Clothing",
    "desc": "20% off all North Face gear via SheerID student verification. Jackets, backpacks, fleeces.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.thenorthface.com/en-us/student-discount"
  },
  {
    "brand": "Foot Locker",
    "icon": "👟",
    "discount": "20% off $99+",
    "category": "Clothing",
    "desc": "20% off purchases of $99+ at Foot Locker via Student Beans. Great for sneaker drops.",
    "affiliate": "Impact.com",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.footlocker.com/student-beans.html"
  },
  {
    "brand": "J.Crew",
    "icon": "🎽",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "J.Crew gives students 15% off sitewide — quality basics, chinos, and workwear essentials.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.jcrew.com/"
  },
  {
    "brand": "Anthropologie",
    "icon": "🌸",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off full-price items at Anthropologie via Student Beans. Boho fashion and home goods.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.anthropologie.com/"
  },
  {
    "brand": "UGG",
    "icon": "🥾",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off UGG boots, slippers, and apparel via UNiDAYS student verification.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.ugg.com/"
  },
  {
    "brand": "Oakley",
    "icon": "🕶️",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off Oakley sunglasses and gear via UNiDAYS. Performance eyewear at student prices.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.oakley.com/en-us"
  },
  {
    "brand": "Kate Spade",
    "icon": "👜",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off online purchases at Kate Spade via UNiDAYS. Handbags, jewelry, and gifts.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.katespade.com/"
  },
  {
    "brand": "Aeropostale",
    "icon": "✈️",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off sitewide at Aeropostale via UNiDAYS. Casual basics and graphic tees for less.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.aeropostale.com/aeropostale-unidays-about.html"
  },
  {
    "brand": "Alphalete",
    "icon": "💪",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "Alphalete gives students 10% off performance activewear — direct on their site.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://alphaleteathletics.com/pages/discounts"
  },
  {
    "brand": "Hanes",
    "icon": "👕",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off at Hanes.com for enrolled college students. The OG for tees, hoodies, and basics.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.hanes.com/student-id"
  },
  {
    "brand": "L.L. Bean",
    "icon": "🎒",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off at L.L.Bean for students — outdoor gear, backpacks, and cozy flannels.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.llbean.com/"
  },
  {
    "brand": "PrettyLittleThing",
    "icon": "✨",
    "discount": "Up to 50% + 12% off",
    "category": "Clothing",
    "desc": "Up to 50% off site-wide plus an extra 12% student discount via Student Beans at PrettyLittleThing.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.prettylittlething.com/"
  },
  {
    "brand": "SHEIN",
    "icon": "🛍️",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off select SHEIN purchases via UNiDAYS or Student Beans. Plus up to 65% off select items.",
    "affiliate": "Impact.com",
    "commission": "5% on sales",
    "dealUrl": "https://us.shein.com/"
  },
  {
    "brand": "Boohoo",
    "icon": "🎀",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off at Boohoo via UNiDAYS or Student Beans — trend-forward fashion at budget prices.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://us.boohoo.com/page/students.html"
  },
  {
    "brand": "Princess Polly",
    "icon": "👑",
    "discount": "25% off",
    "category": "Clothing",
    "desc": "Up to 25% off at Princess Polly via Student Beans. Trendy Aussie fashion brand loved by Gen Z.",
    "affiliate": "Impact.com",
    "commission": "5–8% on sales",
    "dealUrl": "https://us.princesspolly.com/"
  },
  {
    "brand": "Kendra Scott",
    "icon": "💎",
    "discount": "15–20% off",
    "category": "Clothing",
    "desc": "15–20% off at Kendra Scott jewelry with student verification. Perfect for gifts and self-treats.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.kendrascott.com/"
  },
  {
    "brand": "Pandora Jewelry",
    "icon": "🌸",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "10% off Pandora jewelry via ID.me or Student Beans — charm bracelets, rings, and necklaces.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://us.pandora.net/"
  },
  {
    "brand": "Finish Line",
    "icon": "🏃",
    "discount": "Up to 50% off",
    "category": "Clothing",
    "desc": "Up to 50% off select styles at Finish Line via UNiDAYS. Sneakers and athletic apparel.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.finishline.com/"
  },
  {
    "brand": "Marshall Headphones",
    "icon": "🎵",
    "discount": "15% off",
    "category": "Tech",
    "desc": "Up to 15% off Marshall speakers and headphones via Student Beans. Iconic sound, student price.",
    "affiliate": "Impact.com",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.marshallheadphones.com/us/en/special-group-offers.html"
  },
  {
    "brand": "Disney+",
    "icon": "🏰",
    "discount": "15% off",
    "category": "Entertainment",
    "desc": "Disney+ gives students 15% off via UNiDAYS. Disney, Marvel, Star Wars, Pixar, and National Geographic.",
    "affiliate": "Impact.com",
    "commission": "CPA on signups",
    "dealUrl": "https://www.disneyplus.com/"
  },
  {
    "brand": "Amazon Music",
    "icon": "🎵",
    "discount": "33% off ($5.99/mo)",
    "category": "Entertainment",
    "desc": "Amazon Music Unlimited for $5.99/month for college students — regularly $8.99/month. Ad-free streaming.",
    "affiliate": "Amazon",
    "commission": "3–5%",
    "dealUrl": "https://www.amazon.com/music/unlimited/student?tag=campusunlock-20"
  },
  {
    "brand": "HelloFresh",
    "icon": "🥗",
    "discount": "55% off first box",
    "category": "Food",
    "desc": "55% off your first HelloFresh meal kit box + free shipping via UNiDAYS. Fresh ingredients delivered.",
    "affiliate": "CJ Affiliate",
    "commission": "$10–20 per new customer",
    "dealUrl": "https://www.hellofresh.com/"
  },
  {
    "brand": "Tarte Cosmetics",
    "icon": "💄",
    "discount": "20% off",
    "category": "Shopping",
    "desc": "20% off at Tarte Cosmetics with student verification. Popular cruelty-free makeup and skincare.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://tartecosmetics.com/"
  },
  {
    "brand": "Barnes & Noble",
    "icon": "📚",
    "discount": "Up to 80% off",
    "category": "Education",
    "desc": "Up to 80% off used textbooks at Barnes & Noble. Sell them back at end of semester too.",
    "affiliate": "CJ Affiliate",
    "commission": "5% on sales",
    "dealUrl": "https://www.barnesandnoble.com/b/textbooks/_/N-ry0"
  },
  {
    "brand": "Walmart+",
    "icon": "🛒",
    "discount": "50% off membership",
    "category": "Shopping",
    "desc": "50% off Walmart+ membership via SheerID — free delivery, gas discounts, and Paramount+ included.",
    "affiliate": "Impact.com",
    "commission": "$5–10 per signup",
    "dealUrl": "https://www.walmart.com/plus/"
  },
  {
    "brand": "Hotels.com",
    "icon": "🏨",
    "discount": "Up to 40% off",
    "category": "Shopping",
    "desc": "Up to 40% off hotel stays via UNiDAYS or 10% off via Student Beans at Hotels.com.",
    "affiliate": "CJ Affiliate",
    "commission": "4–6% on bookings",
    "dealUrl": "https://www.hotels.com/"
  },
  {
    "brand": "United Airlines",
    "icon": "✈️",
    "discount": "5% off",
    "category": "Shopping",
    "desc": "Ages 18–23 get exclusive student fares via the United app. Verified through UNiDAYS through Dec 31, 2026.",
    "affiliate": "CJ Affiliate",
    "commission": "Referral",
    "dealUrl": "https://www.united.com/"
  },
  {
    "brand": "YNAB",
    "icon": "💰",
    "discount": "FREE 1 year",
    "category": "Software",
    "desc": "You Need A Budget (YNAB) — completely free for one year for college students. Best budgeting app, period.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.ynab.com/college-student-discount"
  },
  {
    "brand": "Prezi",
    "icon": "📊",
    "discount": "79% off ($4/mo)",
    "category": "Software",
    "desc": "Prezi presentation software at just $4/month (reg. $19/mo) for students — 79% off. Dynamic non-linear slides.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://prezi.com/pricing/"
  },
  {
    "brand": "Xfinity",
    "icon": "📡",
    "discount": "$40/year internet",
    "category": "Tech",
    "desc": "Xfinity Internet Essentials for students — as low as $40/year. Fastest student internet deal available.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.xfinity.com/learn/internet-service/internet-essentials"
  },
  {
    "brand": "Verizon",
    "icon": "📱",
    "discount": "Up to $12/mo off",
    "category": "Tech",
    "desc": "Verizon student discount — up to $12/month off per line and $20/month off Fios home internet.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.verizon.com/discounts/student-discount/"
  },
  {
    "brand": "lululemon",
    "icon": "🧘",
    "discount": "Up to 50% off",
    "category": "Clothing",
    "desc": "lululemon's student program gives up to 50% off leggings, hoodies, and gear via Student Beans verification.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.lululemon.com/en-us/studentdiscount"
  },
  {
    "brand": "Abercrombie & Fitch",
    "icon": "👕",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% student discount at Abercrombie & Fitch on full-price styles. Verified via Student Beans.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.abercrombie.com/shop/us"
  },
  {
    "brand": "American Eagle",
    "icon": "🦅",
    "discount": "10–20% off",
    "category": "Clothing",
    "desc": "Student discount on jeans, tops, and AEO accessories with college verification.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.ae.com/us/en"
  },
  {
    "brand": "Aerie",
    "icon": "✨",
    "discount": "10–20% off",
    "category": "Clothing",
    "desc": "Student discount on Aerie intimates, loungewear, and activewear. Sister brand to American Eagle.",
    "affiliate": "CJ Affiliate",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.aerie.com/"
  },
  {
    "brand": "Allbirds",
    "icon": "🌿",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "15% off sustainable sneakers and apparel from Allbirds — the brand built for comfort and the planet.",
    "affiliate": "Impact.com",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.allbirds.com/"
  },
  {
    "brand": "Alo Yoga",
    "icon": "🧘",
    "discount": "Student discount",
    "category": "Clothing",
    "desc": "Alo Yoga student discount on premium yoga and activewear. Verify with Student Beans.",
    "affiliate": "ShareASale",
    "commission": "5–8% on sales",
    "dealUrl": "https://www.aloyoga.com/"
  },
  {
    "brand": "Chewy",
    "icon": "🐾",
    "discount": "Student pricing",
    "category": "Shopping",
    "desc": "Pet food, supplies, and vet meds at student-friendly prices. Auto-ship saves extra.",
    "affiliate": "CJ Affiliate",
    "commission": "$15 per new customer",
    "dealUrl": "https://www.chewy.com/"
  },
  {
    "brand": "AMC Theatres",
    "icon": "🎬",
    "discount": "Discounted tickets",
    "category": "Entertainment",
    "desc": "Discounted movie tickets with a valid college ID at select AMC locations.",
    "affiliate": "CJ Affiliate",
    "commission": "Referral",
    "dealUrl": "https://www.amctheatres.com/discounts"
  },
  {
    "brand": "Regal Cinemas",
    "icon": "🎞️",
    "discount": "Student pricing",
    "category": "Entertainment",
    "desc": "Discounted tickets at Regal theatres with student ID — great for movie nights.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.regmovies.com/static/en/us/theatre/student-pricing-locations"
  },
  {
    "brand": "The Washington Post",
    "icon": "📰",
    "discount": "Free access",
    "category": "Entertainment",
    "desc": "Free Washington Post digital access for students at many universities.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$10 per sub",
    "dealUrl": "https://subscribe.washingtonpost.com/student/"
  },
  {
    "brand": "Wall Street Journal",
    "icon": "📊",
    "discount": "$4/mo for students",
    "category": "Entertainment",
    "desc": "WSJ at $4/month — essential for finance, business, and economics students.",
    "affiliate": "CJ Affiliate",
    "commission": "$10–$15 per sub",
    "dealUrl": "https://store.wsj.com/shop/wsjus/us_stuall/"
  },
  {
    "brand": "Statista",
    "icon": "📈",
    "discount": "Free student access",
    "category": "Education",
    "desc": "Premium data and statistics platform — many universities have free campus access.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.statista.com/"
  },
  {
    "brand": "Scribd",
    "icon": "📚",
    "discount": "60-day free trial",
    "category": "Education",
    "desc": "Unlimited audiobooks, ebooks, and documents — 60 days free for students.",
    "affiliate": "Impact.com",
    "commission": "$5 per trial",
    "dealUrl": "https://www.scribd.com/"
  },
  {
    "brand": "Chegg Tutors",
    "icon": "🧑‍🏫",
    "discount": "First lesson free",
    "category": "Education",
    "desc": "One-on-one online tutoring — first lesson free for new students.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$15 per booking",
    "dealUrl": "https://www.chegg.com/tutors"
  },
  {
    "brand": "Wix",
    "icon": "🌐",
    "discount": "Student pricing",
    "category": "Software",
    "desc": "Build your portfolio website with Wix at a student discount rate.",
    "affiliate": "Impact.com",
    "commission": "$10–$20 per paid plan",
    "dealUrl": "https://www.wix.com/"
  },
  {
    "brand": "Squarespace",
    "icon": "🟦",
    "discount": "Student discount via GitHub",
    "category": "Software",
    "desc": "Squarespace free trial and discount via GitHub Student Dev Pack.",
    "affiliate": "Impact.com",
    "commission": "$10–$20 per plan",
    "dealUrl": "https://education.github.com/pack"
  },
  {
    "brand": "Namecheap",
    "icon": "🌐",
    "discount": "Free domain + SSL",
    "category": "Tech",
    "desc": "Free .me domain for 1 year + free SSL certificate via GitHub Student Dev Pack.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://education.github.com/pack"
  },
  {
    "brand": "Digital Ocean",
    "icon": "💧",
    "discount": "$200 in credits",
    "category": "Tech",
    "desc": "$200 in cloud computing credits free for students via GitHub Dev Pack.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://education.github.com/pack"
  },
  {
    "brand": "Paramount+",
    "icon": "🎬",
    "discount": "50% off any plan",
    "category": "Entertainment",
    "desc": "Paramount+ for students — 50% off any plan (Essential $3.99/mo, Premium $6.50/mo) for 12 months. Verify via SheerID. Stream Yellowstone, Star Trek, NFL, and more.",
    "affiliate": "CJ Affiliate",
    "commission": "$5–$10 per signup",
    "dealUrl": "https://www.paramountplus.com/account/signup/edu-offer/"
  },
  {
    "brand": "Babbel",
    "icon": "🗣️",
    "discount": "65% off — $15.99 for 3 months",
    "category": "Education",
    "desc": "65% off 3 months of Babbel language learning for U.S. college students. Verify via ID.me. Learn Spanish, French, German, and 13 other languages in 15-min lessons.",
    "affiliate": "Impact.com",
    "commission": "$5–$10 per signup",
    "dealUrl": "https://get.babbel.com/discount_student_ame-usa_en"
  },
  {
    "brand": "Epic Pass",
    "icon": "⛷️",
    "discount": "Up to 65% off ski season passes",
    "category": "Travel",
    "desc": "Epic College Pass for students — ski or ride Vail, Park City, Breckenridge, and 40+ resorts at up to 65% off lift ticket prices. Verify with .edu email.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.epicpass.com/pass-results/college.aspx"
  },
  {
    "brand": "Apple TV+",
    "icon": "📺",
    "discount": "Free with Apple Music student plan",
    "category": "Entertainment",
    "desc": "Get Apple TV+ free when you have an Apple Music student subscription ($5.99/mo). Stream Ted Lasso, Severance, The Morning Show, and originals at no extra cost.",
    "affiliate": "Apple Partners",
    "commission": "Apple affiliate program",
    "dealUrl": "https://www.apple.com/apple-tv-plus/"
  },
  {
    "brand": "Overleaf",
    "icon": "📄",
    "discount": "20% off Pro subscription",
    "category": "Software",
    "desc": "Overleaf Pro at 20% off for students — the go-to LaTeX collaborative editor for academic papers, theses, and scientific writing. Essential for STEM and research students.",
    "affiliate": "Student Beans",
    "commission": "Referral",
    "dealUrl": "https://www.overleaf.com/user/subscription/plans"
  },
  {
    "brand": "Ikon Pass",
    "icon": "🏔️",
    "discount": "Student/College pass pricing",
    "category": "Travel",
    "desc": "Ikon Student Pass — discounted ski season pass covering Aspen, Mammoth, Alta, and 50+ resorts worldwide. Often cheaper than Epic for certain resort preferences.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.ikonpass.com/en/shop-passes"
  },
  {
    "brand": "Notion AI",
    "icon": "🤖",
    "discount": "50% off AI add-on",
    "category": "Software",
    "desc": "Students on Notion's free Education Plus plan get 50% off the Notion AI add-on — just $5/mo instead of $10. AI writing, summarization, and automated databases for your notes and projects.",
    "affiliate": "Featured Listing",
    "commission": "Sponsored opportunity",
    "dealUrl": "https://www.notion.so/students"
  },
  {
    "brand": "Perplexity AI",
    "icon": "🔍",
    "discount": "Free Pro with .edu",
    "category": "Software",
    "desc": "Perplexity AI Pro — completely free for students with a verified .edu email. Get unlimited Pro Searches, file uploads, and advanced AI-powered research. One of the best free AI deals for college students right now.",
    "affiliate": "Featured Listing",
    "commission": "Sponsored opportunity",
    "dealUrl": "https://www.perplexity.ai/"
  },
  {
    "brand": "Lovable",
    "icon": "💜",
    "discount": "50% off Pro ($12.50/mo)",
    "category": "Software",
    "desc": "Lovable AI app builder — 50% off the Pro plan for students, just $12.50/month. Build full-stack web apps with AI in minutes. Verify with your .edu email or student ID. Perfect for CS and entrepreneurship students.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://lovable.dev/"
  },
  {
    "brand": "OpenAI Codex",
    "icon": "🤖",
    "discount": "$100 FREE credits",
    "category": "Software",
    "desc": "OpenAI Codex $100 in free credits (2,500 credits) for verified U.S. and Canada university students. Extends Codex AI coding beyond standard ChatGPT plan limits. Verify via SheerID at chatgpt.com/codex/offers/students. Limited to one offer per student.",
    "affiliate": "Featured Listing",
    "commission": "Platform partner",
    "dealUrl": "https://chatgpt.com/codex/offers/students"
  },
  {
    "brand": "QuillBot",
    "icon": "✍️",
    "discount": "Up to 25% off Premium",
    "category": "Software",
    "desc": "QuillBot Premium — up to 25% off for students. AI-powered paraphrasing, grammar checking, summarization, and citation tools. Starting at $8.33/month. Essential for essay writing and research papers.",
    "affiliate": "Student Beans",
    "commission": "Referral",
    "dealUrl": "https://quillbot.com/"
  },
  {
    "brand": "Lucidchart",
    "icon": "📊",
    "discount": "Free Education Account",
    "category": "Software",
    "desc": "Lucidchart professional diagramming tool — free Education account for students. Create flowcharts, org charts, network diagrams, and UML diagrams. Also 25% off paid plans via Student Beans. Essential for engineering, CS, and business students.",
    "affiliate": "Student Beans",
    "commission": "Referral",
    "dealUrl": "https://www.lucidchart.com/pages/usecase/education"
  },
  {
    "brand": "NoteGPT",
    "icon": "📝",
    "discount": "1 Month Free",
    "category": "Software",
    "desc": "NoteGPT — 1 month free for students with .edu email verification. AI-powered note-taking that summarizes YouTube videos, PDFs, and web pages automatically. Turn lectures and readings into smart study notes instantly.",
    "affiliate": "Featured Listing",
    "commission": "Sponsored opportunity",
    "dealUrl": "https://notegpt.io/"
  },
  {
    "brand": "Miro",
    "icon": "🧠",
    "discount": "Free Education plan",
    "category": "Software",
    "desc": "Miro provides a free Education workspace for eligible students with school email verification, including collaboration boards and advanced classroom features.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://miro.com/education-whiteboard/"
  },
  {
    "brand": "Acer",
    "icon": "💻",
    "discount": "Up to 15% off",
    "category": "Tech",
    "desc": "Acer's student discount program gives verified college students up to 15% off laptops, monitors, and accessories through the Acer Store student portal.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://store.acer.com/en-us/student-discount"
  },
  {
    "brand": "Sam's Club",
    "icon": "🛒",
    "discount": "60% off Club membership",
    "category": "Shopping",
    "desc": "Qualified college students can get 60% off a new Sam's Club membership, or $50 off Sam's Club Plus, through the official student membership offer.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://help.samsclub.com/app/answers/detail/a_id/3938/~/college-students-membership-discount"
  },
  {
    "brand": "JBL",
    "icon": "🔊",
    "discount": "Student discount via JBL Campus",
    "category": "Tech",
    "desc": "JBL Campus gives students exclusive discounts on speakers, headphones, and audio gear after college verification. Solid dorm room upgrade pick.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.jbl.com/campus.html"
  },
  {
    "brand": "Proton",
    "icon": "🔒",
    "discount": "72% off VPN / 62% off Unlimited",
    "category": "Software",
    "desc": "Proton's official student page lists current student pricing for Proton VPN Plus, Proton Unlimited, and Proton Mail Plus.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://proton.me/student"
  },
  {
    "brand": "Razer",
    "icon": "🖥️",
    "discount": "Education pricing",
    "category": "Tech",
    "desc": "Razer's official programs page links to its education program with student discounts on eligible gear and laptops.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.razer.com/store/programs"
  },
  {
    "brand": "Slack",
    "icon": "💬",
    "discount": "85% off Pro or Business+",
    "category": "Software",
    "desc": "Slack for Education gives qualifying student groups and campus organizations 85% off paid Slack plans. Big savings for clubs, project teams, and student-run orgs that need better collaboration tools.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://slack.com/help/articles/206646877-Apply-for-the-Slack-for-Education-discount"
  },
  {
    "brand": "Tommy Hilfiger",
    "icon": "👕",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "Tommy Hilfiger gives verified students 15% off through ID.me. Easy add if you want classic basics, outerwear, or business-casual stuff without paying full price.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://usa.tommy.com/en/id-me.html"
  },
  {
    "brand": "Club Monaco",
    "icon": "🧥",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "Club Monaco offers students 15% off full-price and sale merchandise online and in stores. You can unlock it with a .edu email or show student ID in-store.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.clubmonaco.com/en/student-discount/04152019-student-discount-lp.html"
  },
  {
    "brand": "Calvin Klein",
    "icon": "🩲",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "Calvin Klein gives students 10% off after UNiDAYS verification. Nice add for basics, underwear, denim, and dorm-room essentials from a brand people already know.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.calvinklein.us/en/student-discount"
  },
  {
    "brand": "Champion",
    "icon": "🏆",
    "discount": "10% off",
    "category": "Clothing",
    "desc": "Champion offers students 10% off eligible products through ID.me verification. Clean, simple deal for hoodies, sweats, tees, and gym gear.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.champion.com/student-id"
  },
  {
    "brand": "Ableton Live",
    "icon": "🎛️",
    "discount": "50% off",
    "category": "Software",
    "desc": "Students and teachers can save 50% on new Ableton Live Intro, Standard, or Suite licenses. Big one for music production, beatmaking, and audio classes.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.ableton.com/en/shop/education/"
  },
  {
    "brand": "B&H EDU Advantage",
    "icon": "📷",
    "discount": "10–20% off",
    "category": "Tech",
    "desc": "B&H offers student discounts on a huge range of camera gear, laptops, audio equipment, and creator tools through its free EDU Advantage program.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.bhphotovideo.com/find/eduAdvantage.jsp"
  },
  {
    "brand": "Google AI Pro",
    "icon": "🤖",
    "discount": "Free for 12 months",
    "category": "Software",
    "desc": "Verified college students can get Google AI Pro at no charge for 12 months, including premium Gemini features and Google One student benefits.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://one.google.com/ai-student"
  },
  {
    "brand": "HOKA",
    "icon": "👟",
    "discount": "15% off",
    "category": "Clothing",
    "desc": "HOKA gives students 15% or more off eligible shoes and apparel through ID.me. Nice add for runners, walkers, and anyone who wants comfy everyday sneakers.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://www.hoka.com/en/us/discount-programs/"
  },
  {
    "brand": "Tello",
    "icon": "📱",
    "discount": "Student plans from $5/mo",
    "category": "Tech",
    "desc": "Tello has a student landing page with budget phone plans starting at just $5/month. Good low-cost option for students who want to slash their phone bill.",
    "affiliate": "Direct",
    "commission": "Referral",
    "dealUrl": "https://tello.com/promo/students/"
  }
]);
})();
