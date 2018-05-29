south_panel = function(id) {
	var area = $("#south_panel");
	if(area.length) {
		area.html('South area');
		return 0;
	}
	return 1;
}

east_panel = function(id) {
	var area = $("#east_panel");
	if(area.length) {
		area.html('East area');
		return 0;
	}
	return 1;
}

west_panel = function(id) {
	var area = $("#west_panel");
	if(area.length) {
		area.html('West area');
		return 0;
	}
	return 1;
}

center_panel = function(id) {
	var area = $("#center_panel");
	if(area.length) {
		area.html('Center area');
		return 0;
	}
	return 1;
}