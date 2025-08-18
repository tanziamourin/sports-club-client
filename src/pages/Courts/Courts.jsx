import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CourtCard from "./CourtCard";

const Courts = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courts", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/courts?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const courts = data?.courts || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner text-[var(--color-primary)]"></span>
      </div>
    );
  if (isError || !data || !Array.isArray(data.courts))
    return <p className="p-6">No courts found.</p>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <CourtCard key={court._id} court={court} />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn btn-sm ${
              page === i + 1 ? "btn-primary" : "btn-outline"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Courts;
