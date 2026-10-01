import type React from "react";

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  loading = false,
  placeholder = "Buscar canción o audiolibro...",
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="flex gap-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-hover focus:border-brand-red transition"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-hover disabled:opacity-50 transition"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
};