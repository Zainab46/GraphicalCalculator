import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Path, Line, Text as SvgText, G, Rect, Defs, Pattern } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const Graph = ({ route }) => {
  const { grapequation } = route.params;
  
  const [startValue, setStartValue] = useState('1');
  const [endValue, setEndValue] = useState('10');
  const [showInputs, setShowInputs] = useState(true);
  const [graphData, setGraphData] = useState(null);

  // Function to safely evaluate mathematical expressions
  const evaluateExpression = (equation, x) => {
    try {
      // First, handle the mathematical notation you're using
      let expr = equation
        // Handle both uppercase and lowercase X
        .replace(/X/g, 'x')
        // Handle superscript numbers (², ³, etc.) - convert to power notation
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        .replace(/⁴/g, '^4')
        .replace(/⁵/g, '^5')
        .replace(/⁶/g, '^6')
        .replace(/⁷/g, '^7')
        .replace(/⁸/g, '^8')
        .replace(/⁹/g, '^9')
        // Handle mathematical symbols
        .replace(/π/g, 'Math.PI')
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        // Replace x with the actual value
        .replace(/x/g, `(${x})`)
        // Handle mathematical functions
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        // Handle power operator
        .replace(/\^/g, '**')
        // Handle implicit multiplication (like 2x becomes 2*x)
        .replace(/(\d)\(/g, '$1*(')
        .replace(/\)(\d)/g, ')*$1')
        .replace(/(\d)([a-zA-Z])/g, '$1*$2');
      
      // Use Function constructor instead of eval for better security
      const func = new Function('return ' + expr);
      const result = func();
      
      return isFinite(result) ? result : null;
    } catch (error) {
      console.log('Error evaluating:', equation, 'with x =', x, 'Error:', error.message);
      return null;
    }
  };

  // Generate graph data points
  const generateGraphData = () => {
    const start = parseFloat(startValue);
    const end = parseFloat(endValue);
    
    if (isNaN(start) || isNaN(end)) {
      Alert.alert('Error', 'Please enter valid numeric values');
      return;
    }
    
    if (start >= end) {
      Alert.alert('Error', 'End value must be greater than start value');
      return;
    }
    
    const points = [];
    const step = (end - start) / 400; // More points for smoother curve
    
    let minY = Infinity;
    let maxY = -Infinity;
    let validPoints = 0;
    
    // First pass: calculate all points and find min/max Y
    for (let x = start; x <= end; x += step) {
      const y = evaluateExpression(grapequation, x);
      if (y !== null && !isNaN(y) && isFinite(y)) {
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        points.push({ x, y });
        validPoints++;
      }
    }
    
    if (validPoints === 0) {
      Alert.alert('Error', 'No valid points found. Please check your equation.');
      return;
    }
    
    // Add some padding to Y range
    const yRange = maxY - minY;
    const yPadding = yRange * 0.1;
    minY -= yPadding;
    maxY += yPadding;
    
    // Graph dimensions
    const graphWidth = Math.max(800, screenWidth * 2); // Scrollable width
    const graphHeight = 300;
    
    // Second pass: normalize coordinates for display
    const normalizedPoints = points.map(point => ({
      x: point.x,
      y: point.y,
      screenX: ((point.x - start) / (end - start)) * graphWidth,
      screenY: graphHeight - ((point.y - minY) / (maxY - minY)) * (graphHeight - 40) - 20
    }));
    
    setGraphData({
      points: normalizedPoints,
      minY,
      maxY,
      minX: start,
      maxX: end,
      graphWidth,
      graphHeight
    });
    
    setShowInputs(false);
  };

  const handlePlotGraph = () => {
    generateGraphData();
  };

  const handleReset = () => {
    setShowInputs(true);
    setGraphData(null);
  };

  // Create SVG path from points
  const createPath = () => {
    if (!graphData?.points || graphData.points.length === 0) return '';
    
    let path = `M ${graphData.points[0].screenX} ${graphData.points[0].screenY}`;
    for (let i = 1; i < graphData.points.length; i++) {
      path += ` L ${graphData.points[i].screenX} ${graphData.points[i].screenY}`;
    }
    return path;
  };

  // Generate grid lines
  const generateGridLines = () => {
    if (!graphData) return [];
    
    const lines = [];
    const { graphWidth, graphHeight } = graphData;
    
    // Vertical grid lines
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * graphWidth;
      lines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={graphHeight}
          stroke="#e0e0e0"
          strokeWidth="1"
        />
      );
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * graphHeight;
      lines.push(
        <Line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={graphWidth}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth="1"
        />
      );
    }
    
    return lines;
  };

  // Generate axis labels
  const generateLabels = () => {
    if (!graphData) return [];
    
    const labels = [];
    const { graphWidth, graphHeight, minX, maxX, minY, maxY } = graphData;
    
    // X-axis labels
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * graphWidth;
      const value = minX + (i / 10) * (maxX - minX);
      labels.push(
        <SvgText
          key={`x-label-${i}`}
          x={x}
          y={graphHeight - 5}
          fontSize="10"
          fill="#666"
          textAnchor="middle"
        >
          {value.toFixed(1)}
        </SvgText>
      );
    }
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = graphHeight - (i / 5) * (graphHeight - 40) - 20;
      const value = minY + (i / 5) * (maxY - minY);
      labels.push(
        <SvgText
          key={`y-label-${i}`}
          x={5}
          y={y + 3}
          fontSize="10"
          fill="#666"
          textAnchor="start"
        >
          {value.toFixed(1)}
        </SvgText>
      );
    }
    
    return labels;
  };

  if (showInputs) {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Graph Plotter</Text>
          
          <View style={styles.equationContainer}>
            <Text style={styles.label}>Equation: {grapequation}</Text>
            <Text style={styles.hint}>
              Supports: sin(X), cos(X), tan(X), X², sqrt(X), log(X), etc.
              Also handles: X³, π, ×, ÷, abs(X), exp(X)
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Value (X-axis)</Text>
            <TextInput
              style={styles.textInput}
              value={startValue}
              onChangeText={setStartValue}
              placeholder="Enter start value"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>End Value (X-axis)</Text>
            <TextInput
              style={styles.textInput}
              value={endValue}
              onChangeText={setEndValue}
              placeholder="Enter end value"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.plotButton} onPress={handlePlotGraph}>
            <Text style={styles.plotButtonText}>Plot Graph</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.graphHeader}>
        <Text style={styles.graphTitle}>Graph: {grapequation}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>New Graph</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.rangeText}>
        Range: {startValue} to {endValue}
        {graphData && (
          <Text>
            {' | Y-range: '}
            {graphData.minY.toFixed(2)} to {graphData.maxY.toFixed(2)}
          </Text>
        )}
      </Text>

      <ScrollView
        horizontal
        style={styles.scrollContainer}
        showsHorizontalScrollIndicator={true}
      >
        {graphData && (
          <Svg
            width={graphData.graphWidth}
            height={graphData.graphHeight}
            style={styles.svg}
          >
            {/* Grid */}
            {generateGridLines()}
            
            {/* Main axes */}
            <Line
              x1={0}
              y1={graphData.graphHeight / 2}
              x2={graphData.graphWidth}
              y2={graphData.graphHeight / 2}
              stroke="#999"
              strokeWidth="2"
            />
            <Line
              x1={graphData.graphWidth / 2}
              y1={0}
              x2={graphData.graphWidth / 2}
              y2={graphData.graphHeight}
              stroke="#999"
              strokeWidth="2"
            />
            
            {/* Labels */}
            {generateLabels()}
            
            {/* Graph curve */}
            <Path
              d={createPath()}
              stroke="#ff0000"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  equationContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputGroup: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  plotButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  plotButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#666',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  svg: {
    backgroundColor: '#fff',
  },
});

export default Graph;