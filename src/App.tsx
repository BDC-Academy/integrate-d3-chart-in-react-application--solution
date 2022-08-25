/** @format */

import "./App.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import React, { useLayoutEffect, useRef, useState } from "react";

import { Chart, DataItem } from "./D3Chart";
import IconButton from "@mui/material/IconButton";
import MuiChangeCircle from "@mui/icons-material/ChangeCircle";
import Divider from "@mui/material/Divider";

let i = 0;
const datasets = [
  [{ label: "A", value: 10 }, { label: "B", value: 30 }, { label: "C", value: 40 }, { label: "D", value: 20 }],
  [{ label: "A", value: 10 }, { label: "B", value: 40 }, { label: "C", value: 30 }, { label: "D", value: 20 }, { label: "E", value: 50 }, { label: "F", value: 10 }],
  [{ label: "A", value: 60 }, { label: "B", value: 30 }, { label: "C", value: 40 }, { label: "D", value: 20 }, { label: "E", value: 30 }]
];

function App() {
   // TODO: 2 Add code to display the D3Chart in the card content by calling the Chart, initialize and update functions.
  // Also, try to update the chart everytime you click the button by calling the update function and supplying a different dataset.
  // Hint: We are manipulating the DOM outside of the 'normal' react component render flow with d3, in other words an effect on the side...

  const [dataset, setDataset] = useState(datasets[i]);
  const chartRef = useRef<{ update: (data: DataItem[]) => void } | null>(null);

  useLayoutEffect(() => {
    const { initialize, update, remove } = Chart("chart-goes-here");

    initialize();
    chartRef.current = { update };

    //TODO: # possible solution multiple charts
    return () => {
      remove();
    };
  }, []);

  useLayoutEffect(() => {
    chartRef.current?.update(dataset);
  }, [dataset]);

  const changeDatasets = () => {
    i++;
    if (i === datasets.length) i = 0;
    setDataset(datasets[i]);
  };

  return (
    <div className="App">
      <Card sx={{ width: 500, margin: "40px auto" }}>
        <CardHeader title="Mijn eerste D3 grafiek in React" />
        <Divider />
        <CardContent id="chart-goes-here"></CardContent>
        <Divider />
        <CardActions>
          <IconButton onClick={changeDatasets} aria-label="change data">
            <MuiChangeCircle />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}

export default App;
