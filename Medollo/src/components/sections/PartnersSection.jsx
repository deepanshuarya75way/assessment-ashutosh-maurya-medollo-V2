import { motion } from 'framer-motion';

const PartnersSection = () => {
  const partners = [
    { id: 1, name: 'PayTM', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=PayTM' },
    { id: 2, name: 'PhonePe', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=PhonePe' },
    { id: 3, name: 'Google Pay', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=GooglePay' },
    { id: 4, name: 'Amazon Pay', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=AmazonPay' },
    { id: 5, name: 'HDFC', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=HDFC' },
    { id: 6, name: 'Axis Bank', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=AxisBank' },
    { id: 7, name: 'ICICI', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=ICICI' },
    { id: 8, name: 'SBI', logo: 'https://placehold.co/200x80/EAEAEA/666666/png?text=SBI' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-12 bg-lightgray">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold text-darkblue mb-2">Our Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We collaborate with trusted partners to bring you the best healthcare solutions
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-6 shadow-md flex items-center justify-center"
            >
              <img 
                src={partner.logo} 
                alt={`${partner.name} logo`}
                className="max-h-12 max-w-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Trust Badge Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="container-custom mt-16"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-darkblue mb-2">Trusted By Millions</h3>
            <p className="text-gray-600">Our commitment to quality and service has earned us the trust of customers nationwide</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: "🔒", title: "Secure Payments", desc: "100% Secure Transactions" },
              { icon: "🛡️", title: "Quality Assured", desc: "Genuine Products Guaranteed" },
              { icon: "⚕️", title: "Licensed Pharmacy", desc: "Registered with Pharmacy Council" },
              { icon: "🚚", title: "Fast Delivery", desc: "Nationwide Coverage" },
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center p-4"
              >
                <div className="text-3xl mb-3">{badge.icon}</div>
                <h4 className="font-medium text-darkblue">{badge.title}</h4>
                <p className="text-sm text-gray-500">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PartnersSection;