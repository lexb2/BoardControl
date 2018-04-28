function updateView(elementName, content) {
    document.getElementById(elementName).innerHTML = content;
}

function buildInformationHtml(result) {
    if (result.length === 0) {
        return;
    }
    var html = '<dl class="uk-description-list">';
    var i = 0;
    for (i = 0; i < result.length; i++) {
        html = html.concat('<dt>' + result[i].label + '</dt>');
        html = html.concat('<dd class="mono">' + (result[i].result == "" ? "-" : result[i].result) + '</dd>');
        if (i !== result.length - 1) {
            html = html.concat('<hr>');
        }
    }
    html = html.concat('</dl>');
    return html;

}

function getInformationAndPopulateInformationZone() {
    var request = new XMLHttpRequest();
    request.open('GET', '/info', true);
    request.onload = function () {
        if (request.status = 200) {

            var resp = JSON.parse(request.response);
            if (resp.length > 0) {
                updateView("informationZone", buildInformationHtml(resp));
            }
            else {
                updateView("informationZone", "No information available");
            }
        } else {
            // Server returned an error
            updateView("informationZone", "Internal server error...please check the query response in console.");
        }
    };

    request.onerror = function () {
        // Connection error
        document.getElementById("informationZone").innerHTML = "Connexion error...please check the query in console.";
    };

    request.send();
}

function sendCommandAndPopulateResultZone(commandName) {

    var request = new XMLHttpRequest();
    request.open('GET', '/cmd/' + commandName, true);
    request.onload = function () {
        if (request.status = 200) {
            var resp = JSON.parse(request.response);

            if (resp.status === "success") {
                updateView("commandResult", resp.stdout);
            }
            else {
                updateView("commandResult", "Standard error (stderr): <br/>" + resp.stderr + "<br/>Standard output (stdout):<br/>" + resp.stdout);
            }
            updateResultIndicatorAndStatus(resp.status);

        } else {
            // Server returned an error
            updateView("commandResult", "Internal server error...please check the query response in console.");
            updateResultIndicatorAndStatus("failure");
        }
    };

    request.onerror = function () {
        // Connection error
        updateView("commandResult", "Connexion error...please check the query in console.");
        updateResultIndicatorAndStatus("failure");
    };

    request.send();
}

function updateResultIndicatorAndStatus(status) {
    switch (status) {
        case "success":
            document.getElementById("successIndicator").style.display = "inline";
            document.getElementById("failureIndicator").style.display = "none";
            document.getElementById("clearIcon").style.display = "inline";
            document.getElementById("resultContainer").style.display = "block";
            break;
        case "failure":
            document.getElementById("successIndicator").style.display = "none";
            document.getElementById("failureIndicator").style.display = "inline";
            document.getElementById("clearIcon").style.display = "inline";
            document.getElementById("resultContainer").style.display = "block";
            break;
        default:
            document.getElementById("successIndicator").style.display = "none";
            document.getElementById("failureIndicator").style.display = "none";
            document.getElementById("clearIcon").style.display = "none";
            document.getElementById("commandResult").innerHTML = "";
            document.getElementById("resultContainer").style.display = "none";


    }
}