const searchBox =
    document.getElementById("searchTopic");


if (searchBox) {

    searchBox.addEventListener("keyup", function () {

        const searchText =
            searchBox.value.toLowerCase();


        const topics =
            document.querySelectorAll(".topic");


        topics.forEach(topic => {

            const text =
                topic.textContent.toLowerCase();


            if (text.includes(searchText)) {

                topic.style.display = "";

            } else {

                topic.style.display = "none";

            }

        });

    });

}