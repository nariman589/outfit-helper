import React, { useCallback, useRef } from "react";

import { TypeAnimation } from "react-type-animation";

import { Search, Loader2, File } from "lucide-react";
import { toBase64 } from "../utils/toBase64";
import FiltersForPicture from "./FiltersForPicture";

interface Props {
  state: SearchState;
  setState: React.Dispatch<React.SetStateAction<SearchState>>;
  focusRef: React.RefObject<HTMLDivElement | null>;
}

function MainBlock({ state, setState, focusRef }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = useCallback(async () => {
    if (!state.query.trim()) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("http://localhost:3000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: state.query,
          itemsQuantity: state.itemsQuantity,
          requiredShops: state.requiredShops,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка поиска");
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error("Не удалось выполнить поиск");
      }

      setState((prev) => ({ ...prev, results: data.results }));
    } catch (err) {
      const error = err as Error;
      setState((prev) => ({ ...prev, error: error.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
      focusRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.query, state.requiredShops, state.itemsQuantity, focusRef.current]);

  const handleFileUploadButtonClick = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, [fileRef.current]);

  const handleFileUpload = useCallback(async () => {
    if (fileRef.current?.files) {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch("http://localhost:3000/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            img: await toBase64(fileRef.current?.files[0]),
            itemsQuantity: state.itemsQuantity,
            pictureProperty: state.pictureProperty,
            requiredShops: state.requiredShops,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Ошибка поиска");
        }

        const data: ApiResponse = await response.json();

        if (!data.success) {
          throw new Error("Не удалось выполнить поиск");
        }

        setState((prev) => ({ ...prev, results: data.results }));
      } catch (err) {
        const error = err as Error;
        setState((prev) => ({ ...prev, error: error.message }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
        if (fileRef.current) {
          fileRef.current.value = ""; // Reset file input
        }
      }
    }
  }, [
    state.requiredShops,
    state.itemsQuantity,
    state.pictureProperty,
    fileRef.current,
  ]);
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center flex-col">
      <div className="text-white">
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            "Соберем образ для свадьбы",
            2000, // wait 1s before replacing "Mice" with "Hamsters"
            "Соберем образ для прогулки",
            2000,
            "Соберем образ для драки",
            2000,
            "Соберем образ для работы",
            2000,
          ]}
          wrapper="span"
          speed={1}
          style={{
            fontFamily: "monospace",
            fontSize: "2em",
            display: "inline-block",
          }}
          repeat={Infinity}
        />
      </div>
      <textarea
        value={state.query}
        onChange={(e) =>
          setState((prev) => ({ ...prev, query: e.target.value }))
        }
        disabled={state.loading}
        placeholder="Например: Школьный комплект для мальчика 12 лет"
        className="bg-purple-50 disabled:bg-purple-50 resize-none flex-1 w-full h-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C587AEff]"
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />

      <FiltersForPicture setState={setState} state={state} />

      <div className="flex gap-2 w-full">
        <input
          ref={fileRef}
          accept=".jpg,.jpeg,.webp,.png,.jfif"
          type="file"
          onChange={handleFileUpload}
          hidden
        />
        <button
          disabled={state.loading || !state.pictureProperty}
          onClick={handleFileUploadButtonClick}
          className="px-4 py-2 bg-[#C587AEff] text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
        >
          {<File className="h-5 w-5" />}Загрузить Изображение
        </button>

        <button
          onClick={handleSearch}
          disabled={
            state.loading ||
            !state.query.trim() ||
            !Object.values(state.requiredShops).some((variable) => variable)
          }
          className="px-4 py-2 bg-[#8C759Fff] text-white rounded-lg hover:bg-[#8C759Fff] disabled:opacity-50 flex items-center gap-2"
        >
          {state.loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          Найти
        </button>
      </div>
    </div>
  );
}

export default MainBlock;
