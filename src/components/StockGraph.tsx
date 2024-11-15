import dayjs from "dayjs";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface LineChartProps {
  data: [];
  currentPrice: any;
}
const StockGraph: React.FC<LineChartProps> = ({ data, currentPrice }) => {
  const chartOptions = {
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
      visible: false, // Hides the y-axis
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
      // backgroundColor: "#333333", // Change tooltip background color here
      backgroundColor: "transparent", // Change tooltip background color here
      style: {
        color: "#ffffff", // Change text color in the tooltip
      },
      positioner: (labelWidth: any, labelHeight: any, point: any) => {
        console.log(labelWidth, labelHeight);
        var tooltipX = point.plotX - 60;
        var tooltipY = 0;
        return {
          x: tooltipX,
          y: tooltipY,
        };
      },
      formatter: function (
        this: Highcharts.TooltipFormatterContextObject
      ): any {
        const currentPrice1 = this.y; // Access y-value
        currentPrice(currentPrice1);
        const xValue = this.x;

        // Remove the old plot line if it exists
        // if (plotLineId) {
        //   this.points![0].series.chart.xAxis[0].removePlotLine(plotLineId);
        // }
        this.points![0].series.chart.xAxis[0].addPlotLine({
          value: Number(xValue), // Convert xValue to a number
          color: "gray",
          dashStyle: "Dot",
          width: 1,
          zIndex: 5,
        });
        return `${dayjs(xValue).format("MMM DD, YYYY h:mm A")}`;
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default StockGraph;
