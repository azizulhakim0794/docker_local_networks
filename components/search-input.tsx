type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="search-wrap">
      <svg
        aria-hidden="true"
        className="search-icon"
        fill="none"
        height="18"
        viewBox="0 0 24 24"
        width="18"
      >
        <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
        <path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
      <input
        aria-label="Search people"
        autoComplete="off"
        className="search-input"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search name, username, email, company..."
        type="search"
        value={value}
      />
    </label>
  );
}
