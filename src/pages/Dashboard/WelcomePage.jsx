import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { FiUsers, FiCalendar, FiAward, FiCheckCircle, FiClock } from "react-icons/fi";

const WelcomePage = () => {
  const { role, name } = useContext(AuthContext);

  // Welcome message
  const welcomeMessage = `Welcome ${name }!`;

  const subtitle =
    role === "admin"
      ? "Manage your sports center efficiently"
      : role === "member"
      ? "Track your activities and progress"
      : "Explore our sports programs and events";

  // Stats & Chart data
  const statsConfig = {
    admin: [
      { title: "Total Members", value: 120, icon: <FiUsers /> },
      { title: "Active Plans", value: 8, icon: <FiCheckCircle /> },
      { title: "Tournaments", value: 5, icon: <FiAward /> },
      { title: "Pending Approvals", value: 3, icon: <FiClock /> },
    ],
    member: [
      { title: "My Active Plans", value: 1, icon: <FiCheckCircle /> },
      { title: "My Tournaments", value: 2, icon: <FiAward /> },
      { title: "Completed Sessions", value: 15, icon: <FiCalendar /> },
    ],
    default: [
      { title: "Available Plans", value: 8, icon: <FiCheckCircle /> },
      { title: "Upcoming Tournaments", value: 2, icon: <FiAward /> },
    ],
  };

  const barDataConfig = {
    admin: [
      { name: "Jan", Members: 30, Plans: 5 },
      { name: "Feb", Members: 50, Plans: 6 },
      { name: "Mar", Members: 40, Plans: 7 },
      { name: "Apr", Members: 60, Plans: 8 },
      { name: "May", Members: 70, Plans: 6 },
    ],
    member: [
      { name: "Week 1", Sessions: 4 },
      { name: "Week 2", Sessions: 3 },
      { name: "Week 3", Sessions: 5 },
      { name: "Week 4", Sessions: 3 },
    ],
    default: [
      { name: "Jan", Plans: 5 },
      { name: "Feb", Plans: 6 },
      { name: "Mar", Plans: 7 },
    ],
  };

  const pieDataConfig = {
    admin: [
      { name: "Active Members", value: 80 },
      { name: "Inactive Members", value: 40 },
    ],
    member: [
      { name: "Attended", value: 12 },
      { name: "Missed", value: 3 },
    ],
    default: [
      { name: "Open Slots", value: 20 },
      { name: "Booked Slots", value: 10 },
    ],
  };

  const stats = statsConfig[role] || statsConfig.default;
  const barData = barDataConfig[role] || barDataConfig.default;
  const pieData = pieDataConfig[role] || pieDataConfig.default;

  const COLORS = ["var(--color-primary)", "var(--color-accent)"];
  const chartTextColor = "var(--color-text-secondary)";

  return (
    <motion.div
      className="container px-4 py-8 mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Welcome Section */}
      <div className="text-center">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-5xl"
        >
          🏸
        </motion.div>
        <motion.h1
          className="mt-4 text-3xl font-bold md:text-4xl"
          style={{ color: "var(--color-primary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {welcomeMessage}
        </motion.h1>
        <motion.p
          className="mt-2"
          style={{ color: "var(--color-text-secondary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            className="p-6 border rounded-lg shadow-sm"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-secondary)",
              color: "var(--color-text-primary)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-surface)",
                }}
              >
                {stat.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  {stat.title}
                </h3>
                <p className="mt-1 text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <motion.div
          className="p-6 border rounded-lg shadow-sm"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-secondary)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {role === "admin" ? "Monthly Growth" : "Your Weekly Sessions"}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={chartTextColor} tick={{ fill: chartTextColor }} />
                <YAxis stroke={chartTextColor} tick={{ fill: chartTextColor }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-secondary)",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{ color: "var(--color-text-primary)" }}
                />
                <Legend />
                {barData[0]?.Members !== undefined && <Bar dataKey="Members" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />}
                {barData[0]?.Plans !== undefined && <Bar dataKey="Plans" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />}
                {barData[0]?.Sessions !== undefined && <Bar dataKey="Sessions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="p-6 border rounded-lg shadow-sm"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-secondary)" }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {role === "admin" ? "Member Status" : "Attendance Status"}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-secondary)",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value) => [value, pieData.find((d) => d.value === value)?.name]}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomePage;
