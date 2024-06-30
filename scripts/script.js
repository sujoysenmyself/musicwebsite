function filterContent() {
    var input, filter, container, h1, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    container = document.querySelector('.container');
    h1 = container.getElementsByTagName('h1');

    for (i = 0; i < h1.length; i++) {
        a = h1[i].getElementsByTagName('a')[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            h1[i].style.display = "";
        } else {
            h1[i].style.display = "none";
        }
    }
}

function clearSearch() {
    var input, container, h1, i;
    input = document.getElementById('searchInput');
    input.value = ''; // Clear the input field
    container = document.querySelector('.container');
    h1 = container.getElementsByTagName('h1');

    // Show all h1 elements
    for (i = 0; i < h1.length; i++) {
        h1[i].style.display = ""; // Reset display to default
    }
}