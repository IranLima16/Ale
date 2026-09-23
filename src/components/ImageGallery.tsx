import { useState } from "react";

interface Props {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-3xl border border-white/8 bg-surface-1 p-3 shadow-2xl shadow-black/50 sm:p-5">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-inset ring-white/5">
          <img
            src={activeImage}
            alt={productName}
            width={800}
            height={1000}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagem ${index + 1} de ${productName}`}
              aria-current={index === activeIndex}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2 ring-2 transition-all duration-150 sm:h-24 sm:w-20 ${
                index === activeIndex
                  ? "ring-brand-400 shadow-md shadow-brand-500/20"
                  : "opacity-70 ring-white/10 hover:opacity-100 hover:ring-white/30"
              }`}
            >
              <img
                src={image}
                alt=""
                width={80}
                height={100}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
