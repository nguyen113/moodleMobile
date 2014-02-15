var templates = [
    "root/externallib/text!root/plugins/english/playVideo.html",
	"root/externallib/text!root/plugins/english/gallery.html",
	"root/externallib/text!root/plugins/english/addVideo.html",
	"root/externallib/text!root/plugins/english/addQuestion.html",
	"root/externallib/text!root/plugins/english/question.html",
	"root/externallib/text!root/plugins/english/score.html",
    "root/externallib/text!root/plugins/english/lang/en.json"
];

define(templates, function (playVideo, gallery, add_video, add_question, question, score, langStringEN) {	
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
            icon: "plugins/english/icon/Narrator-32.png",
            subMenus: [
				{name: "gallery", menuURL: "#english/gallery", icon: "plugins/english/icon/ProgramStack-32.png"},
				{name: "manager", menuURL: "#english/manager", icon: "plugins/english/icon/Library-32.png"},
            ],
            lang: {
                component: "english",
				strings: langStringEN
            },
            toogler: true,
			serverURL: "http://pcnguyen.dyndns.org/server2/clienttest.php"
        },
        
		
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//Cau hinh navigate trang khi bam vao submenu
		//Lien quan toi settings.subMenus
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        routes: [
            ["english/listening/:youtubeVideoID/:videoID", "english_listen", "showPlayVideo"],
            ["english/manager", "english_manager", "showManager"],
			["english/gallery", "english_galery", "showGallery"],
			["english/show_add_video", "english_add_video", "showAddVideo"],
			["english/add_video/:userID/:userSite/:content/:url/:name", "english_add_video", "addVideo"],
			["english/edit_video/:videoID/:userID/:userSite/:content/:url/:name", "english_add_video", "editVideo"],
			["english/edit_video/:videoID", "english_edit_video", "showEditVideo"],
			["english/add_question/:videoID", "english_add_question", "showAddQuestion"]
        ],
        
		///////////////////////////////////////////////////////////////
		// Function hien thi danh sach video cua tat ca user
		///////////////////////////////////////////////////////////////
		showGallery: function() {
			MM.Router.navigate("");
			MM.log('List all videos in DB' ,'english');
			MM.plugins.english.showListVideo('all','all');
			MM.panels.show('right','');
		},	

		///////////////////////////////////////////////////////////////
		// Function hien thi danh sach video cua user dang dang nhap
		///////////////////////////////////////////////////////////////
        showManager: function() {
			MM.Router.navigate("");
            MM.log('List all videos belong to user' + MM.site.get('fullname') ,'english');
			var user = MM.site.get('username');
			var siteURL = MM.site.get('siteurl');
			MM.plugins.english.showListVideo(user,siteURL);
			MM.plugins.english.showAddVideo();
        },
        
		///////////////////////////////////////////////////////////////
		// Function hien thi danh sach video
		// Tham so:
		//		userID: ten dang nhap 
		// Neu userID = site = all thi list tat ca video
		///////////////////////////////////////////////////////////////
		showListVideo: function(userID, site){
			if((userID=="all")&&(site=="all")){
				var data = {
                "list_video":"1"
				};
				var source1 ='Gallery';
			} else{
				var data = {
                "get_user_video":"1",
				"user_id":userID,
				"site":site
				};
				var source1 ='Manager';
			}
			
			var html;
            MM.plugins.english.WSCall(data, function(videos) {
                var tpl = {videos: videos, source: source1};
                html = MM.tpl.render(MM.plugins.english.templates.gallery.html, tpl);
				MM.panels.show('center', html); 
				MM.panels.hide('right','');
            });
		},
		
		///////////////////////////////////////////////////////////////
		// Function hien thi video
		// Tham so:
		//		youtubeVideoID: id cua video youtube 
		//		videoID: id cua video trong DB
		///////////////////////////////////////////////////////////////
		showPlayVideo: function(youtubeVideoID, videoID){
			MM.Router.navigate("");
            MM.log('Navigate to show video', 'english');
            var questions;
			var data = {
                "get_questions_list": videoID
            }
			//list nhung cau hoi thuoc video do cung voi thoi gian cua no, truyen vao questions
            MM.plugins.english.WSCall(data, function(list) {
				var tpl = {
					youtubeVideoID: youtubeVideoID,
					videoID: videoID,
					questions: list
				}
				var html = MM.tpl.render(MM.plugins.english.templates.playVideo.html, tpl);
				MM.panels.show("right", html); 
			});
		},
		
		///////////////////////////////////////////////////////////////
		// Function them 1 cau hoi vao danh sach o cot center
		// Tham so:
		//		question: id cua video youtube 
		//		index: vi tri cua cau hoi
		//		answera: dap an a
		//		answerb: dap an b
		//		answerc: dap an c
		//		answerd: dap an d
		///////////////////////////////////////////////////////////////
		addQuestionToList: function(index, question, answera, answerb, answerc, answerd, questionid, videoid, source){
			MM.log('adding question to list', 'english');
			MM.log(questionid,"questionid");
			var tpl = {
				videoID: videoid,
				questionid: questionid,
				question: decodeURIComponent(question),
				answera: decodeURIComponent(answera),
				answerb: decodeURIComponent(answerb),
				answerc: decodeURIComponent(answerc),
				answerd: decodeURIComponent(answerd),
				index: index,
				source: source
				
			}
			var html = MM.tpl.render(MM.plugins.english.templates.question.html, tpl);
			MM.panels.htmlAppend("center", html); 
		},
		
		showAddVideo: function(){
			MM.Router.navigate("");
            MM.log('Navigate to add page', 'english');
			var tpl={videoID:"new", name:"new", url:"new", content:"new"};
			var html = MM.tpl.render(MM.plugins.english.templates.add_video.html,tpl);
			MM.panels.show('right', html);
		},
		
		///////////////////////////////////////////////////////////////
		// Function them video vao DB
		// Tham so:
		//		userID: username 
		//		userSite: moodle site
		//		content: noi dung gioi thieu video
		//		url: id cua video youtube
		//		name: Ten video
		///////////////////////////////////////////////////////////////
		addVideo: function(e){
			var userID = MM.site.get('username');
			var userSite = MM.site.get('siteurl');
			var content = encodeURIComponent($('#content').val());
			var youtubeID = $.trim($('#youtubeID').val());
			var name = $.trim($('#name').val());
			var data = {
				'add_video':userID,
				'userSite':userSite,
				'content':content,
				'url':youtubeID,
				'name':name,
				};
			
			MM.plugins.english.WSCall(data, function(outcome) {
				outcome = String(outcome);
				if(outcome=='ok') {
					MM.plugins.english.showListVideo(MM.site.get('username'),MM.site.get('siteurl'));
					MM.plugins.english.showAddVideo();
					MM.popMessage('Add video successfully!!',{autoclose: 5000});
				}
				else {
					MM.plugins.english.showListVideo(MM.site.get('username'),MM.site.get('siteurl'));
					MM.plugins.english.showAddVideo();
					MM.popErrorMessage('Failed to add video!! error:'+outcome,{autoclose: 5000});
				};
			});
		},
		
		showEditVideo: function(videoID){
			MM.Router.navigate("");
            MM.log('Navigate to edit video page', 'english');
			var data = {"get_video":videoID};
			MM.plugins.english.WSCall(data, function(video){
				var tVideo = JSON.parse(video);
				var tpl={videoID:videoID, name:tVideo[0].name, url:tVideo[0].url, content:decodeURIComponent(tVideo[0].content)};
				var html = MM.tpl.render(MM.plugins.english.templates.add_video.html,tpl);
				MM.panels.show('right', html);
				MM.plugins.english.showListQuestion(videoID);
			});
		},
		
		///////////////////////////////////////////////////////////////
		// Function lay tat ca cau hoi cua video hien thi len cot center
		///////////////////////////////////////////////////////////////
		showListQuestion: function(videoID){
			MM.panels.showLoading('center');
			var data = {
                "get_questions_list": videoID
            }
			MM.panels.html("center", "<div class='centered'><a href='#english/add_question/"+videoID+"'><button style='width:100%'>Add Question</button></a></div>"); 
			//list nhung cau hoi thuoc video do cung voi thoi gian cua no, truyen vao questions
            MM.plugins.english.WSCall(data, function(list) {
					var tList = JSON.parse(list);
					var tempList = MM.plugins.english.sortListByTime(tList);
					for (var i=0;i<tempList.length; i++){
						var arrObj = tempList[i];
						MM.plugins.english.addQuestionToList(i,arrObj.question,arrObj.answera, arrObj.answerb, arrObj.answerc, arrObj.answerd, arrObj.id, videoID,"edit");
					}
			});
		},
		
		showAddQuestion: function(videoID){
			MM.Router.navigate("");
            MM.log('Navigate to add question page', 'english');
			var data = {
				"get_video":videoID
			};
            MM.plugins.english.WSCall(data, function(video) {
				video = JSON.parse(video);
				var tpl={questionid:"new",youtubeVideoID:video[0].url,videoID:videoID};
				html = MM.tpl.render(MM.plugins.english.templates.add_question.html,tpl);
				MM.panels.show('right', html);
			});		
		},
		
		///////////////////////////////////////////////////////////////
		// Function them question vao DB
		///////////////////////////////////////////////////////////////
		addQuestion: function(videoID){
			var content = encodeURIComponent($('#question_content').val());
			var answera = $.trim($('#content_answer_a').val());
			var answerb = $.trim($('#content_answer_b').val());
			var answerc = $.trim($('#content_answer_c').val());
			var answerd = $.trim($('#content_answer_d').val());
			var correct = $('#correct_answer').val();
			var time = $('#current_time').val();
			var data = {
				'add_question':videoID,
				'content':content,
				'answera':answera,
				'answerb':answerb,
				'answerc':answerc,
				'answerd':answerd,
				'correct':correct,
				'time':time
				};
			MM.plugins.english.WSCall(data, function(outcome) {
				if(outcome=='ok') {
					MM.plugins.english.showListQuestion(videoID);
					MM.plugins.english.showAddQuestion();
					MM.popMessage('Add question successfully!!',{autoclose: 5000});
				}else {
					MM.plugins.english.showListQuestion(videoID);
					MM.plugins.english.showAddQuestion();
					MM.popErrorMessage('Failed to add question!! error:'+outcome,{autoclose: 5000});
				};
			});
		},
		
		showEditQuestion: function(questionID, videoID){
			MM.Router.navigate("");
            MM.log('Navigate to edit question page', 'english');
			var data = {
				"get_video":videoID
			};
            MM.plugins.english.WSCall(data, function(video) {
				video = JSON.parse(video);
				var data = {
					"get_question":questionID
				};
				MM.plugins.english.WSCall(data, function(question) {
					question = JSON.parse(question);
					var tpl={
						youtubeVideoID:video[0].url,
						videoID:videoID,
						questionid: questionID,
						answera: decodeURIComponent(question[0].answera),
						answerb: decodeURIComponent(question[0].answerb),
						answerc: decodeURIComponent(question[0].answerc),
						answerd: decodeURIComponent(question[0].answerd),
						content: decodeURIComponent(question[0].question),
						correct: question[0].correct,
						time: question[0].time
						};
					html = MM.tpl.render(MM.plugins.english.templates.add_question.html,tpl);
					MM.panels.show('right', html);
				});
			});
		},
		
		///////////////////////////////////////////////////////////////
		// Function edit question vao DB
		///////////////////////////////////////////////////////////////		
		editQuestion: function(questionID, video_id, content, answera, answerb, answerc, answerd, correct, time){
			MM.log('updating question','english');
			var data = {
				'edit_question':questionID,
				'video_id':video_id,
				'content':content,
				'answera':answera,
				'answerb':answerb,
				'answerc':answerc,
				'answerd':answerd,
				'correct':correct,
				'time':time,
				};
			MM.plugins.english.WSCall(data, function(outcome) {
						outcome = String(outcome);
				if(outcome=='ok') {
					MM.plugins.english.showEditQuestion(questionID,video_id);
					MM.plugins.english.showListQuestion(videoID);
					MM.popMessage('Edit question successfully!!',{autoclose: 5000});
				} else {
					MM.plugins.english.showEditQuestion(questionID,video_id);
					MM.plugins.english.showListQuestion(videoID);
					MM.popErrorMessage('Failed to edit question!! error:'+outcome,{autoclose: 5000});
				};
			});
		},
		
		///////////////////////////////////////////////////////////////
		// Function edit video vao DB
		///////////////////////////////////////////////////////////////			
		editVideo: function(videoID){
			MM.log('updating video'+videoID,'english');
			var userID = MM.site.get('username');
			var userSite = MM.site.get('siteurl');
			var content = encodeURIComponent($('#content').val());
			console.log(content,"content");
			var youtubeID = $.trim($('#youtubeID').val());
			var name = $.trim($('#name').val());
			var data = {
				'edit_video':videoID,
				'userID':userID,
				'userSite':userSite,
				'content':content,
				'url':youtubeID,
				'name':name,
				};
			MM.plugins.english.WSCall(data, function(outcome) {
						outcome = String(outcome);
				if(outcome=='ok') {
					MM.plugins.english.showEditVideo(videoID);
					MM.popMessage('Edit video successfully!!',{autoclose: 5000});
				}else {
					MM.plugins.english.showEditVideo(videoID);
					MM.popErrorMessage('Failed to edit video!! error:'+outcome,{autoclose: 5000});
				};
			});
		},
		
		///////////////////////////////////////////////////////////////
		// Function delete video trong DB
		///////////////////////////////////////////////////////////////	
		deleteVideo: function(videoID){
			MM.log('Deleting video','english');
			MM.popConfirm('Are you sure to delete this video?',function(){
				var data = {
					'delete_video':videoID
					};
					MM.plugins.english.WSCall(data, function(outcome) {
						outcome = String(outcome);
						if(outcome=='ok') {
							MM.plugins.english.showListVideo(MM.site.get('username'),MM.site.get('siteurl'));
							setTimeout(donothing,500);
							MM.popMessage('Delete video success!!',{autoclose: 5000});
						}else {
							MM.plugins.english.showListVideo(MM.site.get('username'),MM.site.get('siteurl'));
							setTimeout(donothing,500);
							MM.popErrorMessage('Delete video success!! error:'+outcome,{autoclose: 5000}); 
						}
					});
			});
			
		},
		
		///////////////////////////////////////////////////////////////
		// Function delete question trong DB
		///////////////////////////////////////////////////////////////	
		deleteQuestion: function(questionID, videoID){
			MM.log('Deleting question','english');
			MM.popConfirm('Are you sure to delete this question?',function(){
				var data = {
					'delete_question':questionID
					};
				MM.plugins.english.WSCall(data, function(outcome) {
					outcome = String(outcome);
					if(outcome=='ok') {
							MM.plugins.english.showListQuestion(videoID);
							MM.popMessage('Delete question success!!',{autoclose: 5000});
					}else {
							MM.plugins.english.showListQuestion(videoID);
						MM.popErrorMessage('Delete question success!! error:'+outcome,{autoclose: 5000});
					}
				});
			});
			
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//goi ham bang MM.plugin.english.listenToVideo(id)
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        WSCall: function( data, callBack, errorCallBack) {
			
			var data = MM._convertValuesToString(data);
			
			// If we arrive here, and we are not connected, thrown a network error message.
			if (!MM.deviceConnected()) {
				if (errorCallBack) {
					errorCallBack();
				} else {
					MM.popErrorMessage(MM.lang.s('networkerrormsg'));
				}
				return true;
			}

			// Main jQuery Ajax call, returns in json format.
			$.ajax({
				type: 'POST',
				url: MM.plugins.english.settings.serverURL,
				data: data,
				//dataType: 'json',

				success: function(data) {
					// If the responseExpected value is set then so long as no data
					// is returned, we create a blank object.
					if (!data) {
						data = {};
					}

					if (!data) {
						if (errorCallBack) {
							errorCallBack();
						} else {
							MM.popErrorMessage(MM.lang.s("cannotconnect"));
						}
						return;
					}

					if (typeof(data.exception) != 'undefined') {
						MM.closeModalLoading();
						if (data.errorcode == "invalidtoken" || data.errorcode == "accessexception") {
							MM.popMessage(MM.lang.s("lostconnection"));

							// TODO: Rewrite setTimeout to work off an event call instead.
							setTimeout(function(){
								MM.setConfig("current_site", null);
								location.href = "index.html";
							}, 10000); // 10 seconds later - redirect.
							return;
						} else {
							if (errorCallBack) {
								errorCallBack('Error. ' + data.message);
							} else {
								MM.popErrorMessage('Error. ' + data.message);
							}
							return;
						}
					}

					if (typeof(data.debuginfo) != 'undefined') {
						MM.closeModalLoading();
						if (errorCallBack) {
							errorCallBack('Error. ' + data.message);
						} else {
							MM.popErrorMessage('Error. ' + data.message);
						}
						return;
					}

					MM.log('WS: Data received from WS '+ typeof(data));

					if (typeof(data) == 'object' && typeof(data.length) != 'undefined') {
						MM.log('WS: Data number of elements '+ data.length);
					}


					MM.closeModalLoading();
					MM.log('data from WS',JSON.stringify(data));
					// We pass back a clone of the original object, this may
					// prevent errors if in the callback the object is modified.
					callBack(JSON.parse(JSON.stringify(data)));
				},
				error: function(xhr, ajaxOptions, thrownError) {

					MM.closeModalLoading();

					var error = MM.lang.s('cannotconnect');
					if (xhr.status == 404) {
						error = MM.lang.s('invalidscheme');
					}
					MM.log('WS: error on ' + method + ' error: ' + error);
					if (errorCallBack) {
						errorCallBack();
					}
				}
			});
		},

		sortListByTime: function(list)
		{	
			for (var i = 0; i<list.length; i++)
			{
				for(var j = i+1; j<list.length; j++){
					if(parseInt(list[i].time) > parseInt(list[j].time)){
						var t = list[i];
						list[i] = list[j];
						list[j] = t;
					}
				}
			}
			return list;
		},
		
		handleCheckBoxAsRadioGroup: function(elem, questionID){
			var elems = $(".answer_"+questionID);
			var currentState = elem.checked;
			var elemsLength = elems.length;
			for(var i=0; i<elemsLength; i++)
			{
			if(elems[i].type === "checkbox")
				{

					elems[i].checked = false;   
				}
			}
			elem.checked = currentState;
		},
		
        templates: {
            "playVideo": {
                html: playVideo
            },
			"gallery": {
				html: gallery
			},
			"add_video": {
				html: add_video
			},
			"add_question": {
				html: add_question
			},
			"question": {
				html: question
			}
        }
     }   
	var tag = document.createElement("script"); 
	tag.src = "https://www.youtube.com/iframe_api"; 
	var firstScriptTag = document.getElementsByTagName("script")[0]; 
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	MM.registerPlugin(plugin);

});