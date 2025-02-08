import React, { useState, useEffect, useRef } from 'react';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const NOISE_TYPES = [
  { id: 'rain', name: '雨声', url: '/sounds/rain.mp3' },
  { id: 'waves', name: '海浪', url: '/sounds/waves.mp3' },
  { id: 'forest', name: '森林', url: '/sounds/forest.mp3' },
  { id: 'cafe', name: '咖啡厅', url: '/sounds/cafe.mp3' },
];

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [selectedNoise, setSelectedNoise] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      // Play notification sound
      const notification = new Audio('/sounds/notification.mp3');
      notification.play();
      
      // Switch between work and break time
      setIsWorkTime((prev) => !prev);
      setTimeLeft(isWorkTime ? BREAK_TIME : WORK_TIME);
      setIsRunning(false);
    }
  }, [timeLeft, isWorkTime]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isWorkTime ? WORK_TIME : BREAK_TIME);
  };

  const handleNoiseSelect = (noiseId: string) => {
    setSelectedNoise(noiseId);
    if (audioRef.current) {
      const noise = NOISE_TYPES.find((n) => n.id === noiseId);
      if (noise) {
        audioRef.current.src = noise.url;
        audioRef.current.loop = true;
        audioRef.current.play();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-[#fcf9f3] rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-[#2c2c2c]">
            {isWorkTime ? '专注时间' : '休息时间'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#2c2c2c] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-6xl font-mono text-center mb-8 text-[#2c2c2c]">
          {formatTime(timeLeft)}
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleStartStop}
            className={`px-6 py-2 rounded-lg font-serif transition-colors ${
              isRunning
                ? 'bg-[#e8e1d5] text-[#2c2c2c] hover:bg-[#d8d1c5]'
                : 'bg-[#2c2c2c] text-white hover:bg-[#3c3c3c]'
            }`}
          >
            {isRunning ? '暂停' : '开始'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-lg font-serif text-[#2c2c2c] hover:bg-[#e8e1d5] transition-colors"
          >
            重置
          </button>
        </div>

        {/* White Noise Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-serif text-[#8c8c8c] uppercase tracking-wider">
            白噪音
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {NOISE_TYPES.map((noise) => (
              <button
                key={noise.id}
                onClick={() => handleNoiseSelect(noise.id)}
                className={`px-4 py-2 rounded-lg font-serif transition-colors ${
                  selectedNoise === noise.id
                    ? 'bg-[#2c2c2c] text-white'
                    : 'text-[#2c2c2c] hover:bg-[#e8e1d5]'
                }`}
              >
                {noise.name}
              </button>
            ))}
          </div>

          {/* Volume Control */}
          {selectedNoise && (
            <div className="mt-4">
              <label className="text-sm font-serif text-[#8c8c8c] block mb-2">
                音量
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default PomodoroTimer; 