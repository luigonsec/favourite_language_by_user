$(document).ready(function(){

  $('#show').on('click',function(){

    var user = $('#github-user').val();

    var request = $.ajax({
      url : '/languages/'+user,
      type : 'GET'
    });

    request.fail(function(err){

      if(err.status == 404){
        alert("The username doesn't exists")
      }
      if(err.status == 400){
        alert("You have reached the API limit. Log in with Github to continue")
      }

    })

    request.done(function(datos){

      var valores = [];
      var labels = [];

      // Remove canvas if exists and create it again to avoid overwrite.
      $('#canvas').remove();
      var canvas = document.createElement('canvas');
      canvas.setAttribute('id','canvas');
      $('#canvas-wrapper').html(canvas);


      var ctx = document.getElementById('canvas').getContext('2d');

      for(key in datos){
        labels.push(key);
        valores.push(datos[key])
      }
      var options = {
          title: {
              display: true,
              text: 'Favourite language barchart'
          }
      }


      var data = {
          labels: labels,
          datasets: [
              {
                  label: "Codelines",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(238, 232, 170,1)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: valores,
              }
          ]
      };

      var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
      });
    })

  });

  $('#login').on('click',function(){
    window.location.href = '/authenticate';
  });
})
