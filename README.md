# MMM-Pollen
get the pollen.com forecast for your zipcode

## Preview
![screenshot1](screenshot1.JPG)

## Using the module
run git clone https://github.com/vincep5/MMM-Pollen from inside your MagicMirror/modules folder

Add `MMM-Pollen` module to the `modules` array in the `config/config.js` file:
````javascript
modules: [
  {
    module: "MMM-Pollen",
    position: "top_left",
    header: "Pollen Forecast",
    config: {
        updateInterval: 3 * 60 * 60 * 1000, // every 3 hours
        zip_code: "90210"
    }
  },
]
