import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";

const UserAnnouncements = () => {
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-center mt-10 text-[var(--color-text-secondary)]">
        Loading announcements...
      </p>
    );

  return (
    <div className="max-w-4xl px-4 mx-auto mt-20">
      <h2
        className="mb-8 text-4xl font-bold text-center lg:text-5xl"
        style={{ color: "var(--color-primary)" }}
      >
        Club Announcements
      </h2>

      {announcements.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">
          No announcements available.
        </p>
      ) : (
        <div className="grid gap-6">
          {announcements.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 transition-all border-l-4 shadow-md rounded-2xl"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-primary)",
              }}
            >
              <h4 className="mb-2 text-xl font-semibold text-[var(--color-primary)]">
                {item.title}
              </h4>
              <p className="text-[var(--color-text-primary)]">{item.message}</p>
              {item.date && (
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAnnouncements;
