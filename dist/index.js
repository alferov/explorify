/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* global fetch */

	var dashboard = document.getElementById('dashboard')

	// Get all newsfeed item containers
	var feedItems = document.getElementsByClassName('alert')
	const API = 'https://api.github.com/repos/'

	const itemReducer = (acc, node) => {
	  const titleNode = node.querySelector('.title')
	  const urlNodes = titleNode.getElementsByTagName('a')
	  const url = API + urlNodes[urlNodes.length - 1].innerText
	  acc[url] = { node }
	  return acc
	}

	const responseReducer = (acc, meta) => {
	  let { url, description } = meta
	  let cashedUrl = acc[url]
	  if (!cashedUrl) return
	  let { node } = cashedUrl
	  let div = document.createElement('div');
	  div.textContent = description
	  console.log(div)
	  node.appendChild(div)
	  cashedUrl = Object.assign(cashedUrl, { meta })

	  return acc
	}

	const getRepoDetails = (url) => {
	  return new Promise((resolve, reject) => {
	    const onSuccess = response => resolve(response.json())
	    fetch(url).then(onSuccess, reject)
	  })
	}

	const updateDOM = (node, respond) => {

	}

	// Generate a normalized object, where keys are github repo urls mentioned
	// in the newsfeed and values are references to DOM nodes that will be extended
	const normalizedUrls = Array.prototype.reduce.call(feedItems, itemReducer, {})
	// Get all repository URLs
	const userRepoUrls = Object.keys(normalizedUrls)
	const promises = userRepoUrls.map(getRepoDetails)

	Promise.all(promises).then((responses) => {
	  const normalizedResponses = responses.reduce(
	    responseReducer,
	    Object.assign({}, normalizedUrls)
	  )
	  console.log(normalizedResponses)
	})


/***/ }
/******/ ]);