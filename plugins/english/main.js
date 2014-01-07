var templates = [
    "root/externallib/text!root/plugins/english/listeningVideo.html",
	"root/externallib/text!root/plugins/english/listeningQuestion.html",
    "root/externallib/text!root/plugins/english/reading.html",
	"root/externallib/text!root/plugins/english/manager.html",
    "root/externallib/text!root/plugins/english/lang/en.json"
];

define(templates, function (listeningVideo, listeningQuestion, reading, manager, langStringEN) {	
	var plugin = {
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//Setting co ban cua plugin
		//name: ten cua plugin, dung de goi cac function va doi tuong trong no. Vidu: MM.plugin.english.listenToVideo(1234)
		//type: loai plugin, de general de debug, sau nay doi thanh course
		//subMenus: cac menu con, truyen bien thong qua cac menu nay va action
		//lang: ngon ngu, can nghien cuu them
		//toogler: bat nut toggle de xo ra submenu
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//Cau hinh navigate trang khi bam vao submenu
		//Lien quan toi settings.subMenus
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        routes: [
            ["english/listening", "english_listen", "listenToVideo"],
            ["english/reading", "english_read", "readingPassage"],
            ["english/manager", "english_manager", "managerCourse"],
        ],
        
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//ham mo giao dien video theo videoID cua youtube, dang bi loi, phai mo 2 lan moi hien
		//goi ham bang MM.plugin.english.listenToVideo(id)
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        listenToVideo: function(videoID) {
		
			//The hien trang thai de debug
            MM.log('Navigate to Listening page', 'english');
			
			//Chuyen toi trang dich
            MM.Router.navigate("");
			
			//hien thi loading icon o panel center
            MM.panels.showLoading('center');
			
			//tao doi tuong template, gom cac bien truyen vao trang dich
			var tpl = {
				videoID: videoID
			}
			
			//render trang listeningVideo voi cac bien tu tpl
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