function toggleCitations(ele) {
	parentCard = ele.parentNode.parentNode;
	const citationsContent =
		parentCard.getElementsByClassName("citations-content")[0];
	const toggleButton = parentCard.getElementsByClassName("citations-toggle")[0];

	if (
		citationsContent.style.display === "none" ||
		citationsContent.style.display === ""
	) {
		citationsContent.style.display = "block";
		toggleButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                    Hide Citations
                `;
	} else {
		citationsContent.style.display = "none";
		toggleButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    Show Citations
                `;
	}
}

// Search functionality
const searchInput = document.getElementById("search-input");
const cards = document.querySelectorAll(".card");
const cardContainer = document.getElementById("card-container");
var numOfResults = cards.length;

searchInput.addEventListener("input", function () {
	numOfResults = 0;
	const searchTerm = this.value.toLowerCase();
	cards.forEach((card) => {
		const title = card.innerHTML.toLowerCase();
		const content = card.innerHTML.toLowerCase();

		if (title.includes(searchTerm) || content.includes(searchTerm)) {
			card.style.display = "block";
			numOfResults++;
		} else {
			card.style.display = "none";
		}
	});
	if (numOfResults === 0) {
		document.getElementById("card-container").style.display = "none";
		searchInput.classList.add("invalid-input");
		setTimeout(() => {
			searchInput.classList.remove("invalid-input");
		}, 500);
	} else {
		document.getElementById("card-container").style.display = "flex";
	}
});

searchInput.addEventListener("keyup", function (e) {
	if (numOfResults > 0) {
		if (e.key === "Enter") cardContainer.scrollIntoView();
	} else {
		searchInput.classList.add("invalid-input");
		setTimeout(() => {
			searchInput.classList.remove("invalid-input");
		}, 500);
	}
});
