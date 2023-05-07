        
        var dataPoints = [];
        
        
        fetch('https://data.princegeorgescountymd.gov/resource/sk5x-gxv7.json')
        .then(response => response.json())
        .then(data => {
            
            var groupedData = data.reduce((result, currentValue) => {
                (result[currentValue.agency] = result[currentValue.agency] || []).push(currentValue);
                return result;
            }, {});
            
            
            var agencyAmount = [];
            for (var agency in groupedData) {
                var total = 0;
                groupedData[agency].forEach(item => total += parseFloat(item.amount));
                agencyAmount.push({ agency: agency, amount: total });
            }
            
            
            agencyAmount.sort((a, b) => a.amount - b.amount);
            
            
            for (var i = 0; i < agencyAmount.length; i++) {
                dataPoints.push({ label: agencyAmount[i].agency, y: agencyAmount[i].amount });
            }
            
            
            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Agency and Amount"
                },
                axisY: {
                    title: "Amount (USD)"
                },
                data: [{
                    type: "bar",
                    dataPoints: dataPoints
                }]
            });
            chart.render();
        })
        .catch(error => {
            console.log(error);
        });