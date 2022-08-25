/** @format */

import "d3-transition";

import { max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";


export interface DataItem {
  label: string;
  value: number;
}

// card width - padding left and right
const width = 468;
const height = 400;
const margin = { left: 40, top: 10, right: 10, bottom: 40 };

/**
 * 
 * @param {string} rootElementId Id of the charts parent element 
 * @param {*} data 
 * @returns 
 */
export function Chart(parentElementId: string) {
  let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  let xAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let yAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let content: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let container: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  const initialize = function () {
    // substract the margins before using the height and width
    const contentHeight = height - margin.top - margin.bottom;

    //TODO: 1 uncomment the code below and use select from the d3-selection package to get the parent element
    // where you want place the chart into and append an svg to it
    svg = select(`#${parentElementId}`)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // define a container g element that holds the chart parts
    // and transforms them all at once based on margin values
    container = svg.append("g")
      .attr("class", "container")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // define xAxis g container element,
    // append it to the svg,
    // and put at the bottom of the svg with transform
    xAxis = container.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${contentHeight})`);

    // define yAxis g container element,
    // append it to the svg
    yAxis = container.append("g")
      .attr("class", "yAxis");

    // define a g element that holds the content / bars / lines,
    // append it to the svg
    content = container.append("g")
      .attr("class", "content");
  }

  const update = function (data: DataItem[]) {
    // substract the margins before using the height and width
    const contentHeight = height - margin.top - margin.bottom;
    const contentWidth = width - margin.left - margin.right;

    // isolate the values that we use to calculate and draw the chart
    const dataValues = data.map((d) => d.value);

    // (re)define the x scale band,
    // set the domain (in this case we create a tick for each item in the array),
    // and set the range, from left to right
    const xScale = scaleBand()
      .padding(0.2)
      .domain(data.map((d) => d.label))
      .range([0, contentWidth]);

    // (re)define the y scale linear,
    // set the domain (from 0 to data max),
    // and set the range, from bottom to top
    const yScale = scaleLinear()
      .domain([0, max(dataValues) as number])
      //.nice()
      .range([contentHeight, 0]);

    // select all (non-)existing rect elements
    // and bind our data to the selection
    const selection = content?.selectAll("rect").data(data);

    // update
    // transition existing rect elements in our selection that are already present in the DOM
    // to their correct height and y position
    selection
      ?.transition()
      .duration(300)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => contentHeight - yScale(d.value));

    //exit
    // select any rects in the DOM that don't exits in the data (.length) anymore
    // transition them to 0 height and to the bottom of the chart
    // and remove them from the DOM
    selection
      ?.exit()
      .transition()
      .duration(300)
      .attr("height", 0)
      .attr("y", (_d) => yScale(0))
      .remove();

    // transition our existing elements to the correct width and x 
    // if there is any change in the length of the data
    // but wait until the height and y transition is done AND the bars that should be removed are removed
    selection
      ?.transition()
      .delay(300)
      .attr("width", xScale.bandwidth())
      .attr("x", (d) => xScale(d.label) as number);


    // define any missing rect elements (data.length) with enter and append them to the DOM,
    // set the x, y, height, width and fill
    // and transition them to their correct height and y position
    // The first time this is done, no bars are present in the DOM so they will all be appended
    selection
      ?.enter()
      .append("rect")
      .attr("height", 0)
      .attr("fill", "#294899")
      .attr("y", (_d) => yScale(0))
      .attr("width", xScale.bandwidth())
      .attr("x", (d) => xScale(d.label) as number)
      .transition()
      .delay(300)
      .duration(300)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => contentHeight - yScale(d.value));

    // transition and update the axis with d3 axis function
    xAxis
      ?.transition()
      .duration(300)
      .delay(300)
      .call(axisBottom(xScale));

    yAxis
      ?.transition()
      .duration(300)
      .call(axisLeft(yScale));
  }

  //TODO: # possible solution multiple charts
  const remove = function () {
    svg?.remove();
  }

  return {
    initialize,
    update,
    remove
  };
}
