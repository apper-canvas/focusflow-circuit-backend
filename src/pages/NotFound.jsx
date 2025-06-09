import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center text-white max-w-md mx-auto px-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="Timer" className="w-24 h-24 mx-auto opacity-80" />
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg opacity-90 mb-8">
          Looks like you've wandered off your focus path.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-white text-primary px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          Back to Timer
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;