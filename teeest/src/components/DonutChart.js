import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const DonutChart = ({ dataValues, labels }) => {
  const data = [
    { name: labels[0], value: dataValues[0] },
    { name: labels[1], value: dataValues[1] },
    { name: labels[2], value: dataValues[2] },
  ];

  const COLORS = ["#6FD20C", "#F8E42E", "#D9E1E3"];

  return (
    <PieChart width={168} height={224}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={33}
        outerRadius={64}
        startAngle={450}
        endAngle={90}
        fill="#8884d8"
        paddingAngle={0}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        layout="horizontal"
        align="center"
        verticalAlign="bottom"
        iconType="circle"
        formatter={(value, entry, index) => (
          <span
            style={{
              color: "#004B52",
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
              textAlign: "left",
              textUnderlinePosition: "from-font",
              textDecorationSkipInk: "none",
            }}
          >
            {value}:{" "}
            <span style={{ fontWeight: "700" }}> {dataValues[index]} </span>
          </span>
        )}
      />
    </PieChart>
  );
};

export default DonutChart;
