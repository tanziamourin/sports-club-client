import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";

// ✅ Reusable Avatar component with fallback image
const Avatar = ({ src, alt, className = "" }) => (
  <img
    src={src || "https://i.ibb.co/zfvpZf8/default-user.png"}
    alt={alt || "Profile"}
    className={className}
  />
);

const ManageMembers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/members");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/admin/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
      Swal.fire("Deleted!", "Member has been removed.", "success");
    },
  });

  const filtered = members.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">All Club Members</h2>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 input input-bordered"
      />

      {isLoading ? (
        <p>Loading members...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m._id}>
                  <td>
                    <Avatar src={m.image} alt={m.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, delete!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMutation.mutate(m._id);
                          }
                        })
                      }
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <p>No members found.</p>}
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
