import React from 'react';
import {View} from 'react-native';
import {Svg, Rect, G, Text} from 'react-native-svg';
import AbstractChart from './abstract-chart';

const barWidth = 32;

class StackedBarChart extends AbstractChart {
  renderBars = config => {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      border,
      colors,
    } = config;
    return data.map((x, i) => {
      const barWidth = 32;
      const ret = [];
      let h = 0;
      let st = paddingTop;
      for (let z = 0; z < x.length; z++) {
        h = (height - 55) * (x[z] / border);
        const y = (height / 4) * 3 - h + st;
        const xC =
          (paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2) *
          0.9;
        if (!h) {
          continue;
        }
        console.log('w=' + barWidth + ' h=' + h);
        ret.push(
          <Rect
            key={Math.random()}
            x={xC}
            y={y}
            width={barWidth}
            height={h}
            fill={colors[z]}
          />,
        );
        ret.push(
          <Text
            key={Math.random()}
            x={xC + 0 + barWidth / 2}
            textAnchor="middle"
            y={h > 15 ? y + 15 : y + 7}
            fontSize={12}
            fill="#f2f2f2">
            {x[z]}
          </Text>,
        );

        st -= h;
      }

      return ret;
    });
  };

  renderLegend = config => {
    const {legend, colors, width, height} = config;
    return legend.map((x, i) => {
      return (
        <G key={Math.random()}>
          <Rect
            width="8px"
            height="8px"
            fill={colors[i]}
            rx={8}
            ry={8}
            x={0}
            y={height * 0.25 - i * 20}
          />
          <Text fill="#000" fontSize={12} x={18} y={height * 0.28 - i * 20}>
            {x}
          </Text>
        </G>
      );
    });
  };

  render() {
    const paddingTop = 15;
    const paddingRight = 50;
    const {
      width,
      height,
      style = {},
      data,
      withHorizontalLabels = true,
      withVerticalLabels = true,
    } = this.props;
    const {borderRadius = 0} = style;
    const config = {
      width,
      height,
    };
    let border = 0;
    for (let i = 0; i < data.data.length; i++) {
      const actual = data.data[i].reduce((pv, cv) => pv + cv, 0);
      if (actual > border) {
        border = actual;
      }
    }

    console.log('height=' + height);
    console.log('width=' + width);
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig,
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLines({
              ...config,
              count: 4,
              paddingTop,
            })}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: 4,
                  data: [0, border],
                  paddingTop,
                  paddingRight,
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight: paddingRight + 48,
                  stackedBar: true,
                  paddingTop,
                  horizontalOffset: barWidth,
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.data,
              border,
              colors: this.props.data.barColors,
              paddingTop,
              paddingRight: paddingRight + 20,
            })}
          </G>
        </Svg>
        <Svg height={70} width={width}>
          {this.renderLegend({
            ...config,
            legend: data.legend,
            colors: this.props.data.barColors,
          })}
        </Svg>
      </View>
    );
  }
}
export default StackedBarChart;
