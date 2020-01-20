const env = "dev"

export let servergroup = null;

if (env === "dev") {
	servergroup = { api: `http://localhost:6600` }
}

if (env === "qa") {
	servergroup = { api: `https://192.168.0.191:6500` }
}

if (env === "prod") {
	servergroup = { api: `https://alfadata.in` }
}

export const PublicRouteCollection = ["/", "/signin", "signup", "/signout", "signout"];

export const resCode = {
	exception: "EXCEPTION",
	error: "ERROR",
	undefined: 'UNDEFINED',
	exist: "EXIST",
	validation: "VALIDATION",
	success: "SUCCESS",
	limit: 100,
	ascending: 1,
	descending: -1,
	client: "",
	post: "POST",
	patch: "PATCH",
	delete: "DELETE",
	get: "GET",
}

export const latestCommitId = '#build#';

export const apiKeys = {
	appKey: "6422079bedbcfcd32b852debd",
	source: "ALPHALABSAPPS",
	method: "",
}

export const LocatorListType = [
	{ id: 'id', key: 1, label: "id", value: 'id' },
	{ id: 'css', key: 2, label: "css", value: 'css' },
	{ id: 'name', key: 3, label: "name", value: 'name' },
	{ id: 'xpath', key: 4, label: "xpath", value: 'xpath' },
	{ id: 'class', key: 5, label: "class", value: 'class' },
	{ id: 'label', key: 6, label: "label", value: 'label' },
	{ id: 'linktext', key: 7, label: "linktext", value: 'linktext' },
];

export const ActionListType = [
	{ id: 'is', key: 1, label: 'is', value: 'is', },
	{ id: 'jis', key: 2, label: 'jis', value: 'jis', },
	{ id: 'tick', key: 3, label: 'tick', value: 'tick', },
	{ id: 'click', key: 4, label: 'click', value: 'click' },
	{ id: 'write', key: 5, label: 'write', value: 'write', },
	{ id: 'hover', key: 6, label: 'hover', value: 'hover', },
	{ id: 'untick', key: 7, label: 'untick', value: 'untick' },
	{ id: 'jwrite', key: 8, label: 'jwrite', value: 'jwrite', },
	{ id: 'select', key: 9, label: 'select', value: 'select', },
	{ id: 'aclick', key: 10, label: 'aclick', value: 'aclick', },
	{ id: 'submit', key: 11, label: 'submit', value: 'submit', },
	{ id: 'hclick', key: 12, label: 'hclick', value: 'hclick', },
	{ id: 'rhover', key: 13, label: 'rhover', value: 'rhover', },
	{ id: 'jshover', key: 14, label: 'jshover', value: 'jshover' },
	{ id: 'jsclick', key: 15, label: 'jsclick', value: 'jsclick' },
	{ id: 'isvisible', key: 16, label: 'isvisible', value: 'isvisible' },
	{ id: 'iscontains', key: 17, label: 'iscontains', value: 'iscontains' },
	{ id: 'isnotblank', key: 18, label: 'isnotblank', value: 'isnotblank' }
];

export const PredefinedSteps = [
	{ id: 'wait', key: 1, label: 'wait', value: 'wait' },
	{ id: 'goto', key: 2, label: 'goto', value: 'goto' },
	{ id: 'back', key: 3, label: 'back', value: 'back' },
	{ id: 'isurl', key: 4, label: 'isurl', value: 'isurl' },
	{ id: 'tabkey', key: 5, label: 'tabkey', value: 'tabkey' },
	{ id: 'endkey', key: 6, label: 'endkey', value: 'endkey' },
	{ id: 'zoomin', key: 7, label: 'zoomin', value: 'zoomin' },
	{ id: 'homekey', key: 8, label: 'homekey', value: 'homekey' },
	{ id: 'zoomout', key: 9, label: 'zoomout', value: 'zoomout' },
	{ id: 'isalert', key: 10, label: 'isalert', value: 'isalert' },
	{ id: 'execute', key: 11, label: 'execute', value: 'execute' },
	{ id: 'ScrollUp', key: 12, label: 'ScrollUp', value: 'ScrollUp' },
	{ id: 'enterkey', key: 13, label: 'enterkey', value: 'enterkey' },
	{ id: 'isnoturl', key: 14, label: 'isnoturl', value: 'isnoturl' },
	{ id: 'spacebar', key: 15, label: 'spacebar', value: 'spacebar' },
	{ id: 'escapekey', key: 16, label: 'escapekey', value: 'escapekey' },
	{ id: 'deletekey', key: 17, label: 'deletekey', value: 'deletekey' },
	{ id: 'pageupkey', key: 18, label: 'pageupkey', value: 'pageupkey' },
	{ id: 'selectall', key: 19, label: 'selectall', value: 'selectall' },
	{ id: 'ScrollLeft', key: 20, label: 'ScrollLeft', value: 'ScrollLeft' },
	{ id: 'uparrowkey', key: 21, label: 'uparrowkey', value: 'uparrowkey' },
	{ id: 'ScrollDown', key: 22, label: 'ScrollDown', value: 'ScrollDown' },
	{ id: 'closepopup', key: 23, label: 'closepopup', value: 'closepopup' },
	{ id: 'closealert', key: 24, label: 'closealert', value: 'closealert' },
	{ id: 'switchframe', key: 25, label: 'switchframe', value: 'switchframe' },
	{ id: 'ScrollRight', key: 26, label: 'ScrollRight', value: 'ScrollRight' },
	{ id: 'pagedownkey', key: 27, label: 'pagedownkey', value: 'pagedownkey' },
	{ id: 'acceptalert', key: 28, label: 'acceptalert', value: 'acceptalert' },
	{ id: 'leftarrowkey', key: 29, label: 'leftarrowkey', value: 'leftarrowkey' },
	{ id: 'downarrowkey', key: 30, label: 'downarrowkey', value: 'downarrowkey' },
	{ id: 'backspacekey', key: 31, label: 'backspacekey', value: 'backspacekey' },
	{ id: 'dismissalert', key: 32, label: 'clearcookies', value: 'clearcookies' },
	{ id: 'rightarrowkey', key: 33, label: 'rightarrowkey', value: 'rightarrowkey' },
	{ id: 'isurlcontains', key: 34, label: 'isurlcontains', value: 'isurlcontains' },
	{ id: 'switchtopopup', key: 35, label: 'switchtopopup', value: 'switchtopopup' },
	{ id: 'SwitchDefaultFrame', key: 36, label: 'SwitchDefaultFrame', value: 'SwitchDefaultFrame' },
];


