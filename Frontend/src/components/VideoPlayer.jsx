


import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};


const YouTubeStylePlayer = ({ videoUrl, thumbnailUrl, sources }) => {
    const { theme } = useSelector(state => state.auth)

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const settingsMenuRef = useRef(null);


  const effectiveSources = useMemo(() => {
    if (sources && sources.length > 0) {
      return sources;
    }
    if (videoUrl) {
      return [{ quality: "Auto", src: videoUrl }];
    }
    return [];
  }, [sources, videoUrl]);


  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);


  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [currentQuality, setCurrentQuality] = useState(effectiveSources[0]?.quality || 'Auto');


  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };


  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    setControlsTimeout(setTimeout(() => setShowControls(false), 3000));
  };

  const handleMouseMove = () => {
    if (!isSettingsOpen) resetControlsTimer();
  };
  

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play().catch(e => console.error("Play failed:", e));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };
  
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
    resetControlsTimer();
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    videoRef.current.volume = newVol;
    setIsMuted(newVol === 0);
    resetControlsTimer();
  };

  const toggleMute = () => {
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    resetControlsTimer();
  };
  
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(err => {
        alert(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    resetControlsTimer();
  };


  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
    setIsSettingsOpen(false); 
  };

  const handleQualityChange = (quality) => {
    const video = videoRef.current;
    const time = video.currentTime;
    const wasPlaying = !video.paused;

    setCurrentQuality(quality);
    setIsSettingsOpen(false);

    
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = time;
      if (wasPlaying) {
        video.play();
      }
    }, { once: true });
  };
  
  
  useOnClickOutside(settingsMenuRef, () => setIsSettingsOpen(false));


  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    
    const handleContainerClick = (e) => {
        
        if (e.target === videoRef.current) {
            togglePlayPause();
        }
    }
    container.addEventListener("click", handleContainerClick);
    video.addEventListener("dblclick", toggleFullscreen);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    resetControlsTimer();

    // Cleanup
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      container.removeEventListener("click", handleContainerClick);
      video.removeEventListener("dblclick", toggleFullscreen);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, []); 

  
  const currentSrc = effectiveSources.find(s => s.quality === currentQuality)?.src || '';

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const showQualityMenu = effectiveSources.length > 1;

  if (!currentSrc) {
    return (
      <div className="relative bg-black rounded-lg w-full max-w-3xl aspect-video flex items-center justify-center text-white">
        Error: Video source not found.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg  shadow-xl w-full max-w-3xl aspect-video select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { if (!isSettingsOpen) setShowControls(false); }}
    >
      <video
        key={currentSrc}
        ref={videoRef}
        className={`w-full h-full object-contain rounded  ${theme=='dark'?'border border-gray-100/20 ':' '}  `}
        poster={thumbnailUrl}
        src={currentSrc}
        preload="metadata"
      />

      {/* --- UI Overlays (Controls, Buttons, etc.) --- */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* Center Play Button */}
        {!isPlaying && (
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 m-auto w-20 h-20 flex items-center justify-center rounded-full bg-black/50 text-white border-none pointer-events-auto"
            aria-label="Play video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </button>
        )}

        {/* Controls Container */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white pointer-events-auto">
          {/* Progress Bar */}
          <input
            type="range" min="0" max={100} value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-500/50 rounded-full appearance-none cursor-pointer range-sm accent-red-500"
          />
          
          {/* Bottom Controls */}
          <div className="flex justify-between items-center mt-2">
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              <button onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> )}
              </button>
              <div className="flex items-center gap-2 group">
                <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted || volume === 0 ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.28 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c3.98-.96 7-4.49 7-8.77s-3.02-7.81-7-8.77z"/></svg>}
                </button>
                <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-0 group-hover:w-20 h-1 bg-gray-500/50 rounded-full appearance-none cursor-pointer range-sm accent-white transition-all duration-300" />
              </div>
              <span className="text-sm font-semibold">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            {/* Right Controls */}
            <div className="flex items-center gap-4 relative">
              <button onClick={() => setIsSettingsOpen(o => !o)} aria-label="Settings" aria-haspopup="true" aria-expanded={isSettingsOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
              </button>
              {isSettingsOpen && (
                <div ref={settingsMenuRef} className="absolute bottom-12 right-0 bg-black/80 backdrop-blur-sm rounded-lg p-2 min-w-[180px]">
                  {/* Playback Speed Section */}
                  <div className="text-sm text-gray-300 mb-2 px-2">Playback Speed</div>
                  <ul className="text-white">
                    {playbackRates.map(rate => ( <li key={rate}><button onClick={() => handlePlaybackRateChange(rate)} className={`w-full text-left px-4 py-1.5 rounded-md hover:bg-white/20 ${playbackRate === rate ? 'bg-red-500/80' : ''}`}>{rate === 1 ? 'Normal' : `${rate}x`}</button></li> ))}
                  </ul>
                  
                  {/* Quality Section - ONLY shows if there is more than one source */}
                  {showQualityMenu && <>
                    <hr className="my-2 border-gray-500/50" />
                    <div className="text-sm text-gray-300 mb-2 px-2">Quality</div>
                    <ul className="text-white">
                      {effectiveSources.map(source => ( <li key={source.quality}><button onClick={() => handleQualityChange(source.quality)} className={`w-full text-left px-4 py-1.5 rounded-md hover:bg-white/20 ${currentQuality === source.quality ? 'bg-red-500/80' : ''}`}>{source.quality}</button></li> ))}
                    </ul>
                  </>}
                </div>
              )}
              <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                {isFullscreen ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg> )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeStylePlayer;


