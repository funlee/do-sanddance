/*
 * @Author: funlee
 * @Email: i@funlee.cn
 * @Date: 2019-10-19 20:40:02
 * @Description: 
 * viewerOptions?: Partial<ViewerOptions>;
    insight: Insight;
    data: object[];
    renderOptions?: RenderOptions; 有默认值
    onView?: (renderResult: RenderResult) => void;
    onMount?: (element: HTMLElement) => boolean | void;
 */
import React from "react";
import * as d3 from "d3-request";
import * as deck from "@deck.gl/core";
import * as layers from "@deck.gl/layers";
import * as luma from "luma.gl";
import * as vega from "vega-lib";
import { SandDance, SandDanceReact } from "@msrvida/sanddance-react";
import './App.css'
SandDance.use(vega, deck, layers, luma);

const chartList = ["barchartH", "barchartV", "density", "grid", "scatterplot", "stacks", "treeMap"];

class SandDanceChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      XAxis: [],
      insight: {
        chart: chartList[0],
        colorBin: 'quantize',
        columns: {
          color: 'Age',
          // sort: 'Survived',
          uid: 'Name',
          x: 'Gender', // X 轴类别
          y: 'Age', // Y 轴类别
          z: 'TicketCost' // Z 轴类别
        },
        directColor: undefined,
        facets: null,
        filter: null,
        hideAxes: false,
        hideLegend: false,
        scheme: 'dual_redgreen',
        signaValues: null,
        size: {
          height: 500,
          width: 500
        },
        view: '2d'
      }
    };
  }

  // 生成 mock 数据
  getMockData() {
    const myData = []
    const size = 100;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const id = x * y;
        const z = Math.random() * size * (x % 10) * (y % 10);
        const w = Math.random() * size;
        myData.push({
          id: id,
          x: x,
          y: y,
          z: z,
          w: w
        });
      }
    }

    return myData
  }

  componentDidMount() {
    d3.csv("output-onlinetsvtools.csv", (error, data) => {
      if (error) throw error;
      const XAxis = Object.keys(data[0])
      this.setState({
        data,
        XAxis
      });
    });
  }

  onMount = e => {
    console.log('onMount', e)
    // const lastChild = e.parentElement.children[1];
    // lastChild.style.minHeight = 500 + 'px';
  };
  // 选择图表类型
  onClickChartList = e => {
    const { insight } = this.state;
    insight.chart = e.target.value;
    this.setState({ insight });
  };
  // 2D 3D 切换
  onClickDimenisonRadioBtn = e => {
    e.target.cheched = true;
    let { insight } = this.state;
    insight.view = e.target.value;
    this.setState({ insight });
  };
  // 修改 X 轴类别
  onClickXAxis = e => {
    const { insight } = this.state;
    insight.columns.x = e.target.value
    this.setState({
      insight
    })
  };

  changeSize = () => {
    const { insight } = this.state;
    const { size: { width, height }} = insight
    insight.size = {
      height: width - 10,
      width: height - 10
    }
    this.setState({
      insight
    })
  }

  render() {
    console.log(this.state)
    const { data, insight, XAxis } = this.state
    return (
      <div className="chart-content" style={{width: 1000,height: 800}}>
        <SandDanceReact
          data={data}
          insight={insight}
          onMount={this.onMount}
        />
        <div className="op-wrap">
          <div className="op-item">
            <div className="op-text">
              <span className="font-weight-bold">图表类型</span>
            </div>
            <div>
              <select
                className="form-control"
                id="sanddance-chart-list"
                onClick={this.onClickChartList}
              >
                {chartList.map((item, index) => (
                  <option key={`chartList-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="op-item">
            <div className="op-text">
              <span className="font-weight-bold">2D/3D</span>
            </div>
            <select
              className="form-control"
              id="sanddance-chart-list"
              onClick={this.onClickDimenisonRadioBtn}
            >
              <option key="option-2d" value="2d">
                2D
              </option>
              <option key="option-3d" value="3d">
                3D
              </option>
            </select>
          </div>
          <div className="op-item">
            <div className="op-text">
              <span className="font-weight-bold">X轴类别</span>
            </div>
            <div>
              <select
                className="form-control"
                id="sanddance-x-list"
                onClick={this.onClickXAxis}
              >
                {XAxis.map((item, index) => (
                  <option key={`x-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="op-item">
            <button className="primary" onClick={this.changeSize}>改变大小</button>
          </div>
        </div>
      </div>
    )
  }
}

export default SandDanceChart;
