import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput, Button, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const MathEvaluator = {
  sin: (x, isDeg = false) => Math.sin(isDeg ? x * Math.PI / 180 : x),
  cos: (x, isDeg = false) => Math.cos(isDeg ? x * Math.PI / 180 : x),
  tan: (x, isDeg = false) => Math.tan(isDeg ? x * Math.PI / 180 : x),
  evaluate: (expression, variables = {}, isDeg = false) => {
    try {
      let expr = expression
        .replace(/\bX\b/g, 'x')
        .replace(/\^/g, '**')
        .replace(/(\d)([a-zA-Z])/g, '$1*$2')
        .replace(/([a-zA-Z])(\d)/g, '$1*$2')
        .replace(/pi/gi, Math.PI)
        .replace(/\be\b/gi, Math.E)
        .replace(/\bsin\s*\(/g, 'MathEvaluator.sin(')
        .replace(/\bcos\s*\(/g, 'MathEvaluator.cos(')
        .replace(/\btan\s*\(/g, 'MathEvaluator.tan(');

      if (isDeg) {
        expr = expr.replace(/(MathEvaluator\.(sin|cos|tan))\(([^,)]+)\)/g, '$1($3, true)');
      }

      Object.keys(variables).forEach((key) => {
        expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), variables[key]);
      });

      const safeEval = new Function('MathEvaluator', `return ${expr}`);
      const result = safeEval(MathEvaluator);
      return isNaN(result) || !isFinite(result) ? null : result;
    } catch {
      return null;
    }
  }
};

const EquationPlotter = ({ route }) => {
  const { dataofgraphs, mode } = route.params;
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [yRange, setYRange] = useState({ min: -10, max: 10 });
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [inputMin, setInputMin] = useState('-10');
  const [inputMax, setInputMax] = useState('10');

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffa07a', '#e67e22', '#9b59b6'];

  const generateChartData = () => {
    const expressions = Array.isArray(dataofgraphs) ? dataofgraphs : [];
    const numPoints = 200;
    const step = (xMax - xMin) / numPoints;
    const xValues = Array.from({ length: numPoints + 1 }, (_, i) => xMin + i * step);

    const datasets = [];
    let allY = [];

    expressions.forEach((expr, idx) => {
      const cleanedExpr = expr
        .replace(/\bX\b/g, 'x')
        .replace(/\^/g, '**')
        .replace(/\s+/g, '')
        .replace(/(\d)([a-zA-Z])/g, '$1*$2')
        .replace(/([a-zA-Z])(\d)/g, '$1*$2');

      const yValues = xValues.map(x => {
        const y = MathEvaluator.evaluate(cleanedExpr, { x }, mode === 'DEG');
        return y ?? null;
      });

      if (yValues.some(y => y !== null)) {
        allY.push(...yValues.filter(y => y !== null));
        datasets.push({
          data: yValues.map(y => (y === null ? NaN : y)),
          color: () => colors[idx % colors.length],
          strokeWidth: 2,
          withDots: false,
        });
      }
    });

    if (allY.length > 0) {
      const minY = Math.min(...allY), maxY = Math.max(...allY);
      setYRange({ min: minY - 1, max: maxY + 1 });
    }

    const labelInterval = Math.floor(xValues.length / 6);
    const labels = xValues
      .map(x => x.toFixed(1))
      .filter((_, idx) => idx % labelInterval === 0);

    setChartData({ labels, datasets });
  };

  useEffect(() => {
    generateChartData();
  }, [dataofgraphs, xMin, xMax]);

  const handleUpdateRange = () => {
    const min = parseFloat(inputMin);
    const max = parseFloat(inputMax);

    if (isNaN(min) || isNaN(max) || min >= max) {
      Alert.alert('Invalid Range', 'Enter valid numeric values where min < max.');
      return;
    }

    setXMin(min);
    setXMax(max);
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 2,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
        Equation Plotter
      </Text>

      {/* Min/Max Inputs */}
      <View style={{ flexDirection: 'row', marginBottom: 12, justifyContent: 'space-between' }}>
        <TextInput
          value={inputMin}
          onChangeText={setInputMin}
          placeholder="xMin"
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, flex: 1, marginRight: 5 }}
        />
        <TextInput
          value={inputMax}
          onChangeText={setInputMax}
          placeholder="xMax"
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, flex: 1, marginRight: 5 }}
        />
        <Button title="Apply" onPress={handleUpdateRange} />
      </View>

      <ScrollView horizontal>
        {chartData.datasets.length > 0 ? (
          <LineChart
            data={chartData}
            width={screenWidth * 2} // enables horizontal scroll (zoom-like)
            height={320}
            chartConfig={chartConfig}
            bezier={false}
            withDots={false}
            withInnerLines
            withOuterLines
            segments={6}
          />
        ) : (
          <Text style={{ color: '#aaa', textAlign: 'center' }}>No valid equations to plot.</Text>
        )}
      </ScrollView>

      {/* Legend */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>Legend</Text>
      {dataofgraphs?.map((eq, idx) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ width: 16, height: 4, backgroundColor: colors[idx % colors.length], marginRight: 8 }} />
          <Text style={{ fontSize: 14 }}>{`y = ${eq}`}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default EquationPlotter;
