// We wrap everything in the shorthand of jQuery's $(document).ready() function
// to make sure all css is loaded and applied before our js kicks in
$(function() {


    // Our design is responsive, so we need to account for it
    // when drawing the svg vector map. Since in our css we define
    // the max-width of the map container, let's get that width and use that as
    // basis for the map's size.
    var width = height = $("#mu_enrollment_counties").width();

    // Let's get the data first
    $.getJSON("mo_topo_county.json", function(data){
        // And only after we get it, can we draw a map with it.
        

        function createMap(container, race, moTopoCounty){
            var div = d3.select(container);
            var svg,
                path;

            svg = div.append("svg")
                .attr("width", width)
                .attr("height", height)
                .on("mouseout", function(){
                    // Clear all containers when user cursor leaves map
                    $("#infobox").find("span").text("");
                });

            path = d3.geoPath();

            path.projection(d3.geoAlbersUsa());

            geo = topojson.feature(moTopoCounty, moTopoCounty.objects.mo_county_slice);

            path.projection().fitSize([width, height], geo);

            svg.append('g')
                .attr('class', 'counties')
                .selectAll('path')
                .data(geo.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "rgba(0,0,0,0.2)")
                .style("stroke", "#fff");

                svg.selectAll("path")
                    .on('mouseover', function(d){

                        $("#county_name").text( d.properties.NAME );

                        if (race == "president"){

                            var county_president_data = clear_data.president[d.properties.COUNTYFP];
                            var president_winner = president_candidates[ getWinnerID(county_president_data) ];

                            $("#pres_candidate_name").text( president_winner.name );
                            $("#pres_party").text( president_winner.party );
                            $("#pres_votes").text( president_winner.votes );
                            $("#pres_precinct").text( county_president_data.reporting_precincts );

                        } else { //that is if race is for the senate

                            var county_senate_data = clear_data.senate[d.properties.COUNTYFP];
                            var senate_winner = senate_candidates[ getWinnerID(county_senate_data) ];

                            $("#sen_candidate_name").text( senate_winner.name );
                            $("#sen_party").text( senate_winner.party );
                            $("#sen_votes").text( senate_winner.votes );
                            $("#sen_precinct").text( county_senate_data.reporting_precincts );

                        }

                    })
                    .transition()
                    .duration(500)
                    .style("fill", function(d){
                        // #bf0000 - red
                        // #003fbf - blue

                        if (race == "president"){


                            if(clear_data.president[d.properties.COUNTYFP]){

                                var president_winner = president_candidates[ getWinnerID(clear_data.president[d.properties.COUNTYFP]) ];
                                var party = president_winner.party;

                                // If winner is Democrat
                                if (party == "Democratic") {
                                    return "#232066";
                                // or a Republican
                                } else if (party == "Republican") {
                                    return "#E91D0E";
                                } else if (party == "Constitution") {
                                    return "#8c00d6";
                                } else if (party == "Libertarian") {
                                    return "#fdd400";
                                } else if (party == "Green") {
                                    return "#0e8c3a";
                                } else {
                                    return "#cfcfd1" //gray
                                }


                            }

                        } else { //that is if race is for the senate

                            if(clear_data.senate[d.properties.COUNTYFP]){

                                var senate_winner = senate_candidates[ getWinnerID(clear_data.senate[d.properties.COUNTYFP]) ];
                                var senate_party = senate_winner.party;

                                // If winner is Democrat
                                if (senate_party == "Democratic") {
                                    return "#232066";
                                // or a Republican
                                } else if (senate_party == "Republican") {
                                    return "#E91D0E";
                                } else if (senate_party == "Constitution") {
                                    return "#8c00d6";
                                } else if (senate_party == "Libertarian") {
                                    return "#fdd400";
                                } else if (senate_party == "Green") {
                                    return "#0e8c3a";
                                } else {
                                    return "#cfcfd1" //gray
                                }


                            }

                        }

                        return "#ff0000";

                    });


        };
        d3.json('data/mo_topo_county.json', function(moTopoCounty){

            createMap("#pres_map", "president", moTopoCounty);
            createMap("#sen_map", "senate", moTopoCounty);

        });
        /**d3.json('data/mo_topo_uscongress', function(moTopoUSHouse){
            createUSHouseMap("#ushouse_map", "ushouse", moTopoUSHouse);
        });**/

    });