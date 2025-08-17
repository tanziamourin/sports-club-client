import { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { FiEdit, FiMail, FiUser, FiCalendar, FiPhone, FiMapPin } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex flex-col overflow-hidden bg-white shadow-xl md:flex-row dark:bg-gray-800 rounded-2xl"
          variants={itemVariants}
        >
          {/* Profile Sidebar */}
          <div className="flex flex-col items-center p-8 md:w-1/3 bg-gradient-to-b from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative mb-6 group"
            >
              <img
                src={user?.photoURL || "https://i.ibb.co/ck1SGFJ/profile-placeholder.png"}
                alt="Profile"
                className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-lg dark:border-gray-200"
              />
              <button className="absolute bottom-0 right-0 p-2 transition-all bg-white rounded-full shadow-md opacity-0 dark:bg-gray-700 group-hover:opacity-100">
                <FiEdit className="text-primary-600 dark:text-primary-400" />
              </button>
            </motion.div>

            <motion.h2 
              className="mb-1 text-2xl font-bold text-center"
              variants={itemVariants}
            >
              {user?.displayName || "Guest User"}
            </motion.h2>
            
            <motion.p 
              className="mb-6 text-primary-100 dark:text-primary-200"
              variants={itemVariants}
            >
              {user?.email}
            </motion.p>

            <motion.div 
              className="w-full p-4 mb-6 bg-white rounded-lg dark:bg-gray-700 bg-opacity-20"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Complete</span>
                <span className="text-sm font-bold">75%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600">
                <div 
                  className="h-2 bg-white rounded-full" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </motion.div>
{/* 
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 font-medium bg-white rounded-lg shadow-sm dark:bg-gray-700 text-primary-600 dark:text-primary-400"
              variants={itemVariants}
            >
              Edit Profile
            </motion.button> */}
          </div>

          {/* Profile Details */}
          <div className="p-8 md:w-2/3">
            <motion.h3 
              className="flex items-center mb-6 text-2xl font-bold text-gray-800 dark:text-white"
              variants={itemVariants}
            >
              <FiUser className="mr-2 text-primary-600 dark:text-primary-400" />
              Personal Information
            </motion.h3>

            <motion.div 
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
              variants={containerVariants}
            >
              {/* Personal Info */}
              <motion.div 
                className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl"
                variants={itemVariants}
              >
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Basic Details</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiMail className="mt-1 mr-3 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-700 dark:text-gray-300">{user?.email || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-3 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.metadata?.creationTime
                          ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl"
                variants={itemVariants}
              >
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Additional Information</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiPhone className="mt-1 mr-3 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-700 dark:text-gray-300">{user?.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMapPin className="mt-1 mr-3 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-700 dark:text-gray-300">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Membership Info */}
              <motion.div 
                className="p-5 md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl"
                variants={itemVariants}
              >
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Membership Details</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Membership Tier</p>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">Gold</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {user?.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Today</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;