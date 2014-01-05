function showYoutubeVideo(){
	var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	console.log("show OK");
}
// 4. The API will call this function when the video player is ready.
function youtubeVideo(id){
	player = new YT.Player('player', {
		height: '390',
        width: '640',
        videoId: id,
        playerVars:{
            'enablejsapi': 1,
            'html5': 1
        },
		events: {
            'onReady': onPlayerReady
        }
	});
};
function onYouTubeIframeAPIReady() {
	youtubeVideo('FbJziOMLSy8');
}