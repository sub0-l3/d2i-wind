/**
 * @author SubZero
 */
$(function(){
    $("#submit_day").click(function(){
    
    
    
        url = "/call_matlab";
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            data: {
                day: $('#predict-day').val()
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                var d1 = [];
                var d2 = [];
                var d3 = [];
                var error;
                var sum_square = 0, rmse;
                var length_load_forcast = 24, max_load_forcast = 0;
                
                for (var i = 0; i < data["array_actual"].length; i++) {
                    d1.push([data["array_actual"][i].hour, data["array_actual"][i].value]);
                    d2.push([data["array_actual"][i].hour, data["array_predicted"][i]]);
                    error = 100 * (data["array_actual"][i].value - data["array_predicted"][i]) / data["array_predicted"][i];
                    d3.push([data["array_actual"][i].hour, error]);
                    sum_square = sum_square + Math.pow((data["array_predicted"][i] - data["array_actual"][i].value), 2);
                    
                    if (data["array_predicted"][i] > max_load_forcast) 
                        max_load_forcast = data["array_predicted"][i];
                }
                console.log("Sum_square:");
                console.log(sum_square);
                console.log("max load forcast:");
                console.log(max_load_forcast);
                rmse = Math.pow((sum_square / length_load_forcast), 0.5) / max_load_forcast;
                
                //(((sum((load_forcast - load_actual).^2))/length(load_forcast))^0.5)/max(load_forcast)
                
                
                $('#rmse_value').html((rmse * 100).toFixed(4) + " %");
                
                $.plot("#placeholder-matlab", [{
                    data: d1,
                    label: "Load actual",
                    color: 'lightblue',
                    lines: {
                        show: true,
                        fill: true
                    }
                }, {
                    data: d2,
                    label: "Load forecast",
                    lines: {
                        show: true,
                        fill: true
                    }
                }]);
                // https://github.com/markrcote/flot-axislabels
                var options = {
                    axisLabels: {
                        show: true
                    },
                    xaxes: [{
                        axisLabel: 'foo',
                    }],
                    yaxes: [{
                        position: 'left',
                        axisLabel: 'bar',
                    }, {
                        position: 'right',
                        axisLabel: 'bleem'
                    }]
                };
                
                
                $.plot("#placeholder-error", [{
                    data: d3,
                    color: 'red',
                    lines: {
                        show: true,
                        //fill: true
                    },
                    points: {
                        show: true
                    }
                }], options);
                
            }
        });
        
        
        
    });
});
function plot_chart(){


    url = "/get_load_data";
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        data: {},
        dataType: "json",
        success: function(data){
        
            var d1 = [];
            for (var i = 0; i < data["load_data"].length; i++) {
                d1.push([data["load_data"][i].hour, data["load_data"][i].value]);
            }
            
            $.plot("#placeholder-forecast", [{
                data: d1,
                color: 'lightblue',
                lines: {
                    show: true,
                    fill: true
                }
            }]);
        }
    });
    
}
