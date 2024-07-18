const HEADER_LEVEL_START = 3;
const URL_PATTERN =
	/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

const isUrl = (str) => URL_PATTERN.test(str);

const template = (strings, ...keys) => {
	return function (...values) {
		const dict = values[values.length - 1] || {};
		const result = [strings[0]];
		keys.forEach((key, i) => {
			const value = Number.isInteger(key) ? values[key] : dict[key];
			result.push(value, strings[i + 1]);
		});
		return result.join("");
	};
};

const cardTemplate = template`
  <div class="card">
    <div class="card-content">
      <span class="question-number">${"index"}</span>
      <h2 class="card-title">${"title"}</h2>
      <p class="card-description">${"description"}</p>
      <div class="card-answer">${"answer"}</div>
      ${"citations"}
      <div class="badges">
        <span class="badge"><span class="badge-label">Asked: </span><span class="badge-value">${"dateAsked"}</span></span>
        <span class="badge"><span class="badge-label">Updated: </span><span class="badge-value">${"lastUpdated"}</span></span>
      </div>
    </div>
  </div>
`;

const citationsTemplate = template`
  <button class="citations-toggle" onclick="toggleCitations(this)">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
    Show Citations
  </button>
  <div class="citations-container">
    <h4>Citations and References</h4>
    <div id="citations-content">${"citationContent"}</div>
  </div>
`;

const citationItemTemplate = template`
  <div class="citation">
    <div class="paraphrase">${"paraphrase"}</div>
    <div class="sources">${"sources"}</div>
  </div>
  ${"divider"}
`;

const sourceTemplate = template`
  <p class="${"sourceClass"}">${"sourceContent"}</p>
`;

const createMathExtension = () => ({
	type: "lang",
	filter: (text) => {
		return text
			.replace(
				/```([^`]+)```/g,
				(_, p1) => `<div class="math-tex-block">$$${p1}$$</div>`
			)
			.replace(
				/`([^`]+)`/g,
				(_, p1) => `<span class="math-tex-inline">$${p1}$</span>`
			);
	},
});

const createImageUrlExtension = (attachments) => ({
	type: "output",
	filter: (text) => {
		const attachmentMap = new Map(
			Object.values(attachments).map((att) => [att.name, att.url])
		);
		return text.replace(/<img src="([^"]+)"/g, (_, imgName) => {
			const imgUrl = attachmentMap.get(imgName) || imgName;
			return `<img class="card-answer-img" src="${imgUrl}" alt="${imgName}"`;
		});
	},
});

const createShowdownConverter = (attachments) => {
	return new showdown.Converter({
		literalMidWordUnderscores: true,
		headerLevelStart: HEADER_LEVEL_START,
		simpleLineBreaks: true,
		extensions: [createMathExtension(), createImageUrlExtension(attachments)],
	});
};

const parseMarkdown = (text, attachments = {}) => {
	const converter = createShowdownConverter(attachments);
	return converter.makeHtml(text);
};

const renderCitations = (citations = [], attachments) => {
	if (citations.length === 0) return "";

	const citationContent = citations
		.map((citation, index) => {
			const sourceElements = citation.sources
				.map((source) => {
					const sourceClass =
						citation.sources.length === 1 ? "source single-source" : "source";
					const sourceContent = isUrl(source)
						? `<a href="${source}" target="_blank" rel="noopener noreferrer">${source}</a>`
						: source;
					return sourceTemplate({ sourceClass, sourceContent });
				})
				.join("");

			return citationItemTemplate({
				paraphrase: parseMarkdown(citation.paraphrase, attachments),
				sources: sourceElements,
				divider:
					index < citations.length - 1 ? '<div class="divider"></div>' : "",
			});
		})
		.join("");

	return citationsTemplate({ citationContent });
};

const renderCards = (questions) => {
	const cardContainer = document.getElementById("card-container");

	if (!questions) {
		console.error("Questions data is null or undefined");
		cardContainer.style.display = "none";
		return;
	}

	const questionsArray = Array.isArray(questions)
		? questions
		: Object.values(questions);

	const cards = questionsArray
		.filter((question) => question && "answer" in question)
		.map((question, index) => {
			const {
				title,
				desc,
				answer,
				attachments,
				citations,
				date_asked,
				last_updated,
			} = question;
			return cardTemplate({
				index: index + 1,
				title: title || "Untitled",
				description: desc || "",
				answer: parseMarkdown(answer, attachments),
				citations: renderCitations(citations, attachments),
				dateAsked: date_asked || "Unknown",
				lastUpdated: last_updated || "Unknown",
			});
		})
		.join("");

	cardContainer.innerHTML = cards;
	cardContainer.style.display = cards ? "flex" : "none";
	MathJax.typesetPromise();
};

const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

const debouncedRenderCards = debounce(renderCards, 100);
