// Hero
import InstagramLineIcon from 'remixicon-react/InstagramLineIcon'
import FacebookCircleLineIcon from 'remixicon-react/FacebookCircleLineIcon'
import DribbbleLineIcon from 'remixicon-react/DribbbleLineIcon'
import LinkedinBoxLineIcon from 'remixicon-react/LinkedinBoxLineIcon';
import YoutubeLineIcon from 'remixicon-react/YoutubeLineIcon'
import GithubLineIcon from 'remixicon-react/GithubLineIcon'

const icons = [
  { component: <InstagramLineIcon />, key: 'instagram' },
  { component: <FacebookCircleLineIcon />, key: 'facebook' },
  // { component: <DribbbleLineIcon />, key: 'dribbble' },
  { component: <LinkedinBoxLineIcon />, key: 'linkedin' },
  { component: <YoutubeLineIcon />, key: 'youtube' },
  { component: <GithubLineIcon />, key: 'github' },
];

export const heroIcons = icons.map(icon => (
  <div key={icon.key}>
    {icon.component}
  </div>
));

// AboutMe icons
import GithubFillIcon from 'remixicon-react/GithubFillIcon'
import Projector2LineIcon from 'remixicon-react/Projector2LineIcon'
import GroupLineIcon from 'remixicon-react/GroupLineIcon'
import AwardFillIcon from 'remixicon-react/AwardFillIcon'

export const aboutData = [
  {
    title: 'Github Repos',
    amount: 27,
    icon: <GithubFillIcon />,
  },
  {
    title: 'Successful Projects',
    amount: 10,
    icon: <Projector2LineIcon />,
  },
  {
    title: 'Awards and Recognition',
    amount: 6,
    icon: <AwardFillIcon />,
  },
]

import DownloadLineIcon from 'remixicon-react/DownloadLineIcon'
import ArrowLeftSFillIcon from 'remixicon-react/ArrowLeftSFillIcon'

export const downloadIcon = <DownloadLineIcon />
export const arrowLeftIcon = <ArrowLeftSFillIcon />

export const aboutText =
  " Hi, I’m an enthusiastic recent graduate with a Bachelor's degree in Computer Science and Engineering. I enjoy working with Python and Java, and I specialize in developing web applications using Django. I am also passionate about learning the latest advancements in AI. Throughout my academic journey, I have cultivated strong discipline, punctuality, and a commitment to hard work. I've developed the ability to perform well under pressure and consistently prioritize quality over quantity. I thrive in environments that challenge me and allow me to demonstrate my skills through competitive assessments."
// End of AboutMe icons

// Skills
export const skillsData = [
  
  {
    name: 'HTML',
    icon: '/skills/html.png',
  },
  {
    name: 'CSS',
    icon: '/skills/css.png',
  },
  {
    name: 'JavaScript',
    icon: '/skills/js.png',
  },
  {
    name: 'TailwindCSS',
    icon: '/skills/tailwind.png',
  },
  // {
  //   name: 'Vite',
  //   icon: '/skills/vite.png',
  // },
  // {
  //   name: 'ReactJS',
  //   icon: '/skills/react.png',
  // },
  // {
  //   name: 'TypeScript',
  //   icon: '/skills/ts.png',
  // },
  {
    name: 'AI',
    icon: '/skills/ai.png',
  },
  {
    name: 'Framer Motion',
    icon: '/skills/framer.png',
  },
  // {
  //   name: 'ThreeJS',
  //   icon: '/skills/threejs.png',
  // },
  {
    name: 'NextJS',
    icon: '/skills/nextjs.png',
  },
  // {
  //   name: 'NodeJS',
  //   icon: '/skills/nodejs.png',
  // },
  // {
  //   name: 'MongoDB',
  //   icon: '/skills/mongodb.png',
  // },
  {
    name: 'Github',
    icon: '/skills/github.png',
  },
  {
    name: 'Figma',
    icon: '/skills/figma.png',
  },
  {
    name: 'Photoshop',
    icon: '/skills/photoshop.png',
  },
  // {
  //   name: 'Blender',
  //   icon: '/skills/blender.png',
  // },
  {
    name: 'VS Code',
    icon: '/skills/vscode.png',
  },
]

// import { PiCopyrightThin } from 'react-icons/pi'
import CopyrightLineIcon from 'remixicon-react/CopyrightLineIcon'

// export const copyRightIcon = <PiCopyrightThin />
export const copyRightIcon = <CopyrightLineIcon />
// Experience
export const experienceData = [
  {
    year: 1,
    title: 'Foundation and Basics',
    education:
      'High School Diploma: Focus on computer science, mathematics, and art/design courses.',
    experience: [
      'Basic HTML/CSS: Learn through online tutorials and courses.',
      'Personal Projects: Create simple personal websites or blogs.',
    ],
  },
  {
    year: 2,
    title: 'Advanced Learning and Early Experience',
    education:
      'Associate’s Degree in Web Development or Design: Enroll in a 2-year program covering web development and design principles.',
    experience: [
      'Freelance Work: Take on small freelance projects to build a portfolio.',
      'Online Courses and Certifications: Learn JavaScript, responsive design, and UX/UI design.',
    ],
  },
  {
    year: 3,
    title: 'Specialized Education and Real-World Application',
    education:
      'Online Courses and Bootcamps: Focus on specialized areas like front-end frameworks (React, Angular) and back-end technologies (Node.js).',
    experience: [
      'Internships: Secure internships with tech companies or design agencies.',
      'Contribute to Open Source: Collaborate on open-source projects.',
    ],
  },
  {
    year: 4,
    title: 'Building Expertise and Expanding Skills',
    education: 'Certifications: Obtain certifications in advanced web technologies.',
    experience: [
      'Full-Time Position: Work as a junior web developer or designer.',
      'Portfolio Development: Continuously update your portfolio with professional and personal projects.',
    ],
  },
  {
    year: 5,
    title: 'Mastery and Leadership',
    education: 'Workshops and Conferences: Attend industry events to stay updated.',
    experience: [
      'Senior Position: Aim for a senior web developer or lead designer role, mentoring junior colleagues.',
      'Freelance and Consulting: Consider starting a freelance business or consulting practice.',
    ],
  },
]

export const projectsData = [
  {
    name: 'SparkleGrove.com',
    desc: 'A lifestyle blog featuring DIY crafts, home decor ideas, and inspiration for creating a cozy and stylish living space.',
    url: '/projects/image-1.jpg',
    tech: ['Figma', 'Photoshop', 'HTML'],
  },
  {
    name: 'TechTrekker.net',
    desc: 'A technology news and review site covering the latest gadgets, software updates, and trends in the tech industry.',
    url: '/projects/image-2.jpg',
    tech: ['Figma', 'Photoshop'],
  },
  {
    name: 'CozyNestHomes.org',
    desc: 'A resource for homeowners and renters alike, offering tips on interior design, home improvement projects, and sustainable living practices.',
    url: '/projects/image-3.jpg',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    name: 'WanderLuxeTravels.co',
    desc: 'A travel website that provides luxury travel guides, destination reviews, and tips for planning unforgettable vacations.',
    url: '/projects/image-4.jpg',
    tech: ['HTML', 'CSS', 'JavaScript', 'TailwindCSS'],
  },
  {
    name: 'ByteBoosters.io',
    desc: 'A tech startup specializing in software development, offering innovative solutions and services for businesses looking to enhance their digital presence.',
    url: '/projects/image-5.jpg',
    tech: ['Figma', 'ReactJS', 'TailwindCSS', 'CSS'],
  },
  {
    name: 'GreenLeafGardens.biz',
    desc: 'An online store and community hub for gardening enthusiasts, featuring a wide range of plants, gardening tools, and expert advice.',
    url: '/projects/image-6.jpg',
    tech: ['ReactJS', 'TailwindCSS', , 'CSS', 'FramerMotion'],
  },
  {
    name: 'PixelPerfectDesigns.info',
    desc: 'A graphic design portfolio showcasing the work of a freelance designer, including branding, web design, and illustration projects.',
    url: '/projects/image-7.jpg',
    tech: ['NextJS', 'FramerMotion'],
  },
  {
    name: 'HarmonyHealthHub.com',
    desc: ' A wellness website focused on holistic health, offering articles on nutrition, fitness, mental health, and alternative therapies.',
    url: '/projects/image-8.jpg',
    tech: ['NextJS', 'ReactJS', 'FramerMotion'],
  },
  {
    name: 'StellarSkiesAstronomy.org',
    desc: 'An educational site dedicated to astronomy, providing resources for amateur astronomers, star maps, and information on celestial events.',
    url: '/projects/image-9.jpg',
    tech: ['ReactJS', 'JavaScript', 'ThreeJS'],
  },
  {
    name: 'UrbanEatsDelights.com',
    desc: 'An educational site dedicated to astronomy, providing resources for amateur astronomers, star maps, and information on celestial events.',
    url: '/projects/image-10.jpg',
    tech: ['NextJS', 'ThreeJS'],
  },
]

export const projectsButton = [
  'All',
  'Figma',
  'Photoshop',
  'HTML',
  'CSS',
  'JavaScript',
  'ReactJS',
  'TailwindCSS',
  'NextJS',
  'FramerMotion',
  'ThreeJS',
]

import Home5LineIcon from 'remixicon-react/Home5LineIcon'
import UserLineIcon from 'remixicon-react/UserLineIcon'
import HistoryLineIcon from 'remixicon-react/HistoryLineIcon'
import BriefcaseLineIcon from 'remixicon-react/BriefcaseLineIcon'
import UserStarLineIcon from 'remixicon-react/UserStarLineIcon'
import ProjectorLineIcon from 'remixicon-react/ProjectorLineIcon'
import PriceTag3LineIcon from 'remixicon-react/PriceTag3LineIcon'
import ContactsBook2LineIcon from 'remixicon-react/ContactsBook2LineIcon'
import QuestionAnswerLineIcon from 'remixicon-react/QuestionAnswerLineIcon'

export const navbarData = [
  {
    id: 'home',
    name: 'Home',
    icon: <Home5LineIcon />,
  },
  {
    id: 'about',
    name: 'About',
    icon: <UserLineIcon />,
  },
  {
    id: 'experience',
    name: 'MyRoad',
    icon: <HistoryLineIcon />,
  },
  {
    id: 'skills',
    name: 'Skills',
    icon: <BriefcaseLineIcon />,
  },
  // {
  //   id: 'reviews',
  //   name: 'Reviews',
  //   icon: <UserStarLineIcon />,
  // },
  {
    id: 'projects',
    name: 'Projects',
    icon: <ProjectorLineIcon />,
  },
  // {
  //   id: 'pricing',
  //   name: 'Pricing',
  //   icon: <PriceTag3LineIcon />,
  // },
  {
    id: 'contact',
    name: 'Contact',
    icon: <ContactsBook2LineIcon />,
  },
  {
    id: 'questions',
    name: 'Questions',
    icon: <QuestionAnswerLineIcon />,
  },
]

export const questions = [
  {
    question: 'What are your strengths?',
    answer:
      'My strongest trait is adaptability. I can quickly adjust to new environments and learn new skills. My background in Data Science and self-taught software engineering experience demonstrate my ability to embrace change and take on challenges. This adaptability allows me to work effectively in dynamic settings and contribute in versatile ways.',
  },
  {
    question: 'What is your biggest weakness?',
    answer:
      'I tend to overcommit to details, as I believe in delivering quality work. While this focus on detail can sometimes affect efficiency, I’m working on balancing it by prioritizing tasks and setting time limits. For example, during university projects, I would spend a lot of time ensuring every element was perfect, but I’m learning to streamline my efforts while maintaining quality.',
  },
  {
    question: 'Why should we hire you?',
    answer:
      'You should hire me because my adaptability, positivity, and eagerness to learn make me a strong fit for your team. As a recent graduate, I’m highly motivated and a quick learner, so I’m ready to take on new challenges and be shaped into an ideal team member who consistently adds value. My hard-working nature helped me succeed academically, and I believe it will benefit your company too.',
  },
  {
    question: 'How do you approach a task when information is unclear?',
    answer:
      'I start by identifying the end goal of the task and then break it down into manageable steps. I research and gather information online or seek advice from colleagues if available. Throughout the process, I prioritize safety and adhere to company guidelines. This approach ensures that I remain thorough while still moving the task forward efficiently.',
  },
  {
    question: 'How do you handle change?',
    answer:
      'I view change as a necessary part of growth, both professionally and personally. Technology is constantly evolving, and I believe in staying updated and flexible. Embracing change helps me improve my skills and adapt to new challenges, making me a more versatile employee.',
  },
  {
    question: 'How do you respond to opposing viewpoints?',
    answer:
      'I believe that opposing viewpoints are valuable for fostering creativity and generating diverse ideas. I listen to and weigh the benefits of alternative perspectives. If I disagree, I explain my reasoning respectfully and try to reach a common ground. For example, during my final year project, my teammate and I had different ideas about the technology to use, but through open discussion, we found a compromise that worked for both of us.',
  },
  {
    question: 'How quickly do you make decisions?',
    answer:
      'The speed of my decision-making depends on the urgency and complexity of the situation. For high-priority tasks, I aim to make swift, informed decisions. However, for more complex issues, I take the necessary time to gather information and weigh options, ensuring the best outcome.',
  },
  {
    question: 'How would you handle conflict with a co-worker?',
    answer:
      'I believe open and honest communication is essential in resolving conflicts. If friction arises, I aim to understand my co-worker’s perspective and find a compromise that works for both of us. For instance, during a team project, I encountered a disagreement with a teammate over technology choices. By discussing our viewpoints and focusing on the project’s success, we resolved the conflict amicably.',
  },
  {
    question: 'Tell me about a time when you anticipated a problem before it arose.',
    answer:
      'During my role as a Teaching Assistant, I noticed some students struggling with a topic early in the semester. To prevent issues later, I arranged additional study sessions to address their concerns proactively. This approach helped improve their understanding and prevented future difficulties with the course material.',
  },
  {
    question: 'Tell me about a time when you failed.',
    answer:
      'In my third year, I experienced personal challenges that affected my academic performance, resulting in a B grade in a course I found relatively easy. This experience taught me the importance of resilience and time management, and I’ve since improved my ability to balance personal and academic responsibilities.',
  },
  {
    question: 'What motivates you in your career?',
    answer:
      'I’m motivated by opportunities for growth and the chance to make meaningful contributions. As a fresh graduate, I’m excited about the potential to learn from experienced professionals and gain hands-on experience. I’m driven to create positive impact through my work, whether it’s by developing user-friendly software or working on innovative projects.',
  },
  {
    question: 'How do you approach problem-solving?',
    answer:
      'When facing a challenge, I break down the problem into smaller, manageable parts and look for straightforward solutions first. If I need additional insight, I seek advice from experts or research online. This structured approach allows me to tackle problems methodically and find effective solutions.',
  },
];


import ArrowDropDownLineIcon from 'remixicon-react/ArrowDropDownLineIcon'
export const questionArrow = <ArrowDropDownLineIcon />

// Reviews

import StarFillIcon from 'remixicon-react/StarFillIcon'
import StarHalfLineIcon from 'remixicon-react/StarHalfLineIcon'
import ArrowLeftSLineIcon from 'remixicon-react/ArrowLeftSLineIcon'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'

const starIconsArray = [
  { component: <StarFillIcon />, key: 'star-fill' },
  { component: <StarHalfLineIcon />, key: 'star-half' },
];

const arrowIconsArray = [
  { component: <ArrowLeftSLineIcon />, key: 'arrow-left' },
  { component: <ArrowRightSLineIcon />, key: 'arrow-right' },
];

export const starIcons = starIconsArray.map(icon => (
  <div key={icon.key}>
    {icon.component}
  </div>
));

export const arrowIcons = arrowIconsArray.map(icon => (
  <div key={icon.key}>
    {icon.component}
  </div>
));

export const reviewsData = [
  {
    image: '/reviews/client-4.png',
    name: 'Mark T., Freelance Graphic Designer',
    comment:
      "Your work on our website has been phenomenal. The design is visually stunning and incredibly user-friendly. We've received countless compliments from our customers, and our sales have noticeably increased. Thank you for capturing our brand's essence so perfectly!",
    stars: [1, 1, 1, 1, 0.5],
  },
  {
    image: '/reviews/client-2.png',
    name: 'Sarah B., E-commerce Store Owner',
    comment:
      "Working with you, has been an absolute pleasure. The portfolio website you created for me is sleek, modern, and beautifully showcases my work. Your attention to detail and creative flair are truly impressive. I couldn't be happier with the final result!",
    stars: [1, 1, 1, 1, 1],
  },
  {
    image: '/reviews/client-3.png',
    name: 'Emily R., CEO of Tech Startup',
    comment:
      "The redesign of our corporate website exceeded all expectations. Your innovative ideas and professional execution have given us a site that is not only visually appealing but also highly functional. We've seen a significant improvement in user engagement thanks to your expertise.",
    stars: [1, 1, 1, 1, 1],
  },
  {
    image: '/reviews/client-1.png',
    name: 'Bob W., Lifestyle Blogger',
    comment:
      "I absolutely love the blog design you created for me, [Web Designer's Name]. It's exactly what I envisioned—stylish, unique, and easy to navigate. Your responsiveness and creative input were invaluable. My readers are raving about the new look, and I couldn't be more thrilled!",
    stars: [1, 1, 1, 1, 0.5],
  },
  {
    image: '/reviews/client-5.png',
    name: 'David H., Director of Non-Profit Organization',
    comment:
      "your work on our non-profit’s website has been transformative. The design is clean, engaging, and effectively conveys our mission. We've seen an increase in online donations and volunteer sign-ups, all thanks to your fantastic design. Your dedication and talent are greatly appreciated!",
    stars: [1, 1, 1, 1, 1],
  },
]

export const pricingPlans = [
  {
    title: 'Basic',
    pricing: '$500 - $1,000',
    features: [
      'Up to 5 pages',
      'Responsive design ',
      'Basic SEO ',
      'Contact form',
      'Social media links',
      '1 month support',
    ],
    recommended: 'Small businesses, personal websites, bloggers',
  },
  {
    title: 'Premium',
    pricing: '$5,000 - $10,000',
    features: [
      'Unlimited pages',
      'Responsive design',
      'Comprehensive SEO',
      'Contact form ',
      'Social media links',
      'Advanced security',
      'E-commerce (unlimited products)',
      'Blog setup',
      'Google Analytics with custom reports',
      '6 months support',
    ],
    recommended: 'Medium-sized businesses, online stores, service providers',
  },
  {
    title: 'Standard',
    pricing: '$1,500 - $3,000',
    features: [
      'Up to 10 pages',
      'Responsive design',
      'Advanced SEO',
      'CContact form',
      'Social media links',
      'E-commerce (20 products)',
      'Blog setup',
      'Google Analytics',
      '3 months support',
    ],
    recommended: 'Large businesses, complex e-commerce sites, custom web applications',
  },
]

import CheckLineIcon from 'remixicon-react/CheckLineIcon'

export const checkIcon = <CheckLineIcon />

// Toggle
import MoonFoggyFillIcon from 'remixicon-react/MoonFoggyFillIcon'
import SunFoggyFillIcon from 'remixicon-react/SunFoggyFillIcon'

export const sunIcon = <SunFoggyFillIcon />
export const moonIcon = <MoonFoggyFillIcon />
