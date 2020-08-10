/* GRAPH FUNCTIONS */
/* Initialize compass line graph */
function compassLineGraph() {
  var ctx = document.getElementById('compass-line-graph').getContext('2d');
  return window.myLine = Chart.Line(ctx, {
    data: {
      labels: [],
      datasets: [{
        label: 'X-Axis',
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 0, 0)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1',
      }, {
        label: 'Y-Axis',
        borderColor: 'rgb(0, 255, 0)',
        backgroundColor: 'rgb(0, 255, 0)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1'
      }, {
        label: 'Z-Axis',
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgb(0, 0, 255)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1'
      }]
    },
    options: {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      title: {
        display: false,
        text: 'Compass'
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        }]
      }
    }
  })
}

/* Initialize gyro line graph */
function gyroLineGraph() {
  var ctx = document.getElementById('gyro-line-graph').getContext('2d');
  return window.myLine = Chart.Line(ctx, {
    data: {
      labels: [],
      datasets: [{
        label: 'X-Axis',
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 0, 0)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1',
      }, {
        label: 'Y-Axis',
        borderColor: 'rgb(0, 255, 0)',
        backgroundColor: 'rgb(0, 255, 0)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1'
      }, {
        label: 'Z-Axis',
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgb(0, 0, 255)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1'
      }]
    },
    options: {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      title: {
        display: false,
        text: 'Gyrometer'
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        }]
      }
    }
  })
}

/* Initialize accel line graph */
function accelLineGraph() {
  var ctx = document.getElementById('accel-line-graph').getContext('2d');
  return window.myLine = Chart.Line(ctx, {
    data: {
      labels: [],
      datasets: [{
        label: 'X-Axis',
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 0, 0)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1',
      }, {
        label: 'Y-Axis',
        borderColor: 'rgb(0, 255, 0)',
        backgroundColor: 'rgb(0, 255, 0)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1'
      }, {
        label: 'Z-Axis',
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgb(0, 0, 255)',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1'
      }]
    },
    options: {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      title: {
        display: false,
        text: 'Accelerometer'
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        }]
      }
    }
  })
}

/* Initialize accel live data graph - (X vs Y) axis */
function accelLiveGraph_xy() {
  var ctx = document.getElementById('accel-live-xy').getContext('2d');
  return window.myLine = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels: [],
      datasets: [{
        label: 'Live Data',
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 0, 0)',
        fill: false,
        data: []
      }]
    },
    options: {
      legend: {
        display: false
      },
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      title: {
        display: false,
        text: 'Accelerometer'
      },
      scales: {
        xAxes: [{
          ticks: {
            max: 100,
            min: -100,
            stepSize: 25
          },
          type: 'linear',
          display: true,
          position: 'bottom'
        }],
        yAxes: [{
          ticks: {
            max: 100,
            min: -100,
            stepSize: 25
          },
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left'
        }]
      }
    }
  })
}

/* Initialize accel live data graph - (XY vs Z) axis */
function accelLiveGraph_z() {
  var ctx = document.getElementById('accel-live-z').getContext('2d');
  return window.myLine = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels: [],
      datasets: [{
        label: 'Live Data',
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 0, 0)',
        fill: false,
        data: []
      }]
    },
    options: {
      legend: {
        display: false
      },
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      title: {
        display: false,
        text: 'Accelerometer'
      },
      scales: {
        xAxes: [{
          ticks: {
            max: 100,
            min: -100,
            stepSize: 25
          },
          type: 'linear',
          display: true,
          position: 'bottom'
        }],
        yAxes: [{
          ticks: {
            max: 100,
            min: -100,
            stepSize: 25
          },
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left'
        }]
      }
    }
  })
}

export {
  compassLineGraph,
  gyroLineGraph,
  accelLineGraph,
  accelLiveGraph_xy,
  accelLiveGraph_z
}