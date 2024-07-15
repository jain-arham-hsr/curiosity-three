function render(data) {
	let title;
	let description;
	let answerHTML;
	let card = `<div class="card">
				<div class="card-content">
					<span class="question-number">Q1</span>
					<h2 class="card-title">${title}</h2>
					<p class="card-description">
						${description}
					</p>
					<div class="card-answer">
						${answerHTML}
					</div>
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
					<div class="citations-content">
						<h4>Citations and References:</h4>
						<ul>
							<li>
								Astronomical Society of the Pacific: 'The Reason for the
								Seasons'
							</li>
							<li>NASA Earth Observatory: 'Milutin Milankovitch'</li>
							<li>National Geographic: 'Seasons'</li>
						</ul>
					</div>
					<div class="badges">
						<span class="badge"
							><span class="badge-label">Asked: </span
							><span class="badge-value">July 10, 2024</span></span
						>
						<span class="badge"
							><span class="badge-label">Updated: </span
							><span class="badge-value">July 14, 2024</span></span
						>
					</div>
				</div>
			</div>`;
}
