import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";
import { motion } from "framer-motion";

const Avatar = ({ src, alt, className }) => (
  <img
    src={src || "https://i.ibb.co/zfvpZf8/default-user.png"}
    alt={alt || "Profile"}
    className={className}
  />
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 }},
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

const ManageMembers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [view, setView] = useState("card"); // default view = card
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => (await axiosSecure.get("/admin/members")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/admin/members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
      Swal.fire("Deleted!", "Member has been removed.", "success");
    },
  });

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a,b)=>{
    const A  = sortField==="createdAt" ? new Date(a[sortField]) : (a[sortField]?.toLowerCase() ||"");
    const B  = sortField==="createdAt" ? new Date(b[sortField]) : (b[sortField]?.toLowerCase() ||"");
    return sortOrder==="asc" ? (A>B?1:-1) : (A<B?1:-1);
  });

  const handleSort = (field)=>{
    if(field===sortField) setSortOrder(sortOrder==="asc"?"desc":"asc");
    else { setSortField(field); setSortOrder("asc");}
  }

  /*------------------------------------------------------------------------*/
  /* Card layout (avatar,name,email,status,date,delete)                     */
  /*------------------------------------------------------------------------*/
  const renderCards = () => (
    <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {sorted.map((m) => (
        <motion.div
          key={m._id}
          variants={rowVariants}
          whileHover={{ y: -3, boxShadow: "0px 6px 14px rgba(0,0,0,0.08)" }}
          className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-secondary)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Avatar src={m.image} alt={m.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold" style={{color:"var(--color-text-primary)"}}>{m.name}</p>
              <p className="text-sm" style={{color:"var(--color-text-secondary)"}}>{m.email}</p>
            </div>
          </div>

          <p className="mb-2 text-sm" style={{color:"var(--color-text-secondary)"}}>
            Joined: {new Date(m.createdAt).toLocaleDateString()}
          </p>

          <span className={`inline-block px-3 py-1 text-xs rounded font-semibold mb-4 ${
            m.status === "suspended"
              ? "bg-red-100 text-red-600"
              : m.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-600"
          }`}>
            {m.status || "active"}
          </span>

          <button
            onClick={() =>
              Swal.fire({
                title:"Are you sure?",
                text:"You won’t be able to revert this!",
                icon:"warning",
                showCancelButton:true,
                confirmButtonText:"Yes, delete!"
              }).then(res=>{
                if(res.isConfirmed) deleteMutation.mutate(m._id);
              })
            }
            className="w-full py-2 text-sm rounded-lg hover:scale-[1.02] transition"
            style={{background:"var(--color-primary)",color:"var(--color-surface)"}}
          >
            Delete
          </button>
        </motion.div>
      ))}
    </motion.div>
  );

  /*------------------------------------------------------------------------*/
  /* Table layout                                                           */
  /*------------------------------------------------------------------------*/
  const renderTable = () => (
    <div className="overflow-x-auto rounded-xl"
         style={{background:"var(--color-surface)",border:"1px solid var(--color-secondary)"}}>
      <table className="min-w-full">
        <thead style={{background:"var(--color-secondary)",color:"#fff"}}>
          <tr>
            <th className="px-6 py-3 text-left">Photo</th>
            <th className="px-6 py-3 text-left cursor-pointer" onClick={()=>handleSort('name')}>
              Name {sortField==='name' ? (sortOrder==='asc'?'⬆️':'⬇️') : '' }
            </th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left cursor-pointer" onClick={()=>handleSort('createdAt')}>
              Joined {sortField==='createdAt' ? (sortOrder==='asc'?'⬆️':'⬇️') : '' }
            </th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>

        <motion.tbody variants={containerVariants} initial="hidden" animate="show">
        {sorted.map(m=>(
            <motion.tr key={m._id} variants={rowVariants} whileHover={{background:"var(--color-background)"}}>
              <td className="px-6 py-4"><Avatar src={m.image} alt={m.name} className="w-10 h-10 rounded-full"/></td>
              <td className="px-6 py-4">{m.name}</td>
              <td className="px-6 py-4">{m.email}</td>
              <td className="px-6 py-4">{new Date(m.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs uppercase font-semibold ${
                    m.status==='suspended'? 'bg-red-100 text-red-600'
                    : m.status==='pending'? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-600'
                }`}>{m.status || "active"}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={()=>Swal.fire({
                      title:"Are you sure?",
                      text:"You won’t be able to revert this!",
                      icon:"warning",
                      showCancelButton:true,
                      confirmButtonText:"Yes, delete!"
                    }).then(res=>{ if(res.isConfirmed) deleteMutation.mutate(m._id);})}
                  className="px-3 py-1 text-xs rounded-lg"
                  style={{background:"var(--color-primary)",color:"var(--color-surface)"}}>
                  Delete
                </button>
              </td>
            </motion.tr>
        ))}
        </motion.tbody>
      </table>
      {sorted.length===0 && (
        <p className="py-4 text-center" style={{color:"var(--color-text-secondary)"}}>No members found.</p>
      )}
    </div>
  );

  /*------------------------------------------------------------------------*/

  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="p-4">
      <h2 className="mb-8 text-4xl font-bold" style={{color:"var(--color-primary)"}}>All Club Members</h2>

      {/* Toggle buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={()=>setView("card")}
          className={`px-4 py-2 rounded-lg text-sm ${view==="card" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] border"}`}
        >
          Card View
        </button>
        <button
          onClick={()=>setView("table")}
          className={`px-4 py-2 rounded-lg text-sm ${view==="table" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] border"}`}
        >
          Table View
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search by name"
        className="w-full px-4 py-2 mb-4 border rounded-lg md:w-1/3"
        style={{background:"var(--color-surface)",color:"var(--color-text-primary)",borderColor:"var(--color-secondary)"}}
      />

      {isLoading ? <p>Loading members...</p> : (view==="card" ? renderCards() : renderTable())}
    </motion.div>
  );
};

export default ManageMembers;
