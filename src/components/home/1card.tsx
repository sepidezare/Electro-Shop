export default function OneCard() {
  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 font-jamjuree rounded-xl">
      <div className="relative lg:min-h-120 bg-gray-900 rounded-xl">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
          style={{
            backgroundImage: "url('/images/home/banner/tv-banner.webp')",
          }}
        ></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-100 font-jamjuree">
          <div className="w-full flex justify-end items-center">
            {/* Text and Button Content */}
            <div className="max-w-lg text-center">
              <h6 className="text-xl text-white mb-4">
                Discover Amazing Experiences
              </h6>
              <h6 className="text-4xl font-bold text-white mb-4">
                monitor screen for gaming
              </h6>
              <p className="text-sm text-white mb-6 leading-relaxed">
                34&quot; Curved Monitor | 3K 165Hz Display | Stereo SoundBar
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white hover:bg-blue-700 hover:text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-102">
                  SHOP NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
