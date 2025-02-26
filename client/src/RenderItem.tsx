import { Star } from "lucide-react";

const RenderItem = ({ type, products }: ItemGroup) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 capitalize">{type}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-[#956DA0] p-2 text-white text-center">
              {product.shop}
            </div>
            <div className="aspect-square w-full relative bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  -{product.discount}%
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
              <h3 className="font-medium mb-2 whitespace-break-spaces h-12 line-clamp-2">
                {product.name}
              </h3>

              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between flex-col">
                <div>
                  <div className="font-semibold">{product.price}</div>
                  {product.oldPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {product.oldPrice}
                    </div>
                  )}
                </div>
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm w-full items-end text-center p-4 rounded-xl  bg-[#956DA0] text-white hover:text-white"
                >
                  Подробнее
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderItem;
