import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Reusable UI Components ---

// A small, reusable component for social media links
const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="text-slate-300 hover:text-sky-300 transition-colors duration-300"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon}
        </svg>
    </a>
);


// The main component for the student's information card
const StudentInfoCard = () => {


  
    // SVG paths for icons
    const icons = {
        github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>,
        linkedin: <>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
        </>,
        mail: <>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </>
    };

    return (
        <div className=" bg-slate-900/50 backdrop-blur-lg rounded-2xl shadow-md w-full max-w-sm mx-auto overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <div className="p-8">
                <div className="text-center">
                    <div className='flex'>
                        <img
                        className="md:w-60 md:h-60 w-40 h-40 p-4 object-cover  mx-auto "

                        src="/Profile.png"
                        alt="Student Profile Picture"
                    />
                    </div>
                    <h2 className="mt-5 md:text-2xl text-xl font-lora font-bold text-slate-300">Yuvraj Thakur
                         <span className="absolute -bottom-2 left-0 h-1 w-24 bg-cyan-500 rounded-full transition-all duration-500 group-hover:w-full" />
                    </h2>
                    <p className="mt-1 md:text-md text-base font-semibold text-sky-300 ">Web Developer & AI Enthusiast</p>
                   
                </div>
                <div className="mt-6 flex justify-center space-x-6">
                    <SocialLink href="https://github.com/yuvrajthakur1" icon={icons.github} label="GitHub Profile" />
                    <SocialLink href="#" icon={icons.linkedin} label="LinkedIn Profile" />
                    <SocialLink href="mailto:yuvrajthakur.contact@gmail.com" icon={icons.mail} label="Send an Email" />
                </div>
            </div>
        </div>
    );
};


// The main About Section component that contains everything
export default function AboutSection() {

  const [about,setAbout] = useState(false);

    return (
        <>
            {/* You can add this style block to your main app file or keep it here */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Inter:wght@400;600&display=swap');
                
                body { 
                    font-family: 'Inter', sans-serif; 
                    background-color: #fdfaf6; /* Warm off-white */
                }

                .font-lora {
                    font-family: 'Lora', serif;
                }
            `}</style>

            <section className="py-10 md:py-24">
                <div className="container mx-auto px-1">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        
                        {/* Column 1: About Text */}
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl  md:text-3xl font-bold text-white mb-8 relative inline-block group">
                            About Me
                            <span className="absolute -bottom-2 left-0 h-1 w-24 bg-cyan-500 rounded-full transition-all duration-500 group-hover:w-full" />
                        </h2>
                            <p className=" md:text-lg sm:text-md text-base text-left text-slate-400 mb-4 leading-relaxed">
                                This portfolio is a showcase of my journey into front-end development and AI integration. Built with a passion for clean code and intuitive design, it demonstrates my ability to create dynamic, responsive, and user-centric web applications.
                            </p>
                           {
                            about &&  <p className=" md:text-lg sm:text-md text-base text-left text-slate-400 mb-4 leading-relaxed">
                               Here, you'll find projects that leverage modern technologies like React and Tailwind CSS to build beautiful interfaces, along with explorations into generative AI to create smarter, more interactive user experiences.
                            </p>
                            
                           }
                               
                               <div className='flex justify-start hover:cursor-pointer  py-2  rounded-md'>
                                    <button onClick={()=> setAbout(!about)}>{about ? "See Less":"See More"}</button>
                                  </div>
                        </div>

                        {/* Column 2: Student Info Card */}
                        <div>
                            <StudentInfoCard />
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

