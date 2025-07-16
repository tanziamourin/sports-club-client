import { motion } from "framer-motion";

const CouponBadge = ({ code, discount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="px-6 py-4 text-center border-2 border-dashed shadow-md rounded-xl"
      style={{
        borderColor: "var(--color-accent)",
        backgroundColor: "white",
        minWidth: "200px",
        // marginTop:'20px'
      }}
    >
      <h4
        className="mb-2 text-lg font-bold"
        style={{ color: "var(--color-primary)" }}
      >
        {code}
      </h4>
      <p className="font-medium text-gray-700">{discount}% OFF</p>
    </motion.div>
  );
};

export default CouponBadge;
