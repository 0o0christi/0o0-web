/* Touchscreen fullscreen playback with landscape orientation where supported. */
const projectVideo = document.getElementById('project-video');
const landscapeButton = document.querySelector('.project-video-landscape');

if (projectVideo && landscapeButton) {
    landscapeButton.addEventListener('click', async () => {
        try {
            if (projectVideo.requestFullscreen) {
                await projectVideo.requestFullscreen();
                if (screen.orientation?.lock) {
                    try {
                        await screen.orientation.lock('landscape');
                    } catch {
                        // Native fullscreen still allows device rotation when unlocked.
                    }
                }
            } else if (projectVideo.webkitEnterFullscreen) {
                projectVideo.webkitEnterFullscreen();
            }
        } catch {
            // Keep the native video controls available if fullscreen is declined.
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && screen.orientation?.unlock) {
            screen.orientation.unlock();
        }
    });
}
