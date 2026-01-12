// Seed data keeps the cloned public site functional while the
// Firebase-backed admin tooling is being built. The ContentProvider
// replaces any of these datasets with live Firestore values when
// documents are available inside the respective collections.
export const seedData = {
  siteMeta: {
    organizationName: "GIST Campus",
    tagline: "Powering Great Minds Across Sri Lanka",
    contact: {
      address: "271/1, Osman Road, Sainthamaruthu 07",
      hotline: "070 300 8684\n076 300 8684\n072 300 8684",
      email: "info@gistcampus.com",
    },
    social: [
      { label: "Facebook", href: "" },
      { label: "Instagram", href: "" },
      { label: "LinkedIn", href: "" },
      { label: "YouTube", href: "" },
      { label: "WhatsApp", href: "https://wa.me/94703008684" },
      { label: "TikTok", href: "" },
    ],
  },
  heroSlides: [
    {
      id: "slide-1",
      image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg",
      title: "What is your next education pathway?",
      subtitle: "57 years of empowering Sri Lankan talent through world-class education.",
      ctaLabel: "Explore Programmes",
      ctaTarget: "/#programmes",
    },
    {
      id: "slide-2",
      image: "https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg",
      title: "Powering Great Minds Islandwide",
      subtitle: "8 campuses, 300 lecturers, and 25,000+ students shaping the future.",
      ctaLabel: "Visit Campuses",
      ctaTarget: "/#campuses",
    },
    {
      id: "slide-3",
      image: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg",
      title: "Outcome Based Learning",
      subtitle: "Practical learning experiences that prepare you for global careers.",
      ctaLabel: "Discover OBL",
      ctaTarget: "/#about",
    },
  ],
  stats: {
    years: 57,
    foreignPartnerships: 5,
    professionalPartnerships: 100,
    campuses: 8,
    lecturers: 300,
    students: 25000,
  },
  campuses: [
    {
      id: "colombo",
      name: "Colombo Campus",
      tagline: "Powering Great Minds",
      contact: "+94 11 732 1000",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
    {
      id: "rajagiriya",
      name: "Rajagiriya Campus",
      tagline: "Powering Great Minds",
      contact: "+94 11 792 7000",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
    {
      id: "kandy",
      name: "Kandy Campus",
      tagline: "Enterprising Hearts",
      contact: "+94 70 562 1604",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
    {
      id: "kurunegala",
      name: "Kurunegala Campus",
      tagline: "Home of Inspired Solutions",
      contact: "+94 70 222 2780",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
    {
      id: "galle",
      name: "Galle Campus",
      tagline: "Calibrating the Future of Southerners",
      contact: "+94 77 497 7550",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
    {
      id: "matara",
      name: "Matara Campus",
      tagline: "Calibrating the Future of Southerners",
      contact: "+94 76 097 2550",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
    {
      id: "kirulapone",
      name: "Kirulapone NIC",
      tagline: "Coloring Passionate Lives",
      contact: "+94 11 797 7200",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
    {
      id: "kic",
      name: "Kandy KIC",
      tagline: "Coloring Passionate Lives",
      contact: "+94 70 198 1000",
      image: "https://images.pexels.com/photos/207729/pexels-photo-207729.jpeg",
    },
  ],
  faculties: [
    {
      id: "business",
      title: "School of Business",
      excerpt:
        "Global Business, HR, Marketing, Accounting & Finance, Digital Banking, Agro Entrepreneurship, Event & Tourism Management.",
      heroImage: "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg",
      buttonLabel: "Discover Business",
      url: "https://www.nibm.lk/faculties/school-of-business",
    },
    {
      id: "computing",
      title: "School of Computing",
      excerpt:
        "Software Engineering, Network Engineering, MIS, Multimedia, Full Stack Development, AI, Cybersecurity, Data Analytics.",
      heroImage: "https://images.pexels.com/photos/7869245/pexels-photo-7869245.jpeg",
      buttonLabel: "Explore Computing",
      url: "https://www.nibm.lk/faculties/school-of-computing",
    },
    {
      id: "engineering",
      title: "School of Engineering",
      excerpt:
        "Quantity Surveying, Civil & Construction Management, Electro Mechanical, Mechatronics, Robotics & IoT specialization tracks.",
      heroImage: "https://images.pexels.com/photos/3862135/pexels-photo-3862135.jpeg",
      buttonLabel: "Engineering Pathways",
      url: "https://www.nibm.lk/faculties/school-of-engineering",
    },
    {
      id: "language",
      title: "School of Language",
      excerpt:
        "English Studies, TESOL, Communication, Professional English, and 6+ Global Language Programmes tailored to careers.",
      heroImage: "https://images.pexels.com/photos/278887/pexels-photo-278887.jpeg",
      buttonLabel: "Master Languages",
      url: "https://www.nibm.lk/faculties/school-of-language",
    },
    {
      id: "design",
      title: "School of Design",
      excerpt:
        "Fashion & Interior Design, Creative Industries, Fine Arts, Photography, Sound & Music powered by creative technology labs.",
      heroImage: "https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg",
      buttonLabel: "Design Futures",
      url: "https://www.nibm.lk/faculties/school-of-design",
    },
    {
      id: "humanities",
      title: "School of Humanities",
      excerpt:
        "Psychology, Journalism, International Relations, and Global Languages with international university collaborations.",
      heroImage: "https://images.pexels.com/photos/6279655/pexels-photo-6279655.jpeg",
      buttonLabel: "Explore Humanities",
      url: "https://www.nibm.lk/faculties/school-of-humanities",
    },
    {
      id: "analytics",
      title: "Business Analytics Center",
      excerpt:
        "Industry-focused data science degrees, analytics bootcamps, and executive programmes with global university partners.",
      heroImage: "https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg",
      buttonLabel: "Data & Analytics",
      url: "https://www.nibm.lk/faculties/business-analytics-center",
    },
    {
      id: "productivity",
      title: "Productivity & Quality Center",
      excerpt:
        "Logistics, Supply Chain, Project Management, Industrial Engineering, Quality Management and Lean Six Sigma pathways.",
      heroImage: "https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg",
      buttonLabel: "Productivity Edge",
      url: "https://www.nibm.lk/faculties/productivity-quality-center",
    },
  ],
  programmes: [
    { id: "masters", label: "Masters", description: "Globally recognized postgraduate credentials.", icon: "🎓" },
    { id: "degree", label: "Degree", description: "Undergraduate programmes with UK, AUS, RU partners.", icon: "📘" },
    { id: "hnd", label: "HND", description: "Edexcel & Pearson aligned Higher National Diplomas.", icon: "📗" },
    { id: "diploma", label: "Diploma", description: "Specialized diplomas for career acceleration.", icon: "📙" },
    { id: "adv-cert", label: "Advanced Certificate", description: "Skills-focused advanced certificates.", icon: "📄" },
    { id: "certificate", label: "Certificate", description: "Entry-level programmes for any learner.", icon: "✅" },
    { id: "foundation", label: "Foundation", description: "Bridging programmes that unlock degrees.", icon: "🧩" },
    { id: "workshops", label: "Workshops", description: "Intensive bootcamps and masterclasses.", icon: "⚡" },
  ],
  courses: [
    {
      id: "bsc-digital-marketing",
      slug: "bsc-digital-marketing",
      title: "BSc (Hons) Digital Marketing & Brand Management",
      facultyId: "business",
      programTypeId: "degree",
      duration: "4 Years",
      level: "Degree",
      mode: "Full-time",
      start: "January 2025",
      description:
        "Develop deep expertise in brand building, omni-channel marketing, and consumer analytics with Coventry University.",
      outcomes: [
        "Design omnichannel brand strategies",
        "Leverage analytics to grow digital campaigns",
        "Lead cross-functional brand teams",
      ],
      modules: [
        "Digital Strategy",
        "Brand Management",
        "Consumer Behavior",
        "Social Media Marketing",
        "Data Analytics",
        "Web Development Basics"
      ],
      entryRequirements: [
        "GCE A/L with minimum 3 passes",
        "NIBM foundation or equivalent diploma",
      ],
      fees: "LKR 1,200,000",
      tuition: "Contact our enrollment team",
      brochureUrl: "#",
      heroImage: "https://res.cloudinary.com/ddui7mqsj/image/upload/v1731853454/course-marketing.jpg",
    },
    {
      id: "hnd-software-engineering",
      slug: "hnd-software-engineering",
      title: "HND in Software Engineering",
      facultyId: "computing",
      programTypeId: "hnd",
      duration: "2 Years",
      level: "HND",
      mode: "Full-time / Part-time",
      start: "March 2025",
      description:
        "Hands-on programme covering full-stack development, DevOps, agile delivery, and secure coding practices.",
      outcomes: [
        "Design enterprise applications",
        "Deploy CI/CD pipelines",
        "Collaborate with agile teams",
      ],
      modules: [
        "Programming Fundamentals",
        "Database Design",
        "Web Development",
        "Software Testing",
        "Object Oriented Programming",
        "Data Structures & Algorithms"
      ],
      entryRequirements: [
        "GCE A/L in Maths/Science streams",
        "Diploma pathway via School of Computing",
      ],
      fees: "LKR 450,000",
      tuition: "Contact our enrollment team",
      brochureUrl: "#",
      heroImage: "https://res.cloudinary.com/ddui7mqsj/image/upload/v1731853454/course-software.jpg",
    },
    {
      id: "diploma-psychology",
      slug: "diploma-psychology",
      title: "Diploma in Applied Psychology",
      facultyId: "humanities",
      programTypeId: "diploma",
      duration: "1 Year",
      level: "Diploma",
      mode: "Weekend",
      start: "February 2025",
      description:
        "Immersive exposure to counseling techniques, behavioral science, and community mental health projects.",
      outcomes: [
        "Apply counseling frameworks ethically",
        "Design community outreach programmes",
        "Collaborate with clinical mentors",
      ],
      modules: [
        "Introduction to Psychology",
        "Developmental Psychology",
        "Counseling Skills",
        "Abnormal Psychology",
        "Research Methods"
      ],
      entryRequirements: [
        "GCE O/L with English",
        "Mature entry via interview",
      ],
      fees: "LKR 150,000",
      tuition: "Contact our enrollment team",
      brochureUrl: "#",
      heroImage: "https://res.cloudinary.com/ddui7mqsj/image/upload/v1731853455/course-psychology.jpg",
    },
  ],
  foreignAffiliations: [
    { id: "coventry", country: "United Kingdom", name: "Coventry University" },
    { id: "essex", country: "United Kingdom", name: "University of Essex" },
    { id: "limkokwing", country: "Malaysia", name: "Limkokwing University" },
    { id: "griffith", country: "Australia", name: "Griffith University" },
    { id: "qut", country: "Australia", name: "Queensland University of Technology" },
    { id: "ural", country: "Russia", name: "Ural Federal University" },
  ],
  professionalAffiliations: [
    { id: "cim", name: "Chartered Institute of Marketing" },
    { id: "cmi", name: "Chartered Management Institute" },
    { id: "bcs", name: "British Computer Society" },
    { id: "pmi", name: "Project Management Institute" },
    { id: "six-sigma", name: "Lean Six Sigma Alliance" },
  ],
  newsEvents: [
    {
      id: "codex",
      title: "GIST CodeX 1.0 | IEEEXtreme 19.0",
      date: "2025-10-25",
      description: "Successful completion of GIST CodeX 1.0 at GIST Campus Colombo.",
    },
    {
      id: "brand-talk-7",
      title: "Brand Talk 7.0",
      date: "2025-10-24",
      description: "Digital Marketing & Brand Management students hosted Brand Talk 7.0 featuring Lifebuoy Sri Lanka.",
    },
    {
      id: "brand-talk-9",
      title: "Brand Talk 9.0",
      date: "2025-10-22",
      description: "Industry insights shared by leading brand custodians with GIST students.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      image: "https://images.pexels.com/photos/3912950/pexels-photo-3912950.jpeg?auto=compress&cs=tinysrgb&w=600",
      caption: "Student showcase at GIST Campus IOT Week",
    },
    {
      id: "gallery-2",
      image: "https://images.pexels.com/photos/7869041/pexels-photo-7869041.jpeg?auto=compress&cs=tinysrgb&w=600",
      caption: "Robotics lab demo at School of Engineering",
    },
    {
      id: "gallery-3",
      image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg",
      caption: "Graduation ceremony 2024",
    },
  ],
  testimonials: [
    {
      id: "alumni-1",
      name: "Shehani Perera",
      programme: "BSc (Hons) Business Management",
      quote:
        "Outcome-based learning, mentoring, and the strong alumni network at GIST Campus helped me secure a regional marketing role immediately after graduation.",
      avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg",
    },
  ],
  certificates: [
    {
      certificateNo: "GIST-2024-001",
      studentName: "Dinesh Fernando",
      programme: "BSc (Hons) Digital Marketing",
      year: "2024",
    },
    {
      certificateNo: "GIST-2024-045",
      studentName: "Ayesha Ranasinghe",
      programme: "HND in Software Engineering",
      year: "2024",
    },
  ],
};

