import React from "react";

interface Props {
  state: SearchState;
  setState: React.Dispatch<React.SetStateAction<SearchState>>;
}

function Filters({ state, setState }: Props) {
  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setState((v) => ({ ...v, itemsQuantity: parseInt(value) }));
  };
  return (
    <div className="flex gap-4 mt-4 flex-wrap">
      <div className="flex gap-4">
        <label className="ms-2 text-sm font-medium text-gray-100 dark:text-gray-300">
          Количество предметов
        </label>
        <select
          value={state.itemsQuantity}
          onChange={handleRangeChange}
          disabled={state.loading}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
      </div>
      {Object.entries(state.requiredShops).map(([key, value]) => {
        return (
          <div key={key} className="flex items-center">
            <input
              id={`shop-${key}`}
              className="w-4 h-4 accent-purple-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              type="checkbox"
              checked={value}
              disabled={state.loading}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  requiredShops: {
                    ...prev.requiredShops,
                    [key]: e.target.checked,
                  },
                }))
              }
            />
            <label
              htmlFor={`shop-${key}`}
              className="ms-2 text-sm font-medium text-gray-100 dark:text-gray-300"
            >
              {key}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default Filters;
