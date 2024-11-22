import dayjs from "dayjs";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useState } from "react";

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
  const chartRef = useRef<any>(null);
  useEffect(() => {
    const chart = chartRef.current?.chart;

    const handleTouchStart = (e: any) => {
      console.log("Touch started", e.touches[0]);
    };

    const handleTouchEnd = (e: any) => {
      console.log("Touch ended", e);
      setTimeout(() => {
        chart.xAxis[0].removePlotLine();
        chart.tooltip.hide();
        chart.yAxis[0].addPlotLine({
          value: previousPrice,
          color: "gray",
          dashStyle: "Dot",
          width: 1,
          zIndex: 5,
        });
        chart.series.forEach((series: any) => {
          series.points.forEach((point: any) => {
            point.setState(""); // Reset marker state
          });
        });
        setcurrentPrice(currentPrice);
      })
      setTimeout(() => {
        localStorage.removeItem("unsetTouchNavigator");
      }, 2000);
    };
    const handleTouchMove = (e: any) => {
      console.log("Touch move", e);
      localStorage.setItem("unsetTouchNavigator", "1");
    };

    if (chart) {
      Highcharts.addEvent(chart.container, "touchstart", handleTouchStart);
      Highcharts.addEvent(chart.container, "touchmove", handleTouchMove);
      Highcharts.addEvent(chart.container, "touchend", handleTouchEnd);
    }
  }, [currentPrice]);
  const [options, setoptions] = useState({});
  useEffect(() => {
    if (data.length > 0) {
      setoptions({
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
            lineWidth: 1,
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
      });
    }
  }, [data, currentPrice]);

  return (
    <HighchartsReact highcharts={Highcharts} ref={chartRef} options={options} />
  );
};

export default StockGraph;
