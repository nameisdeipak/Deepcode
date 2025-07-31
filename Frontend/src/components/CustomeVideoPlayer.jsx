

import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from 'media-chrome/dist/react';


const CustomVideoPlayer = ({ url, onReady, onError }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleReady = () => {
    setIsLoading(false);
    if (onReady) {
      onReady(); 
    }
  };

  return (

    <MediaController
      style={{

        '--media-icon-color': 'white',
        '--media-range-track-background': 'rgba(255, 255, 255, 0.25)',
        '--media-range-bar-color': 'white',
      }}
    >
  
      <ReactPlayer
        slot="media"
        url={url}
        controls={false} 
        width="100%"
        height="100%"
        playing={true}
        onReady={handleReady}
        onError={onError}
        config={{
          file: {
            attributes: {

              controlsList: 'nodownload',
            },
          },
        }}
      />
      

      {isLoading && (
        <div
          slot="centered-chrome" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}

    
      <MediaControlBar>
        <MediaPlayButton />
        <MediaSeekBackwardButton seekOffset={10} />
        <MediaSeekForwardButton seekOffset={10} />
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaPlaybackRateButton />
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
};

export default CustomVideoPlayer;