import React, { useState} from 'react';

// --- Reusable UI Components ---

const Header = () => (
    <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight mb-3">
            AI Palette Buddy Pro 🎨
        </h1>
        <p className="text-lg text-slate-600">Describe a theme, and let AI craft the perfect color palette for you.</p>
    </header>
);

const ControlPanel = ({ onGenerate, loading, palette, onExport }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt) {
            alert("Please provide a text prompt.");
            return;
        }
        onGenerate(prompt);
    };
    
    return (
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-slate-200/80">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="prompt-input" className="block text-md font-semibold text-slate-700 mb-2">Describe a theme or mood</label>
                    <input
                        id="prompt-input"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., enchanted forest, retro diner"
                        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={loading || !prompt}
                >
                    {loading ? 'Generating...' : 'Generate Palette'}
                </button>
            </form>
            {palette.length > 0 && (
                 <div className="text-center mt-6 pt-6 border-t border-slate-200">
                    <button onClick={onExport} className="w-full bg-slate-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-slate-800 transition-colors">
                        Export Palette
                    </button>
                </div>
            )}
        </div>
    );
};

const ColorSwatch = ({ color, onCopy }) => {
    if (!color || !color.hex) {
        return null; 
    }

    const textColor = parseInt(color.hex.replace("#", ""), 16) > 0xffffff / 2 ? 'text-black' : 'text-white';
    
    const handleCopy = (e) => {
        e.stopPropagation();
        const textArea = document.createElement("textarea");
        textArea.value = color.hex;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        onCopy(color.hex);
    };

    return (
        <div 
            className="h-full flex flex-col justify-end p-6 rounded-2xl text-center cursor-pointer group" 
            style={{ backgroundColor: color.hex }}
            onClick={handleCopy}
        >
            <div className={`mt-auto transition-opacity duration-300 ${textColor}`}>
                <p className="font-bold text-base">{color.name}</p>
                <p className="font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{color.hex}</p>
            </div>
        </div>
    );
};

const ExportModal = ({ palette, onClose }) => {
    const generateCssVars = () => `root {\n${palette.map(c => `  --${c.name.toLowerCase().replace(/ /g, '-')}-color: ${c.hex};`).join('\n')}\n}`;
    const generateTailwindConfig = () => {
        const colors = palette.reduce((acc, c) => {
            acc[`'${c.name.toLowerCase().replace(/ /g, '-')}'`] = `'${c.hex}'`;
            return acc;
        }, {});
        return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 2).replace(/"/g, '')}\n    }\n  }\n}`;
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-slate-800">Export Palette</h3>
                <div>
                    <label className="font-semibold text-slate-700">CSS Variables</label>
                    <pre className="bg-slate-100 text-sm p-3 rounded-md mt-1 overflow-auto"><code>{generateCssVars()}</code></pre>
                </div>
                 <div>
                    <label className="font-semibold text-slate-700">Tailwind Config</label>
                    <pre className="bg-slate-100 text-sm p-3 rounded-md mt-1 overflow-auto"><code>{generateTailwindConfig()}</code></pre>
                </div>
                <div className="text-right">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300">Close</button>
                </div>
            </div>
        </div>
    );
};

const Toast = ({ message }) => {
    if (!message) return null;
    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {message}
        </div>
    );
};


// --- Main Application Component ---

export default function Color() {
    const [palette, setPalette] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showExport, setShowExport] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 2000);
    };

    const generatePalette = async (prompt) => {
        setLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey === "YOUR_GEMINI_API_KEY_HERE") {
            setError("Please add your Gemini API key to the code.");
            setLoading(false);
            return;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const promptPayload = `Generate a 5-color palette based on the theme "${prompt}". The colors should be named 'Primary', 'Secondary', 'Accent 1', 'Accent 2', and 'Text/Neutral'. Respond ONLY with a valid JSON array of objects, where each object has "name" (string) and "hex" (string, e.g., "#RRGGBB").`;
        const payload = {
            contents: [{ parts: [{ text: promptPayload }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, hex: { type: "STRING" } } } }
            }
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `API error: ${response.statusText}`);
            }
            
            const result = await response.json();
            const colorsText = result.candidates[0].content.parts[0].text;
            setPalette(JSON.parse(colorsText));
        } catch (err) {
            setError(`Sorry, couldn't generate a palette. Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <style>{`
                body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
            `}</style>
            <main className="container mx-auto px-4 py-12 md:py-20">
                <Header />
                <div className="flex flex-col items-center gap-12">
                    <div className="w-full max-w-3xl">
                        <ControlPanel 
                            onGenerate={generatePalette} 
                            loading={loading}
                            palette={palette}
                            onExport={() => setShowExport(true)}
                        />
                    </div>

                    <div className="w-full">
                        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg mb-8">{error}</p>}
                        
                        <div className="h-[50vh] min-h-[400px] w-full grid grid-cols-2 md:grid-cols-5 gap-4 transition-all duration-500">
                             {palette.length > 0 ? (
                                palette.map((color, index) => (
                                    <ColorSwatch key={index} color={color} onCopy={(hex) => showToast(`${hex} copied!`)} />
                                ))
                            ) : (
                                !loading && <div className="col-span-2 md:col-span-5 flex items-center justify-center text-center p-8 bg-slate-100 rounded-lg border-2 border-dashed"><div><h2 className="text-2xl font-bold text-slate-700 mb-2">Your palette will appear here</h2><p className="text-slate-500">Describe a theme to get started.</p></div></div>
                            )}
                        </div>
                    </div>
                </div>
                 {showExport && <ExportModal palette={palette} onClose={() => setShowExport(false)} />}
                 <Toast message={toastMessage} />
            </main>
        </>
    );
}

