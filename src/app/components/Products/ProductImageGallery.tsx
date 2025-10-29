"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  mainImage: string;
  additionalMedia: Array<{
    url: string;
    type: "image" | "video";
    name?: string;
    size?: number;
    mimeType?: string;
  }>;
}

export default function ProductImageGallery({
  mainImage,
  additionalMedia,
}: ProductImageGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState(mainImage);

  const allMedia = [mainImage, ...additionalMedia.map((media) => media.url)];

  return (
    <div className="space-y-4">
      {/* Main Image/Video */}
      <div className="relative w-full h-96">
        {selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".mov") ? (
          <video
            src={selectedMedia}
            controls
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <Image
            src={selectedMedia}
            alt="Product image"
            fill
            className="object-contain rounded-lg"
            priority
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto">
        {allMedia.map((media, index) => (
          <button
            key={index}
            onClick={() => setSelectedMedia(media)}
            className={`relative w-20 h-20 rounded-md overflow-hidden ${
              selectedMedia === media ? "ring-2 ring-blue-600" : ""
            }`}
          >
            {media.endsWith(".mp4") || media.endsWith(".mov") ? (
              <video src={media} className="w-full h-full object-cover" muted />
            ) : (
              <Image
                src={media}
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
