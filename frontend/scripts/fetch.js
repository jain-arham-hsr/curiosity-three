import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
	getDatabase,
	ref,
	child,
	get,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
	apiKey: "AIzaSyCL5fUeky5eCQ4suhxlMUT3a9VibqyLHC4",
	authDomain: "curiositythree-47a83.firebaseapp.com",
	databaseURL:
		"https://curiositythree-47a83-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "curiositythree-47a83",
	storageBucket: "curiositythree-47a83.appspot.com",
	messagingSenderId: "932309652320",
	appId: "1:932309652320:web:e135f29ae0d3d302a3c405",
	measurementId: "G-NN86KZMWTV",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const dbRef = ref(database);
get(child(dbRef, `questions`))
	.then((snapshot) => {
		if (snapshot.exists()) {
			render(snapshot.val());
		} else {
			console.log("No data available");
		}
	})
	.catch((error) => {
		console.error(error);
	});
