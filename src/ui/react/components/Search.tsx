import React, { useState, useEffect } from 'react';

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceTime?: number;
  className?: string;
}

const Search: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceTime = 300,
  className,
}) => {
  const [localQuery, setLocalQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new debounce timeout
    const timeout = setTimeout(() => {
      onSearch(localQuery);
    }, debounceTime);

    setDebounceTimeout(timeout);

    // Cleanup on unmount or when localQuery changes
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localQuery, onSearch, debounceTime]);

  return (
    <div className={`workout-settings-search ${className || ''}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
      />
    </div>
  );
};

export default Search;
