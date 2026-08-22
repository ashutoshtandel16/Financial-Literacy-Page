/* =====================================
   LEARN PAGE SEARCH
   ===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchBox =
            document.getElementById(
                "searchTopic"
            );


        if (!searchBox) {

            return;

        }


        searchBox.addEventListener(
            "keyup",
            function () {

                const searchText =
                    searchBox.value
                        .toLowerCase()
                        .trim();


                const topics =
                    document.querySelectorAll(
                        ".topic"
                    );


                topics.forEach(
                    function (topic) {

                        const text =
                            topic.textContent
                                .toLowerCase();


                        if (
                            text.includes(searchText)
                        ) {

                            topic.style.display =
                                "";

                        } else {

                            topic.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }
);
