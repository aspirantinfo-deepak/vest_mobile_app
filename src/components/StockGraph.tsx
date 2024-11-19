import dayjs from "dayjs";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface LineChartProps {
  data: [];
  currentPrice: any;
  setcurrentPrice: any;
  previousPrice: any;
}
const StockGraph: React.FC<LineChartProps> = ({
  data,
  setcurrentPrice,
  currentPrice,
  previousPrice,
}) => {
  const chartOptions = {
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOut: (e: any) => {
              e.target.series.chart.xAxis[0].removePlotLine();
              // previousPrice &&
              //   e.target.series.chart.yAxis[0].addPlotLine({
              //     value: previousPrice,
              //     color: "gray",
              //     dashStyle: "Dot",
              //     width: 1,
              //     zIndex: 5,
              //   });
              setcurrentPrice(currentPrice);
            },
          },
        },
      },
    },
    chart: {
      type: "line",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    xAxis: {
      visible: true, // Hides the x-axis
      plotLines: [],
      labels: {
        enabled: false, // This hides only the x-axis labels
      },
    },
    yAxis: {
      plotLines: [
        {
          value: previousPrice,
          color: "gray",
          dashStyle: "Dot",
          width: 1,
          zIndex: 5,
        },
      ],
      visible: true, // Hides the y-axis
      labels: {
        enabled: false, // This hides only the y-axis labels
      },
      title: {
        text: null, // Hides the y-axis title
      },
      gridLineWidth: 0,
    },
    legend: {
      enabled: false, // Hides the legend
    },
    credits: {
      enabled: false, // Hides the Highcharts credit text
    },
    series: [
      {
        data: data,
        color: "#00FF00",
        marker: {
          enabled: false, // Disable the dots
        },
      },
    ],

    tooltip: {
      shared: true,
      backgroundColor: "black",
      style: {
        color: "#ffffff", // Change text color in the tooltip
      },
      positioner: (_: any, __: any, point: any) => {
        var tooltipX = point.plotX - 60;
        var tooltipY = 0;
        return {
          x: tooltipX,
          y: tooltipY,
        };
      },
      formatter: function (this: any): any {
        setcurrentPrice(this.y);
        const xValue = this.x;
        const tValue = this.point.t;
        this.points![0].series.chart.xAxis[0].addPlotLine({
          value: Number(xValue), // Convert xValue to a number
          color: "gray",
          dashStyle: "Dot",
          width: 1,
          zIndex: 5,
        });
        this.points![0].series.chart.yAxis[0].removePlotLine();
        return `${dayjs(tValue).format("MMM DD, YYYY h:mm A")}`;
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default StockGraph;
