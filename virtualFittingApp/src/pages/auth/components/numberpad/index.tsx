import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { code: "KR", name: "대한민국", dialCode: "+82", flag: "🇰🇷" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "JP", name: "日本", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "中国", dialCode: "+86", flag: "🇨🇳" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Deutschland", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
];

interface PhoneInput {
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
}

function InternationalPhoneInput({ phoneNumber, setPhoneNumber }: PhoneInput) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const formatPhoneNumber = (value: string, countryCode: string): string => {
    const numbers = value.replace(/[^\d]/g, "");

    if (countryCode === "KR") {
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
    }

    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry.code);
    setPhoneNumber(formatted);
  };

  const handleCountrySelect = (country: Country): void => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setPhoneNumber("");
  };

  return (
    <div className="w-full flex flex-col justify-start items-start">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 focus:outline-none focus:border-indigo-500"
            >
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-gray-700">
                {selectedCountry.dialCode}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-indigo-50 transition-colors text-left"
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        {country.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {country.dialCode}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="10-0000-0000"
            className="flex-1 h-12 px-4 border-2 rounded-lg focus:outline-none focus:border-white transition-colors text-white"
            maxLength={13}
          />
        </div>
      </div>
    </div>
  );
}

export { InternationalPhoneInput };
