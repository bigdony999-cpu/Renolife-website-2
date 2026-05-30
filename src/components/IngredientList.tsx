import { useState } from 'react';
import { Leaf, Search, Sparkles, AlertCircle } from 'lucide-react';
import { Language, TranslationSet } from '../types';

interface IngredientListProps {
  lang: Language;
  t: TranslationSet;
}

export default function IngredientList({ lang, t }: IngredientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Stem' | 'Anti' | 'Super'>('All');

  const categories = [
    { id: 'All', label: lang === 'sw' ? 'Zote' : 'All' },
    { id: 'Stem', label: lang === 'sw' ? 'Cell Mama' : 'Stem Cells' },
    { id: 'Anti', label: lang === 'sw' ? 'Antioxidant' : 'Antioxidants' },
    { id: 'Super', label: lang === 'sw' ? 'Matunda Tiba' : 'Superfruits' }
  ];

  const filteredIngredients = t.ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ing.sciName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ing.desc.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Stem') return matchesSearch && ing.category === 'Stem Cell';
    if (activeCategory === 'Anti') return matchesSearch && ing.category === 'Antioxidant';
    if (activeCategory === 'Super') return matchesSearch && ing.category === 'Superfood';
    return matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Centered Header Block */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-secondary">
          {lang === 'sw' ? 'VIAMBATA TIBALISHE' : 'ACTIVE INGREDIENTS'}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl text-primary dark:text-white mt-3 mb-4">
          {t.ingredientTitle}
        </h3>
        <div className="w-16 h-1 bg-secondary mx-auto rounded mb-6"></div>
        <p className="text-sm md:text-base text-on-surface-variant dark:text-surface-variant/90 max-w-xl mx-auto">
          {t.ingredientSub}
        </p>
      </div>

      {/* Symmetrical Categories & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 border-b border-outline-variant/20 pb-6 w-full">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary-container text-on-primary dark:bg-secondary-fixed dark:text-on-secondary-fixed shadow'
                  : 'bg-surface-container dark:bg-tertiary-container/30 text-on-surface-variant dark:text-tertiary-fixed-dim hover:bg-surface-container-high'
              }`}
              id={`cat-tab-${cat.id.toLowerCase()}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder={lang === 'sw' ? "Tafuta kiambata..." : "Search ingredient..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest dark:bg-tertiary-container/40 border border-outline-variant dark:border-outline-variant/30 rounded focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none text-sm text-on-surface transition-all"
            id="ingredient-search-input"
          />
        </div>
      </div>

      {/* Grid Display */}
      {filteredIngredients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="ingredients-grid">
          {filteredIngredients.map((ing, idx) => (
            <div 
              key={idx}
              className="bg-surface-container-lowest dark:bg-tertiary border border-outline-variant/40 dark:border-primary-container/40 rounded-lg p-6 flex flex-col justify-between items-center text-center hover:shadow-md hover:border-secondary/40 transition-all group"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 mb-4 w-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary dark:text-secondary-fixed-dim bg-secondary-container/30 px-2.5 py-1 rounded">
                    {ing.category}
                  </span>
                  <Leaf className="w-4 h-4 text-secondary/35 group-hover:text-secondary hover:scale-110 transition-all duration-300" />
                </div>
                
                <h4 className="font-serif text-lg font-semibold text-primary dark:text-primary-fixed group-hover:text-secondary dark:group-hover:text-secondary-fixed transition-colors mb-1">
                  {ing.name}
                </h4>
                <p className="text-[11px] font-mono text-on-surface-variant/70 italic mb-3">
                  {ing.sciName}
                </p>
                <p className="text-xs text-on-surface-variant dark:text-surface-variant/90 leading-relaxed px-1">
                  {ing.desc}
                </p>
              </div>

              {/* Action Marker */}
              <div className="mt-6 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-[11px] w-full">
                <span className="flex items-center gap-1 text-primary-container/70 dark:text-primary-fixed-dim/70">
                  <Sparkles className="w-3 h-3 text-secondary" />
                  {lang === 'sw' ? 'Mimea Hai' : 'Bio-Active'}
                </span>
                <span className="text-secondary font-semibold">100% Salama</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-surface-container-low dark:bg-tertiary rounded-lg border border-dashed border-outline-variant">
          <AlertCircle className="w-8 h-8 text-on-surface-variant/60 mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">
            {lang === 'sw' ? 'Hakuna kiambata kilichopatikana.' : 'No ingredients matched your search.'}
          </p>
        </div>
      )}
    </div>
  );
}
