import dayjs from "dayjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef } from "react";

interface LineChartProps {
  data: [];
  setcurrentPrice: any;
  currentPrice: any;
  previousPrice: any;
}
const PortFolioGraph: React.FC<LineChartProps> = ({
  data,
  setcurrentPrice,
  currentPrice,
  previousPrice,
}) => {
  const chartRef = useRef<any>(null);
  useEffect(() => {
    const chart = chartRef.current?.chart;

    const handleTouchStart = (e: any) => {
      console.log("Touch started", e.touches[0]);
    };

    const handleTouchEnd = (e: any) => {
      console.log("Touch ended", e);
      chart.xAxis[0].removePlotLine();
      chart.tooltip.hide();
    };

    if (chart) {
      Highcharts.addEvent(chart.container, "touchstart", handleTouchStart);
      Highcharts.addEvent(chart.container, "touchend", handleTouchEnd);
    }
  }, []);
  const chartOptions = {
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOut: (e: any) => {
              e.target.series.chart.xAxis[0].removePlotLine();

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
      visible: true,
      plotLines: [],
      labels: {
        enabled: false,
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

      visible: true,
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      gridLineWidth: 0,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        data: data,
        color: "#00FF00",
        marker: {
          enabled: false,
        },
      },
    ],
    tooltip: {
      shared: true,
      backgroundColor: "black",
      style: {
        color: "#ffffff",
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
          value: Number(xValue),
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

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
      ref={chartRef}
    />
  );
};

export default PortFolioGraph;
