<!-- TrafficSummaryChart.vue -->
<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <h1 class="fs-2 fw-bold">
          <IconChartLine class="me-1" />Earnings Statistics
        </h1>
        <div>
          <span>Refresh</span>
          <IconRefresh />
        </div>
      </div>
      <div id="chart-mentions" class="chart-lg">
        <apexchart
          type="bar"
          height="240"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import { IconRefresh, IconChartLine } from "@tabler/icons-vue";

export default {
  name: "TrafficSummaryChart",
  components: {
    IconRefresh,
    IconChartLine,
  },
  data() {
    return {
      series: [
        {
          name: "Web",
          data: [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 12, 5, 8], // Dữ liệu từ HTML
        },
        // {
        //   name: "Social",
        //   data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 5, 3], // Dữ liệu từ HTML
        // },
        // {
        //   name: "Other",
        //   data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Dữ liệu từ HTML
        // },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 240,
          toolbar: {
            show: false, // Ẩn toolbar
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "flat",
          },
        },
        dataLabels: {
          enabled: false, // Ẩn nhãn dữ liệu trên cột
        },
        stroke: {
          show: true,
          width: 0,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "29 Jun",
            "Jul '20",
            "03 Jul",
            "05 Jul",
            "07 Jul",
            "09 Jul",
            "11 Jul",
            "13 Jul",
            "15 Jul",
            "17 Jul",
          ],
          labels: {
            style: {
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          min: 0,
          max: 100,
          tickAmount: 5,
          labels: {
            style: {
              fontSize: "11px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        fill: {
          opacity: 1,
          colors: [
            "rgba(6,111,209,1)",
            "rgba(6,111,209,0.8)",
            "rgba(47,179,68,0.8)",
          ],
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            },
          },
        },
        grid: {
          borderColor: "#e0e0e0",
          strokeDashArray: 4,
        },
      },
    };
  },
};
</script>

<style scoped>
.chart-lg {
  min-height: 240px;
}
</style>
