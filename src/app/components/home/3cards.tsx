import Image from "next/image";
import Link from "next/link";

const NewArrivalsSection = () => {
  const products = [
    {
      id: 1,
      title: "NEW ARRIVALS",
      name: "GoPro HERO9",
      description: "Revolutionary 5K video",
      href: "/shop/gopro-hero9",
      bgImage: "/images/home/banner2-01.webp",
    },
    {
      id: 2,
      title: "SPECIAL DEALS",
      name: "43 inch UHD 4K",
      description: "Next-level performance ",
      href: "/shop/gopro-hero10",
      bgImage: "/images/home/banner2-02.webp",
    },
    {
      id: 3,
      title: "GAMING MOUSE",
      name: "GXT 110 FELOX",
      description: "Larger sensor, enhanced features ",
      href: "/shop/gopro-hero11",
      bgImage: "/images/home/banner2-03.webp",
    },
  ];

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 font-jamjuree">
      {/* <div className="text-center mb-12">
        <span className="text-blue-600 font-semibold text-lg tracking-wide">
          New Arrivals
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold text-black mt-2">
          Latest GoPro Collection
        </h2>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative rounded-xl overflow-hidden shadow-[2px_4px_18px_rgba(0,0,0,0.2)] transition-shadow duration-300 flex flex-col lg:flex-row min-h-70"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${product.bgImage})` }}
            >
              <div className="absolute inset-0"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative p-6 flex-1 lg:w-1/2 flex flex-col z-10 justify-center">
              <div>
                <span className="text-blue-400 font-semibold text-xs tracking-wide">
                  {product.title}
                </span>
                <h3 className="text-xl font-bold text-black mt-2 mb-4">
                  {product.name}
                </h3>
              </div>
              <Link
                href="/"
                className="text-sm font-medium text-black hover:text-blue-400"
              >
                Shop Now &#8594;
              </Link>
            </div>

            {/* Product Image - Right */}
            <div className="relative h-48 lg:h-auto lg:w-1/2 lg:flex-shrink-0 z-10"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
