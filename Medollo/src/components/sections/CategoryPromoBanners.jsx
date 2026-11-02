import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CategoryPromoBanners = () => {
  const navigate = useNavigate();

  const banners = [
    {
      id: 1,
      title: "Pet Care supplies in minutes",
      description: "Food, treats, toys & more",
      cta: "Order Now",
      bgColor: "bg-yellow-400", // Bright yellow
      textColor: "text-black",
      buttonBg: "bg-black",
      buttonText: "text-white",
      images: [
       
        {
          type: "dog",
          src: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop",
          className: "absolute right-14 top-10 w-32 h-32 object-cover rounded-full z-20 shadow-lg"
        },
       
        {
          type: "food2",
          src: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150&h=150&fit=crop",
          className: "absolute right-8 bottom-8 w-28 h-32 object-cover rounded-lg -rotate-6 z-10 shadow-md"
        },
      
      ]
    },
    {
      id: 2,
      title: "Pharmacy at your door step",
      description: "Get all your healthcare needs delivered to your doorstep",
      cta: "Order Now",
      bgColor: "bg-blue-300", // Light blue
      textColor: "text-black",
      buttonBg: "bg-black",
      buttonText: "text-white",
      images: [
        {
          type: "baby",
          src: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=300&h=300&fit=crop",
          className: "absolute right-0 top-0 w-48 h-56 object-cover rounded-xl z-10"
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/products')}
          className={`${banner.bgColor} rounded-xl p-8 cursor-pointer shadow-lg hover:shadow-xl transition-all relative overflow-hidden min-h-[220px]`}
        >
          {/* Content */}
          <div className="relative z-20">
            <h3 className={`text-3xl font-bold mb-2 ${banner.textColor}`}>
              {banner.title}
            </h3>
            <p className={`text-base mb-6 ${banner.textColor} opacity-90`}>
              {banner.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${banner.buttonBg} ${banner.buttonText} px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all`}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/products');
              }}
            >
              {banner.cta}
            </motion.button>
          </div>

          {/* Images */}
          <div className="absolute inset-0 z-10">
            {banner.images.map((img, idx) => (
              <motion.img
                key={idx}
                src={img.src}
                alt={img.type}
                className={img.className}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>

          {/* Decorative elements for Pet Care */}
          {banner.id === 1 && (
            <>
              <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-500 opacity-20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-yellow-500 opacity-20 rounded-full blur-xl"></div>
            </>
          )}

          {/* Decorative elements for Baby Care */}
          {banner.id === 2 && (
            <>
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-400 opacity-10 rounded-full blur-xl"></div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryPromoBanners;

