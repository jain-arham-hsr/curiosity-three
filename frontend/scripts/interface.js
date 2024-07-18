function toggleCitations(ele) {
	parentCard = ele.parentNode.parentNode;
	const citationsContainer = parentCard.getElementsByClassName(
		"citations-container"
	)[0];
	const toggleButton = parentCard.getElementsByClassName("citations-toggle")[0];

	if (
		citationsContainer.style.display === "none" ||
		citationsContainer.style.display === ""
	) {
		citationsContainer.style.display = "block";
		toggleButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                    Hide Citations
                `;
	} else {
		citationsContainer.style.display = "none";
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
const cardContainer = document.getElementById("card-container");

searchInput.addEventListener("input", function () {
	const cards = document.querySelectorAll(".card");
	let numOfResults = 0;
	const searchTerm = this.value.toLowerCase();
	cards.forEach((card) => {
		const content = card.innerHTML.toLowerCase();
		if (content.includes(searchTerm)) {
			card.style.display = "block";
			numOfResults++;
		} else {
			card.style.display = "none";
		}
	});
	if (numOfResults === 0) {
		document.getElementById("card-container").style.display = "none";
		searchInput.classList.add("invalid-input");
	} else {
		searchInput.classList.remove("invalid-input");
		document.getElementById("card-container").style.display = "flex";
	}
});

searchInput.addEventListener("keyup", function (e) {
	if (e.key === "Enter") cardContainer.scrollIntoView();
});
