import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

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
    return <p className="text-center mt-10 text-[var(--color-text-secondary)]">Loading announcements...</p>;

  return (
    <div className="max-w-4xl px-4 mx-auto mt-20">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-8">
        Club Announcements
      </h2>

      {announcements.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">
          No announcements available.
        </p>
      ) : (
        <ul className="space-y-6">
          {announcements.map((item) => (
            <li
              key={item._id}
              className="p-6 bg-[var(--color-surface)] rounded-2xl shadow hover:shadow-lg transition border-l-4 border-[var(--color-primary)]"
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserAnnouncements;
