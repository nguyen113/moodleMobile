var templates = [
    "root/externallib/text!root/plugins/english/listeningVideo.html",
	"root/externallib/text!root/plugins/english/manager.html",
	"root/externallib/text!root/plugins/english/gallery.html",
	"root/externallib/text!root/plugins/english/score.html",
    "root/externallib/text!root/plugins/english/lang/en.json"
];

define(templates, function (listeningVideo, manager, gallery, score, langStringEN) {	
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
				{name: "gallery", menuURL: "#english/gallery", icon: "plugins/english/icon.png"},
				{name: "manager", menuURL: "#english/manager", icon: "plugins/english/icon.png"}
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
            ["english/manager", "english_manager", "showManager"],
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
        
        showManager: function() {
            MM.Router.navigate("");
            MM.log('Navigate to Manager page', 'english');

			//tao doi tuong template, gom cac bien truyen vao trang dich
			var html;
			var data = {
                "get_user_video": "1",
				"user_id":MM.site.get('username'),
				"site":MM.site.get('siteurl'),
            }
            MM.englishWSCall(data, function(videos) {
                var tpl1 = {videos: videos};
                html = MM.tpl.render(MM.plugins.english.templates.gallery.html, tpl1);
				MM.panels.show('center', html); 
            });
			//render trang listeningVideo voi cac bien tu tpl
			//var html = MM.tpl.render(MM.plugins.english.templates.gallery.html, tpl);
			MM.panels.hide('right','');
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
                var tpl1 = {videos: videos};
				MM.log('render template',videos);
                html = MM.tpl.render(MM.plugins.english.templates.gallery.html, tpl1);
				MM.panels.show('center', html); 
            });
			
			//render trang listeningVideo voi cac bien tu tpl
			//var html = MM.tpl.render(MM.plugins.english.templates.gallery.html, tpl);
			MM.panels.hide('right','');			
		},
		
        templates: {
            "listeningVideo": {
                html: listeningVideo
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