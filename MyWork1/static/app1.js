
// API KEY:
const AP_KEY = "pk.eyJ1Ijoib2xlbmlhY3oiLCJhIjoiY2toN3gwaWI2MDh4MTJ4bXo5MXl3eDcxayJ9.fWd2YaP4XafdL8e006Wowg";

var earthquakeLayerGroup = L.layerGroup();


// Initialize Leaflet map
var map = L.map('map').setView([39.9334, 32.8597], 6);

//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

//create map layers
//define tileLayer for later...
var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 10,
    minZoom: 2,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: AP_KEY
})
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  minZoom: 2,
  id: "light-v10",
  accessToken: AP_KEY
});
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  minZoom: 2,
  id: "dark-v10",
  accessToken: AP_KEY
});
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  minZoom: 2,
  id: "satellite-v9",
  accessToken: AP_KEY
});


// MAP STYLE SLICER:

// Define an object to map slicer values to tile layers
var tileLayers = {
    'Street': tileLayer,
    'Light': light,
    'Dark': dark,
    'Satellite': satellite
};
// Function to change the map style based on the selected slicer value
function changeMapStyle(style) {
    // Remove all existing tile layers from the map
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    // Add the selected tile layer to the map
    tileLayers[style].addTo(map);
}

var globalselectedstyle;
// Event listener for the slicer (assuming the slicer has a 'change' event)
document.getElementById('map-style').addEventListener('change', function() {
    var selectedStyle = this.value;
    globalselectedstyle = selectedStyle;
    changeMapStyle(selectedStyle);
});

// Initialize the map with a default tile layer



// GETTING DATA FROM API AND  BUTTONS FUNCTIONS:

var usgsApiEndpoint = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
// Function to fetch and display earthquake data from the last hou


// Function to fetch and display earthquake data for the most recent earthquakes
function fetchMostRecentEarthquakes() {
    
    var color="#FF8B13"

    // Define parameters for the API request
    var params = {
        format: 'geojson',
        limit: 20, // Limit to the most recent 50 earthquakes (you can adjust this)
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakes(data,color);
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}



function fetchLastHourEarthquakes() {

    var color="#FF0032"

    // Define parameters for the API request
    var params = {
        format: 'geojson',
        starttime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last hour
        endtime: new Date().toISOString(),
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakes(data,color);
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}

// Function to fetch and display earthquake data from the last day

var lastdaylayer;
function fetchLastDayEarthquakes() {
    // Define the USGS API endpoint for earthquake data
    
    var color="#F0DE36"

    var params = {
        format: 'geojson',
        starttime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last day
        endtime: new Date().toISOString(),
    };

    if (lastdaylayer) {
        // If displayed, remove the fault lines layer from the map
        map.removeLayer(lastdaylayer);
        lastdaylayer = null; // Set it to null to indicate it's not displayed
    } else {

    // Make a request to the USGS API
        fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
            // Process the earthquake data and display it on the map
                displayEarthquakes(data,color);
            })
            .catch(function (error) {
                console.error('Error fetching earthquake data:', error);
        });
    }
}

// Function to fetch and display earthquake data from the last week

function fetchLastWeekEarthquakes() {
    var color="#16FF00"

    var params = {
        format: 'geojson',
        starttime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last week
        endtime: new Date().toISOString(),
        minmagnitude:2,
        limit:1500,
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakes(data,color);
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}

// Function to fetch and display earthquake data from the last month

function fetchLastMonthEarthquakes() {
    var color="#068FFF"

    var params = {
        format: 'geojson',
        starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last month
        endtime: new Date().toISOString(),
        limit: 3000,
        minmagnitude:2,
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakes(data,color);
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}

function fetchLastYearEarthquakes() {
    var color="#CECE5A"

    var params = {
        format: 'geojson',
        starttime: new Date(Date.now() - 20 *365 * 24 * 60 * 60 * 1000).toISOString(), // Last month
        endtime: new Date().toISOString(),
        limit: 5000,
        minmagnitude:6,
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakes(data,color);
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}


// BUFFER ZONE OF 10 KM OF SELECTED EARTHQUAKE BUTTONS FUNCTIONS:
// function to fetch and display buffer zone of 10 km of selected earthquake buttons functions :

// Function to fetch and display earthquake data for the last 50 earthquakes
function fetchBufferEarthquakes() {
    var color="white"
    // Define parameters for the API request
    var params = {
        format: 'geojson',
        limit: 250, // Limit to the last 250 earthquakes
        minmagnitude: 3, // Minimum magnitude
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakesBuff(data,color);
            
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}

// Function to create a buffer zone around the earthquake data
function createBufferZone(earthquakeData, bufferRadius) {
    // Create a Turf.js feature collection from the earthquake data
    var featureCollection = turf.featureCollection(earthquakeData.features);

    // Create a buffer zone around the features
    var bufferedFeatures = turf.buffer(featureCollection, bufferRadius, { units: 'kilometers' });

    // Create a GeoJSON layer for the buffer zone and add it to the map
    L.geoJSON(bufferedFeatures, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "<h1>Location: </h1>"+feature.properties.place 
                +"<br><h1>Magnitude: </h1>"+ feature.properties.mag
                + "<br><h1>Time: </h1>"+new Date(feature.properties.time)
            );
        }, 
        style: function (feature) {
            var magnitude = feature.properties.mag;
            var depth_e = feature.geometry.coordinates[2];
            return {
                radius: getRadius1(magnitude), // Adjust the marker size based on magnitude
                color: 'brown',
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.5,
            };
        },
        onEachFeature: function (feature, layer) {
            // Add pop-up information for each earthquake
            var properties = feature.properties;
            layer.bindPopup(
                'Magnitude: ' + properties.mag + '<br>' +
                'Location: ' + properties.place + '<br>' +
                'Time: ' + new Date(properties.time).toLocaleString( 
                'en-US', { timeZoneName: 'short' } ) + '<br>' 
            );
            layer.on('mouseover', function (feature) {
                this.openPopup();
            });
            layer.on('mouseout', function (feature) {
                this.closePopup();
            });
        },
    }).addTo(map);
}


//this function determines the radius of the marker based on the magnitude.
function getRadius1(magnitude) {
    // accomodate magnitudes of "0" to prevent erroneous markers.
    if (magnitude === 0) {
        return NaN;
    }
    return magnitude * 1;
}

// Function to display earthquake data on the map
function displayEarthquakesBuff(earthquakeData,color) {

    earthquakeLayerGroup.clearLayers();
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "<h1>Location: </h1>"+feature.properties.place 
                +"<br><h1>Magnitude: </h1>"+ feature.properties.mag
                + "<br><h1>Time: </h1>"+new Date(feature.properties.time)
            );
        }, 
        pointToLayer: function (feature, latlng) {
            
            // Customize marker style based on earthquake properties
            var magnitude = feature.properties.mag;
            var depth_e = feature.geometry.coordinates[2];
            var markerOptions = {
                radius: getRadius1(magnitude), // Adjust the marker size based on magnitude
                fillColor: color, // Color marker based on depth
                //scolor: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 1,
                
            };
            return L.circleMarker(latlng, markerOptions);
        },

        onEachFeature: function (feature, layer) {
            // Add pop-up information for each earthquake
            var properties = feature.properties;
            layer.bindPopup(
                'Magnitude: ' + properties.mag + '<br>' +
                'Location: ' + properties.place + '<br>' +
                'Time: ' + new Date(properties.time).toLocaleString( 
                'en-US', { timeZoneName: 'short' } ) + '<br>' 
            );
            layer.on('mouseover', function (feature) {
                this.openPopup();
            });
            layer.on('mouseout', function (feature) {
                this.closePopup();
            });
        },
    }).addTo(map);
    createBufferZone(earthquakeData, 10)
        
    // Fit the map to the bounds of the earthquake data
    map.fitBounds(L.geoJSON(earthquakeData).getBounds());
}

// Event listener for the button to fetch the last 50 earthquakes and create a buffer zone
document.getElementById('buffer-zone').addEventListener('click', function () {
    // Clear any existing earthquake markers and buffer zones
    // Fetch and display the last 50 earthquakes
    fetchBufferEarthquakes();
    changeMapStyle(globalselectedstyle);
});



// MAGNITUDE SLICER:

// Function to change the magnitude filter based on the selected slicer value
function changeMagnitudeFilter(magnitude) {

    // Update the current magnitude filter
    currentMagnitudeFilter = magnitude;

    // Fetch and display earthquakes based on the selected magnitude
    fetchAndDisplayEarthquakesMag(currentMagnitudeFilter);
}   

function fetchAndDisplayEarthquakesMag(magnitude) {
    var color="violet"
    // Define parameters for the API request
    var params = {
        format: 'geojson',
        limit: 1000, // Limit to the last 1000 earthquakes
        minmagnitude: magnitude, // Minimum magnitude
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakes(data,color);
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}

// Event listener for the magnitude dropdown menu

document.getElementById('magnitude-slicer').addEventListener('change', function () {
    // Get the selected magnitude value from the dropdown
    var selectedMagnitude = parseFloat(this.value);

    // Update the current magnitude filter
    currentMagnitudeFilter = selectedMagnitude;

    changeMagnitudeFilter(selectedMagnitude);
    
    // Fetch and display earthquakes based on the selected magnitude
    fetchAndDisplayEarthquakesMag(selectedMagnitude);
    changeMapStyle(globalselectedstyle);
});


// DEPTH SLICER:
// Function to change the DEPTH filter based on the selected slicer value

function changeDepthFilter(depth) {
    // Update the current depth filter
    currentDepthFilter = depth;

    // Fetch and display earthquakes based on the selected depth
    fetchAndDisplayEarthquakesDepth(currentDepthFilter);
}

// Function to fetch and display earthquake data for the last 50 earthquakes
function fetchAndDisplayEarthquakesDepth(depth) {
    var color="cyan"

    // Define parameters for the API request
    var params = {
        format: 'geojson',
        limit: 1000, // Limit to the last 1000 earthquakes
        mindepth: depth, // Minimum depth
        minmagnitude:4,
    };

    // Make a request to the USGS API
    fetch(usgsApiEndpoint + '?' + new URLSearchParams(params))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Process the earthquake data and display it on the map
            displayEarthquakes(data,color);
        })
        .catch(function (error) {
            console.error('Error fetching earthquake data:', error);
        });
}

// Event listener for the depth dropdown menu
document.getElementById('depth-slicer').addEventListener('change', function () {
    // Get the selected depth value from the dropdown
    var selectedDepth = parseFloat(this.value);

    // Update the current depth filter
    currentDepthFilter = selectedDepth;

    changeDepthFilter(selectedDepth);

    // Fetch and display earthquakes based on the selected depth
    fetchAndDisplayEarthquakesDepth(selectedDepth);
    changeMapStyle(globalselectedstyle);
});


// DISPLAYING DATA ON THE MAP:

//this function determines the radius of the marker based on the magnitude.
function getRadius(magnitude) {
    // accomodate magnitudes of "0" to prevent erroneous markers.
    if (magnitude === 0) {
        return NaN;
    }
    return magnitude * 1.5;
}

// Function to display earthquake data on the map
function displayEarthquakes(earthquakeData,color) {

    earthquakeLayerGroup.clearLayers();
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "<h1>Location: </h1>"+feature.properties.place 
                +"<br><h1>Magnitude: </h1>"+ feature.properties.mag
                + "<br><h1>Time: </h1>"+new Date(feature.properties.time)
                + "<br><h1>Depth: </h1>"+feature.geometry.coordinates[2] + " km"
                + "<br><h1>Country: </h1>"+feature.properties.place.split(", ").pop()
            );
        }, 
        pointToLayer: function (feature, latlng) {
            
            // Customize marker style based on earthquake properties
            var magnitude = feature.properties.mag;
            var depth_e = feature.geometry.coordinates[2];
            var markerOptions = {
                radius: getRadius(magnitude), // Adjust the marker size based on magnitude
                fillColor: color, // Color marker based on depth
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
                depth: depth_e, // Save the depth as a custom property
                
            };
            return L.circleMarker(latlng, markerOptions);
        },

        onEachFeature: function (feature, layer) {
            // Add pop-up information for each earthquake
            var properties = feature.properties;
            layer.bindPopup(
                'Magnitude: ' + properties.mag + '<br>' +
                'Location: ' + properties.place + '<br>' +
                'Time: ' + new Date(properties.time).toLocaleString( 
                'en-US', { timeZoneName: 'short' } ) + '<br>' +
                'Depth: ' + feature.geometry.coordinates[2] + ' km' + '<br>'  
            );
            layer.on('mouseover', function (feature) {
                this.openPopup();
            });
            layer.on('mouseout', function (feature) {
                this.closePopup();
            });
        },
    }).addTo(map);
        
    // Fit the map to the bounds of the earthquake data
    map.fitBounds(L.geoJSON(earthquakeData).getBounds());
}


//Define a variable to keep track of the fault lines layer
var faultLinesLayer;

// Function to fetch and display fault line data
function fetchFaultLines() {
    // Define the URL for the fault line data
    var faultLineURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

    // Check if the fault lines layer is currently displayed
    if (faultLinesLayer) {
        // If displayed, remove the fault lines layer from the map
        map.removeLayer(faultLinesLayer);
        faultLinesLayer = null; // Set it to null to indicate it's not displayed
    } else {
        // If not displayed, make a request to fetch the fault line data
        fetch(faultLineURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Create a GeoJSON layer for fault lines and add it to the map
                faultLinesLayer = L.geoJSON(data, {
                    style: function (feature) {
                        return {
                            color: 'red', // Customize the line color
                            weight: 2, // Customize the line weight
                        };
                    },
                }).addTo(map);
            })
            .catch(function (error) {
                console.error('Error fetching fault line data:', error);
            });
    }
}



// EVENT LISTENERS FOR BUTTONS:

// Event listener for the button to fetch last hour earthquakes
document.getElementById('last-hour-button').addEventListener('click', function () {
    // Clear the map before fetching new data
    map.eachLayer(function (layer) {
        if (layer !== tileLayer) {
            map.removeLayer(layer);
        }
    });
    changeMapStyle(globalselectedstyle);

    // Fetch and display earthquake data from the last hour
    fetchLastHourEarthquakes();
});

// Event listener for the button to fetch last day earthquakes

document.getElementById('last-day-button').addEventListener('click', function () {
    // Clear the map before fetching new data
    map.eachLayer(function (layer) {
        if (layer !== tileLayer) {
            map.removeLayer(layer);
        }
    });
    changeMapStyle(globalselectedstyle);

    // Fetch and display earthquake data from the last day
    fetchLastDayEarthquakes();
});

// Event listener for the button to fetch last week earthquakes

document.getElementById('last-week-button').addEventListener('click', function () {
    // Clear the map before fetching new data

    map.eachLayer(function (layer) {
        if (layer !== tileLayer) {
            map.removeLayer(layer);
        }
    });
    changeMapStyle(globalselectedstyle);


    // Fetch and display earthquake data from the last week
    fetchLastWeekEarthquakes();
});

// Event listener for the button to fetch last month earthquakes

document.getElementById('last-month-button').addEventListener('click', function () {
    // Clear the map before fetching new data
    map.eachLayer(function (layer) {
        if (layer !== tileLayer) {
            map.removeLayer(layer);
        }
    });
    changeMapStyle(globalselectedstyle);

    // Fetch and display earthquake data from the last month
    fetchLastMonthEarthquakes();
});

document.getElementById('last-year-button').addEventListener('click', function () {
    // Clear the map before fetching new data
    map.eachLayer(function (layer) {
        if (layer !== tileLayer) {
            map.removeLayer(layer);
        }
    });
    changeMapStyle(globalselectedstyle);

    // Fetch and display earthquake data from the last month
    fetchLastYearEarthquakes();
});

// Event listener for the button to fetch fault lines 

// Event listener for the button to fetch fault lines
document.getElementById('Fault-line').addEventListener('click', function () {
    // Fetch and display fault line data
    fetchFaultLines();
});



// Event listener for the button to fetch most recent earthquakes
document.getElementById('last-earthquake-button').addEventListener('click', function () {
    // Clear the earthquake layer group before fetching new data
    map.eachLayer(function (layer) {
        if (layer !== tileLayer) {
            map.removeLayer(layer);
        }
    });
    // adding popup for showing detail about button:
    
    // Fetch and display most recent earthquake data
    fetchMostRecentEarthquakes();
    changeMapStyle(globalselectedstyle);
});

// Event listener for the depth dropdown menu
document.getElementById('depth-slicer').addEventListener('change', function () {
    // Get the selected depth value from the dropdown
    var selectedDepth = parseFloat(this.value);

    // Update the current depth filter
    currentDepthFilter = selectedDepth;

    // Fetch and display earthquakes based on the selected depth
    fetchAndDisplayEarthquakes(selectedDepth);
    changeMapStyle(globalselectedstyle);
});







