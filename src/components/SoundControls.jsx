import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const SOUND_OPTIONS = [
  { id: 'none', label: 'No Sound', file: null },
  { id: 'rain', label: 'Rain', file: '/sounds/rain.mp3' },
  { id: 'cafe', label: 'Café', file: '/sounds/cafe.mp3' },
  { id: 'white-noise', label: 'White Noise', file: '/sounds/white-noise.mp3' },
  { id: 'forest', label: 'Forest', file: '/sounds/forest.mp3' },
  { id: 'ocean', label: 'Ocean Waves', file: '/sounds/ocean.mp3' }
];

const SoundControls = ({ settings, onSettingsUpdate, audioRef }) => {
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const ambientAudioRef = useRef(null);
  
  useEffect(() => {
    // Set up notification audio ref
    if (audioRef) {
      audioRef.current = new Audio('/sounds/notification.mp3');
    }
    
    // Set up ambient audio
    if (settings?.soundType && settings.soundType !== 'none') {
      const soundOption = SOUND_OPTIONS.find(s => s.id === settings.soundType);
      if (soundOption?.file) {
        ambientAudioRef.current = new Audio(soundOption.file);
        ambientAudioRef.current.loop = true;
        ambientAudioRef.current.volume = (settings.soundVolume || 50) / 100;
      }
    }
    
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
    };
  }, [settings?.soundType, audioRef]);
  
  const handleSoundChange = async (soundId) => {
    await onSettingsUpdate({
      ...settings,
      soundType: soundId,
      soundEnabled: soundId !== 'none'
    });
    
    // Stop current ambient sound
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const handleVolumeChange = async (volume) => {
    await onSettingsUpdate({
      ...settings,
      soundVolume: volume
    });
    
    // Update volume for current ambient sound
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = volume / 100;
    }
  };
  
  const toggleAmbientSound = () => {
    if (!ambientAudioRef.current || settings?.soundType === 'none') return;
    
    if (isPlaying) {
      ambientAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      ambientAudioRef.current.play().catch(() => {
        // Audio play failed
      });
      setIsPlaying(true);
    }
  };
  
  const currentSound = SOUND_OPTIONS.find(s => s.id === settings?.soundType) || SOUND_OPTIONS[0];
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowControls(!showControls)}
        className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-colors"
        title="Sound Controls"
      >
        <ApperIcon name={settings?.soundEnabled ? 'Volume2' : 'VolumeX'} size={20} />
      </motion.button>
      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl p-4 min-w-64 z-50"
          >
            <div className="space-y-4">
              {/* Sound selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ambient Sound
                </label>
                <div className="space-y-2">
                  {SOUND_OPTIONS.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundChange(sound.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        currentSound.id === sound.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="text-sm">{sound.label}</span>
                      {currentSound.id === sound.id && (
                        <ApperIcon name="Check" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Volume control */}
              {settings?.soundEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume
                  </label>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="VolumeX" size={16} className="text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.soundVolume || 50}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <ApperIcon name="Volume2" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 min-w-8">
                      {settings.soundVolume || 50}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Ambient sound play/pause */}
              {settings?.soundEnabled && settings.soundType !== 'none' && (
                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={toggleAmbientSound}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ApperIcon name={isPlaying ? 'Pause' : 'Play'} size={16} />
                    <span className="text-sm">
                      {isPlaying ? 'Stop' : 'Preview'} {currentSound.label}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoundControls;