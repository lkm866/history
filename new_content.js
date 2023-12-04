$(function(){
	let dateYear = new Date().getFullYear();
	let dateMonth = new Date().getMonth() +1 ;
	let dateDay = new Date().getDate();
	let dateHours = new Date().getHours();
	let minDateNum = dateYear + "-" + dateMonth + "-" + dateDay + "-" + dateHours;
	let maxDateNum = dateYear + "-" +(dateMonth+1) + "-" + dateDay + "-" + dateHours;
	
	let logic = function(currentDateTime){
		this.setOptions({
			minTime:'0:00'
	  });
	};
	
	$(document).ready(function(){
		let reserveButton = document.querySelector('#reserveSendButton');
		if (reserveButton) {
			reserveButton.classList.add('disabled');
			reserveButton.style.pointerEvents = 'none';
		}else {
			console.error("#reserveSendButton 값을 찾을 수 없습니다.");
		}
	});
	
	$('#reservation').each(function(){
		$(this).datetimepicker({
			minDate : minDateNum,
			maxDate : maxDateNum,
			onShow : logic,
			step:15,
			onSelectTime: function(date,input,e_item){
				$('#reservation').addClass("active");
				$('#reservation').attr("value",$('#reservation').val());
				
				let selectedDate = new Date(date);
				let year = selectedDate.getFullYear();
				let month = selectedDate.getMonth() + 1;
				let day = selectedDate.getDate();
				let hours = selectedDate.getHours();
				let minutes = selectedDate.getMinutes();
				let days = ['일', '월', '화', '수', '목', '금', '토'];
				let dayOfWeek = days[selectedDate.getDay()];
				let timezoneOffset = selectedDate.getTimezoneOffset();
				let timezoneHour = Math.abs(Math.floor(timezoneOffset / 60));
				let timezoneMinute = Math.abs(timezoneOffset % 60);
				let timezoneSign = timezoneOffset > 0 ? "-" : "+";
				let timezone = "(GMT " + timezoneSign + timezoneHour.toString().padStart(2, '0') + ":" + timezoneMinute.toString().padStart(2, '0') + ")";
				let formattedDate = year + "." + month + "." + day + ". (" + dayOfWeek + ") " + hours + ":" + minutes.toString().padStart(2, '0') + " " + timezone;
				
				$('#reservation_text').text(formattedDate);
				$('.reservation_title').show();
				$('.reservation').show();
				stateHandle();
			},
		});
	});
	
	$(".xdsoft_date").click(function(){
		logic = function( currentDateTime ){
			if($(this).hasClass("xdsoft_today")){
				this.setOptions({
					minTime:(dateHours+1) +':00'
				});
			}else
				this.setOptions({
					minTime:'1:00'
				});
		};
	});
	
	function stateHandle() {
		let reserveInput = document.querySelector('#reservation');
		let reserveButton = document.querySelector('#reserveSendButton');
		let sendButton = document.querySelector('#send-btn');
		let saveButton = document.querySelector('#save-btn');
		
		if(reserveButton && sendButton && saveButton) {
			if(reserveInput.value === '') {
				reserveButton.style.pointerEvents = 'none';
				reserveButton.classList.add('disabled');
				sendButton.style.pointerEvents = 'auto';
				sendButton.classList.remove('disabled');
				saveButton.style.pointerEvents ='auto';
				saveButton.classList.remove('disabled');
			}else{
				reserveButton.style.pointerEvents = 'auto';
				reserveButton.classList.remove('disabled');
				sendButton.style.pointerEvents = 'none';
				sendButton.classList.add('disabled');
				saveButton.style.pointerEvents = 'none';
				saveButton.classList.add('disabled');
			}
		}
	};
	
	$('#reservation_text').click(function(){
		$('#reservation').datetimepicker('show');
	});
	
	$("#reservation_cancel").click(function(){
		$('#reservation_text').text("");
		$('#reservation').val("");
		$('.reservation_title').show();
		$('.reservation').hide();
		stateHandle();
	});
	
	// 외부메일 업로드
	const dataTransfer = new DataTransfer();
	const fileInput = document.querySelector('#file_add');
    const preview = document.querySelector('#table_file tbody');
	$("#file_add").change(function(){
		$("#table_file").addClass("active");
		const files = Array.from(fileInput.files)
        let fileArr = document.getElementById("file_add").files
        
        if(fileArr != null && fileArr.length>0){

            // =====DataTransfer 파일 관리========
            for(var i=0; i<fileArr.length; i++){
                dataTransfer.items.add(fileArr[i])
            }
            document.getElementById("file_add").files = dataTransfer.files;
//            console.log("dataTransfer =>",dataTransfer.files)
//            console.log("input FIles =>", document.getElementById("file_add").files);
            // ==========================================
            files.forEach(file => {
            	let ret = "0B";

        		if(file.size > (1024 * 1024 * 1024)){ // gb
        			ret = numRound((file.size / (1024 * 1024 * 1024)), 2) + "GB";
        		}else if(file.size > (1024 * 1024)){ // mb
        			ret = numRound((file.size / (1024 * 1024)), 2) + "MB";
        		}else if(file.size > 1024){ // kb
        			ret = numRound((file.size / (1024)), 2) + "KB";
        		}else{ // b
        			ret = (file.size) + "B";
        		}
	            preview.innerHTML += `
	            <tr id="${file.lastModified}">
	            	<td><span data-index='${file.lastModified}' class='file-remove'>삭제</span></td>
	            	<td>${file.name}</td>
	            	<td>대기 중</td>
	            	<td>${ret}</td>
	            </tr>`;
	        });
           $(".btn_box").addClass("active");
        }
         
    })
    
    
    $("#table_file").click(function(event){
        let fileArr = document.getElementById("file_add").files;
        if(event.target.className=='file-remove'){
            targetFile = event.target.dataset.index 
            
            // ============DataTransfer================
            for(var i=0; i<dataTransfer.files.length; i++){
                if(dataTransfer.files[i].lastModified==targetFile){
                    dataTransfer.items.remove(i)
                    break
                }                
            }
            if(dataTransfer.files.length < 1){
            	$("#table_file, .btn_box").removeClass("active");
            }
            
            document.getElementById("file_add").files = dataTransfer.files;
     
            const removeTarget = document.getElementById(targetFile);
            removeTarget.remove();
            
        }else if(event.target.className=='file-remove-all'){

        	for(var i=dataTransfer.files.length; i>=0; i--){
        		dataTransfer.items.remove(i);
            }
        	
        	document.getElementById("file_add").files = dataTransfer.files;
        	$("#table_file tbody").empty();
        	$("#table_file, .btn_box").removeClass("active");
        }
//        console.log("dataTransfer 삭제후=>",dataTransfer.files)
//    	console.log('input FIles 삭제후=>',document.getElementById("file_add").files);

    })
    
    $(".save_value_box").each(function(){
    	let selectBtn = $(this).children(".save_section");
    	let selectList = $(this).children(".mail_list");
    	let selectListItems = selectList.children("li");
    	let selectInput = selectList.children("input");
    	selectBtn.click(function(){
	    	if(selectList.hasClass("active")){
	    		selectList.removeClass("active");
	    	}else{
	    		selectList.addClass("active");
	    	}
	    });
//    	selectListItems.click(function(){
//    		selectInput.val($(this).attr('data-value'));
//    		selectBtn.text($(this).text());
//    		selectList.removeClass("active");
//    	});
    });
	
	$("#btn_saveMailReset").click(function(){
		$("#table_file").removeClass("active");
		$("#table_file tbody").empty();
		$("#file_add").val('');
		$(".btn_box").removeClass("active");
	});

	$(document).on("click", "#save_mail_box_list li" , function(){
		let _save_value_box = $(this).parents('.save_value_box').eq(0);
    	let selectBtn = _save_value_box.children(".save_section");
    	let selectList = _save_value_box.children(".mail_list");
    	let selectInput = _save_value_box.children("input");
    	selectInput.val($(this).attr('data-value'));
		selectBtn.text($(this).text());
		selectList.removeClass("active");
	});

})

