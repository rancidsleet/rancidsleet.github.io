// cannot directly assign .focus function?
let focus = _ => document.getElementById("searchbar").focus();
let last_hr;

function filter(phrase) {
	try {last_hr.classList.remove("hide"); last_hr = undefined;} catch {}
	
	document.querySelectorAll(".list__node").forEach(i => {
		if (i.getAttribute("data-tags").toLowerCase().includes(phrase)) {
			i.classList.remove("hide");
			last_hr = i.querySelector("hr");
		} else i.classList.add("hide");
	});
	try {last_hr.classList.add("hide")} catch {}
}

window.addEventListener("load", () => {
	focus();
	window.addEventListener("keyup", focus);
});
