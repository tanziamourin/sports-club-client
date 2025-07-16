import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MemberAnnouncements = () => {
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4 mt-20">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-6">Club Announcements</h2>
      {announcements.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        <ul className="space-y-3 ">
          {announcements.map((item) => (
            <li key={item._id} className="p-3 bg-white border rounded shadow">
              <h4 className="mb-2 font-semibold text-[var(--color-primary)]">{item.title}</h4>
              <p className="text-[var(--color-text-primarys)]">{item.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberAnnouncements;
