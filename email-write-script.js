$(document).ready(function () {
	var pop = 1;

	fnComboCharSet();
	fnInit();

	// 브라우저 크기 조절 시 받는 사람, 참조, 숨은 참조 input 박스 길이 조절
	$(window).resize(function () {
		var to_inputObj = getObjectId("to");
		var cc_inputObj = getObjectId("cc");
		var bcc_inputObj = getObjectId("bcc");

		// 입력객체 resize
		fnResizeInputObject(to_inputObj);
		fnResizeInputObject(cc_inputObj);
		fnResizeInputObject(bcc_inputObj);
	});

	$("#send-btn").click(function () {
		fnSendMail("");
	});

	// 예약메일 발송
	$("#reserveSendButton").on("click", function () {
		fnSendMail("R");
	});

	// 미리보기
	$("#preview-btn").click(function () {
		fnPreview();
	});

	// 미리보기 팝업창 닫기
	$(".btn-preview-popup-close").click(function () {
		$(".popup-preview").css("display", "none");
	});
	$(".popup-preview-close").click(function () {
		$(".popup-preview").css("display", "none");
	});

	$("#save-btn").click(function () {
		fnSendMail("T");
	});

	// 상단 취소 버튼
	$("#cancel-btn").click(function () {
		history.go(-1);
	});

	// 메일보내기 창 닫기 버튼
	$("#close-btn").click(function () {
		window.close();
	});

	// 목록으로 가기 버튼
	$("#mail-list-btn").click(function () {
		fnMoveList("Y");
	});

	// 예약목록으로 가기 버튼
	$("#mail-reservationlist-btn").click(function () {
		fnMoveList("R");
	});

	// 주소록객체처리
	addressInputObject();

	// 박스 빈 공간 선택시 input 박스로 포커스 주기
	$("#cell_to_input_box, #cell_cc_input_box, #cell_bcc_input_box").click(function (e) {
		if ($(e.target).attr("id").indexOf("to_address_item") == -1
			&& $(e.target).attr("id").indexOf("cc_address_item") == -1
			&& $(e.target).attr("id").indexOf("bcc_address_item") == -1) {
			$(this).children("input").focus();
		}
	});

	// 서명관리
	$("#sign_use_yn").click(function () {
		if ($("#chk_sign_use_yn").is(":checked")) {
			$("#sign_text").addClass("hide");
		}
		else {
			$("#sign_text").removeClass("hide");
		}
	});

	// 서명유형선택
	$("#select_sign_text_edit").change(function () {
		fnChgSignUseType();
	});

	// 기본메일주소여부 클릭 시 나머지는 체크 풀기
	$(".mail-addr-yn-chk").click(function () {
		$(".mail-addr-yn-chk").parent().children("input[type=checkbox]").prop("checked", false);
		$(".mail-addr-yn-chk").attr("src", __homeStatic__ + "/images/unchecked.png");
	});

	// 받는 사람 팝업
	$("#btn_addr_book_to").click(function (e) {
		fn_web_popup_email_address_book_open({
			TITLE: "받는 사람",
			REG_EMAIL_LIST: fnGetRegEmailList("to"),
			ORG_CHART_ALL_BUTTON: true,
			RETURN: function (p_data) {
				fnReturnEmailAddresBook("to", p_data);
			}
		});
	});

	// 참조 팝업
	$("#btn_addr_book_cc").click(function (e) {
		fn_web_popup_email_address_book_open({
			TITLE: "참조",
			REG_EMAIL_LIST: fnGetRegEmailList("cc"),
			ORG_CHART_ALL_BUTTON: false,
			RETURN: function (p_data) {
				fnReturnEmailAddresBook("cc", p_data);
			}
		});
	});

	// 숨은 참조 팝업
	$("#btn_addr_book_bcc").click(function (e) {
		fn_web_popup_email_address_book_open({
			TITLE: "숨은 참조",
			REG_EMAIL_LIST: fnGetRegEmailList("bcc"),
			ORG_CHART_ALL_BUTTON: false,
			RETURN: function (p_data) {
				fnReturnEmailAddresBook("bcc", p_data);
			}
		});
	});
});



// 인코딩 콤보박스 데이터 조회
function fnComboCharSet() {
	sendAjaxRequest({
		ACTION: null,
		FORM: null,
		SERVICE: "groupware.common.combo.GroupwareCombo.getCharsetList",
		METHOD: "POST",
		PARAMS: null,
		DONE: function (p_response) {
			var status = getDocStatus(p_response);
			if (status == "ok") {
				var _column1 = "";
				var _column2 = "";
				var _option = "";
				for (var i = 0; i < p_response.DATA.length; i++) {
					_column1 = p_response.DATA[i].column1;
					_column2 = p_response.DATA[i].column2;
					_option = $("<option value=\"" + _column1 + "\">" + _column2 + "</option>");
					$('#charset').append(_option);
				}
				$("#charset").val("UTF-8").attr("selected", "selected");
			}
			else {
				alert(status);
			}
		},
		ERROR: null,
		ASYNCHRONOUS: true,
		BASEAPP_TYPE: "S",
		SESSION_CHECK: false,
		CONFIRM_MESSAGE: null,
		RESPONSE_TYPE: "json",
		PROGRESS_MESSAGE: null
	});
}

// 서명유형선택
function fnChgSignUseType() {
	sendAjaxRequest({
		ACTION: null,
		FORM: null,
		SERVICE: "groupware.email.EmailConfig.getSign",
		METHOD: "POST",
		PARAMS: "domain_name=" + _domain_name
			+ "&email_acnt_id=" + _email_acnt_id
		,
		DONE: function (p_response) {
			var status = getDocStatus(p_response);
			if (status == "ok") {
				var data = p_response.DATA;
				if ($("#select_sign_text_edit").val() == "1") {
					$("#sign_text").html(data[0].sign_text1);
				}
				else if ($("#select_sign_text_edit").val() == "2") {
					$("#sign_text").html(data[0].sign_text2);
				}
				else if ($("#select_sign_text_edit").val() == "3") {
					$("#sign_text").html(data[0].sign_text3);
				}
			}
			else {
				alert(status);
			}
		},
		ERROR: null,
		ASYNCHRONOUS: true,
		BASEAPP_TYPE: "S",
		SESSION_CHECK: false,
		CONFIRM_MESSAGE: null,
		RESPONSE_TYPE: "json",
		PROGRESS_MESSAGE: null
	});
}

// 기존 첨부파일 삭제
function deleteExistAttachFile(p_pn, p_ppn) { // 파트넘버, 상위파트넘버
	if (_file_count > 0) {

		var attach_file_list_existObj = getObjectId("attach_file_list_exist");
		if (attach_file_list_existObj == null) {
			return;
		}
		var exist_attach_itemList = getObjectsId("exist_attach_item");
		for (var i = 0; i < exist_attach_itemList.length; i++) {
			if (parseInt(exist_attach_itemList[i].getAttribute("part_num")) == parseInt(p_pn)
				&& parseInt(exist_attach_itemList[i].getAttribute("parent_part_num")) == parseInt(p_ppn)
			) {
				attach_file_list_existObj.removeChild(exist_attach_itemList[i]);
				break;
			}
		}
	}
}


// 닫기
function fnThisClose(p_obj) {
	fnAppClose(p_obj);
}


// 주소록객체처리
function addressInputObject() {
	var addrInputObjName = ["to", "cc", "bcc"];

	for (var i = 0; i < addrInputObjName.length; i++) {
		var evtObj = document.getElementById(addrInputObjName[i]); // tempfrm[addrInputObjName[i]];

		irfw.Event.addListener(evtObj, "keydown", function (p_evt) {
			var keyCode = p_evt.keyCode ? p_evt.keyCode : p_evt.which ? p_evt.which : p_evt.charCode;
			var inputObj = getEventSource(p_evt);

			inputObj.setAttribute("keycodeValue", keyCode);

			if (keyCode == 186 // 세미콜론
				|| keyCode == 188 // 콤마
				|| keyCode == 13 // 엔터
				//|| keyCode == 9 // 탭
			) {

				if (inputObj.value.trim() != "") {
					// 입력한 메일 주소가 중복되는 경우는 객체태그가 추가 되지 않도록 하기
					var equalObj = fnCheckInputObject(inputObj, inputObj.value);
					if (equalObj == null) {
						var appendHTML = fnMakeTagEmailAddress(inputObj, inputObj.value); // 이메일객체tag
						fnAppendEmailAddressObject(inputObj, appendHTML); // 이메일객체추가
						fnResizeInputObject(inputObj); // 입력객체resize
					}
					else {
						// 중복 객체에 깜빡이는 효과 주기
						var pos = 0;
						var change_color = setInterval(cc_frame, 4);
						function cc_frame() {
							if (pos == 120) {
								equalObj.style.color = "#4794FE";
								equalObj.style.border = "solid 1px #4794FE";
								clearInterval(change_color);
							}
							else {
								pos++;
								equalObj.style.color = "#FD7F8E";
								equalObj.style.border = "solid 1px #FD7F8E";
							}
						}
					}
				}

				$('#' + inputObj.getAttribute("id")).autocomplete("close");
				inputObj.value = "";

				if (keyCode == 9) { // 탭 --> 다음객체로 포커스이동
					if (inputObj) {
						inputObj.setAttribute("next.focus.enter.unuse", "false");
						inputObj.setAttribute("next.focus.enter.unuse", "true");
					}
				}
				irfw.Event.stopEvent(p_evt);
			}
			else if (keyCode == 8 // 백스페이스
			) {
				if (inputObj.value == "") {
					var addressItemDeleteList = getObjectsId(inputObj.getAttribute("name") + "_address_item_delete"); // 삭제아이콘객체
					if (addressItemDeleteList.length > 0) {
						fnRemoveEmailAddressObject(addressItemDeleteList[addressItemDeleteList.length - 1]);
					}

					try {
						$('#' + inputObj.getAttribute("id")).autocomplete("close");
					}
					catch (ex) { }
				}
			}
		});
		irfw.Event.addListener(evtObj, "blur", function (p_evt) {
			var inputObj = getEventSource(p_evt);
			if (inputObj.value.trim() != "") {
				// 입력한 메일 주소가 중복되는 경우는 객체태그가 추가 되지 않도록 하기
				var equalObj = fnCheckInputObject(inputObj, inputObj.value);
				if (equalObj == null) {
					var appendHTML = fnMakeTagEmailAddress(inputObj, inputObj.value); // 이메일객체tag
					fnAppendEmailAddressObject(inputObj, appendHTML); // 이메일객체추가
					fnResizeInputObject(inputObj); // 입력객체resize
				}
				else {
					// 중복 객체에 깜빡이는 효과 주기
					var pos = 0;
					var change_color = setInterval(cc_frame, 4);
					function cc_frame() {
						if (pos == 120) {
							equalObj.style.color = "#4794FE";
							equalObj.style.border = "solid 1px #4794FE";
							clearInterval(change_color);
						}
						else {
							pos++;
							equalObj.style.color = "#FD7F8E";
							equalObj.style.border = "solid 1px #FD7F8E";
						}
					}
				}
			}

			inputObj.value = "";

			irfw.Event.stopEvent(p_evt);
		});
	}
}

// 객체태그 중복 확인
function fnCheckInputObject(p_input_object, p_address) {
	var objName = $(p_input_object).attr("name"); // to, cc, bcc
	var objAddress = p_address.trim();
	var ltIndex = objAddress.indexOf("<");
	var sAddress = ""; // 입력한 이메일 주소
	var equalObj = null;

	// 등록한 태그에 '<, >'가 포함되어 있는 경우 그 사이에 있는 이메일 주소 불러오기
	if (ltIndex != -1 && objAddress.substr(objAddress.length - 1) == ">") {
		sAddress = objAddress.substr(ltIndex + 1);
		sAddress = sAddress.substr(0, sAddress.length - 1);
	}
	else {
		sAddress = objAddress;
	}

	// 이미 등록되어 있는 태그(객체)들을 배열에 담기
	var regAllObj = document.getElementsByClassName("emailaddressobj");
	var regObj = [];
	for (var i = 0; i < regAllObj.length; i++) {
		if (regAllObj[i].getAttribute("class").indexOf("emailaddressobj_error") == -1
			&& regAllObj[i].getAttribute("id") == objName + "_address_item") {
			regObj.push(regAllObj[i]);
		}
	}

	// 이미 등록되어 있는 태그의 메일 주소와 입력한 메일 주소가 같은지 비교
	var regObjAddress = "";
	var regLtIndex = 0;
	var regAddress = "";
	for (var j = 0; j < regObj.length; j++) {
		regObjAddress = regObj[j].childNodes[1].getAttribute("value");
		regLtIndex = regObjAddress.indexOf("<");

		if (regLtIndex != -1 && regObjAddress.substr(regObjAddress.length - 1) == ">") {
			regAddress = regObjAddress.substr(regLtIndex + 1);
			regAddress = regAddress.substr(0, regAddress.length - 1);
		}
		else {
			regAddress = regObjAddress;
		}

		// 등록하려는 이메일 주소가 이미 등록되어 있는 경우
		if (sAddress == regAddress) {
			equalObj = regObj[j];
			break;
		}
	}

	return equalObj;
}

// 수신주소입력객체resize
function fnResizeInputObject(p_input_object) {
	if (p_input_object == null) {
		return;
	}
	var objBox = p_input_object.parentElement;
	var objName = p_input_object.getAttribute("name"); // to/cc/bcc
	var addressItemList = getObjectsId(objName + "_address_item"); // 주소아이템내역
	var addressBookBtn = getObjectId("btn_addr_book_" + objName);
	var cellPadding = 21; // 셀여백
	var addressBookButtonWidth = 0;

	var lastItemRight = 0;
	if (addressItemList.length > 0) {
		var lastItem = addressItemList[addressItemList.length - 1];
		var lastItemRight = parseInt(lastItem.offsetLeft) + (parseInt(lastItem.clientWidth) + 2) + 5;

		addressBookButtonWidth = lastItemRight - cellPadding;
	}

	p_input_object.style.width = "calc(100% - " + addressBookButtonWidth + "px)";
	if (parseInt(objBox.clientWidth) - addressBookButtonWidth < 80) {
		p_input_object.style.width = "100%";
	}
}

// 이메일객체tag생성
function fnMakeTagEmailAddress(p_input_object, p_input_account) {
	var ret = "";
	var emailAccount = p_input_account.trim();
	var objName = p_input_object.getAttribute("name"); // to/cc/bcc

	var emailAddress = "";
	var tempAddress = strSplit(emailAccount, "<");
	var tempAddress2 = [];
	var chkAddress = [];
	for (var i = 0; i < tempAddress.length; i++) {
		tempAddress2 = strSplit(tempAddress[i], ">");
		for (var j = 0; j < tempAddress2.length; j++) {
			chkAddress.push(tempAddress2[j]);
		}
	}

	for (var i = chkAddress.length - 1; i >= 0; i--) {
		if (chkAddress[i] != "") {
			emailAddress = chkAddress[i];
			break;
		}
	}

	emailAccount = emailAccount.encode4Html();

	var validationRegex = /(^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$)/;
	var isNormal = false;

	if (objName == "to") {
		if (emailAccount == "#전체#"
			|| emailAccount == "#전체"
			|| emailAccount == "#FULL#"
			|| emailAccount == "#FULL"
		) {

			isNormal = true;
		}
		else {
			isNormal = validationRegex.test(emailAddress);
		}
	}
	else {
		isNormal = validationRegex.test(emailAddress);
	}

	ret = "<div id=\"" + objName + "_address_item\" name=\"" + objName + "_address_item\" class=\"emailaddressobj " + (isNormal ? "emailaddressobj_normal" : "emailaddressobj_error") + "\"" + (isNormal ? "" : " title=\"이메일주소가 올바르지 않습니다.\"") + ">";
	ret += emailAccount;
	ret += "<input id=\"" + objName + "_address\" name=\"" + objName + "_address\" type=\"hidden\" value=\"" + emailAccount + "\" validation=\"" + (isNormal ? "true" : "false") + "\">";
	ret += "<div id=\"" + objName + "_address_item_delete\" name=\"" + objName + "_address_item_delete\" class=\"emailaddressobj_delete\" title=\"" + emailAccount + "삭제\" inputobjectname=\"" + objName + "\" onclick=\"javascript:fnRemoveEmailAddressObject(this);\">×</div>"
	ret += "</div>";

	return ret;
}

// 이메일객체추가
function fnAppendEmailAddressObject(p_input_object, p_append_object) {
	p_input_object.insertAdjacentHTML("beforebegin", p_append_object);

	try {
		$('#' + p_input_object.getAttribute("id")).autocomplete("close");
	}
	catch (ex) { }
}

// 수신주소입력객체삭제
function fnRemoveEmailAddressObject(p_object) {
	var objName = p_object.getAttribute("inputobjectname"); // to/cc/bcc
	var addressItemList = getObjectsId(objName + "_address_item");
	var addressItemDeleteList = getObjectsId(objName + "_address_item_delete");
	var removeObject = null;
	for (var i = 0; i < addressItemDeleteList.length; i++) {
		if (addressItemDeleteList[i] == p_object) {
			removeObject = addressItemList[i];
			break;
		}
	}

	fnRemoveEmailAddressObjectPrcs(removeObject, objName);
}
// 수신주소입력객체삭제처리
function fnRemoveEmailAddressObjectPrcs(p_object, p_name) {
	if (p_object) {
		var inputObj = getObjectId(p_name); // 입력객체
		var cellObj = getObjectId("cell_" + p_name + "_input_box"); // 셀객체
		cellObj.removeChild(p_object);

		fnResizeInputObject(inputObj); // 입력객체resize
	}
}

// 수신주소추가
function fnAppendRecieveAddress(p_obj, p_address_list) {
	var targetObj = null;
	if (getTypeOf(p_obj) == "string") {
		targetObj = getObjectId(p_obj);
		if (targetObj == null) {
			targetObj = getObjectId(p_obj);
		}
	}
	else {
		targetObj = p_obj;
	}

	if (targetObj) {
		if (p_address_list.length > 0) {
			for (var i = 0; i < p_address_list.length; i++) {
				var appendHTML = fnMakeTagEmailAddress(targetObj, p_address_list[i]); // 이메일객체tag
				fnAppendEmailAddressObject(targetObj, appendHTML); // 이메일객체추가
			}

			fnResizeInputObject(targetObj); // 입력객체resize
		}
	}
}

// 스마트검색-주소록
function smartSearchForAddrBook() {
	sendAjaxRequest({
		ACTION: null,
		FORM: null,
		SERVICE: "groupware.common.smartsearch.getEmailAddressBookList",
		METHOD: "POST",
		PARAMS: null,
		DONE: function (response) {
			var emaillist = new Array();
			var data = getDocDataList(response);
			for (var i = 0; i < data.length; i++) {
				emaillist.push(getDocAttribute(data[i], "email"));
			}
			initAutoEmail(emaillist);
		},
		ERROR: null,
		ASYNCHRONOUS: true,
		CONFIRM_MESSAGE: null,
		PROGRESS_MESSAGE: null
	});
}

function initAutoEmail(emaillist) {
	var availableTags = emaillist;

	function split(val) {
		return val.split(/;\s*/);
	}

	function extractLast(term) {
		return split(term).pop();
	}

	$("#to,#cc,#bcc").bind("keydown", function (event) {
		if (event.keyCode === $.ui.keyCode.TAB
			&& $(this).autocomplete("instance").menu.active
		) {
			event.preventDefault();
		}
	}).autocomplete({
		minLength: 0,
		search: function () {
			var targetObjKeycodeValue = arguments[0].target.getAttribute("keycodeValue"); // 입력객체의 keycode값
			if (targetObjKeycodeValue == null) {
				targetObjKeycodeValue = arguments[0].target.keycodeValue;
			}
			if (targetObjKeycodeValue != null) {
				var keyCode = parseInt(targetObjKeycodeValue);
				if (keyCode == $.ui.keyCode.LEFT
					|| keyCode == $.ui.keyCode.RIGHT
					|| keyCode == $.ui.keyCode.UP
					|| keyCode == $.ui.keyCode.DOWN) {

					return false;
				}
			}
		},
		source: function (request, response) {
			if (extractLast(request.term) == "") {
				return;
			}
			response($.ui.autocomplete.filter(availableTags, extractLast(request.term)));
		},
		focus: function (event, ui) {
			this.value = ui.item.value;
			return false;
		},
		select: function (event, ui) {
			if (ui.item.value.trim() != "") {
				// 입력한 메일 주소가 중복되는 경우는 객체태그가 추가 되지 않도록 하기
				var equalObj = fnCheckInputObject(this, ui.item.value);
				if (equalObj == null) {
					var appendHTML = fnMakeTagEmailAddress(this, ui.item.value); // 이메일객체tag
					fnAppendEmailAddressObject(this, appendHTML); // 이메일객체추가
					fnResizeInputObject(this); // 입력객체resize
				}
				else {
					// 중복 객체에 깜빡이는 효과 주기
					var pos = 0;
					var change_color = setInterval(cc_frame, 4);
					function cc_frame() {
						if (pos == 120) {
							equalObj.style.color = "#4794FE";
							equalObj.style.border = "solid 1px #4794FE";
							clearInterval(change_color);
						}
						else {
							pos++;
							equalObj.style.color = "#FD7F8E";
							equalObj.style.border = "solid 1px #FD7F8E";
						}
					}
				}
			}

			this.value = "";

			return false;
		}
	}
	);
}

/**
* 첨부파일업로드
*/
function fnAttachFileUpload() {
	var file_upload_config = "email_write"; // 파일업로드설정-이메일쓰기
	var file_upload_object = getObjectId(file_upload_id);
	var file_upload_id = file_upload_object.value;

	fnOpenFileUploadWin({
		UPLOAD_CONFIG: file_upload_config
		, UPLOAD_ID: file_upload_id
		, LIST_OBJECT: "attach_file_list_append"
		, CLOSE: function (data) {
			if (data != null) {
				file_upload_object.value = data.file_upload_id;
			}
		}
	});
}

//수신메일작성
function fnMakeReceiveMail(p_list) {
	var ret = { "list": [], status: true }; // 상태는 형식 밸리데이션체크
	var validation = "";
	for (var i = 0; i < p_list.length; i++) {
		validation = p_list[i].getAttribute("validation");
		if (validation == "true" || validation == "Y") {
			//ret.list += (ret.list.length > 0 ? ", " : "") + p_list[i].value;
			ret.list.push(encodeURIComponent(p_list[i].value));
		}
		else {
			ret.status = false;
			break;
		}
	}
	return ret;
}

// 메일전송
// p_send_type null:전송 T:임시저장 R:예약메일
function fnSendMail(p_send_type) {
	var reservationDateTime = "";

	if (p_send_type == 'R') {
		reservationDateTime = $("#reservation").val();
		if (!reservationDateTime) {
			alert("예약일이 지정되지 않았습니다.");
			return;
		}
	}
	else if (p_send_type == null || p_send_type.length == 0) {
		p_send_type = "S";
	}

	console.log("예약일시: " + reservationDateTime);
	console.log("p_send_type : " + p_send_type);

	var confMsg = ""; // 확인메시지

	var toList = getObjectsId("to_address");
	var ccList = getObjectsId("cc_address");
	var bccList = getObjectsId("bcc_address");

	var toAddressList = _to_me ? { "list": [_email_address], status: true } : fnMakeReceiveMail(toList);
	if (toAddressList.status == false) {
		alert("받는 사람에 형식이 올바르지 않는 주소가 존재합니다.");
		return;
	}
	var ccAddressList = fnMakeReceiveMail(ccList);
	if (ccAddressList.status == false) {
		alert("참조에 형식이 올바르지 않는 주소가 존재합니다.");
		return;
	}
	var bccAddressList = fnMakeReceiveMail(bccList);
	if (bccAddressList.status == false) {
		alert("숨은참조에 형식이 올바르지 않는 주소가 존재합니다.");
		return;
	}

	if (p_send_type == "S" || p_send_type == "R") {
		if ($("#from").text() == "") {
			alert("보내는 사람이 없습니다.");
			return;
		}

		if (toList.length == 0
			&& _to_me == false
		) {
			alert("받는 사람이 없습니다.");
			return;
		}

		if (getObjectId("subject").value.trim() == "") {
			confMsg = "제목이 없습니다.\n그대로 메일을 보내시겠습니까?";
		}
	}
	else {
		if ($("#from").text() == "") {
			alert("보내는 사람이 없습니다.");
			return;
		}

		if (toList.length == 0
			&& _to_me == false
		) {
			alert("받는 사람이 없습니다.");
			return;
		}

		// confMsg = "저장하시겠습니까?";
	}

	if (p_send_type == "R" || p_send_type == "T") { // 임시저장시에 첨부파일이 대용량은 불가처리
		if (getObjectId("file-upload-container")) {
			if (window["_fileListMap_"]) {
				for (var i = 0; i < Object.keys(_fileListMap_).length; i++) {
					key = Object.keys(_fileListMap_)[i];
					if (_fileListMap_[key].status == "delete") {
						continue;
					}

					if (_fileListMap_[key].bigFile == "Y"
						|| _fileListMap_[key].bigFile == "true"
						|| _fileListMap_[key].bigFile == true
					) {
						if (p_send_type == 'R') {
							alert("첨부파일 중에 대용량파일이 있는 경우 예약발송을 할 수 없습니다.");
						} else {
							alert("첨부파일 중에 대용량파일이 있는 경우 임시저장을 할 수 없습니다.");
						}
						return;
					}
				}
			}
		}
	}

	if (confMsg != "") {
		if (confirm(confMsg) == false) { // confirm message
			return;
		}
	}

	getObjectId("send_type").value = p_send_type; // 전송유형(S:전송 T:임시저장 R:예약메일)

	// 기존첨부파일처리
	var attach_file_listObj = getObjectId("attach_file_list");
	var existAttachItemPnList = "";
	var existAttachItemParentPnList = "";
	if (attach_file_listObj) {
		var existAttachList = getObjectsName("exist_attach_item");
		for (var i = 0; i < existAttachList.length; i++) {
			existAttachItemPnList += (existAttachItemPnList != "" ? "," : "") + existAttachList[i].getAttribute("part_num");
			existAttachItemParentPnList += (existAttachItemParentPnList != "" ? "," : "") + existAttachList[i].getAttribute("parent_part_num");
		}
	}
	else if (getObjectId("file-upload-container")) {
		if (window["_fileListMap_"]) {
			for (var i = 0; i < Object.keys(_fileListMap_).length; i++) {
				key = Object.keys(_fileListMap_)[i];
				if (_fileListMap_[key].status == "exist") {
					if (_fileListMap_[key].partNumber > 0) {
						existAttachItemPnList += (existAttachItemPnList != "" ? "," : "") + _fileListMap_[key].partNumber;
						existAttachItemParentPnList += (existAttachItemParentPnList != "" ? "," : "") + _fileListMap_[key].parentPartNumber;
					}
				}
			}
		}
	}

	// 발송하기 전에 파일 업로드  fn_fileUpload
	fn_fileUpload(function (p_data) {
		var status = p_data.status;

		if (p_data.status == "ok") {
			var fileUploadId = p_data.file_upload_id; // 업로드아이디
			var fileGroupTokenKey = p_data.file_group_token_key; // 파일그룹토큰
			var fileLength = p_data.fileList.length; // 파일갯수

			var toAddressParams = "&to_address.cnt=" + toAddressList.list.length;
			for (var i = 0; i < toAddressList.list.length; i++) {
				toAddressParams += "&to_address=" + toAddressList.list[i];
			}

			var ccAddressParams = "&cc_address.cnt=" + ccAddressList.list.length;
			for (var i = 0; i < ccAddressList.list.length; i++) {
				ccAddressParams += "&cc_address=" + ccAddressList.list[i];
			}

			var bccAddressParams = "&bcc_address.cnt=" + bccAddressList.list.length;
			for (var i = 0; i < bccAddressList.list.length; i++) {
				bccAddressParams += "&bcc_address=" + bccAddressList.list[i];
			}

			// 발송
			sendAjaxRequest({
				ACTION: null,
				FORM: null,
				SERVICE: "groupware.email.Email.sendMessage",
				METHOD: "POST",
				PARAMS: "send_type=" + p_send_type
					+ "&from=" + encodeURIComponent($("#from").text())
					+ "&subject=" + encodeURIComponent($('#subject').val())
					+ toAddressParams
					+ ccAddressParams
					+ bccAddressParams
					+ "&exist_attach_item_part_number_list=" + existAttachItemPnList
					+ "&exist_attach_item_parent_part_number_list=" + existAttachItemParentPnList
					+ "&mailbox_type=" + _mailbox_type
					+ "&mailbox_name=" + _mailbox_name
					+ "&message_number=" + _message_number
					+ "&email_account=" + _email_account
					+ "&body=" + getEditorValue("cntt", true)
					+ "&file_upload_id=" + fileUploadId
					+ "&to_me=" + (_to_me == true ? "Y" : "N")
					+ "&charset=" + $("#charset option:selected").val()  // 에디터  // /getEditorValue("body", true)
					+ "&sign_use_yn=" + ($("#chk_sign_use_yn").is(":checked") ? "Y" : "N")
					+ "&sign_text=" + encodeURIComponent($("#sign_text").html())
					+ "&reserve_date=" + encodeURIComponent(reservationDateTime)
				,
				DONE: function (response) {
					var status = getDocStatus(response);
					if (status == "ok") {
						if (_modal_view_yn == "Y") {
							if (p_send_type == "S") {
								alert("메일을 보냈습니다.");
							}
							else if (p_send_type == "R") {
								alert("메일 발송 예약이 완료되었습니다.");
							}
							else {
								alert("작성한 메일이 임시보관함에 저장되었습니다.");
							}
							window.close();
							return
						}

						if (p_send_type == "S") {
							if (_write_type.length == 0) {
								location.replace("./EmailWriteDone.jsp?email_account=" + _email_account + "&email_account_name=" + _email_account_name + "&email_address=" + _email_address);
								fnMoveList();
							}
							else {
								fnMoveList();
							}
						}
						else if (p_send_type == "R") {
							location.replace("./EmailWriteDone_ReservaionDateTime.web.jsp?email_account=" + _email_account + "&email_account_name=" + _email_account_name + "&email_address=" + _email_address + "&reservationDateTime=" + reservationDateTime);
						}
						else {
							alert("작성한 메일이 예약/임시보관함에 저장되었습니다.");
							fnMoveList("R");
						}
					}
					else {
						if (p_send_type == "S") {
							alert("메일 전송에 실패했습니다.\n\n" + status);
						}
						else {
							alert("저장시 오류가 발생했습니다.\n\n" + status);
						}
					}
				},
				ERROR: null,
				ASYNCHRONOUS: true,
				CONFIRM_MESSAGE: null,
				PROGRESS_MESSAGE: p_send_type == "T" ? "임시 저장 중" : "메일 전송 중"
			});

		}
		else {
			alert(status);
		}
	});
}


// 주소록팝업
// p_type : to, cc, bcc
function fnAddressBookPopup(p_type) {
	var choiceCnt = 0; // 주소록선택가능갯수

	var url = __CONFIG__.groupware.popup.addressbook;
	var param = "?menunm=주소록&menuid=" + _menuid + "&data_type=mail&choice_cnt=" + choiceCnt + "&domain=irimmail.co.kr";

	var arguments = null;

	var modalWin = irfw.modalWin.open({
		ID: "winAddressBookPopup4Mail"
		, TYPE: "iframe"
		, URL: url + param
		, TITLE: "주소록"
		, WIDTH: 780
		, HEIGHT: 600
		, POSITION: "C"
		, MODAL: true
		, DRAG: true
		, SCROLL: true
		, ARGUMENTS: arguments
		, CLOSE_BUTTON: true
	});

	modalWin.afterClosePreProcess = function (p_data) {
		fnAddressBookPopup_mail(p_data, p_type);
	};
}


/**
* 주소록팝업 done
*/
function fnAddressBookPopup_mail(p_data, p_type) {
	if (p_data == null) {
		return;
	}

	var addressList = [];
	for (var i = 0; i < p_data.length; i++) {
		addressList.push(p_data[i].user_name + "<" + p_data[i].user_email + ">");
	}

	fnAppendRecieveAddress(p_type, addressList);
}


// 내게쓰기
function fnToMe() {
	fnAppendRecieveAddress("to", [$("#from").text()]);
}

// 목록보기
function fnMoveList(m_param) {
	if (m_param == "Y") {
		parent.$("#mailbox-inbox").click();
	}
	else {
		location.replace("./EmailWriteDone.jsp?email_account=" + _email_account + "&email_account_name=" + _email_account_name + "&email_address=" + _email_address);
	}
}

// 미리보기
function fnPreview() {
	var from = _email_address.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

	var toList = getObjectsId("to_address");
	var ccList = getObjectsId("cc_address");
	var bccList = getObjectsId("bcc_address");

	var toAddressList = _to_me ? { "list": _email_address, status: true } : fnPreviewMakeReceiveMail(toList);
	var ccAddressList = fnPreviewMakeReceiveMail(ccList);
	var bccAddressList = fnPreviewMakeReceiveMail(bccList);

	$("#preview-email-subject-val").html($('#subject').val());
	$("#preview-email-from-val").html(from);
	$("#preview-email-to-val").html(toAddressList.list.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
	$("#preview-email-cc-val").html(ccAddressList.list.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
	$("#preview-email-bcc-val").html(bccAddressList.list.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));

	var email_contents = getEditorValue("cntt", false);
	if ($("#chk_sign_use_yn").is(":checked")) {
		email_contents += "<div id=\"preview-sign-container\" style=\"border-top:solid 1px #caccd7; margin-top:10px; margin-top:10px; font-size:12px; min-height:80px; padding:10px;\">";
		email_contents += $("#sign_text").html();
		email_contents += "</div>";
	}

	$("#preview-email-body-val").html(email_contents);
	$("#preview-email-file-val").html($("#fileUploadSummary").html());

	$(".popup-preview").css("display", "block");
}

// 수신메일작성
function fnPreviewMakeReceiveMail(p_list) {
	var ret = { "list": "", status: true }; // 상태는 형식 밸리데이션체크
	for (var i = 0; i < p_list.length; i++) {
		ret.list += (ret.list.length > 0 ? ", " : "") + p_list[i].value;
	}
	return ret;
}

// 이메일주소록팝업에서 받은 메일주소 태그 형식으로 리턴
function fnReturnEmailAddresBook(p_type, p_data) {
	var arrDataList = p_data;

	if (arrDataList.length == 0) {
		return;
	}

	// 등록되어 있는 태그 모두 삭제
	var emailObj = getObjectId("cell_" + p_type + "_input_box").querySelectorAll(".emailaddressobj");
	for (var i = 0; i < emailObj.length; i++) {
		emailObj[i].remove();
	}

	var emailAccount = "";
	var emailAccountName = "";
	var arrEmailList = new Array();
	for (var i = 0; i < arrDataList.length; i++) {
		emailAccount = arrDataList[i].email_account;
		emailAccountName = arrDataList[i].email_account_name;

		if (emailAccountName == "") {
			arrEmailList.push(emailAccount);
		}
		else {
			arrEmailList.push(emailAccountName + "<" + emailAccount + ">");
		}
	}

	fnAppendRecieveAddress(p_type, arrEmailList); // 태그박스에 태그 생성
}

// 태그박스에 등록된 메일주소 가져오기
function fnGetRegEmailList(p_type) {
	var type = p_type;

	if (type == null) {
		return;
	}

	var inputBoxObj = null;

	if (type == "to") {
		inputBoxObj = getObjectId("cell_" + p_type + "_input_box");
	}
	else if (type == "cc") {
		inputBoxObj = getObjectId("cell_" + p_type + "_input_box");
	}
	else if (type == "bcc") {
		inputBoxObj = getObjectId("cell_" + p_type + "_input_box");
	}

	var emailAddressObj = inputBoxObj.getElementsByTagName("div");
	var arrEmailAddress = new Array();
	var emailAddress = "";
	var emailAcccountName = "";
	var emailAccount = "";

	for (var i = 0; i < emailAddressObj.length; i++) {
		if (emailAddressObj[i].id != type + "_address_item"
			|| emailAddressObj[i].classList.contains("emailaddressobj_error")
		) {
			continue;
		}

		emailAddress = emailAddressObj[i].children[0].getAttribute("value");

		if (emailAddress.indexOf("<") > -1) {
			emailAcccountName = emailAddress.split("<")[0];
			emailAccount = emailAddress.split("<")[1];
			emailAccount = emailAccount.substring(0, emailAccount.length - 1);
		}
		else {
			emailAcccountName = "";
			emailAccount = emailAddress;
		}

		arrEmailAddress.push({
			"email_account_name": emailAcccountName,
			"email_account": emailAccount
		});
	}

	if (arrEmailAddress != null) {
		arrEmailAddress = JSON.stringify(arrEmailAddress);
	}

	return arrEmailAddress;
}
