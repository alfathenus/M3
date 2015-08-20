(function() {
    "use strict";
    /**
    Base class for Charts.
    
    @example
        var configMixed = {
            container:"#axis19",
            width:350,
            height:198,
            margin:{bottom:20, top:5, left:5, right:5},
            axis: [{pos:"left", clazz:"Axis.LinealAxis"},{pos:"bottom", clazz:"Axis.CategoryAxix", serie:"label"}],
            series: [{
                y:"left",
                x:"bottom",
                clazz:"ColumnSerie",
            }]
        };
        var chart = new M3.Chart();
        chart.draw([{label:"Argentina", value:3455645}, {label:"Brasil", value:234234}], configMixed);
    
    @class M3.Chart
    @constructor
    @extends M3.AbstractChart
    @module M3
    
    */
    M3.Chart = M3.Chart || M3CreateClass(M3.AbstractChart, function() { this.axis = null; this.series = null;});
    
    /**
    Create the AxisManger and initilize it.
    It's called form drawInner function
    
    @method addAxis
    @protected
    */
    M3.Chart.prototype.addAxis = function() {
        this.axis = new M3.Axis.AxisManager();
        this.axis.setConfig(this.config).setData(this.data).show();
    };
    
    /**
    @method drawInner
    @protected
    */
    M3.Chart.prototype.drawInner = function() {
        this.addAxis();
        
        this.drawChartArea();
        
        this.drawSeries();
        
        return this;
    };
    
    /**
    Initialize the series items and call to draw function to each.
    It's called from drawInner function.
    
    @method drawSeries
    @protected
    */
    M3.Chart.prototype.drawSeries = function() {
        this.series = [];
        var chart = d3.select(this.config.container + " .chartarea");
        
        var s = null;
        //if(this.config.series === undefined || this.config.series === null) {
        if(!this.config.series) {
            s = [this.configSerie({})];
        } else if (!(this.config.series instanceof Array)){
            s = [this.configSerie(this.config.series)];
        } else {
            s = this.config.series;
        }
        
        var indx = 1;
        for(var i = 0; i < s.length; i++) {
            var ss = this.configSerie(s[i]);
            //if(ss !== undefined && ss !== null && ss.clazz !== undefined && ss.clazz !== null) {
            if(ss && ss.clazz) {
                var vec = ss.clazz.split(".");
                var claz = M3, j = 0;
                while(j < vec.length) { claz = claz[vec[j++]]; }
                //this.series[i] = (new M3[ss.clazz]()).draw(this.data, ss, this.axis, chart, (i+1));
                this.series[i] = new claz();
                indx =  this.series[i].draw(this.data, ss, this.axis, chart, indx);
            }
        }
        
    };
    
    /**
    It's called from drawSeries.
    
    @method configSerie
    @protected
    */
    M3.Chart.prototype.configSerie = function(value) {
        //if(value.itemValue === undefined || value.itemValue === null) {
        if(!value.itemValue) {
            value.itemValue = this.config.itemValue;
        }
        //if(value.itemValue === undefined || value.itemValue === null) {
        if(!value.itemLabel) {
            value.itemLabel = this.config.itemLabel;
        }
        return value;
    };
    
    /**
    Adds de SVG item container for series and the background.
    It's called form drawInner function.
    
    @method drawChartArea
    @protected
    @chainable
    */
    M3.Chart.prototype.drawChartArea = function() {
        var canvas = d3.select(this.config.container + " ." + this.config.styles.canvas);
        
        var offsetX = 0;
        //offsetX += (this.axis.axis.left !== null)?(this.axis.getOffset("left") + 1):0;
        offsetX += (this.axis.axis.left)?(this.axis.getOffset("left") + 1):0;
        
        var offsetY = 0;
        //offsetY += (this.axis.axis.top !== null)?this.axis.getOffset("top"):0;
        offsetY += (this.axis.axis.top)?this.axis.getOffset("top"):0;
        
        var w = this.config.canvasWidth;
        //w -= (this.axis.axis.left !== null)?(this.axis.getOffset("left")+1):0;
        w -= (this.axis.axis.left)?(this.axis.getOffset("left")+1):0;
        //w -= (this.axis.axis.right !== null)?(this.axis.getOffset("right")+1):0;
        w -= (this.axis.axis.right)?(this.axis.getOffset("right")+1):0;
        
        var h = this.config.canvasHeight;
        //h -= (this.axis.axis.top !== null)?this.axis.getOffset("top"):0;
        h -= (this.axis.axis.top)?this.axis.getOffset("top"):0;
        //h -= (this.axis.axis.bottom !== null)?this.axis.getOffset("bottom"):0;
        h -= (this.axis.axis.bottom)?this.axis.getOffset("bottom"):0;
        
        var rect = null;
        try {
            rect = d3.select(this.config.container + " ." + this.config.styles.container + " .chartarea > rect");
            //if(rect === undefined || rect === null) {
            if(!rect === undefined) {
                throw new Error();
            }
            var r = rect[0][0];
            //if(r === undefined || r === null) {
            if(!r) {
                throw new Error();
            }
        } catch(e) {
            rect = canvas.append("g")
                .attr("class", "chartarea")
                .attr("transform", "translate(" + offsetX + ", " + offsetY + ")")
                .append("rect")
                .attr("class", "background");
        }
        
        rect.attr("width", w)
            .attr("height", h)
            
        
        return this;
    };
    
    M3.Chart.prototype.resize = function(width, height) {
        M3.AbstractChart.prototype.resize.call(this, [width, height]);
        //Axis
        this.axis.resize(this.config);
        //chartarea
        this.drawChartArea();
        //series
        var chart = d3.select(this.config.container + " .chartarea");
        var s = null;
        //if(this.config.series === undefined || this.config.series === null) {
        if(!this.config.series) {
            s = [this.configSerie({})];
        } else if (!(this.config.series instanceof Array)){
            s = [this.configSerie(this.config.series)];
        } else {
            s = this.config.series;
        }
        var ind = 1;
        var scope = this;
        this.series.forEach(function(elem, indx) {
            var ss = scope.configSerie(s[indx]);
            ind = elem.draw(scope.data, ss, scope.axis, chart, ind);
        });
    }
})();