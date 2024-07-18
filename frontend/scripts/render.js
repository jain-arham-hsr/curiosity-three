const mathExtension = {
	type: "lang",
	filter: function (text) {
		text = text.replace(/```([^`]+)```/g, function (match, p1) {
			return '<div class="math-tex-block">$$' + p1 + "$$</div>";
		});
		text = text.replace(/`([^`]+)`/g, function (match, p1) {
			return '<span class="math-tex-inline">$' + p1 + "$</span>";
		});

		return text;
	},
};

const imageUrlExtension = function (attachments) {
	return {
		type: "output",
		filter: function (text) {
			console.log("outside replace");
			return text.replace(/<img src="([^"]+)"/g, function (match, imgName) {
				console.log("Inside replace");
				console.log(imgName);
				console.log(attachments);
				let imgUrl = imgName;
				for (const attachment of Object.values(attachments)) {
					if (attachment.name === imgName) {
						imgUrl = attachment.url;
					}
				}
				return '<img class="card-answer-img" src="' + imgUrl + '"';
			});
		},
	};
};

function isUrl(str) {
	const urlPattern = /^(http|https):\/\/([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;
	return urlPattern.test(str);
}

function parseAnswer(answer, attachments) {
	const converter = new showdown.Converter({
		literalMidWordUnderscores: true,
		headerLevelStart: 3,
		simpleLineBreaks: true,
		extensions: [mathExtension, imageUrlExtension(attachments)],
	});
	return converter.makeHtml(answer);
}

function parseCitations(citations) {
	let citationsContentHTML = `
	<button class="citations-toggle" onclick="toggleCitations(this)">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 9l-7 7-7-7"
			/>
		</svg>
		Show Citations
	</button>
	<div class="citations-container">
		<h4>Citations and References</h4>
	<div id="citations-content">`;
	citations.forEach((citation, index) => {
		citationsContentHTML += `<div class="citation">
								<p class="paraphrase">
									${citation.paraphrase}
								</p><div class="sources">`;
		citation.sources.forEach((source) => {
			sourceElementClass =
				citation.sources.length === 1 ? "source single-source" : "source";
			if (isUrl(source)) {
				citationsContentHTML += `<p><a href="${source}" target="_blank" rel="noopener noreferrer" class="${sourceElementClass}">${source}</a></p>`;
			} else {
				citationsContentHTML += `<p class="${sourceElementClass}">${source}</p>`;
			}
		});
		citationsContentHTML += `</div></div>`;
		if (index < citations.length - 1) {
			citationsContentHTML += `<div class="divider"></div>`;
		}
	});
	citationsContentHTML += `</div></div>`;
	return citationsContentHTML;
}

function renderCards(questions) {
	let serialNum = 0;
	Object.values(questions).forEach((question) => {
		if (!("answer" in question)) return;
		serialNum++;
		let card = `<div class="card">
				<div class="card-content">
					<span class="question-number">${serialNum}</span>
					<h2 class="card-title">${question.title}</h2>
					<p class="card-description">
						${question.desc}
					</p>
					<div class="card-answer">
						${parseAnswer(question.answer, question.attachments)}
					</div>
					${"citations" in question ? parseCitations(question.citations) : ""}	
					<div class="badges">
						<span class="badge"
							><span class="badge-label">Asked: </span
							><span class="badge-value">${question.date_asked}</span></span
						>
						<span class="badge"
							><span class="badge-label">Updated: </span
							><span class="badge-value">${question.last_updated}</span></span
						>
					</div>
				</div>
			</div>`;
		document.getElementById("card-container").innerHTML += card;
	});
	const cards = document.querySelectorAll(".card");
	var numOfResults = cards.length;
	if (numOfResults === 0) {
		document.getElementById("card-container").style.display = "none";
	} else {
		document.getElementById("card-container").style.display = "flex";
	}
	MathJax.typesetPromise();
}
