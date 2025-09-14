import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AboutSection from './components/About';
import Contact from './components/Contact';


// --- SVG Icons (as components for reusability) ---
const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const ExternalLinkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);



// --- Animated Starfield Background Component ---
const StarfieldBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let stars = [];
        let animationFrameId;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createStars = () => {
            stars = [];
            const starCount = Math.floor((canvas.width * canvas.height) / 1000);
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    alpha: Math.random(),
                    velocity: {
                        x: (Math.random() - 0.5) * 0.1,
                        y: (Math.random() - 0.5) * 0.1
                    }
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.x += star.velocity.x;
                star.y += star.velocity.y;

                if (star.x < 0 || star.x > canvas.width) star.velocity.x = -star.velocity.x;
                if (star.y < 0 || star.y > canvas.height) star.velocity.y = -star.velocity.y;

                star.alpha += (Math.random() - 0.5) * 0.02;
                if(star.alpha < 0) star.alpha = 0;
                if(star.alpha > 1) star.alpha = 1;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const init = () => {
            setCanvasSize();
            createStars();
            animate();
        };

        init();

        const handleResize = () => {
            cancelAnimationFrame(animationFrameId);
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};


// --- Custom Hooks ---
const useIntersectionObserver = options => {
    const [entry, setEntry] = useState(null);
    const [node, setNode] = useState(null);
    const observer = useRef(null);
    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(([entry]) => setEntry(entry), options);
        if (node) observer.current.observe(node);
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [node, options]);
    return [setNode, entry];
};

// --- Reusable Animated Section Component ---
const AnimatedSection = ({ children, className }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = entry?.isIntersecting;
    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
            {children}
        </div>
    );
};




const SKILLS = [
    { name: 'JavaScript', icon: 'https://cdn.svgporn.com/logos/javascript.svg' },
    { name: 'React', icon: 'https://cdn.svgporn.com/logos/react.svg' },
    { name: 'Node.js', icon: 'https://cdn.svgporn.com/logos/nodejs-icon.svg' },
    { name: 'TypeScript', icon: 'https://cdn.svgporn.com/logos/typescript-icon.svg' },
    { name: 'Python', icon: 'https://cdn.svgporn.com/logos/python.svg' },
    { name: 'SQL', icon: 'https://cdn.svgporn.com/logos/mysql.svg' },
    { name: 'BootStrap', icon: 'https://cdn.svgporn.com/logos/bootstrap.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.svgporn.com/logos/tailwindcss-icon.svg' },
    { name: 'Next.js', icon: 'https://cdn.svgporn.com/logos/nextjs-icon.svg' },
    { name: 'MongoDB', icon: 'https://cdn.svgporn.com/logos/mongodb.svg' },
    { name: 'Redux', icon: 'https://cdn.svgporn.com/logos/redux.svg' },  
    { name: 'Postman', icon: 'https://cdn.svgporn.com/logos/postman.svg' },
    { name: 'Git', icon: 'https://cdn.svgporn.com/logos/git.svg' },
    { name: 'GitHub', icon: 'https://cdn.svgporn.com/logos/github.svg' }
    
];




const PROJECTS = [
    {
    title: 'Help Buddy',
    description: "This project is a fully-featured, responsive chat application that allows users to have interactive conversations with Google's powerful Gemini AI. It's designed with a clean, modern user interface and provides a seamless user experience, complete with persistent chat history and rich text formatting",
    tags: ['React', 'AI', 'Gemini', 'Tailwind CSS'],
    liveUrl: '/chatbot',
    githubUrl: '#',
    imageUrl: '/ChatBot.png'
}, {
    title: 'AI Powered PantryChef',
    description: "PantryChef is a responsive single-page application designed to solve the common kitchen dilemma: What can I make with the ingredients I have? Users can input the items from their pantry or fridge, and the app leverages the power of Google's Gemini AI to generate creative and simple recipe suggestions in real-time. The application features a warm, classic design with subtle animations to create an engaging and intuitive user experience."
   ,
    tags: ['React', 'JavaScript', 'HTML', 'Tailwind CSS'],
    liveUrl: '/pantry',
    githubUrl: '#',
    imageUrl: '/Pantry.png'
}
, {
    title: 'Breast Cancer Predictor App',
    description: "Breast Cancer Predictor App is a machine learning–powered tool designed to assist in the early detection of breast cancer risk. By analyzing key medical data such as cell measurements and clinical features, the app predicts the likelihood of malignancy with high accuracy. It provides users with an easy-to-use interface for inputting test results, visualizes predictions clearly, and supports healthcare professionals in decision-making. While not a replacement for medical diagnosis, it offers an additional layer of insight to encourage timely consultations and screenings."
   ,
    tags: ['AI', 'ML', 'PREPROCESSING', 'STREAMLIT','KAGGLE'],
    liveUrl: 'https://yuvismlpro.streamlit.app/',
    githubUrl: 'https://github.com/yuvrajthakur1/streamlit-cancer-prediction/blob/master/app/main.py',
    imageUrl: '/Breast.png'
}
, {
    title: 'AI Color Combo Generator',
    description: "."
   ,
    tags: ['REACT JS', 'TAILWIND', 'AI', 'CSS','GEMINI'],
    liveUrl: '/color',
    githubUrl: '#',
    imageUrl: '/Pallet.png'
}
, {
    title: 'Catch The Pokemon',
    description: "."
   ,
    tags: ['REACT JS', 'TAILWIND', 'AI', 'CSS','GEMINI'],
    liveUrl: 'https://yuvrajthakur1.github.io/PokemonProject/',
    githubUrl: 'https://github.com/yuvrajthakur1/PokemonProject',
    imageUrl: '/Pallet.png'
}
,];





// --- Font Style Component ---
const SpaceFonts = () => (
    <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`.font-display { font-family: 'Exo 2', sans-serif; }`}</style>
    </>
);




// --- Main App Component ---
export default function App() {


    const [showAll,setShowAll] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const visibleProject  = showAll ? PROJECTS : PROJECTS.slice(0,2);
    const [showAllSkills,setShowAllSkills] = useState(false);
    const visibleSkills  = showAllSkills ? SKILLS : SKILLS.slice(0,5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sectionRefs = {
        home: useRef(null),
        about: useRef(null),
        skills: useRef(null),
        projects: useRef(null),
        contact: useRef(null)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const navLinks = [{ id: 'home', title: 'Home' }, { id: 'about', title: 'About' }, { id: 'skills', title: 'Skills' }, { id: 'projects', title: 'Projects' }, { id: 'contact', title: 'Contact' }];

    useEffect(() => {
        const handleScroll = () => {
            const pageYOffset = window.scrollY;
            let newActiveSection = null;
            navLinks.forEach(({ id }) => {
                const ref = sectionRefs[id];
                if (ref.current) {
                    const sectionOffsetTop = ref.current.offsetTop - 150;
                    const sectionHeight = ref.current.offsetHeight;
                    if (pageYOffset >= sectionOffsetTop && pageYOffset < sectionOffsetTop + sectionHeight) {
                        newActiveSection = id;
                    }
                }
            });
            if (newActiveSection) setActiveSection(newActiveSection);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navLinks, sectionRefs]);

    const scrollToSection = sectionId => {
        sectionRefs[sectionId].current.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };



    return (
        <div className="bg-slate-950 text-slate-300 font-display leading-relaxed antialiased selection:bg-cyan-300 selection:text-cyan-900">
            <SpaceFonts />
            <StarfieldBackground />

            {/* --- Navbar --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:bg-slate-900/50 md:backdrop-blur-lg border-b border-slate-800">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="#home" onClick={() => scrollToSection('home')} className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
                      Yuvraj Thakur
                    </a>
                    <ul className="hidden md:flex items-center space-x-8">
                        {navLinks.map(({ id, title }) => (
                            <li key={id}>
                                <button onClick={() => scrollToSection(id)} className={`font-semibold tracking-wide transition-colors relative group ${activeSection === id ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}>
                                    {title}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === id ? 'scale-x-100' : ''}`}></span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 space-y-1.5">
                        <span className={`block w-6 h-0.5 bg-slate-200 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-slate-200 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-slate-200 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-gray-900">
                        <ul className="flex flex-col space-y-8 text-center">
                            {navLinks.map(({ id, title }) => (
                                <li key={id}>
                                    <button onClick={() => scrollToSection(id)} className={`md:text-3xl text-xl font-bold transition-colors ${activeSection === id ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}>
                                        {title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>

            <main className="container mx-auto px-6 md:px-12 lg:px-20 pt-24 md:pt-7 relative z-10">
                {/* --- Home/Hero Section --- */}
                <section ref={sectionRefs.home} id="home" className="md:min-h-screen  flex flex-col justify-center items-start">
                    <AnimatedSection className="w-full">
                        <p className="md:text-lg text-md text-cyan-400 mb-2 font-semibold tracking-wider">Hi, my name is</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3" style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}>
                            Yuvraj Thakur
                        </h1>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-400 mb-6">
                            I craft solutions in the digital cosmos.
                        </h2>
                        <p className="max-w-xl text-slate-400 mb-8 md:text-lg text-base">
                            I'm a software engineer who builds and designs exceptional digital experiences. My focus is on creating accessible, human-centered products that shine bright.
                        </p>
                        <div className="flex items-center space-x-6">
                           <a href="https://github.com/yuvrajthakur1"  className="text-slate-400 hover:text-cyan-400 transition-transform hover:scale-110"><GithubIcon className="h-7 w-7" /></a>
                           <a href="https://www.linkedin.com/in/yuvraj-thakur-573249294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-transform hover:scale-110"><LinkedinIcon className="h-7 w-7" /></a>
                           <a href="mailto:yuvrajthakur.contact@gmail.com" className="text-slate-400 hover:text-cyan-400 transition-transform hover:scale-110"><MailIcon className="h-7 w-7" /></a>
                        </div>
                    </AnimatedSection>
                </section>

                {/* --- About Section --- */}
                <section ref={sectionRefs.about} id="about" className="py-24 scroll-mt-24">
                    <AnimatedSection>
                       <AboutSection/>
                    </AnimatedSection>
                </section>
                
                {/* --- Skills Section --- */}
                <section ref={sectionRefs.skills} id="skills" className="py-24 scroll-mt-14">
                    <AnimatedSection>
                         <h2 className="sm:text-3xl text-xl md:text-4xl font-bold text-white mb-12 text-center">My Constellation of Skills</h2>
                         <div className="flex flex-wrap justify-center gap-6">
                            {visibleSkills.map((skill, i) => (
                                <div 
                                    key={i} 
                                    className="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg md:px-5 px-3 md:py-3 py-1 md:text-lg sm:text-md text-base text-slate-300 font-semibold transition-all duration-300 hover:text-cyan-300 hover:border-cyan-700 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                                    style={{ transitionDelay: `${i * 50}ms` }}>
                                    <img src={skill.icon} alt={`${skill.name} icon`} className="md:w-6 md:h-6 h-3 w-3 mr-3" />
                                    <span>{skill.name}</span>
                                </div>
                            ))}

 
                            <div className='flex justify-center hover:cursor-pointer  py-2 px-4 rounded-md'>
                                    <button onClick={()=> setShowAllSkills(!showAllSkills)}>{showAllSkills ? "See Less":"See More"}</button>
                                  </div>
                         </div>
                    </AnimatedSection>
                </section>

                {/* --- Projects Section --- */}
                <section ref={sectionRefs.projects} id="projects" className="py-24   scroll-mt-24">
                    <AnimatedSection>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 relative inline-block group">
                            My Projects
                            <span className="absolute -bottom-2 left-0 h-1 w-24 bg-cyan-500 rounded-full transition-all duration-500 group-hover:w-full" />
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 l gap-8">
                           
                           {
                            visibleProject.map((project,i)=>{
                                return <div key={i} className='shadow-lg md:gap-8 gap-5 bg-slate-900/50 backdrop-blur-lg    rounded-md p-4   flex flex-col'>
                                       <div className='md:h-52 h-28 overflow-hidden p-4'>
                                        <img src={project.imageUrl} className='scale-150' alt="Project URL" />
                                       </div>
                                       <div className='p-3 flex flex-col gap-2'>
                                         <details>
                                            <summary className='font-semibold text-sky-300'>{project.title}</summary>
                                            <p className='p-1 text-slate-30'>{project.description}</p>
                                         </details>
                                

                                        <div className='grid grid-cols-2  mt-4 mb-2 justify-items-center gap-4 '>
                                            {
                                                project.tags.map((tag,i)=>{
                                                    return <h5 key={i} className='bg-blue-500 py-1 md:px-8 px-3 md:text-md   text-base rounded-md'>{tag}</h5>
                                                })
                                            }
                                        </div>
                                       </div>
                                       <div>
                                       <div className='flex justify-around'>
                                         <div className='flex justify-center'>
                                             <NavLink to={project.liveUrl} className=" rounded-md py-1 px-2 md:text-lg sm:text-md text-base bg-green-700 hover:bg-green-600 transform hover:rotate-2">Live Demo</NavLink>
                                        </div>
                                       <div className='flex justify-center'>
                                             <a href={project.githubUrl} className="  py-1 px-2 rounded-sm md:text-lg sm:text-md text-base bg-green-700 hover:bg-green-600 transform hover:rotate-2">Git Hub</a>
                                        </div>
                                       </div>
                                       </div>
                                </div>
                            })
                           }

                                  <div className='flex justify-center hover:cursor-pointer py-2 px-4 rounded-md'>
                                    <button onClick={()=> setShowAll(!showAll)}>{showAll ? "See Less":"See More"}</button>
                                  </div>
                        </div>
                    </AnimatedSection>
                </section>



                {/* --- Contact Section --- */}
                <section ref={sectionRefs.contact} id="contact" className="py-24 scroll-mt-24 text-center">
                    <AnimatedSection>
                        <Contact/>
                    </AnimatedSection>
                </section>

            </main>
            {/* --- Footer --- */}
            <footer className="py-6 text-center text-sm text-slate-500 relative z-10">
                <p>Designed & Built by Yuvraj Thakur</p>
            </footer>
        </div>
    );
}

