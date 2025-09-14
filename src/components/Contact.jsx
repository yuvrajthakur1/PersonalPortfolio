import { Mail, Phone, Linkedin, Github, Twitter } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6  text-slate-100">
      <div className="flex flex-col justify-center  text-left">
        <h2 className="text-2xl  md:text-3xl font-bold text-white mb-8 relative inline-block group">
                            Lets Connect
                            <span className="absolute -bottom-2 left-0 h-1 w-24 bg-cyan-500 rounded-full transition-all duration-500 group-hover:w-full" />
                        </h2>
        <p className="text-slate-400 mb-16 md:text-lg text-md">
          Don’t be a stranger! Reach out to me directly or connect through my socials.
        </p>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2  lg:grid-cols-3 gap-10">
          {/* Phone */}
          <a
            href="tel:+911234567890"
            className="group  bg-slate-900/50 backdrop-blur-lg   rounded-2xl p-8 shadow-md flex flex-col items-center transition"
          >
            <Phone className="w-10 h-10 text-slate-300 mb-4 group-hover:scale-110 transition" />
            <h3 className="font-semibold md:text-lg text-md mb-1">Phone</h3>
            <p className="text-slate-400 group-hover:text-slate-200 transition">
              +91 9617672001
            </p>
          </a>

          {/* Email */}
          <a
            href="mailto:yuvrajthakur.contact@gmail.com"
            className="group  bg-slate-900/50 backdrop-blur-lg   rounded-2xl p-8 shadow-md flex flex-col items-center transition"
          >
            <Mail className="w-10 h-10 text-slate-300 mb-4 group-hover:scale-110 transition" />
            <h3 className="font-semibold md:text-lg text-md mb-1">Email</h3>
            <p className="text-slate-400 group-hover:text-slate-200 transition">
              yuvrajthakur.contact@gmail.com
            </p>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="group  bg-slate-900/50 backdrop-blur-lg  rounded-2xl p-8 shadow-md flex flex-col items-center transition"
          >
            <Linkedin className="w-10 h-10 text-slate-300 mb-4 group-hover:scale-110 transition" />
            <h3 className="font-semibold md:text-lg text-md mb-1">LinkedIn</h3>
            <p className="text-slate-400 group-hover:text-slate-200 transition">
              
            </p>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/yuvrajthakur1"
            target="_blank"
            rel="noopener noreferrer"
            className="group  bg-slate-900/50 backdrop-blur-lg  rounded-2xl p-8 shadow-md flex flex-col items-center transition"
          >
            <Github className="w-10 h-10 text-slate-300 mb-4 group-hover:scale-110 transition" />
            <h3 className="font-semibold md:text-lg text-md mb-1">GitHub</h3>
            <p className="text-slate-400 group-hover:text-slate-200 transition">
             yuvrajthakur1
            </p>
          </a>

        </div>
      </div>
    </section>
  );
}
