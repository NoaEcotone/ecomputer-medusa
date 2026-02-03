import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export interface FilterState {
  processorTypes: string[];
  ramSizes: number[];
  storageCapacities: number[];
  storageTypes: string[];
  screenSizes: number[];
  screenResolutions: string[];
  graphicsTypes: string[];
  conditions: string[];
}

interface FilterOptions {
  processorTypes: string[];
  ramSizes: number[];
  storageCapacities: number[];
  storageTypes: string[];
  screenSizes: number[];
  screenResolutions: string[];
  graphicsTypes: string[];
  conditions: string[];
}

interface ProductFiltersProps {
  options: FilterOptions;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function ProductFilters({ options, filters, onFilterChange }: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['processor', 'ram', 'storage', 'screen'])
  );

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleCheckboxChange = (
    category: keyof FilterState,
    value: string | number
  ) => {
    const currentValues = filters[category] as any[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      processorTypes: [],
      ramSizes: [],
      storageCapacities: [],
      storageTypes: [],
      screenSizes: [],
      screenResolutions: [],
      graphicsTypes: [],
      conditions: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => Array.isArray(value) && value.length > 0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
            Wis alles
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className="divide-y divide-gray-200">
        {/* Processor Type */}
        {options.processorTypes.length > 0 && (
          <FilterSection
            title="Processor"
            isOpen={openSections.has('processor')}
            onToggle={() => toggleSection('processor')}
          >
            {options.processorTypes.map((type) => (
              <FilterCheckbox
                key={type}
                label={type}
                checked={filters.processorTypes.includes(type)}
                onChange={() => handleCheckboxChange('processorTypes', type)}
              />
            ))}
          </FilterSection>
        )}

        {/* RAM Size */}
        {options.ramSizes.length > 0 && (
          <FilterSection
            title="RAM Geheugen"
            isOpen={openSections.has('ram')}
            onToggle={() => toggleSection('ram')}
          >
            {options.ramSizes.map((size) => (
              <FilterCheckbox
                key={size}
                label={`${size} GB`}
                checked={filters.ramSizes.includes(size)}
                onChange={() => handleCheckboxChange('ramSizes', size)}
              />
            ))}
          </FilterSection>
        )}

        {/* Storage Capacity */}
        {options.storageCapacities.length > 0 && (
          <FilterSection
            title="Opslag Capaciteit"
            isOpen={openSections.has('storage')}
            onToggle={() => toggleSection('storage')}
          >
            {options.storageCapacities.map((capacity) => (
              <FilterCheckbox
                key={capacity}
                label={capacity >= 1000 ? `${capacity / 1000} TB` : `${capacity} GB`}
                checked={filters.storageCapacities.includes(capacity)}
                onChange={() => handleCheckboxChange('storageCapacities', capacity)}
              />
            ))}
          </FilterSection>
        )}

        {/* Storage Type */}
        {options.storageTypes.length > 0 && (
          <FilterSection
            title="Opslag Type"
            isOpen={openSections.has('storageType')}
            onToggle={() => toggleSection('storageType')}
          >
            {options.storageTypes.map((type) => (
              <FilterCheckbox
                key={type}
                label={type}
                checked={filters.storageTypes.includes(type)}
                onChange={() => handleCheckboxChange('storageTypes', type)}
              />
            ))}
          </FilterSection>
        )}

        {/* Screen Size */}
        {options.screenSizes.length > 0 && (
          <FilterSection
            title="Schermgrootte"
            isOpen={openSections.has('screen')}
            onToggle={() => toggleSection('screen')}
          >
            {options.screenSizes.map((size) => (
              <FilterCheckbox
                key={size}
                label={`${size}"`}
                checked={filters.screenSizes.includes(size)}
                onChange={() => handleCheckboxChange('screenSizes', size)}
              />
            ))}
          </FilterSection>
        )}

        {/* Screen Resolution */}
        {options.screenResolutions.length > 0 && (
          <FilterSection
            title="Schermresolutie"
            isOpen={openSections.has('resolution')}
            onToggle={() => toggleSection('resolution')}
          >
            {options.screenResolutions.map((resolution) => (
              <FilterCheckbox
                key={resolution}
                label={resolution}
                checked={filters.screenResolutions.includes(resolution)}
                onChange={() => handleCheckboxChange('screenResolutions', resolution)}
              />
            ))}
          </FilterSection>
        )}

        {/* Graphics Type */}
        {options.graphicsTypes.length > 0 && (
          <FilterSection
            title="Videokaart Type"
            isOpen={openSections.has('graphics')}
            onToggle={() => toggleSection('graphics')}
          >
            {options.graphicsTypes.map((type) => (
              <FilterCheckbox
                key={type}
                label={type}
                checked={filters.graphicsTypes.includes(type)}
                onChange={() => handleCheckboxChange('graphicsTypes', type)}
              />
            ))}
          </FilterSection>
        )}

        {/* Condition */}
        {options.conditions.length > 0 && (
          <FilterSection
            title="Conditie"
            isOpen={openSections.has('condition')}
            onToggle={() => toggleSection('condition')}
          >
            {options.conditions.map((condition) => (
              <FilterCheckbox
                key={condition}
                label={condition}
                checked={filters.conditions.includes(condition)}
                onChange={() => handleCheckboxChange('conditions', condition)}
              />
            ))}
          </FilterSection>
        )}
      </div>
    </div>
  );
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-sm uppercase tracking-wide">{title}</h3>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="px-4 pb-4 space-y-2">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-black"
      />
      <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{label}</span>
    </label>
  );
}
