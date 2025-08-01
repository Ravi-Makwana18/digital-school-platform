import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import styled from "styled-components";

const CustomTooltip = styled.div`
  background-color: #ffffff; /* Clean white background */
  border-radius: 8px; /* Softer, more modern rounded corners */
  padding: 15px; /* More generous padding */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08); /* Layered, professional shadow */
  border: 1px solid rgba(0, 0, 0, 0.05); /* Very subtle border */
`;

const TooltipMain = styled.h2`
  margin: 0 0 8px 0; /* Space below the main title */
  font-weight: 600; /* Slightly bolder for prominence */
  font-size: 1.15rem; /* Slightly larger main text */
  color: #333333; /* Dark gray for main text */
`;

const TooltipText = styled.p`
  margin: 4px 0; /* Small margin for line separation */
  font-weight: 400; /* Normal weight for detail text */
  font-size: 0.9rem; /* Slightly smaller for details */
  color: #555555; /* Muted dark gray for detail text */
`;

const CustomTooltipContent = ({ active, payload, dataKey }) => {
    if (active && payload && payload.length) {
        const { subject, attendancePercentage, totalClasses, attendedClasses, marksObtained, subName } = payload[0].payload;

        return (
            <CustomTooltip>
                {dataKey === "attendancePercentage" ? (
                    <>
                        <TooltipMain>{subject}</TooltipMain>
                        <TooltipText>Attended: ({attendedClasses}/{totalClasses})</TooltipText>
                        <TooltipText>{attendancePercentage}%</TooltipText>
                    </>
                ) : (
                    <>
                        <TooltipMain>{subName ? subName.subName : 'N/A'}</TooltipMain> { }
                        <TooltipText>Marks: {marksObtained}</TooltipText>
                    </>
                )}
            </CustomTooltip>
        );
    }

    return null;
};

const CustomBarChart = ({ chartData, dataKey }) => {
    const subjects = chartData.map((data) => data.subject || (data.subName ? data.subName.subName : ''));
    const distinctColors = generateDistinctColors(subjects.length);

    return (
        <BarChart
            width={650}
            height={400}
            data={chartData}
            margin={{
                top: 20, right: 30, left: 20, bottom: 5,
            }}
        >
            <XAxis
                dataKey={dataKey === "marksObtained" ? "subName.subName" : "subject"}
                angle={-45}
                textAnchor="end"
                height={60}
                tickLine={false}
                axisLine={{ stroke: '#cccccc' }}
                tick={{ fill: '#555555', fontSize: '13px' }}
            />
            <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: '#cccccc' }}
                tick={{ fill: '#555555', fontSize: '13px' }}
            />
            <Tooltip content={<CustomTooltipContent dataKey={dataKey} />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} /> {/* Lighter hover highlight */}
            <Bar dataKey={dataKey}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={distinctColors[index]} />
                ))}
            </Bar>
        </BarChart>
    );
};


const generateDistinctColors = (count) => {
    const colors = [];
    const goldenRatioConjugate = 0.618033988749895;

    for (let i = 0; i < count; i++) {
        const hue = (i * goldenRatioConjugate) % 1;
        const color = hslToRgb(hue, 0.7, 0.5);
        colors.push(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    }

    return colors;
};

const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // Achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export default CustomBarChart;