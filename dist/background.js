/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/background.ts":
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeLanguageToolTab": () => (/* binding */ closeLanguageToolTab),
/* harmony export */   "getUserGoogleInfoByToken": () => (/* binding */ getUserGoogleInfoByToken)
/* harmony export */ });
/* harmony import */ var _eventhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventhandler */ "./src/background/eventhandler.ts");
/* harmony import */ var _staticData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../staticData */ "./src/staticData.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


// 開始執行所有事件監聽
(0,_eventhandler__WEBPACK_IMPORTED_MODULE_0__.setChromeListener)();
const getUserGoogleInfoByToken = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${_staticData__WEBPACK_IMPORTED_MODULE_1__.LANGUAGE_TOOL_API_KEY}`, {
        method: 'POST',
        body: JSON.stringify({ idToken: idToken })
    });
    let jsonObj = yield response.json();
    // 儲存使用者資訊
    yield chrome.storage.sync.set({
        displayName: jsonObj.users[0].displayName,
        email: jsonObj.users[0].email,
        photoUrl: jsonObj.users[0].photoUrl
    });
    chrome.runtime.sendMessage({ action: "setReactUserInfo" });
});
// 取得使用者資訊後關閉 LT tab
const closeLanguageToolTab = (tableId) => {
    if (tableId != 0) {
        chrome.tabs.remove(tableId, function () {
            tableId = 0;
        });
    }
};



/***/ }),

/***/ "./src/background/eventhandler.ts":
/*!****************************************!*\
  !*** ./src/background/eventhandler.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setChromeListener": () => (/* binding */ setChromeListener)
/* harmony export */ });
/* harmony import */ var _background__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./background */ "./src/background/background.ts");
/* harmony import */ var _staticData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../staticData */ "./src/staticData.ts");


let tabToClose = 0;
let idToken;
let pageLang = 'zh-TW';
const setChromeListener = () => {
    // 點擊登入按鈕
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "openLanguageToolTab") {
            // 開啟新分頁讓使用者登入 Language Tool
            chrome.tabs.create({
                url: _staticData__WEBPACK_IMPORTED_MODULE_1__.LANGUAGE_TOOL_URL,
                active: false
            }, (tab) => {
                // 儲存 tabId 以便在取得到用戶資訊後可關閉指定 tab
                tabToClose = tab.id;
            });
        }
    });
    // 攔截 LT 發送的 POST 請求，並提取其中的 idToken
    chrome.webRequest.onBeforeRequest.addListener(function (details) {
        if (details.method == 'POST'
            && details.initiator == _staticData__WEBPACK_IMPORTED_MODULE_1__.LANGUAGE_TOOL_URL
            && details.requestBody != undefined
            && details.requestBody.raw != undefined) {
            // 解析請求 Body 中的資料
            let postedString = decodeURIComponent(String.fromCharCode.apply(null, 
            // @ts-ignore
            new Uint8Array(details.requestBody.raw[0].bytes)));
            // Get the token then start to get user informaions and info dev panel to retry patch action
            if (postedString.includes('idToken')) {
                let postJsonObj = JSON.parse(postedString);
                if (postJsonObj.idToken.length >= 100) {
                    idToken = postJsonObj.idToken;
                    chrome.storage.sync.set({ token: postJsonObj.idToken }, function () {
                        (0,_background__WEBPACK_IMPORTED_MODULE_0__.getUserGoogleInfoByToken)(idToken);
                        (0,_background__WEBPACK_IMPORTED_MODULE_0__.closeLanguageToolTab)(tabToClose);
                        chrome.runtime.sendMessage({ action: ['autoRetryPatchAfterAutoGetToken'] });
                    });
                }
            }
        }
    }, { urls: ['<all_urls>'] }, ['requestBody']);
};



/***/ }),

/***/ "./src/staticData.ts":
/*!***************************!*\
  !*** ./src/staticData.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LANGUAGE_SELECT_DATA": () => (/* binding */ LANGUAGE_SELECT_DATA),
/* harmony export */   "LANGUAGE_TOOL_API_KEY": () => (/* binding */ LANGUAGE_TOOL_API_KEY),
/* harmony export */   "LANGUAGE_TOOL_URL": () => (/* binding */ LANGUAGE_TOOL_URL),
/* harmony export */   "VALID_DOMAIN_LIST": () => (/* binding */ VALID_DOMAIN_LIST)
/* harmony export */ });
// 可使用小工具 Domain
const LANGUAGE_TOOL_API_KEY = 'AIzaSyDKyl5i5uLG_vFBF2cxdJwfzkXNdQuNn80';
const LANGUAGE_TOOL_URL = 'https://translation.qa.91dev.tw';
const VALID_DOMAIN_LIST = [
    'sms.qa.91dev.tw',
    'sms.qa8.91dev.tw',
];
const LANGUAGE_SELECT_DATA = [
    { value: 'zh-TW', name: "中文" },
    { value: 'zh-HK', name: "香港中文" },
    { value: 'en-US', name: "英文" },
    { value: 'ms-MY', name: "馬來文" },
    { value: 'kok-IN', name: "火星文" }
];


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/background/background.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.js.map