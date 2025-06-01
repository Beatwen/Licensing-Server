import { motion } from 'framer-motion';
import { Play, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logoLight from '../assets/images/RFGo-Logo.svg';
import logoDark from '../assets/images/RFGo-Logo-dark.svg';
import presentationVideo from '../assets/video/screen-rf-go.mp4';

const Hero = () => {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<'logo-initial' | 'video' | 'logo-final'>('logo-initial');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Précharger la vidéo dès le début
    if (videoRef.current) {
      videoRef.current.load();
    }

    const logoTimer = setTimeout(() => {
      setCurrentPhase('video');
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          console.error('Erreur lors de la lecture de la vidéo:', error);
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.error('Deuxième tentative échouée:', e));
            }
          }, 100);
        });
      }
    }, 5000);

    return () => clearTimeout(logoTimer);
  }, []);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 30) {
      // Après 30 secondes de vidéo, passer au logo final
      setCurrentPhase('logo-final');
      videoRef.current.pause();
    }
  };

  const handleVideoLoaded = () => {
    console.log('Vidéo chargée et prête à être lue');
    if (videoRef.current && currentPhase === 'video') {
      videoRef.current.play().catch(error => {
        console.error('Erreur lors de la lecture après chargement:', error);
      });
    }
  };

  const renderContent = () => {
    switch (currentPhase) {
      case 'logo-initial':
      case 'logo-final':
        return (
          <>
            <div className="flex items-center justify-center h-full w-full">
              <motion.img
                key={currentPhase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={logoLight}
                alt="RF.Go Logo"
                className="max-w-[80%] max-h-[80%] object-contain dark:hidden"
              />
              <motion.img
                key={`${currentPhase}-dark`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={logoDark}
                alt="RF.Go Logo"
                className="max-w-[80%] max-h-[80%] object-contain hidden dark:block"
              />
            </div>
            {/* Vidéo cachée mais préchargée */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
              muted
              autoPlay={false}
              playsInline
              preload="auto"
              onTimeUpdate={handleVideoTimeUpdate}
              onLoadedData={handleVideoLoaded}
              onError={(e) => console.error('Erreur vidéo:', e)}
            >
              <source src={presentationVideo} type="video/mp4" />
              Votre navigateur ne supporte pas les vidéos HTML5.
            </video>
          </>
        );
      case 'video':
        return (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            autoPlay
            playsInline
            preload="auto"
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedData={handleVideoLoaded}
            onError={(e) => console.error('Erreur vidéo:', e)}
          >
            <source src={presentationVideo} type="video/mp4" />
            Votre navigateur ne supporte pas les vidéos HTML5.
          </video>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Prenez le contrôle de vos fréquences.
              <span className="text-blue-600"> Partout. Sans compromis.</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              L'outil ultime pour gérer vos fréquences sans fil en tournée, événementiel ou installation.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard#download')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 shadow-lg hover:bg-blue-700 transition"
              >
                Télécharger l'app <Download className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('demo')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition"
              >
                Voir la démo <Play className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto w-[280px] h-[580px] bg-black rounded-[3rem] p-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl"></div>
              <div className="h-full w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;