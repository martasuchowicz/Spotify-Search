(function () {
    var defaultImgUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";

    var resultsElem = $("#results");

    var doc = $(document);

    var win = $(window);

    var infScroll = location.search.search(/\bscroll=infinite\b/) > -1;

    var nextUrl;

    var timer;

    function getData(url) {
        var q, type, goWasClicked;
        if (!url) {
            goWasClicked = true;
            q = $("input").val();
            type = $("select").val();
            url =
                "https://elegant-croissant.glitch.me/spotify?q=" +
                encodeURIComponent(q) +
                "&type=" +
                type;
        }

        $.ajax({
            url: url,
            success: function (data) {
                data = data.artists || data.albums;

                $("#more").remove();

                var myHtml = goWasClicked
                    ? "<h3>Results for &quot;" + q + "&quot;</h3>"
                    : "";

                var item, imgUrl;

                for (var i = 0; i < data.items.length; i++) {
                    item = data.items[i];
                    imgUrl = defaultImgUrl;
                    if (item.images[0]) {
                        imgUrl = item.images[0].url;
                    }

                    myHtml += '<div class="item">';
                    myHtml +=
                        '<a href="' +
                        item.external_urls.spotify +
                        '" target="_blank">';
                    myHtml += '<img src="' + imgUrl + '">';
                    myHtml += "</a>";
                    myHtml +=
                        '<a href="' +
                        item.external_urls.spotify +
                        '" target="_blank">';
                    myHtml += item.name;
                    myHtml += "</a>";
                    myHtml += "</div>";
                }

                if (!i) {
                    myHtml += "<em>Sorry, we did not find anything.</em>";
                }

                nextUrl = data.next;
                if (nextUrl) {
                    if (infScroll) {
                        checkScrollPos();
                    } else {
                        myHtml += '<button id="more">More</button>';
                    }
                    nextUrl = nextUrl.replace(
                        "api.spotify.com/v1/search",
                        "elegant-croissant.glitch.me/spotify"
                    );
                }

                if (goWasClicked) {
                    resultsElem.html(myHtml);
                } else {
                    resultsElem.append(myHtml);
                }
            },
        });
    }

    $("#go").on("click", function () {
        clearTimeout(timer);
        getData();
    });

    $(document).on("click", "#more", function () {
        getData(nextUrl);
    });

    function checkScrollPos() {
        timer = setTimeout(function () {
            if (doc.scrollTop() + win.height() >= doc.height() - 50) {
                getData(nextUrl);
            } else {
                checkScrollPos();
            }
        }, 750);
    }
})();
