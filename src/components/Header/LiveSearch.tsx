'use client';
import { useState, useTransition, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '../../types/product';
import type { Category } from '../../types/category';

type SearchResult = (Product & { id: string; type: 'product' }) | (Category & { 
  id: string;  // ← FIXED!
  type: 'category'; 
  price?: number; 
  discountPrice?: number; 
  image?: string; 
  inStock?: boolean; 
  rating?: number; 
  todayOffer?: boolean; 
  FeaturedProduct?: boolean; 
  categoryNames?: string[]
});

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      startTransition(async () => {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(data);
      });
    }, 250);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSelect = (item: SearchResult) => {
    if (item.type === 'product') {
      router.push(`/products/${item.id}`);
    } else {
      router.push(`/categories/${item.slug || item.id}`);
    }
    setQuery('');
    setResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search products or categories..."
        value={query}
        onChange={handleSearch}
        className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
      />
      
      {isPending && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}

      {results.length > 0 && !isPending && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((item) => (
            <div
              key={item.id}  // ← NOW WORKS!
              onClick={() => handleSelect(item)}
              className="p-4 cursor-pointer hover:bg-blue-50 border-b border-gray-50 last:border-b-0 transition-colors flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                {item.type === 'product' && item.image ? (
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                    item.type === 'product' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {item.type === 'product' ? '📦' : '📁'}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'product' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type}
                  </span>
                  {item.categoryNames?.[0] && (
                    <span className="truncate max-w-[150px]">
                      in {item.categoryNames[0]}
                    </span>
                  )}
                </div>
                
                {item.type === 'product' && (
                  <div className="mt-2 space-y-1">
                    {item.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          ${item.discountPrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${item.price}
                        </span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-green-600">
                        ${item.price}
                      </div>
                    )}
                    
                    <div className="flex gap-1 mt-1">
                      {item.inStock === false && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Out of Stock</span>
                      )}
                      {item.todayOffer && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Today's Offer</span>
                      )}
                      {item.FeaturedProduct && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Featured</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && results.length === 0 && !isPending && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
          <p className="text-gray-500 text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}