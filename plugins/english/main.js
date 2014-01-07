var templates = [
    "root/externallib/text!root/plugins/english/listeningVideo.html",
	"root/externallib/text!root/plugins/english/listeningQuestion.html",
    "root/externallib/text!root/plugins/english/reading.html",
	"root/externallib/text!root/plugins/english/manager.html",
    "root/externallib/text!root/plugins/english/lang/en.json"
];

define(templates, function (listeningVideo, listeningQuestion, reading, manager, langStringEN) {	
	var plugin = {
        settings: {
            name: "english",
            type: "general",
            icon: "plugins/english/icon.png",
            subMenus: [
                {name: "listenvideo", menuURL: "#english/listening", icon: "plugins/english/icon.png"},
                {name: "readingpassage", menuURL: "#english/reading", icon: "plugins/english/icon.png"},
                {name: "manager", menuURL: "#english/manager", icon: "plugins/english/icon.png"}
            ],
            lang: {
                component: "my_plugin_en",
				strings: langStringEN
            },
            toogler: true
        },
        
        routes: [
            ["english/listening", "english_listen", "listenToVideo"],
            ["english/reading", "english_read", "readingPassage"],
            ["english/manager", "english_manager", "managerCourse"],
        ],
        
        listenToVideo: function(videoID) {
            MM.log('Navigate to Listening page', 'english');
            MM.Router.navigate("");
            MM.panels.showLoading('center');
			var tpl = {
				videoID: videoID
			}
			
			
			
			
			var html = MM.tpl.render(MM.plugins.english.templates.listeningVideo.html, tpl);
            if (MM.deviceType == "tablet") {
				MM.panels.html('right', '');
            }			
			MM.panels.show("right", html); 	
			
			
			
			
			
			



			
        },
		
		addQuestionToPanel: function(questionID, panel){
			MM.panels.showLoading('center');
		},
		
        readingPassage: function() {
            MM.log('Navigate to Reading page', 'english');
            MM.Router.navigate("");
			MM.panels.showLoading('center');
			var html = MM.plugins.english.templates.reading.html;
            if (MM.deviceType == "tablet") {
                MM.panels.html('right', '');
            }
			MM.panels.show("center", html); 

        },
        
        managerCourse: function() {
            MM.Router.navigate("");
            MM.log('Navigate to Manager page', 'english');
			MM.panels.showLoading('center');
			var html = MM.plugins.english.templates.manager.html;
            if (MM.deviceType == "tablet") {
                MM.panels.html('right', '');
            }
			MM.panels.show("center", html); 
        },
        
        templates: {
            "listeningVideo": {
                html: listeningVideo
            },
            "listeningQuestion": {
                html: listeningQuestion
            },
            "reading": {
                html: reading
            },
            "manager": {
                html: manager
            }
        }
     }   
    MM.registerPlugin(plugin);

});