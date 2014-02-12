var templates = [
    "root/externallib/text!root/plugins/english/listeningVideo.html",
	"root/externallib/text!root/plugins/english/listeningQuestion.html",
    "root/externallib/text!root/plugins/english/reading.html",
	"root/externallib/text!root/plugins/english/manager.html",
	"root/externallib/text!root/plugins/english/gallery.html",
	"root/externallib/text!root/plugins/english/score.html",
    "root/externallib/text!root/plugins/english/lang/en.json"
];

define(templates, function (listeningVideo, listeningQuestion, reading, manager, gallery, score, langStringEN) {	
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
				{name: "gallery", menuURL: "#english/gallery", icon: "plugins/english/icon.png"}
            ],
            lang: {
                component: "english",
				strings: langStringEN
            },
            toogler: true
        },
        
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//Cau hinh navigate trang khi bam vao submenu
		//Lien quan toi settings.subMenus
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        routes: [
            ["english/listening/:videoID/:id", "english_listen", "showVideo"],
            ["english/manager", "english_manager", "managerCourse"],
			["english/gallery", "english_galery", "showGallery"],
        ],
        
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//goi ham bang MM.plugin.english.listenToVideo(id)
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        showVideo: function(videoID, id) {
			
			//The hien trang thai de debug
            MM.log('Navigate to Listening page', 'english');
			
			//Chuyen toi trang dich
            MM.Router.navigate("");
			
			//hien thi loading icon o panel center
            var questions;
			var data = {
                "get_questions_list": id
            }
			//list nhung cau hoi thuoc video do cung voi thoi gian cua no, truyen vao questions
            MM.englishWSCall(data, function(list) {
				//tao doi tuong template, gom cac bien truyen vao trang dich
				var tpl = {
				videoID: videoID,
				id: id,
				questions: list
				}
				//render trang listeningVideo voi cac bien tu tpl
				var html = MM.tpl.render(MM.plugins.english.templates.listeningVideo.html, tpl);

				MM.panels.show("right", html); 
			});							
        },
		
		addQuestionToPanel: function(questionID, panel){
			MM.panels.showLoading('center');
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
        
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//ham mo giao dien chon bai nghe hoac bai doc
		//cac tham so:
		//type: listening/ reading : dieu kien hien thi cua gallery, xuat hien khi click vao listening hoac reading
		//goi ham bang MM.plugin.english.listenToVideo(id)
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		showGallery: function() {
			MM.Router.navigate("");
			MM.log('Navigate to Gallery page', 'english');
			MM.panels.showLoading('center');
			//tao doi tuong template, gom cac bien truyen vao trang dich
			var html;
			var data = {
                "list_video": "1"
            }
            MM.englishWSCall(data, function(videos) {
                // Removing loading icon.
                //$('a[href="#participants/' +courseId+ '"]').removeClass('loading-row');
                var tpl1 = {videos: videos};
				MM.log('render template',videos);
                html = MM.tpl.render(MM.plugins.english.templates.gallery.html, tpl1);
				MM.panels.show('center', html); 
				//MM.log('Received data', data);
                //var course = MM.db.get("courses", MM.config.current_site.id + "-" + courseId);
                //var pageTitle = course.get("shortname") + " - " + MM.lang.s("participants");

                //MM.panels.show('center', html, {title: pageTitle});
                // Load the first user
                //if (MM.deviceType == "tablet" && users.length > 0) {
                //    $("#panel-center li:eq(0)").addClass("selected-row");
                //    MM.plugins.participants.showParticipant(courseId, users.shift().id);
                //    $("#panel-center li:eq(0)").addClass("selected-row");
                //}
            });
			
			//render trang listeningVideo voi cac bien tu tpl
			//var html = MM.tpl.render(MM.plugins.english.templates.gallery.html, tpl);
			MM.panels.hide('right','');			
						
			
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
            },
			"gallery": {
				html: gallery
			}
        }
     }   
    MM.registerPlugin(plugin);

});