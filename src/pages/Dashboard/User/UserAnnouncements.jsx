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
    <div>
      <h2 className="mb-4 text-2xl font-bold">Club Announcements</h2>
      <ul className="space-y-3">
        {announcements.map((item) => (
          <li key={item._id} className="p-3 bg-white border rounded shadow">
            <h4 className="font-semibold">{item.title}</h4>
            <p>{item.message}</p>
          </li>
        ))}
      </ul>
     
    </div>
  );
};

export default Announcements;
