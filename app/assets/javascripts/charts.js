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
                
                for (var i = 0; i < data["array_actual"].length; i++) {
                    d1.push([data["array_actual"][i].hour, data["array_actual"][i].value]);
                    d2.push([data["array_actual"][i].hour, data["array_predicted"][i]]);
                    error = 100* (data["array_actual"][i].value - data["array_predicted"][i]) / data["array_predicted"][i];
                    d3.push([data["array_actual"][i].hour, error]);
                    
                }
                
                $.plot("#placeholder-matlab", [{
                    data: d1,
                    color: 'lightblue',
                    lines: {
                        show: true,
                        fill: true
                    }
                }, {
                    data: d2,
                    lines: {
                        show: true,
                        fill: true
                    }
                }]);
                
                
                $.plot("#placeholder-error", [{
                    data: d3,
                    color: 'red',
                    lines: {
                        show: true,
                        //fill: true
                    },
					points: { show: true }
                }]);
                
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
