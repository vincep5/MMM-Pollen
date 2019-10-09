'use strict';


Module.register("MMM-Pollen", {

    result: [],
    // Default module config.
    defaults: {
        updateInterval: 3 * 60 * 60 * 1000, // every 3 hours
        zip_code: 90210,
        fadeSpeed: 2000,
    },

    start: function() {
        this.loaded = false;
        this.getData();
        this.scheduleUpdate();
    },

    getStyles: function() {
        return ["MMM-Pollen.css"];
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("pollen");

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        wrapper.className = 'small bright';

        //header row
        var tbl = document.createElement("table");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        //td1.innerHTML = "When";
        var icon1 = document.createElement("span");
        icon1.className = "fa fa-clock-o";
        var td2 = document.createElement("td");
        //td2.innerHTML = "Level";
        td2.className = "pollen-padding";
        var icon2 = document.createElement("span");
        icon2.className = "fa fa-line-chart";
        var td3 = document.createElement("td");
        //td3.innerHTML = "Top Allergens";
        td3.className = "align-left";
        var icon3 = document.createElement("span");
        icon3.className = " fa fa-pagelines";

        td1.appendChild(icon1);
        td2.appendChild(icon2);
        td3.appendChild(icon3);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbl.appendChild(tr);

        if (this.result && this.result.Location) {
            this.result.Location.periods.forEach(function(p) {
                var indexCt = p.Index;
                var indexDay = p.Type;
                var allergens = [];

                p.Triggers.forEach(function(t) {
                    allergens.push(t.Name);
                });

                var td1 = document.createElement("td");
                td1.innerHTML = indexDay;
                var td2 = document.createElement("td");
                td2.innerHTML = indexCt;
                var td3 = document.createElement("td");
                td3.innerHTML = allergens.join(", ");

                //determine color
                // Low (0–2.4) 
                // Low-Medium (2.5–4.8) 
                // Medium (4.9–7.2) 
                // Medium-High (7.3–9.6) 
                // High (9.7–12) 
                if(indexCt >= 9.7) {
                	td2.className = "pollen-high";
                } else if(indexCt >= 7.3) {
                	td2.className = "pollen-mediumhigh";
                } else if(indexCt >= 4.9) {
                	td2.className = "pollen-medium";
                } else if(indexCt >= 2.5) {
                	td2.className = "pollen-lowmedium";
                } else if(indexCt >= 0) {
                	td2.className = "pollen-low";
                }

                var tr = document.createElement("tr");
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                
                tbl.appendChild(tr);
            });
        }

        wrapper.appendChild(tbl);
        return wrapper;
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setInterval(function() {
            self.getData();
        }, nextLoad);
    },

    getData: function () {
        var url = "https://www.pollen.com/api/forecast/current/pollen/" + this.config.zip_code
        this.sendSocketNotification(url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "POLLEN_RESULT") {
            this.result = payload;
            this.loaded = true;
            this.updateDom(this.config.fadeSpeed);
        }
    },

});