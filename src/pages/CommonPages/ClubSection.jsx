import {
  FaUsers,
  FaTrophy,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ClubSection = () => {
  const stats = [
    {
      value: "250+",
      label: "Active Members",
      icon: <FaUsers className="text-3xl" />,
    },
    {
      value: "12",
      label: "Championships Won",
      icon: <FaTrophy className="text-3xl" />,
    },
    {
      value: "Daily",
      label: "Training Sessions",
      icon: <FaCalendarAlt className="text-3xl" />,
    },
    {
      value: "5",
      label: "Court Locations",
      icon: <FaMapMarkerAlt className="text-3xl" />,
    },
  ];

  const features = [
    {
      title: "Professional Coaching",
      description: "Certified trainers for all skill levels",
      icon: "👨‍🏫",
    },
    {
      title: "Tournament Ready",
      description: "Regular competitive events",
      icon: "🏆",
    },
    {
      title: "Youth Programs",
      description: "Special training for young athletes",
      icon: "🧒",
    },
    {
      title: "Flexible Memberships",
      description: "Options for every commitment level",
      icon: "💳",
    },
  ];

  return (
    <section className="py-16 ">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] md:text-4xl">
            Our Sports Club
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-[var(--color-text-primary)] dark:text-gray-300">
            Where passion meets performance in a community dedicated to
            excellence
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6 mb-16 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-6 text-center rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-surface)] 
                 shadow-md hover:shadow-2xl transition-shadow"
            >
              <div className="flex justify-center text-[var(--color-primary)] dark:text-[var(--color-secondary)]">
                {stat.icon}
              </div>
              <h3 className="mt-3 text-2xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
                {stat.value}
              </h3>
              <p className="mt-1 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Features and Image */}
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Features List */}
          <div className="lg:w-1/2">
            <h3 className="mb-6 text-2xl font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
              Why Choose Our Club?
            </h3>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-surface)] shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl rounded-xl bg-[var(--color-secondary)]/20 dark:bg-[var(--color-secondary)]/30">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="px-8 py-3 mt-8 font-semibold text-white transition-all duration-300 rounded-lg shadow-md hover:shadow-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 dark:bg-[var(--color-secondary)] dark:hover:bg-[var(--color-secondary)]/90">
              Join Today
            </button>
          </div>

          {/* Image */}
          <div className="lg:w-1/2">
            <div className="relative overflow-hidden shadow-xl rounded-xl aspect-video">
              <img
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
                alt="Club members playing"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">Community First</h3>
                <p className="mt-1">Where every member becomes family</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="mb-8 text-2xl font-semibold text-center text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
            What Our Members Say
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "The coaching transformed my game completely!",
                author: "Sarah J.",
                role: "Competitive Player",
              },
              {
                quote: "Best facilities and friendliest community around.",
                author: "Mike T.",
                role: "Weekend Warrior",
              },
              {
                quote: "My kids love the youth programs!",
                author: "Priya K.",
                role: "Parent",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-surface)] shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-yellow-400">★★★★★</div>
                <p className="mt-4 italic text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
                  "{testimonial.quote}"
                </p>
                <div className="mt-4">
                  <p className="font-medium text-[var(--color-primary)] dark:text-[var(--color-secondary)]">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubSection;
