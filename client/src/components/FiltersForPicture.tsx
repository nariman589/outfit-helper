import React from "react";

interface Props {
  state: SearchState;
  setState: React.Dispatch<React.SetStateAction<SearchState>>;
}

function FiltersForPicture({ state, setState }: Props) {
  const handlePicturePropertiesChange = (
    checked: boolean,
    value: PictureProperty
  ) => {
    if (checked && value) {
      setState((prev) => ({ ...prev, pictureProperty: value }));
    } else if (!checked && value) {
      setState((prev) => ({ ...prev, pictureProperty: undefined }));
    }
  };
  return (
    <div className="flex self-start gap-4">
      <div className="flex items-center">
        <input
          className="w-4 h-4 accent-purple-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          checked={state.pictureProperty === "on_image"}
          onChange={(e) =>
            handlePicturePropertiesChange(e.target.checked, "on_image")
          }
          disabled={state.loading}
          id="items-on-picture"
        />
        <label
          htmlFor={`items-on-picture`}
          className="ms-2 text-sm font-medium text-gray-100 dark:text-gray-300"
        >
          Найти предметы на изображений
        </label>
      </div>
      <div className="flex items-center">
        <input
          className="w-4 h-4 accent-purple-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          checked={state.pictureProperty === "by_image"}
          onChange={(e) =>
            handlePicturePropertiesChange(e.target.checked, "by_image")
          }
          disabled={state.loading}
          id="items-by-picture"
        />
        <label
          htmlFor={`items-by-picture`}
          className="ms-2 text-sm font-medium text-gray-100 dark:text-gray-300"
        >
          Подобрать образ для предметов из изображения
        </label>
      </div>
      <div className="flex items-center">
        <input
          className="w-4 h-4 accent-purple-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
          checked={state.pictureProperty === "selfie"}
          onChange={(e) =>
            handlePicturePropertiesChange(e.target.checked, "selfie")
          }
          disabled={state.loading}
          id="items-by-selfie"
        />
        <label
          htmlFor={`items-by-selfie`}
          className="ms-2 text-sm font-medium text-gray-100 dark:text-gray-300"
        >
          Подобрать образ по фотографий
        </label>
      </div>
    </div>
  );
}

export default FiltersForPicture;
