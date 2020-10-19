
function rand() {
	const title = document.getElementById('title');
	const titles = [
		'Stop!',
		'Blocked!',
		'#!#!#!',
		':-((((',
		'No way!',
		'Go away!'
	];
	title.innerText = titles[Math.floor(Math.random() * titles.length)];

	if (Math.random() > 0.5) {
		document.body.classList.add('inverted');
	} else {
		document.body.classList.remove('inverted');
	}
}

window.addEventListener('DOMContentLoaded', rand);
document.addEventListener('click', rand);
