import { useRef, useEffect } from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ leads }) => {
  const priorities = leads.map((lead) => lead.priority);
  const uniquePriorities = [...new Set(priorities)];

  const priorityCount = uniquePriorities.map((priority) => {
    return priorities.filter((p) => p === priority).length;
  });

  const chartRef = useRef(null);

  const data = {
    labels: uniquePriorities,
    datasets: [
      {
        data: priorityCount,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chartInstance.destroy();
    }
  }, [data]);

  return (
    <div>
      <h2>Priority Distribution</h2>
      <Pie data={data} ref={chartRef} />
    </div>
  );
};

export default PieChart;
