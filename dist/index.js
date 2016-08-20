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
	let dashboard = document.getElementById('dashboard')
	let cache = {}

	// Get all newsfeed DOM nodes
	const getFeedItems = (startingFrom) => {
	  const allowed = ['.watch_started', '.create', '.fork']
	  return document.querySelectorAll(...allowed)
	}

	// Get user/repo pairs from the DOM nodes
	const mapNodes = (node) => {
	  return node.querySelector('.title').lastElementChild.innerText
	}

	// Grab repo details from API and update the cache if needed
	const getRepoDetails = (userRepo, cache) => {
	  const API = 'https://api.github.com/repos/'

	  return new Promise((resolve, reject) => {
	    if (cache[userRepo]) {
	      resolve(cache[userRepo])
	      return
	    }

	    fetch(API + userRepo)
	      .then(result => result.json())
	      .then(json => cache[userRepo] = json)
	      .then(resolve)
	      .catch(reject)
	  })
	}

	const extend = () => {
	  const nodes = Array.from(getFeedItems())
	  const repositories = new Set(nodes.map(mapNodes))

	  Promise
	    .all([...repositories].map(userRepo => getRepoDetails(userRepo, cache)))
	    .then((result) => {})
	    .catch(console.error)
	}

	extend()


/***/ }
/******/ ]);