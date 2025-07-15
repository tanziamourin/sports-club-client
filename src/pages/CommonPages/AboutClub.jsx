import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const aboutData = [
  {
    title: '📜 Our History',
    text: 'Founded in 1995, our club began as a small group of sports lovers. Today, we are a premier destination for athletes.',
    animation: 'https://lottie.host/23ffdb59-ed7a-4424-a1fb-3d6824c5503d/zckrPiEv4H.lottie'
  },
  {
    title: '🎯 Our Mission',
    text: 'To foster a passionate and active community through professional facilities, inclusive programs, and events.',
    animation: 'https://lottie.host/a01609d8-dcdf-45bc-8c07-b72c053b81a8/0bys81HpMN.lottie'
  },
  {
    title: '🚀 Our Vision',
    text: 'To redefine the local sports experience by building a legacy of excellence, inclusiveness, and innovation.',
    animation: 'https://lottie.host/0b2b25e3-cd83-45af-b7d5-8624260c2b84/pZR5ko3RNS.lottie'
  },
];

const AboutClub = () => {
  return (
    <section className="w-full h-auto overflow-y-hidden bg-[var(--color-background)] px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-[var(--color-primary)] text-center mb-12">About the Club</h2>

        <div className="relative border-l-4 border-[var(--color-primary)] space-y-20">
          {aboutData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="relative pl-10"
            >
              {/* Timeline Dot */}
              <span className="absolute left-[-11px] top-3 w-5 h-5 bg-[var(--color-accent)] border-4 border-white rounded-full z-10 animate-ping"></span>

              {/* Card */}
              <div className="flex flex-col items-center gap-6 p-6 transition duration-300 bg-white shadow-lg md:flex-row rounded-xl hover:shadow-xl">
                <div className="w-full md:w-1/2">
                  <DotLottieReact
                    src={item.animation}
                    loop
                    autoplay
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">{item.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutClub;
