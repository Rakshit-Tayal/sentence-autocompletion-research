import React, { useState, useEffect, useRef } from 'react';

// --- (Constants and Hooks) ---

const backgroundImageUrls = [
  '/images/bg-1.jpg',
  '/images/bg-2.jpg',
  '/images/bg-3.jpg',
  '/images/bg-4.jpg'
];

// --- Corrected and Robust Typewriter Effect Hook using setTimeout ---
const useTypewriter = (text, speed = 100) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // This array will hold the IDs of all our scheduled timeouts.
    const timeoutIds = [];
    
    // Always start with an empty string.
    setDisplayText('');

    // Create a separate timeout for each character to appear.
    // This is more robust than a single interval.
    text.split('').forEach((char, index) => {
      const timeoutId = setTimeout(() => {
        setDisplayText(prev => prev + char);
      }, speed * (index + 1));
      timeoutIds.push(timeoutId);
    });

    // The cleanup function is critical. When the component unmounts or the
    // effect re-runs, it will clear ALL scheduled timeouts, preventing conflicts.
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [text, speed]); // Dependency array ensures the effect restarts if the text changes.

  return displayText;
};

// --- (Visual Components) ---

const BackgroundSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, images.length]);

  return (
    <div className="fixed inset-0 -z-20">
      {images.map((imgUrl, index) => (
        <div
          key={imgUrl}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-linear ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${imgUrl})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/70"></div>
    </div>
  );
};

const Icon = ({ path, className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const SectionCard = ({ iconPath, title, children }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <section 
      ref={ref}
      className={`bg-black/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
        <div className="bg-purple-600/20 p-2 rounded-full"><Icon path={iconPath} /></div>
        {title}
      </h2>
      {children}
    </section>
  );
};

const TimelineItem = ({ phase, title, description, isLast = false }) => (
    <div className="relative">
        <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full ring-4 ring-slate-800">
                <span className="font-bold text-white">{phase}</span>
            </div>
            {!isLast && <div className="flex-auto border-t-2 border-slate-700"></div>}
        </div>
        <div className="mt-4 pl-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    </div>
);

const CodeBlock = ({ children }) => (
    <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 my-6 text-left overflow-x-auto transition-all duration-300 hover:border-purple-500">
        <pre className="font-mono text-xs sm:text-sm text-slate-300 whitespace-pre">
            <code>{children}</code>
        </pre>
    </div>
);

const ComparisonTable = () => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                    <th className="p-4 bg-slate-800/50 border-b-2 border-slate-600 font-semibold text-white">Attribute</th>
                    <th className="p-4 bg-slate-800/50 border-b-2 border-slate-600 font-semibold text-purple-400">Recurrent Models (LSTM)</th>
                    <th className="p-4 bg-slate-800/50 border-b-2 border-slate-600 font-semibold text-green-400">Transformer Models</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-slate-700">
                    <td className="p-4 font-medium">Computation</td>
                    <td className="p-4 text-purple-400">Sequential (O(n))</td>
                    <td className="p-4 text-green-400">Parallel (O(1))</td>
                </tr>
                <tr className="border-b border-slate-700">
                    <td className="p-4 font-medium">Long-Range Dependencies</td>
                    <td className="p-4 text-purple-400">Difficult (Long path)</td>
                    <td className="p-4 text-green-400">Easy (Constant path)</td>
                </tr>
                 <tr>
                    <td className="p-4 font-medium">Core Mechanism</td>
                    <td className="p-4 text-purple-400">Recurrence (Hidden States)</td>
                    <td className="p-4 text-green-400">Self-Attention</td>
                </tr>
            </tbody>
        </table>
    </div>
);


// --- Main Page Components ---

const HomePage = ({ onNavigate }) => {
  const animatedTitle = useTypewriter("The Small Data Problem", 100);

  return (
    <div className="space-y-20">
      <header className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight animate-fade-in-down h-20">
          {animatedTitle}
          <span className="inline-block w-1 h-12 sm:h-16 ml-2 bg-purple-500 animate-pulse"></span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto animate-fade-in-down animation-delay-300">
          A Case Study on the Limits of Recurrent Models for Text Generation
        </p>
      </header>

      <main className="max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed space-y-12">
        <SectionCard title="Abstract" iconPath="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
          <p>Dominant sequence modeling architectures have historically been based on recurrent or convolutional neural networks. However, these models face significant challenges with long sequences due to their sequential nature. This project explores these limitations by training a recurrent (LSTM) model on a small text corpus. The resulting model, while achieving high training accuracy, fails to generate semantically coherent text, demonstrating the difficulty of learning long-range dependencies. This serves as a practical motivation for modern architectures that eschew recurrence in favor of global dependency mechanisms.</p>
        </SectionCard>
        
        <SectionCard title="The Challenge of Sequential Computation" iconPath="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0117.657 18.657zM12 12A2 2 0 1012 8a2 2 0 000 4z">
           <p className="mb-6">Recurrent models like LSTMs factor computation along the positions of the input sequence. By processing one token at a time, they generate a hidden state `h_t` based on the previous state `h_t-1`. This **inherently sequential nature precludes parallelization**, making training on very long sequences inefficient.</p>
           <p>More critically, this creates long paths for information to travel. To learn the relationship between the first and last words of a paragraph, a signal must traverse the entire sequence. This often leads to the **Vanishing Gradient Problem**, where the model's ability to learn long-range dependencies is severely diminished.</p>
           <CodeBlock>
{`def rnn_forward(inputs, hidden_state):
    outputs = []
    for input_t in inputs:
        # The output at time 't' depends on the previous hidden state
        output_t, hidden_state = rnn_cell(input_t, hidden_state)
        outputs.append(output_t)
    return outputs, hidden_state
`}
           </CodeBlock>
           <p className="mt-6">The model's failure in our experiment demonstrates this. It learns local patterns ("Christmas" is followed by "present") but fails to maintain the context of the entire sentence, resulting in nonsensical output.</p>
        </SectionCard>

        {/* New Timeline Section */}
        <SectionCard title="Project Roadmap" iconPath="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
            <div className="grid grid-cols-2 gap-8">
                <TimelineItem phase="1" title="LSTM Experiment" description="Demonstrate the limitations of a sequential model on a small dataset, highlighting overfitting and the failure to learn long-range context." />
                <TimelineItem phase="2" title="The Attention Solution" description="Introduce and implement a Transformer-based model, which relies entirely on self-attention to draw global dependencies between input and output." isLast={true} />
            </div>
        </SectionCard>
        
        <SectionCard title="An Alternative: The Transformer" iconPath="M13 10V3L4 14h7v7l9-11h-7z">
          <p>To address the limitations of recurrence, the Transformer architecture was proposed. It eschews sequential processing and instead relies entirely on a mechanism called **self-attention** to draw global dependencies between all words in the input and output. This allows for significantly more parallelization and, as shown in our comparison, reduces the maximum path length between dependencies to a constant, making it far easier to learn relationships between distant words.</p>
          <ComparisonTable />
          <p className="mt-6">Phase 2 of this project will involve implementing a Transformer-based model to demonstrate its superior performance on the same small dataset.</p>
        </SectionCard>
        
        <div className="text-center py-10">
          <p className="text-slate-400 mb-6">You've reviewed the background. Now, experience the limitations firsthand.</p>
          <button onClick={() => onNavigate('demo')} className="bg-purple-600 text-white font-bold text-xl py-4 px-10 rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg shadow-purple-900/50">
            Launch LSTM Experiment
          </button>
        </div>
      </main>
    </div>
  );
};

// --- (Placeholder DemoPage Component) ---
const DemoPage = ({ onNavigate }) => (
  <div className="text-center animate-fade-in">
    <button onClick={() => onNavigate('home')} className="absolute top-4 left-4 sm:top-8 sm:left-8 text-slate-400 hover:text-white transition z-10">
      <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-8 h-8"/> 
    </button>
    <h1 className="text-4xl text-white font-bold mt-20">LSTM Demo</h1>
    <p className="text-slate-400">This is where the interactive RNN demo will be implemented.</p>
  </div>
);

// --- (Main App Component) ---
function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-purple-500 selection:text-white">
      <BackgroundSlideshow images={backgroundImageUrls} />
      <div className="relative container mx-auto max-w-4xl p-4 sm:p-8">
        {page === 'home' && <HomePage onNavigate={setPage} />}
        {page === 'demo' && <DemoPage onNavigate={setPage} />}
      </div>
    </div>
  );
}

export default App;

