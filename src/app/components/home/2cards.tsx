import Link from "next/link";

const NewArrivalsSection = () => {
  const products = [
    {
      id: 1,
      title: "NEW ARRIVALS",
      name: "GoPro HERO9",
      description: "Revolutionary 5K video",
      href: "/shop/gopro-hero9",
      bgImage: "/images/home/banner/2.jpg",
    },
    {
      id: 2,
      title: "SPECIAL DEALS",
      name: "43 inch UHD 4K",
      description: "Next-level performance ",
      href: "/shop/gopro-hero10",
      bgImage: "/images/home/banner/4.jpg",
    },
  ];

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 font-jamjuree">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative rounded-xl overflow-hidden shadow-[2px_4px_18px_rgba(0,0,0,0.2)] flex flex-col justify-end h-[34vh] lg:h-[50vh]"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-top bg-no-repeat"
              style={{ backgroundImage: `url(${product.bgImage})` }}
            >
              <div className="absolute inset-0"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative p-6 lg:p-10 z-10 w-full xl:w-1/2">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mt-2 mb-4">
                {product.name}
              </h3>
              <p className="text-sm lg:text-md text-white mt-2 mb-6">
                {product.description}
              </p>
              <Link
                href="#"
                className="text-md font-medium text-white hover:text-blue-400 inline-flex items-center"
              >
                Shop Now
                <span className="ml-2">&#8594;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
