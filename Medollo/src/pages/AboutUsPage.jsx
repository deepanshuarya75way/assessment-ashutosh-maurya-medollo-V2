import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/ui/PageTransition";

const AboutUsPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const teamMembers = [
    {
      name: "Dr. Rajesh Sharma",
      position: "Founder & CEO",
      image: "https://placehold.co/400x400/001E42/FFFFFF/png?text=RS",
      bio: "Dr. Sharma founded Medollo with a vision to make healthcare accessible to all. With over 20 years of experience in the pharmaceutical industry, he leads our mission to revolutionize healthcare delivery.",
    },
    {
      name: "Priya Patel",
      position: "Chief Operations Officer",
      image: "https://placehold.co/400x400/FF385C/FFFFFF/png?text=PP",
      bio: "With a background in logistics and supply chain management, Priya ensures that Medollo delivers medicines promptly and maintains the highest standards in operations.",
    },
    {
      name: "Dr. Ankit Kumar",
      position: "Chief Medical Officer",
      image: "https://placehold.co/400x400/24AEB1/FFFFFF/png?text=AK",
      bio: "Dr. Kumar oversees our medical content and ensures that all health advice and product information is accurate. He is passionate about health education and patient safety.",
    },
    {
      name: "Meera Reddy",
      position: "Technology Head",
      image: "https://placehold.co/400x400/FF385C/FFFFFF/png?text=MR",
      bio: "Meera leads our tech team, developing innovative solutions for healthcare delivery. Her focus on creating a seamless digital experience has been instrumental in our growth.",
    },
  ];

  const milestones = [
    {
      year: "2015",
      title: "Foundation of Medollo",
      description:
        "Started as a small online pharmacy with delivery service in one city.",
    },
    {
      year: "2017",
      title: "Expansion to Major Cities",
      description:
        "Extended operations to cover all major metropolitan areas in the country.",
    },
    {
      year: "2019",
      title: "Launch of Health Consultation",
      description:
        "Added online doctor consultation services to provide complete healthcare solutions.",
    },
    {
      year: "2021",
      title: "Diagnostic Services Integration",
      description:
        "Partnered with leading diagnostic labs to offer home sample collection and testing services.",
    },
    {
      year: "2023",
      title: "Mobile App Launch",
      description:
        "Released our mobile application for convenient access to all our services.",
    },
  ];

  return (
    <PageTransition variant="slide">
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-darkblue to-primary text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.7 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                About Medollo
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl opacity-90"
              >
                Our mission is to make healthcare accessible, affordable, and
                convenient for everyone.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={
                  isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
                }
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-darkblue mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2015, Medollo began with a simple idea: to make
                    healthcare accessible to everyone, regardless of their
                    location or circumstances. Our founder, Dr. Rajesh Sharma,
                    experienced firsthand the challenges people faced in
                    accessing quality medicines and healthcare advice.
                  </p>
                  <p>
                    What started as a small online pharmacy has now grown into a
                    comprehensive healthcare platform offering a wide range of
                    services - from medicine delivery and health consultations
                    to diagnostic services and health products.
                  </p>
                  <p>
                    Through our journey, we've remained committed to our core
                    values of authenticity, reliability, and
                    customer-centricity. Every medicine delivered, every
                    consultation provided, and every service offered is backed
                    by our promise of quality and care.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isVisible
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -top-5 -left-5 w-24 h-24 bg-primary/10 rounded-full z-0"></div>
                <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-secondary/10 rounded-full z-0"></div>
                <img
                  src="https://placehold.co/600x400/24AEB1/FFFFFF/png?text=Our+Journey"
                  alt="Medollo Story"
                  className="rounded-xl shadow-lg relative z-10"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold text-center text-darkblue mb-12"
            >
              Our Core Values
            </motion.h2>

            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: "🛡️",
                  title: "Trust & Authenticity",
                  description:
                    "We ensure that every product on our platform is genuine and sourced directly from authorized manufacturers.",
                },
                {
                  icon: "❤️",
                  title: "Care & Compassion",
                  description:
                    "We believe in putting our customers first and providing services with empathy and understanding.",
                },
                {
                  icon: "🚀",
                  title: "Innovation",
                  description:
                    "We continually strive to improve our services through technological advancements and creative solutions.",
                },
                {
                  icon: "🤝",
                  title: "Accessibility",
                  description:
                    "We are committed to making healthcare accessible to everyone, regardless of location or circumstances.",
                },
                {
                  icon: "⏱️",
                  title: "Reliability",
                  description:
                    "We understand the importance of timely delivery and consistent service quality in healthcare.",
                },
                {
                  icon: "🔒",
                  title: "Privacy & Security",
                  description:
                    "We prioritize the security of our customers' data and maintain strict confidentiality standards.",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-darkblue mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold text-darkblue mb-3"
              >
                Meet Our Team
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-gray-600 max-w-xl mx-auto"
              >
                The passionate individuals behind Medollo who work tirelessly to
                make healthcare better for you.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-darkblue">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline/Milestones */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold text-darkblue mb-3"
              >
                Our Journey
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-gray-600 max-w-xl mx-auto"
              >
                Key milestones in our mission to transform healthcare delivery.
              </motion.p>
            </div>

            <div className="relative">
              {/* Vertical Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>

              <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={containerVariants}
                className="space-y-12"
              >
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`flex flex-col md:flex-row ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="md:w-1/2 p-6">
                      <div
                        className={`md:${
                          index % 2 === 0 ? "text-right" : "text-left"
                        }`}
                      >
                        <div className="inline-block px-4 py-2 bg-primary text-white text-lg font-bold rounded-lg mb-3">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold text-darkblue mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Circle Indicator */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow"></div>
                    </div>

                    <div className="md:w-1/2"></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-secondary to-primary text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold mb-4"
              >
                Join Us in Our Mission
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-lg mb-8 opacity-90"
              >
                Be a part of our journey to make healthcare accessible and
                affordable for all. Whether you're a customer, partner, or
                someone who shares our vision, there's a place for you in the
                Medollo community.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100"
                >
                  Contact Us
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-darkblue text-white font-medium rounded-md hover:bg-opacity-90"
                >
                  Career Opportunities
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AboutUsPage;
