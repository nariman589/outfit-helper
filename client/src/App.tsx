import { useState, useCallback, useRef } from "react";
import RenderItem from "./RenderItem";

import logo from "./assets/logo.png";
import Filters from "./components/Filters";
import MainBlock from "./components/MainBlock";

const OutfitSearch = ({}) => {
  const [state, setState] = useState<SearchState>({
    query: "",
    requiredShops: {
      Wildberries: true,
      Asos: false,
      Kaspi: false,
      Lamoda: false,
      FarFetch: false,
    },
    pictureProperty: "on_image",
    itemsQuantity: 4,
    results: null,
    loading: false,
    error: null,
  });

  const focusRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={`flex flex-col p-4 bg-purple-50 min-h-screen h-full`}>
      <div className="flex items-center flex-col w-full">
        <div className="mt-6 w-36 h-32">
          <img className="object-fill" src={logo} alt="logo" />
        </div>
        <div className="mb-6 w-full items-center bg-gradient-to-r from-[#956DA0] to-[#D3ADD1ff] p-8 rounded-3xl shadow-2xl">
          <MainBlock focusRef={focusRef} setState={setState} state={state} />
          <Filters setState={setState} state={state} />
        </div>
      </div>

      {state.error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
          {state.error}
        </div>
      )}

      {state.results && (
        <div className="space-y-8" ref={focusRef}>
          {state.results.map((group) => (
            <RenderItem key={group.type} {...group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OutfitSearch;
