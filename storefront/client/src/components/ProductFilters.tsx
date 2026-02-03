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
}

interface FilterOptions {
  processorTypes: string[];
  ramSizes: number[];
  storageCapacities: number[];
  storageTypes: string[];
  screenSizes: number[];
  screenResolutions: string[];
  graphicsTypes: string[];
}

interface ProductFiltersProps {
  options: FilterOptions;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const MAX_VISIBLE_ITEMS = 8;

export default function ProductFilters({ options, filters, onFilterChange }: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['processor', 'ram', 'storage', 'screen'])
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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

  const toggleExpanded = (section: string) => {
    setExpandedSections(prev => {
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
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => Array.isArray(value) && value.length > 0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
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

      {/* Filter Content - Scrollable */}
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
        {/* Processor Type */}
        {options.processorTypes.length > 0 && (
          <FilterSection
            title="Processor"
            isOpen={openSections.has('processor')}
            onToggle={() => toggleSection('processor')}
            items={options.processorTypes}
            selectedItems={filters.processorTypes}
            onItemChange={(value) => handleCheckboxChange('processorTypes', value)}
            isExpanded={expandedSections.has('processor')}
            onToggleExpanded={() => toggleExpanded('processor')}
            formatLabel={(item) => item}
          />
        )}

        {/* RAM Size */}
        {options.ramSizes.length > 0 && (
          <FilterSection
            title="RAM Geheugen"
            isOpen={openSections.has('ram')}
            onToggle={() => toggleSection('ram')}
            items={options.ramSizes}
            selectedItems={filters.ramSizes}
            onItemChange={(value) => handleCheckboxChange('ramSizes', value)}
            isExpanded={expandedSections.has('ram')}
            onToggleExpanded={() => toggleExpanded('ram')}
            formatLabel={(item) => `${item} GB`}
          />
        )}

        {/* Storage Capacity */}
        {options.storageCapacities.length > 0 && (
          <FilterSection
            title="Opslag Capaciteit"
            isOpen={openSections.has('storage')}
            onToggle={() => toggleSection('storage')}
            items={options.storageCapacities}
            selectedItems={filters.storageCapacities}
            onItemChange={(value) => handleCheckboxChange('storageCapacities', value)}
            isExpanded={expandedSections.has('storage')}
            onToggleExpanded={() => toggleExpanded('storage')}
            formatLabel={(item) => item >= 1000 ? `${item / 1000} TB` : `${item} GB`}
          />
        )}

        {/* Storage Type */}
        {options.storageTypes.length > 0 && (
          <FilterSection
            title="Opslag Type"
            isOpen={openSections.has('storageType')}
            onToggle={() => toggleSection('storageType')}
            items={options.storageTypes}
            selectedItems={filters.storageTypes}
            onItemChange={(value) => handleCheckboxChange('storageTypes', value)}
            isExpanded={expandedSections.has('storageType')}
            onToggleExpanded={() => toggleExpanded('storageType')}
            formatLabel={(item) => item}
          />
        )}

        {/* Screen Size */}
        {options.screenSizes.length > 0 && (
          <FilterSection
            title="Schermgrootte"
            isOpen={openSections.has('screen')}
            onToggle={() => toggleSection('screen')}
            items={options.screenSizes}
            selectedItems={filters.screenSizes}
            onItemChange={(value) => handleCheckboxChange('screenSizes', value)}
            isExpanded={expandedSections.has('screen')}
            onToggleExpanded={() => toggleExpanded('screen')}
            formatLabel={(item) => `${item}"`}
          />
        )}

        {/* Screen Resolution */}
        {options.screenResolutions.length > 0 && (
          <FilterSection
            title="Schermresolutie"
            isOpen={openSections.has('resolution')}
            onToggle={() => toggleSection('resolution')}
            items={options.screenResolutions}
            selectedItems={filters.screenResolutions}
            onItemChange={(value) => handleCheckboxChange('screenResolutions', value)}
            isExpanded={expandedSections.has('resolution')}
            onToggleExpanded={() => toggleExpanded('resolution')}
            formatLabel={(item) => item}
          />
        )}

        {/* Graphics Type */}
        {options.graphicsTypes.length > 0 && (
          <FilterSection
            title="Videokaart Type"
            isOpen={openSections.has('graphics')}
            onToggle={() => toggleSection('graphics')}
            items={options.graphicsTypes}
            selectedItems={filters.graphicsTypes}
            onItemChange={(value) => handleCheckboxChange('graphicsTypes', value)}
            isExpanded={expandedSections.has('graphics')}
            onToggleExpanded={() => toggleExpanded('graphics')}
            formatLabel={(item) => item}
          />
        )}


      </div>
    </div>
  );
}

function FilterSection<T extends string | number>({
  title,
  isOpen,
  onToggle,
  items,
  selectedItems,
  onItemChange,
  isExpanded,
  onToggleExpanded,
  formatLabel,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  items: T[];
  selectedItems: T[];
  onItemChange: (value: T) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  formatLabel: (item: T) => string;
}) {
  const hasMore = items.length > MAX_VISIBLE_ITEMS;
  const visibleItems = isExpanded ? items : items.slice(0, MAX_VISIBLE_ITEMS);

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-sm uppercase tracking-wide">{title}</h3>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {visibleItems.map((item) => (
              <FilterCheckbox
                key={String(item)}
                label={formatLabel(item)}
                checked={selectedItems.includes(item)}
                onChange={() => onItemChange(item)}
              />
            ))}
          </div>
          {hasMore && (
            <button
              onClick={onToggleExpanded}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {isExpanded ? '- Minder weergeven' : `+ Meer weergeven (${items.length - MAX_VISIBLE_ITEMS} meer)`}
            </button>
          )}
        </div>
      )}
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
