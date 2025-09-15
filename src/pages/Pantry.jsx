import React, { useState } from 'react';

// --- Reusable UI Components ---

// Component for the main header/title
const Header = () => (
    <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-lora font-bold text-stone-800 leading-tight mb-3">
        AI Chef Buddy 🍳
        </h1>
        <p className="text-lg text-stone-600">Enter your ingredients and discover what you can cook with the help of AI Chef Buddy and get step by step!</p>
    </header>
);

// Component for the user to type and add new ingredients
const IngredientInput = ({ onAddIngredient, disabled }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newIngredient = inputValue.trim().toLowerCase();
        if (newIngredient) {
            onAddIngredient(newIngredient);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., chicken, rice, tomato..."
                className="flex-grow p-3 bg-white border border-stone-300 text-stone-900 placeholder-stone-400 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:bg-stone-100"
                disabled={disabled}
            />
            <button
                type="submit"
                className="bg-orange-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm disabled:bg-orange-300"
                disabled={disabled}
            >
                Add
            </button>
        </form>
    );
};

// Component to display a single ingredient tag
const IngredientTag = ({ ingredient, onRemove }) => (
    <div className="flex items-center bg-stone-200 text-stone-700 text-md font-medium px-4 py-2 rounded-full animate-pop-in">
        <span>{ingredient}</span>
        <button onClick={() => onRemove(ingredient)} className="ml-2 text-stone-500 hover:text-stone-800">
            &times;
        </button>
    </div>
);

// Component to display a single recipe card, now with steps
const RecipeCard = ({ recipe, index }) => {
    const [showSteps, setShowSteps] = useState(false);

    return (
     <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 opacity-0 animate-slide-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
     >
        <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" onError={(e) => e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'}/>
        <div className="p-6">
            <h3 className="font-lora font-bold text-xl text-stone-800 mb-2">{recipe.title}</h3>
            <p className="text-stone-600">
                <span className="font-semibold text-stone-700">Ingredients:</span> {recipe.ingredients.join(', ')}
            </p>
             <div className="mt-4">
                <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="text-orange-600 font-semibold hover:text-orange-800 transition-colors"
                >
                    {showSteps ? 'Hide Recipe' : 'View Recipe'}
                </button>
            </div>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showSteps ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                <ol className="list-decimal list-inside space-y-2 text-stone-600">
                    {recipe.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    </div>
    );
};

// A simple loading spinner component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
    </div>
);


// --- Main Application Component ---

export default function Pantry() {
    const [ingredients, setIngredients] = useState([]);
    const [foundRecipes, setFoundRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    
    // Function to add an ingredient, preventing duplicates
    const addIngredient = (ingredient) => {
        if (!ingredients.includes(ingredient)) {
            setIngredients([...ingredients, ingredient]);
        }
    };

    // Function to remove an ingredient
    const removeIngredient = (ingredientToRemove) => {
        setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
    };

    // --- AI-Powered Recipe Finder ---
    const findRecipes = async () => {
        if (ingredients.length === 0) return;

        setLoading(true);
        setError(null);
        setSearched(true);
        setFoundRecipes([]);

        // --- IMPORTANT: Replace with your actual API key ---
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const prompt = `You are a master chef. Based on these ingredients: ${ingredients.join(', ')}, suggest between 2 and 4 simple recipes. Respond ONLY with a valid JSON array of objects. Each object must have these exact keys: "id" (a unique number), "title" (string), "ingredients" (an array of strings), and "steps" (an array of strings, with each string being a single step in the cooking process).`;
        
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            id: { type: "NUMBER" },
                            title: { type: "STRING" },
                            ingredients: { type: "ARRAY", items: { type: "STRING" } },
                            steps: { type: "ARRAY", items: { type: "STRING" } },
                        },
                    },
                },
            },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            const jsonText = result.candidates[0].content.parts[0].text;
            const recipes = JSON.parse(jsonText);

            // Fetch a real image from the internet for each recipe
            const recipesWithImages = recipes.map(recipe => ({
                ...recipe,
                image: `https://source.unsplash.com/600x400/?${encodeURIComponent(recipe.title + ' food')}`
            }));
            
            setFoundRecipes(recipesWithImages);

        } catch (err) {
            console.error("Failed to fetch recipes:", err);
            setError(`Sorry, couldn't generate a palette. Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Inter:wght@400;600&display=swap');
                
                body { 
                    font-family: 'Inter', sans-serif; 
                    background-color: #fdfaf6; /* Warm off-white */
                }

                .font-lora {
                    font-family: 'Lora', serif;
                }

                @keyframes pop-in {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .animate-pop-in {
                    animation: pop-in 0.3s ease-out forwards;
                }

                @keyframes slide-fade-in {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                .animate-slide-fade-in {
                    animation: slide-fade-in 0.5s ease-out forwards;
                }
            `}</style>
            <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                <Header />

                {/* --- Input Section --- */}
                <div className="bg-white p-8 rounded-lg shadow-md mb-12">
                    <h2 className="text-2xl font-lora font-bold text-stone-700 mb-4">Your Ingredients</h2>
                    <IngredientInput onAddIngredient={addIngredient} disabled={loading} />
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {ingredients.map(ing => (
                            <IngredientTag key={ing} ingredient={ing} onRemove={removeIngredient} />
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <button
                            onClick={findRecipes}
                            className="bg-stone-800 text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-stone-900 transition-all duration-300 transform hover:scale-105 shadow-md disabled:bg-stone-400 disabled:text-stone-200 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={loading || ingredients.length === 0}
                        >
                            {loading ? 'Finding Recipes...' : 'Find Recipes'}
                        </button>
                    </div>
                </div>

                {/* --- Results Section --- */}
                <div>
                    <h2 className="text-3xl font-lora font-bold text-stone-800 mb-8 text-center">Suggested Meals</h2>
                    {loading && <LoadingSpinner />}
                    {error && <p className="text-center text-red-500 text-lg">{error}</p>}
                    {!loading && !error && searched && foundRecipes.length === 0 && (
                        <p className="text-center text-stone-500 text-lg">
                            No recipes found with your ingredients. Try removing some or adding more!
                        </p>
                    )}
                    <div className="grid md:grid-cols-2 gap-8">
                        {foundRecipes.map((recipe, index) => (
                            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

