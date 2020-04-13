import React from 'react';
// @ts-ignore
import YouTube from 'react-youtube';

interface VideoPlayerProps {
    videoId?: string;
    width?: number;
}

const VideoPlayer = ({ videoId, width }: VideoPlayerProps): JSX.Element => {
    if (!videoId || videoId === "") {
        return <div>Error, no video to play.</div>
    }
    if (width && width > 600) {
        width = 600;
    }
    return (
        <YouTube videoId={videoId} opts={width ? {width, height: 2.5 * width / 4}: {}}/>
    )
} 

export default VideoPlayer;