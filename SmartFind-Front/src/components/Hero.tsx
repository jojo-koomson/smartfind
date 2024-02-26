import { motion } from "framer-motion";
import bg from '../assets/image-1-1.jpeg';
import bg2 from '../assets/GettyImages-9.jpg';
import { NavLink } from "react-router-dom";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-800 text-white bg-center bg-cover bg-blend-overlay bg-fixed bg-black/30" 
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex-grow flex flex-col justify-center items-center max-w-full bg-opacity-40 p-8 text-white">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="text-center mx-auto">
              <motion.h1 className="text-4xl sm:text-6xl font-semibold" 
                animate={{ x: [null, 100, 0] }}
                variants={containerVariants}
              >
                Welcome to Smart Find!
              </motion.h1>
              <motion.p className="font-light text-lg sm:text-3xl mt-5" variants={containerVariants}>
                Search and let's get you connected.
              </motion.p>
            </div>
            <motion.div className="flex justify-center mt-10" variants={buttonVariants}>
              <NavLink to={"/MapSearchpage"}>
                <a className="px-6 py-3 sm:px-9 sm:py-3 rounded-lg text-white text-lg sm:text-xl bg-blue-600 hover:bg-cyan-400 transition-colors" href="">
                  Get Started
                </a>
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.section
        className="min-h-screen bg-slate-800 text-white bg-center bg-cover bg-blend-overlay bg-fixed bg-black/30 relative overflow-hidden"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <motion.div
          variants={buttonVariants}
          className="flex justify-center items-center mt-20 sm:mt-64"
        >
          <div className="flex-grow flex flex-col justify-center items-center max-w-full bg-opacity-30 p-8 text-white">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="text-center mx-auto">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-4xl sm:text-6xl font-semibold"
                  variants={containerVariants}
                >
                  Service that leaves a smile on your face
                </motion.h1>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Hero;
