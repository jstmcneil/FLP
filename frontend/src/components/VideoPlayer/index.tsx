import React from 'react';
// @ts-ignore
import YouTube from 'react-youtube';

interface VideoPlayerProps {
    videoId?: string
}

const VideoPlayer = ({ videoId }: VideoPlayerProps): JSX.Element => {
    if (!videoId || videoId === "") {
        return <div>Error, no video to play.</div>
    }
    return (
        <YouTube videoId={videoId} />
    )
} 

export default VideoPlayer;