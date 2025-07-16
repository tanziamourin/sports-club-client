import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  return (
    <div className="mt-20">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-6">Club Announcements</h2>
      <ul className="space-y-5 ">
        {announcements.map((item) => (
          <li key={item._id} className="p-3 bg-white border rounded shadow ">
            <h2 className="mb-2 text-[var(--color-primary)] font-semibold">{item.title}</h2>
            <p className="text-[var(--color-text-primarys)]">{item.message}</p>
          </li>
        ))}
      </ul>
     
    </div>
  );
};

export default Announcements;
