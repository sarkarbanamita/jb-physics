import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting JB Physics database seed...');

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123physics', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jbphysics.com' },
    update: {},
    create: {
      name: 'JB Physics Creator',
      email: 'admin@jbphysics.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      streakCount: 5,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@jbphysics.com' },
    update: {},
    create: {
      name: 'Rohan Banerjee',
      email: 'student@jbphysics.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      streakCount: 3,
    },
  });

  console.log('✅ Created users:', admin.email, student.email);

  // 2. Create Chapters
  const ch1 = await prisma.chapter.upsert({
    where: { slug: 'electrostatics' },
    update: {},
    create: {
      titleEn: 'Unit 1: Electrostatics',
      titleBn: 'অধ্যায় ১: স্থির তড়িৎ ও ক্ষেত্র',
      slug: 'electrostatics',
      descriptionEn: 'Electric charges, Coulomb law, electric fields, Gauss theorem, electric flux, electrostatic potential, and capacitors.',
      descriptionBn: 'তড়িৎ আধান, কুলম্বের সূত্র, তড়িৎক্ষেত্র, গাউসের উপপাদ্য, তড়িৎ ফ্লাক্স, স্থির-তড়িৎ বিভব এবং ধারক ও ধারকত্ব।',
      orderIndex: 1,
      icon: 'Atom',
      isPublished: true,
      topics: {
        create: [
          { titleEn: 'Coulomb Law & Field', titleBn: 'কুলম্বের সূত্র ও ক্ষেত্র', slug: 'coulomb-law', orderIndex: 1 },
          { titleEn: 'Gauss Law & Flux', titleBn: 'গাউসের সূত্র ও ফ্লাক্স', slug: 'gauss-flux', orderIndex: 2 },
          { titleEn: 'Capacitance & Dielectrics', titleBn: 'ধারকত্ব ও পরাবৈদ্যুতিক মাধ্যম', slug: 'capacitance', orderIndex: 3 },
        ],
      },
    },
  });

  const ch2 = await prisma.chapter.upsert({
    where: { slug: 'current-electricity' },
    update: {},
    create: {
      titleEn: 'Unit 2: Current Electricity',
      titleBn: 'অধ্যায় ২: প্রবাহী তড়িৎ',
      slug: 'current-electricity',
      descriptionEn: 'Electric current, drift velocity, Ohm law, resistivity, temperature dependence, Kirchhoff laws, potentiometer, and meters.',
      descriptionBn: 'তড়িৎপ্রবাহ, বিচলন বেগ, ওহমের সূত্র, রোধাঙ্ক, তাপমাত্রা নির্ভরতা, কার্শফের সূত্রাবলী, পোটেনশিওমিটার এবং মিটার।',
      orderIndex: 2,
      icon: 'Zap',
      isPublished: true,
      topics: {
        create: [
          { titleEn: 'Ohm Law & Drift Velocity', titleBn: 'ওহমের সূত্র ও বিচলন বেগ', slug: 'drift-velocity', orderIndex: 1 },
          { titleEn: 'Kirchhoff Laws & Circuits', titleBn: 'কার্শফের সূত্র ও বর্তনী', slug: 'kirchhoff-laws', orderIndex: 2 },
          { titleEn: 'Measuring Instruments', titleBn: 'পরিমাপক যন্ত্র ও মিটার', slug: 'meters', orderIndex: 3 },
        ],
      },
    },
  });

  const ch3 = await prisma.chapter.upsert({
    where: { slug: 'magnetism' },
    update: {},
    create: {
      titleEn: 'Unit 3: Magnetic Effects of Current & Magnetism',
      titleBn: 'অধ্যায় ৩: তড়িৎপ্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব',
      slug: 'magnetism',
      descriptionEn: 'Biot-Savart law, Ampere circuital law, solenoid, Lorentz force, magnetic dipole, Earth magnetism, and magnetic materials.',
      descriptionBn: 'বায়ো-সাভার্ট সূত্র, অ্যাম্পিয়ারের সূত্র, সলিনয়েড, লরেঞ্জ বল, চৌম্বক দ্বিমেরু, ভূ-চুম্বকত্ব এবং চৌম্বক পদার্থ।',
      orderIndex: 3,
      icon: 'Compass',
      isPublished: true,
      topics: {
        create: [
          { titleEn: 'Biot-Savart & Ampere Law', titleBn: 'বায়ো-সাভার্ট ও অ্যাম্পিয়ারের সূত্র', slug: 'biot-savart', orderIndex: 1 },
          { titleEn: 'Magnetic Forces on Currents', titleBn: 'তড়িৎপ্রবাহের উপর চৌম্বক বল', slug: 'magnetic-force', orderIndex: 2 },
          { titleEn: 'Earth Magnetism & Matter', titleBn: 'ভূ-চুম্বকত্ব ও পদার্থ', slug: 'earth-magnetism', orderIndex: 3 },
        ],
      },
    },
  });

  console.log('✅ Created chapters:', ch1.slug, ch2.slug, ch3.slug);

  // 3. Create Questions
  const questionsData = [
    {
      code: 'WB12-CH01-Q001',
      chapterId: ch1.id,
      difficulty: 'MEDIUM',
      questionEn: 'The electric field in a region is $\\vec{E} = (3\\hat{i} - 4\\hat{j} + 2\\hat{k})\\text{ V/m}$. The electric flux passing through a square region of side $2\\text{ m}$ situated in the $YZ$-plane in that region is:',
      questionBn: 'কোনো অঞ্চলে ক্রিয়াশীল তড়িৎক্ষেত্র হল $\\vec{E} = (3\\hat{i} - 4\\hat{j} + 2\\hat{k})\\text{ V/m}$; ওই অঞ্চলে $YZ$-তলে অবস্থিত $2\\text{ m}$ বাহুবিশিষ্ট বর্গাকার ক্ষেত্রের মধ্য দিয়ে অতিক্রান্ত তড়িৎ ফ্লাক্স হল—',
      optionA_En: '$12\\text{ V}\\cdot\\text{m}$',
      optionA_Bn: '$12\\text{ V}\\cdot\\text{m}$',
      optionB_En: '$6\\text{ V}\\cdot\\text{m}$',
      optionB_Bn: '$6\\text{ V}\\cdot\\text{m}$',
      optionC_En: '$-16\\text{ V}\\cdot\\text{m}$',
      optionC_Bn: '$-16\\text{ V}\\cdot\\text{m}$',
      optionD_En: '$8\\text{ V}\\cdot\\text{m}$',
      optionD_Bn: '$8\\text{ V}\\cdot\\text{m}$',
      correctOption: 'A',
      explanationEn: 'For a planar square in the $YZ$-plane, its area normal vector points perpendicular to the plane along the $+X$ axis: $\\vec{A} = (\\text{side})^2 \\hat{i} = (2 \\times 2)\\hat{i} = 4\\hat{i}\\text{ m}^2$.\n\nElectric flux is the scalar dot product:\n$$\\Phi = \\vec{E} \\cdot \\vec{A} = (3\\hat{i} - 4\\hat{j} + 2\\hat{k}) \\cdot 4\\hat{i} = (3 \\times 4) + 0 + 0 = 12\\text{ V}\\cdot\\text{m}$$\nNotice that the $Y$ and $Z$ components of the electric field graze parallel to the surface without crossing it!',
      explanationBn: '$YZ$-তলে অবস্থিত বর্গাকার ক্ষেত্রের ক্ষেত্রফল ভেক্টর $\\vec{A}$ তলের সঙ্গে লম্বভাবে $+X$ অক্ষ বরাবর ক্রিয়াশীল: $\\vec{A} = (\\text{বাহু})^2 \\hat{i} = (2 \\times 2)\\hat{i} = 4\\hat{i}\\text{ m}^2$।\n\nতড়িৎ ফ্লাক্স হল স্কেলার ডট গুণফল:\n$$\\Phi = \\vec{E} \\cdot \\vec{A} = (3\\hat{i} - 4\\hat{j} + 2\\hat{k}) \\cdot 4\\hat{i} = 3 \\times 4 = 12\\text{ V}\\cdot\\text{m}$$\nলক্ষণীয় যে তড়িৎক্ষেত্রের $Y$ এবং $Z$ উপাংশগুলি তলের সমান্তরালে থাকায় তল ভেদ করে না, তাই এদের অবদান শূন্য।',
      formula: '\\Phi = \\vec{E} \\cdot \\vec{A}',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 45,
      simulationType: 'ELECTRIC_FLUX_3D',
      simulationParams: JSON.stringify({ fieldVector: [3, -4, 2], plane: 'YZ', side: 2 }),
      isQuestionOfDay: true,
      isPublished: true,
    },
    {
      code: 'WB12-CH01-Q002',
      chapterId: ch1.id,
      difficulty: 'MEDIUM',
      questionEn: 'The dielectric constant of the medium between the plates of a parallel plate capacitor is $k_1 = 2$, with capacitance $3\\,\\mu\\text{F}$. If the distance between the plates is doubled and filled with a dielectric medium of $k_2 = 4$, the new capacitance will be:',
      questionBn: 'একটি সমান্তরাল পাতধারকের পাতদ্বয়ের মধ্যবর্তী মাধ্যমের পরাবৈদ্যুতিক ধ্রুবক $2$। এর ধারকত্ব $3\\,\\mu\\text{F}$। এখন, ধারকটির পাতদ্বয়ের মধ্যবর্তী দূরত্ব দ্বিগুণ করে, ওই ফাঁকা স্থানে $k = 4$ পরাবৈদ্যুতিক ধ্রুবকসম্পন্ন প্লেট প্রবেশ করানো হল। এখন ধারকটির ধারকত্ব হবে—',
      optionA_En: '$1\\,\\mu\\text{F}$',
      optionA_Bn: '$1\\,\\mu\\text{F}$',
      optionB_En: '$2\\,\\mu\\text{F}$',
      optionB_Bn: '$2\\,\\mu\\text{F}$',
      optionC_En: '$3\\,\\mu\\text{F}$',
      optionC_Bn: '$3\\,\\mu\\text{F}$',
      optionD_En: '$6\\,\\mu\\text{F}$',
      optionD_Bn: '$6\\,\\mu\\text{F}$',
      correctOption: 'C',
      explanationEn: 'The capacitance of a dielectric-filled parallel plate capacitor is given by $C = \\frac{k \\varepsilon_0 A}{d}$.\n\nInitially: $C_1 = \\frac{2 \\varepsilon_0 A}{d} = 3\\,\\mu\\text{F} \\implies \\frac{\\varepsilon_0 A}{d} = 1.5\\,\\mu\\text{F}$.\n\nWhen distance is doubled ($d\' = 2d$) and dielectric constant $k_2 = 4$:\n$$C_2 = \\frac{k_2 \\varepsilon_0 A}{d\'} = \\frac{4 \\varepsilon_0 A}{2d} = 2 \\times \\left(\\frac{\\varepsilon_0 A}{d}\\right) = 2 \\times 1.5\\,\\mu\\text{F} = 3\\,\\mu\\text{F}$$',
      explanationBn: 'পরাবৈদ্যুতিক মাধ্যমযুক্ত সমান্তরাল পাতধারকের ধারকত্ব $C = \\frac{k \\varepsilon_0 A}{d}$।\n\nপ্রাথমিকভাবে: $C_1 = \\frac{2 \\varepsilon_0 A}{d} = 3\\,\\mu\\text{F} \\implies \\frac{\\varepsilon_0 A}{d} = 1.5\\,\\mu\\text{F}$।\n\nএখন দূরত্ব দ্বিগুণ ($d\' = 2d$) এবং পরাবৈদ্যুতিক ধ্রুবক $k_2 = 4$ হলে:\n$$C_2 = \\frac{4 \\varepsilon_0 A}{2d} = 2 \\times \\left(\\frac{\\varepsilon_0 A}{d}\\right) = 2 \\times 1.5 = 3\\,\\mu\\text{F}$$',
      formula: 'C = \\frac{k \\varepsilon_0 A}{d}',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 120,
      simulationType: 'CAPACITOR_DIELECTRIC',
      simulationParams: JSON.stringify({ initialDielectric: 2, finalDielectric: 4, initialDistance: 2 }),
      isQuestionOfDay: false,
      isPublished: true,
    },
    {
      code: 'WB12-CH01-Q003',
      chapterId: ch1.id,
      difficulty: 'HARD',
      questionEn: 'Two conductors $X$ and $Y$ have capacitances $3C$ and $C$ respectively. A charge $Q$ is given to conductor $X$, which is then shared with conductor $Y$. The ratio of total electrostatic energy after sharing to total initial energy will be:',
      questionBn: 'দুটি পরিবাহী $X$ এবং $Y$-এর ধারকত্ব যথাক্রমে $3C$ এবং $C$। পরিবাহী $X$-এ $Q$ আধান দেওয়া হল যা পরিবাহীটি $Y$-এর সঙ্গে ভাগ করে নেয়। ভাগ হওয়ার পরে মোট শক্তি এবং মোট প্রাথমিক শক্তির অনুপাত হবে—',
      optionA_En: '$9:16$',
      optionA_Bn: '$9:16$',
      optionB_En: '$\\sqrt{3}:2$',
      optionB_Bn: '$\\sqrt{3}:2$',
      optionC_En: '$3:4$',
      optionC_Bn: '$3:4$',
      optionD_En: '$4:3$',
      optionD_Bn: '$4:3$',
      correctOption: 'C',
      explanationEn: 'Initial energy of conductor $X$: $U_i = \\frac{Q^2}{2(3C)} = \\frac{Q^2}{6C}$.\n\nAfter connecting in parallel, the total capacitance is $C_{\\text{total}} = 3C + C = 4C$. Total charge remains conserved ($Q$).\n\nFinal energy: $U_f = \\frac{Q^2}{2(4C)} = \\frac{Q^2}{8C}$.\n\nRatio:\n$$\\frac{U_f}{U_i} = \\frac{Q^2/(8C)}{Q^2/(6C)} = \\frac{6}{8} = \\frac{3}{4}$$',
      explanationBn: 'প্রাথমিক অবস্থায় $X$-এর সঞ্চিত শক্তি: $U_i = \\frac{Q^2}{2(3C)} = \\frac{Q^2}{6C}$।\n\nযুক্ত করার পর মোট ধারকত্ব: $C_{\\text{total}} = 3C + C = 4C$। আধানের সংরক্ষণ অনুযায়ী মোট আধান অপরিবর্তিত থাকে ($Q$)।\n\nচূড়ান্ত মোট শক্তি: $U_f = \\frac{Q^2}{2(4C)} = \\frac{Q^2}{8C}$।\n\nঅনুপাত:\n$$\\frac{U_f}{U_i} = \\frac{Q^2/8C}{Q^2/6C} = \\frac{6}{8} = \\frac{3}{4}$$',
      formula: 'U = \\frac{Q^2}{2C}',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 180,
      simulationType: null,
      isPublished: true,
    },
    {
      code: 'WB12-CH02-Q004',
      chapterId: ch2.id,
      difficulty: 'MEDIUM',
      questionEn: 'A potential difference $V$ is applied across the ends of a conductor of length $l$ and area $A$.\nStatement I: If $V$ is doubled, current density will be doubled.\nStatement II: If $V$ is doubled, drift velocity will become half.\nStatement III: If area $A$ is doubled, current density will decrease.\nWhich statement(s) is/are correct?',
      questionBn: '$l$ দৈর্ঘ্যবিশিষ্ট ও $A$ প্রস্থচ্ছেদবিশিষ্ট পরিবাহীর দু-প্রান্তে $V$ বিভবপ্রভেদ প্রয়োগ করা হল।\nবিবৃতি I: বিভবপ্রভেদ দ্বিগুণ করা হলে তড়িৎপ্রবাহ ঘনত্ব দ্বিগুণ হবে।\nবিবৃতি II: বিভবপ্রভেদ দ্বিগুণ করা হলে বিচলন বেগ অর্ধেক হয়ে যাবে।\nবিবৃতি III: প্রস্থচ্ছেদ দ্বিগুণ করা হলে তড়িৎপ্রবাহ ঘনত্ব কমে যাবে।\nকোন বিবৃতিটি সঠিক?',
      optionA_En: 'I and II are correct',
      optionA_Bn: 'I এবং II সঠিক',
      optionB_En: 'Only I is correct',
      optionB_Bn: 'কেবলমাত্র I সঠিক',
      optionC_En: 'Only III is correct',
      optionC_Bn: 'কেবলমাত্র III সঠিক',
      optionD_En: 'II and III are correct',
      optionD_Bn: 'II এবং III সঠিক',
      correctOption: 'B',
      explanationEn: 'Current density $j = \\sigma E = \\sigma \\frac{V}{l}$.\n- Since $j \\propto V$, doubling $V$ doubles $j$. (Statement I is CORRECT)\n- Drift velocity $v_d = \\mu E = \\mu \\frac{V}{l} \\implies v_d \\propto V$, so doubling $V$ doubles drift velocity, NOT halved. (Statement II is WRONG)\n- Current density $j = \\sigma V/l$ does not depend on area $A$ for a constant potential gradient $V/l$. (Statement III is WRONG)\nThus, only Statement I is correct.',
      explanationBn: 'তড়িৎপ্রবাহ ঘনত্ব $j = \\sigma E = \\sigma \\frac{V}{l}$।\n- যেহেতু $j \\propto V$, বিভবপ্রভেদ দ্বিগুণ করলে প্রবাহ ঘনত্ব দ্বিগুণ হবে। (বিবৃতি I সঠিক)\n- বিচলন বেগ $v_d = \\mu \\frac{V}{l} \\implies v_d \\propto V$, তাই $V$ দ্বিগুণ করলে $v_d$-ও দ্বিগুণ হবে। (বিবৃতি II ভুল)\n- স্থির বিভব পার্থক্যের ক্ষেত্রে প্রবাহ ঘনত্ব $j$ পরিবাহীর ক্ষেত্রফল $A$-এর উপর নির্ভর করে না। (বিবৃতি III ভুল)',
      formula: 'j = \\sigma E = \\sigma \\frac{V}{l}',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 240,
      simulationType: null,
      isPublished: true,
    },
    {
      code: 'WB12-CH02-Q005',
      chapterId: ch2.id,
      difficulty: 'EASY',
      questionEn: 'A wire of length $l$ has resistance $R$. The wire is stretched uniformly until its length becomes $x$ times the initial length. The new resistance of the wire will be:',
      questionBn: 'ধরা যাক $l$ দৈর্ঘ্যবিশিষ্ট একটি তারের রোধ হল $R$। এখন তারটিকে ততক্ষণ টানা হল যতক্ষণ না তারটির দৈর্ঘ্য পূর্বের $x$ গুণ হয়। এখন তারটির রোধ হবে—',
      optionA_En: '$x^2 R$',
      optionA_Bn: '$x^2 R$',
      optionB_En: '$x R$',
      optionB_Bn: '$x R$',
      optionC_En: '$\\dfrac{R}{x}$',
      optionC_Bn: '$\\dfrac{R}{x}$',
      optionD_En: '$R$',
      optionD_Bn: '$R$',
      correctOption: 'A',
      explanationEn: 'When a wire is stretched, its volume $V = A \\cdot l$ remains constant. Therefore, when length becomes $l\' = x \\cdot l$, cross-sectional area becomes $A\' = \\frac{A}{x}$.\n\nNew resistance:\n$$R\' = \\rho \\frac{l\'}{A\'} = \\rho \\frac{x l}{A / x} = x^2 \\left(\\rho \\frac{l}{A}\\right) = x^2 R$$',
      explanationBn: 'তারকে টানলে তার আয়তন $V = A \\cdot l$ ধ্রুবক থাকে। সুতরাং দৈর্ঘ্য $l\' = x l$ হলে প্রস্থচ্ছেদ $A\' = \\frac{A}{x}$ হয়ে যাবে।\n\nনতুন রোধ:\n$$R\' = \\rho \\frac{l\'}{A\'} = \\rho \\frac{x l}{A/x} = x^2 \\left(\\rho \\frac{l}{A}\\right) = x^2 R$$',
      formula: 'R\' = x^2 R',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 300,
      simulationType: null,
      isPublished: true,
    },
    {
      code: 'WB12-CH03-Q006',
      chapterId: ch3.id,
      difficulty: 'EASY',
      questionEn: "According to Ampere's circuital law, for an ideal long solenoid, the magnetic field strength $B$ on its axis and its radius $r$ are related as:",
      questionBn: 'অ্যাম্পিয়ারের বর্তনী সূত্র অনুযায়ী একটি আদর্শ সলিনয়েডের অক্ষে চৌম্বক ক্ষেত্রপ্রাবল্য $B$ এবং এর ব্যাসার্ধ $r$ হলে—',
      optionA_En: '$B \\propto r$',
      optionA_Bn: '$B \\propto r$',
      optionB_En: '$B \\propto \\dfrac{1}{r}$',
      optionB_Bn: '$B \\propto \\dfrac{1}{r}$',
      optionC_En: '$B \\propto \\dfrac{1}{r^2}$',
      optionC_Bn: '$B \\propto \\dfrac{1}{r^2}$',
      optionD_En: '$B$ is independent of $r$',
      optionD_Bn: '$B$, $r$-এর নিরপেক্ষ',
      correctOption: 'D',
      explanationEn: 'The magnetic field inside an ideal long solenoid is given by $B = \\mu_0 n I$, where $n$ is the number of turns per unit length and $I$ is the current. This magnetic field is uniform and completely independent of the radius $r$ of the solenoid.',
      explanationBn: 'আদর্শ দীর্ঘ সলিনয়েডের অভ্যন্তরে অক্ষ বরাবর চৌম্বক ক্ষেত্র $B = \\mu_0 n I$, যেখানে $n$ হল একক দৈর্ঘ্যে পাকসংখ্যা এবং $I$ হল প্রবাহমাত্রা। এই মান সলিনয়েডের ব্যাসার্ধ $r$-এর উপর মোটেই নির্ভর করে না ($B$ ব্যাসার্ধ নিরপেক্ষ)।',
      formula: 'B = \\mu_0 n I',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 360,
      simulationType: null,
      isPublished: true,
    },
    {
      code: 'WB12-CH03-Q007',
      chapterId: ch3.id,
      difficulty: 'MEDIUM',
      questionEn: 'The resistance of a voltmeter is $300\\,\\Omega$. It can measure a maximum voltage of $150\\text{ V}$. To convert this instrument into an ammeter capable of measuring currents up to $8\\text{ A}$, the required resistance to be connected is:',
      questionBn: 'একটি ভোল্টমিটারের রোধ $300\\,\\Omega$। যন্ত্রটি $150\\text{ V}$ সর্বোচ্চ বিভবপার্থক্য পরিমাপ করতে পারে। যন্ত্রটিকে $8\\text{ A}$ পর্যন্ত প্রবাহমাত্রা মাপার উপযুক্ত অ্যামিটারে পরিণত করতে হলে যে রোধ যুক্ত করতে হবে, তা হল—',
      optionA_En: '$20\\,\\Omega$, in parallel',
      optionA_Bn: '$20\\,\\Omega$, সমান্তরালে',
      optionB_En: '$20\\,\\Omega$, in series',
      optionB_Bn: '$20\\,\\Omega$, শ্রেণিতে',
      optionC_En: '$30\\,\\Omega$, in parallel',
      optionC_Bn: '$30\\,\\Omega$, সমান্তরালে',
      optionD_En: '$40\\,\\Omega$, in series',
      optionD_Bn: '$40\\,\\Omega$, শ্রেণিতে',
      correctOption: 'A',
      explanationEn: 'Full scale deflection current of the voltmeter coil:\n$$I_g = \\frac{V_g}{R_g} = \\frac{150\\text{ V}}{300\\,\\Omega} = 0.5\\text{ A}$$\nTo convert into an ammeter measuring $I = 8\\text{ A}$, we connect a shunt resistor $S$ in parallel:\n$$S = \\frac{I_g R_g}{I - I_g} = \\frac{0.5 \\times 300}{8 - 0.5} = \\frac{150}{7.5} = 20\\,\\Omega\\text{ in parallel}$$',
      explanationBn: 'ভোল্টমিটারের সর্বোচ্চ প্রবাহমাত্রা:\n$$I_g = \\frac{V_g}{R_g} = \\frac{150}{300} = 0.5\\text{ A}$$\n$8\\text{ A}$ প্রবাহ মাপার অ্যামিটারে রূপান্তর করতে সমান্তরালে শান্ট $S$ যুক্ত করতে হবে:\n$$S = \\frac{I_g R_g}{I - I_g} = \\frac{0.5 \\times 300}{8 - 0.5} = \\frac{150}{7.5} = 20\\,\\Omega\\text{ সমান্তরালে}$$',
      formula: 'S = \\frac{I_g R_g}{I - I_g}',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 420,
      simulationType: null,
      isPublished: true,
    },
    {
      code: 'WB12-CH03-Q008',
      chapterId: ch3.id,
      difficulty: 'MEDIUM',
      questionEn: 'A current $i$ flows through a semicircular wire of radius $a$ connected to two straight wires along the diameter line. The magnetic field at the center $O$ of the semicircle is:',
      questionBn: 'অর্ধবৃত্তাকার পরিবাহীর ক্ষেত্রে: $a$ ব্যাসার্ধের অর্ধবৃত্তের কেন্দ্রবিন্দু $O$-তে চৌম্বক ক্ষেত্র কত হবে (প্রবাহমাত্রা $i$)?',
      optionA_En: '$\\dfrac{\\mu_0 i}{2a}$',
      optionA_Bn: '$\\dfrac{\\mu_0 i}{2a}$',
      optionB_En: '$\\dfrac{\\mu_0 i}{2\\pi a}$',
      optionB_Bn: '$\\dfrac{\\mu_0 i}{2\\pi a}$',
      optionC_En: 'Zero',
      optionC_Bn: 'শূন্য',
      optionD_En: '$\\dfrac{\\mu_0 i}{4a}$',
      optionD_Bn: '$\\dfrac{\\mu_0 i}{4a}$',
      correctOption: 'D',
      explanationEn: 'The magnetic field due to a full circular loop at its center is $B = \\frac{\\mu_0 i}{2a}$. For a semicircle, it is exactly half:\n$$B_{\\text{semi}} = \\frac{1}{2} \\left(\\frac{\\mu_0 i}{2a}\\right) = \\frac{\\mu_0 i}{4a}$$\nThe two straight wire segments lie along the line passing through point $O$, so their contribution according to Biot-Savart law ($\\sin 0^\\circ = 0$) is zero.',
      explanationBn: 'সম্পূর্ণ বৃত্তাকার লুপের কেন্দ্রে চৌম্বক ক্ষেত্র $B = \\frac{\\mu_0 i}{2a}$। অতএব অর্ধবৃত্তাকার অংশের জন্য:\n$$B_{\\text{semi}} = \\frac{1}{2} \\left(\\frac{\\mu_0 i}{2a}\\right) = \\frac{\\mu_0 i}{4a}$$\nসোজা তার দুটি কেন্দ্রবিন্দু $O$-এর সরলরেখায় অবস্থিত হওয়ায় বায়ো-সাভার্ট সূত্র অনুযায়ী তাদের জন্য কেন্দ্রে চৌম্বক ক্ষেত্র শূন্য।',
      formula: 'B = \\frac{\\mu_0 i}{4a}',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 480,
      simulationType: null,
      isPublished: true,
    },
    {
      code: 'WB12-CH03-Q009',
      chapterId: ch3.id,
      difficulty: 'EASY',
      questionEn: "At a certain place, the vertical component of Earth's magnetic field is twice the horizontal component ($B_v = 2 B_h$). If the angle of dip at that place is $\\theta$, the value of $\\tan\\theta$ is:",
      questionBn: 'কোনো একস্থানে পৃথিবীর চৌম্বক ক্ষেত্রের উল্লম্ব উপাংশ অনুভূমিক উপাংশের দ্বিগুণ ($B_v = 2 B_h$)। ওই স্থানে বিনতি কোণ $\\theta$ হলে, $\\tan\\theta$-এর মান হবে—',
      optionA_En: '$2$',
      optionA_Bn: '$2$',
      optionB_En: '$\\dfrac{1}{2}$',
      optionB_Bn: '$\\dfrac{1}{2}$',
      optionC_En: '$\\dfrac{1}{\\sqrt{3}}$',
      optionC_Bn: '$\\dfrac{1}{\\sqrt{3}}$',
      optionD_En: '$\\sqrt{3}$',
      optionD_Bn: '$\\sqrt{3}$',
      correctOption: 'A',
      explanationEn: 'The angle of dip $\\theta$ is related to the vertical and horizontal components of Earth\'s magnetic field by:\n$$\\tan\\theta = \\frac{B_v}{B_h}$$\nGiven $B_v = 2 B_h$, we have:\n$$\\tan\\theta = \\frac{2 B_h}{B_h} = 2$$',
      explanationBn: 'বিনতি কোণ $\\theta$-এর সূত্র হল:\n$$\\tan\\theta = \\frac{B_v}{B_h}$$\nযেহেতু উল্লম্ব উপাংশ অনুভূমিক উপাংশের দ্বিগুণ ($B_v = 2 B_h$):\n$$\\tan\\theta = \\frac{2 B_h}{B_h} = 2$$',
      formula: '\\tan\\theta = \\frac{B_v}{B_h}',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 540,
      simulationType: null,
      isPublished: true,
    },
    {
      code: 'WB12-CH03-Q010',
      chapterId: ch3.id,
      difficulty: 'EASY',
      questionEn: 'A square coil of side $1\\text{ m}$ and resistance $1\\,\\Omega$ is placed in a uniform magnetic field of $0.5\\text{ T}$. If the plane of the coil is perpendicular to the magnetic field, the magnetic flux through the coil is:',
      questionBn: '$1\\text{ m}$ বাহু এবং $1\\,\\Omega$ রোধবিশিষ্ট একটি বর্গাকার কুণ্ডলীকে $0.5\\text{ T}$ চৌম্বক ক্ষেত্রে রাখা আছে। যদি কুণ্ডলীর তল চৌম্বক ক্ষেত্রের অভিমুখের সঙ্গে লম্ব হয়, তাহলে কুণ্ডলীর মধ্যে দিয়ে চৌম্বক প্রবাহ হবে—',
      optionA_En: '$0.5\\text{ weber}$',
      optionA_Bn: '$0.5\\text{ weber}$',
      optionB_En: '$1\\text{ weber}$',
      optionB_Bn: '$1\\text{ weber}$',
      optionC_En: '$0\\text{ weber}$',
      optionC_Bn: '$0\\text{ weber}$',
      optionD_En: '$2\\text{ weber}$',
      optionD_Bn: '$2\\text{ weber}$',
      correctOption: 'A',
      explanationEn: 'Area of the square coil: $A = 1\\text{ m} \\times 1\\text{ m} = 1\\text{ m}^2$.\nWhen the plane of the coil is perpendicular to the magnetic field, the area normal vector is parallel to $\\vec{B}$ (i.e. angle $\\theta = 0^\\circ$).\nMagnetic flux:\n$$\\Phi = B A \\cos(0^\\circ) = 0.5\\text{ T} \\times 1\\text{ m}^2 \\times 1 = 0.5\\text{ Wb}$$',
      explanationBn: 'বর্গাকার কুণ্ডলীর ক্ষেত্রফল $A = 1 \\times 1 = 1\\text{ m}^2$।\nকুণ্ডলীর তল চৌম্বক ক্ষেত্রের সঙ্গে লম্ব হলে ক্ষেত্রফল ভেক্টর $\\vec{A}$ ও $\\vec{B}$-এর মধ্যবর্তী কোণ $\\theta = 0^\\circ$ হয়।\nচৌম্বক ফ্লাক্স:\n$$\\Phi = B A \\cos(0^\\circ) = 0.5 \\times 1 = 0.5\\text{ Weber}$$',
      formula: '\\Phi = B A \\cos\\theta',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeTimestamp: 600,
      simulationType: null,
      isPublished: true,
    },
  ];

  for (const q of questionsData) {
    await prisma.question.upsert({
      where: { code: q.code },
      update: q,
      create: q,
    });
  }

  console.log(`✅ Seeded ${questionsData.length} authentic bilingual physics questions`);

  // 4. Create Practice Test
  const electrostaticsQuestions = await prisma.question.findMany({
    where: { chapterId: ch1.id },
  });

  const test = await prisma.test.upsert({
    where: { id: 'test-electrostatics-01' },
    update: {},
    create: {
      id: 'test-electrostatics-01',
      chapterId: ch1.id,
      titleEn: 'Class 12 Physics — Electrostatics Practice Test',
      titleBn: 'দ্বাদশ শ্রেণি পদার্থবিদ্যা — স্থির তড়িৎ মক টেস্ট',
      durationMinutes: 15,
      totalMarks: electrostaticsQuestions.length,
      testQuestions: {
        create: electrostaticsQuestions.map((q, idx) => ({
          questionId: q.id,
          orderIndex: idx,
        })),
      },
    },
  });

  console.log('✅ Created mock practice test:', test.titleEn);
  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
