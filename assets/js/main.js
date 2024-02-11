let jeans = 0;
let clothesList = [];
let cloth = "";
let page = 1;
let total_elements = 0;
let total = [];
let totalpages = [];
const N = 6;
let titles = [];

function stateChange(j, p) {
	page = p;
	jeans = j;
	cloth = clothesList[j];
}

function addPageNumbers() {
	$("#pagenumberlist").empty();
	for (let i = 1; i <= totalpages[jeans]; i++) {
		$("#pagenumberlist").append('<li class="page-item" id="button-' + i + '"><a class="page-link">' + i + '</a></li>');
	}
}

function addElements() {
	$("#catalog-list").empty();
	let tot = N;
	if (page == totalpages[jeans])
		tot = (total[jeans] - 1) % N + 1;
	for (let i = 1; i <= tot; i++) {
		$("#catalog-list").append(`
      <div class="col-spc my-4">
        <div class="card card-shadow">
          <img src="assets/images/` + cloth + `/` + (i + (page - 1) * N) + `.jpg" class="card-image" id="my`+ i +`">
          <div class="spinner d-flex">
            <div class="spinner-border text-primary justify-content-center align-items-center"></div>
          </div>
          <div class="c-body justify-content-center">
            ` + titles[jeans][i + (page - 1) * N] + `
          </div>
        </div>
      </div>`);
		$("#my" + i).click(function() {
			$("#modal").show();
			$("#modal-img").attr('src', "assets/images/" + cloth + "-full/" + (i + ((page - 1) * N)) + ".jpg");
			$("#caption").html(titles[jeans][i + (page - 1) * N]);
		});
	}
}

function addActive() {
	$("#button-" + page).addClass('active');
}

function removeActive() {
	$("#button-" + page).removeClass('active');
}

function addOnClick(i) {
	$("#button-" + i).click(function() {
		let pi = page;
		removeActive();
		removeOnClick(i);
		stateChange(jeans, i);
		addActive();
		addOnClick(pi);

		addElements();
	});
}

function removeOnClick(i) {
	$("#button-" + i).off('click');
}

function addOnClickAll() {
	let tot = total[jeans];
	for (let i = 1; i <= totalpages[jeans]; i++) {
		if (page != i) {
			addOnClick(i);
		}
	}
}

function addCatalogSection() {
	$("#catalog-header").empty();
	list_elements = "";
	for (let i = 0; i < total_elements; i++) {
		name = clothesList[i];
		arr = name.split(" ");
		arr2 = [];
		for (el of arr) {
			el1 = el;
			if (el1.length >= 1) {
				el1 = el.charAt(0).toUpperCase() + el.slice(1);
			}
			arr2.push(el1);
		}
		name = arr2.join(" ");
		list_elements += `<li class="nav-item m-4" id="` + (i) + `">
	      <a class="nav-link cursor">` + name + `</a>
	    </li>`;
	}
	$("#catalog-header").append(`
	<ul class="navbar-nav ml-auto">
		` + list_elements + `
	</ul>
`);
}

function addActiveMain(){
	$("#" + jeans).addClass("active");
	$("#" + jeans).addClass("head-3");
}

function removeActiveMain() {
	$("#" + jeans).removeClass("active");
	$("#" + jeans).removeClass("head-3");
}

function removeOnClickMain(i) {
	$("#" + i).off('click');
}


function addOnClickMain(i) {
	$("#" + i).click(function() {
		removeActiveMain();
		removeOnClickMain(i);
		stateChange(i, 1);
		addActiveMain();
		for (let index = 0; index < total_elements; index++) {
			if (index != i) {
				addOnClickMain(index);
			}
		}
		addPageNumbers();
		addActive();
		addOnClickAll();

		addElements();
	});
}

$("#modal-close").click(function(){
	$("#modal").hide();
});
$.getJSON("assets/js/data.json", function(data) {
	console.log(data);
	data = data["data"];
	total_elements = data.length;
	for (element of data) {
		clothesList.push(element["head"]);
		titles.push(element["titles"]);
		total.push(element["titles"].length - 1);
		totalpages.push(Math.floor(((element["titles"].length - 1) + N - 1) / N));
	}
	cloth = clothesList[jeans];
	console.log(total);
	console.log(totalpages);
	addCatalogSection();
	addPageNumbers();
	addActive();
	addOnClickAll();

	addElements();

	addActiveMain();
	for (let index = 0; index < total_elements; index++) {
		if (index != jeans) {
			addOnClickMain(index);
		}
	}
});