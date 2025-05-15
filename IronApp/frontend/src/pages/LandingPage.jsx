import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Activity, Utensils, Target } from 'lucide-react';
import landingPagePic2 from '../assets/landingPagePic2.jpeg.webp';


const LandingPage = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-[var(--neutral-color-blue)] to-gray-900 text-white">
      {/* Navigation */}
      <motion.nav
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="py-6 px-4 sm:px-6 lg:px-8 z-20 relative"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold tracking-tight" style={{ color: 'var(--primary-color-teal)' }}>
            Gym<span style={{ color: 'var(--accent-color-orange)'}}>Nutrition</span>
          </Link>
          <div className="space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium rounded-md hover:opacity-90 transition-opacity flex items-center text-white"
              style={{ backgroundColor: 'var(--primary-color-teal)'}}
            >
              <LogIn size={16} className="mr-2" />
              Sign In
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main 
        className="flex-grow flex items-center justify-center relative bg-fixed bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${landingPagePic2})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-24 relative z-10" 
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Elevate Your <span style={{ color: 'var(--primary-color-teal)'}}>Fitness</span> Journey.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-200"
          >
            Track meals, monitor progress, and achieve your health goals. Seamlessly plan your diet and stay motivated.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-10 flex justify-center space-x-4"
          >
            <Link
              to="/register"
              className="px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center"
              style={{ backgroundColor: 'var(--accent-color-orange)', color: 'var(--neutral-color-blue)'}}
            >
              Register for free
            </Link>
          </motion.div>
        </motion.div>
      </main>
      
      {/* Mini Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="py-16 md:py-24 relative z-10"
          style={{ backgroundColor: 'var(--neutral-color-blue)' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12 text-white">
              Everything you need to succeed.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div variants={itemVariants} className="p-6 rounded-lg bg-white/10">
                <Utensils size={48} className="mx-auto mb-4" style={{ color: 'var(--primary-color-teal)'}} />
                <h3 className="text-xl font-semibold mb-2 text-white">Effortless Food Logging</h3>
                <p className="text-gray-300">Quickly log your meals from our food database.</p>
              </motion.div>
              <motion.div variants={itemVariants} className="p-6 rounded-lg bg-white/10">
                <Target size={48} className="mx-auto mb-4" style={{ color: 'var(--primary-color-teal)'}} />
                <h3 className="text-xl font-semibold mb-2 text-white">Future Food Tracking</h3>
                <p className="text-gray-300">Track your food for days or weeks in advance with ease.</p>
              </motion.div>
              <motion.div variants={itemVariants} className="p-6 rounded-lg bg-white/10">
                <Activity size={48} className="mx-auto mb-4" style={{ color: 'var(--primary-color-teal)'}} />
                <h3 className="text-xl font-semibold mb-2 text-white">Track Your Progress</h3>
                <p className="text-gray-300">Monitor weight and nutritional intake to stay on track with your goals.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>


      {/* Footer */}
      <motion.footer
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="py-8 text-center relative z-10 bg-gray-900"
      >
        <p className="text-sm text-gray-400">
        Project created for educational purposes by Sam, Ryan, and Domenica.
        </p>
      </motion.footer>
    </div>
  );
};

export default LandingPage; 