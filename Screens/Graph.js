import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  PanResponder,
} from 'react-native';
import Svg, { Path, Line, Text as SvgText, G, Rect, Circle } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Graph = ({ route }) => {
  const { grapequation } = route.params;
  
  const [startValue, setStartValue] = useState('1');
  const [endValue, setEndValue] = useState('10');
  const [showInputs, setShowInputs] = useState(true);
  const [graphData, setGraphData] = useState(null);
  
  // Viewport states - shows only a portion of the full graph
  const [viewportX, setViewportX] = useState(0); // Current viewport X position
  const [viewportY, setViewportY] = useState(0); // Current viewport Y position
  const [viewportWidth, setViewportWidth] = useState(15); // How many X units to show
  const [viewportHeight, setViewportHeight] = useState(15); // How many Y units to show
  
  // Zoom states
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Cursor states
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [cursorValue, setCursorValue] = useState({ x: 0, y: 0 });
  
  // Refs for gesture handling
  const lastPanRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Function to safely evaluate mathematical expressions
  const evaluateExpression = (equation, x) => {
    try {
      let expr = equation
        .replace(/X/g, 'x')
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        .replace(/⁴/g, '^4')
        .replace(/⁵/g, '^5')
        .replace(/⁶/g, '^6')
        .replace(/⁷/g, '^7')
        .replace(/⁸/g, '^8')
        .replace(/⁹/g, '^9')
        .replace(/π/g, 'Math.PI')
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/x/g, `(${x})`)
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/\^/g, '**')
        .replace(/(\d)\(/g, '$1*(')
        .replace(/\)(\d)/g, ')*$1')
        .replace(/(\d)([a-zA-Z])/g, '$1*$2');
      
      const func = new Function('return ' + expr);
      const result = func();
      
      return isFinite(result) ? result : null;
    } catch (error) {
      console.log('Error evaluating:', equation, 'with x =', x, 'Error:', error.message);
      return null;
    }
  };

  // Generate graph data points for the full range
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
    const step = (end - start) / 2000; // More points for smoother curve
    
    let minY = Infinity;
    let maxY = -Infinity;
    let validPoints = 0;
    
    // Calculate all points and find global min/max Y
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
    const globalMinY = minY - yPadding;
    const globalMaxY = maxY + yPadding;
    
    // Set initial viewport to show first portion of the graph
    const initialViewportWidth = Math.min(15, (end - start) / 2);
    const initialViewportHeight = Math.min(15, (globalMaxY - globalMinY) / 2);
    
    setViewportX(start);
    setViewportY(globalMinY + (globalMaxY - globalMinY) / 2 - initialViewportHeight / 2);
    setViewportWidth(initialViewportWidth);
    setViewportHeight(initialViewportHeight);
    
    setGraphData({
      allPoints: points,
      globalMinY,
      globalMaxY,
      globalMinX: start,
      globalMaxX: end,
      graphWidth: screenWidth - 40,
      graphHeight: 400
    });
    
    setShowInputs(false);
  };

  // Get points visible in current viewport
  const getViewportPoints = () => {
    if (!graphData) return [];
    
    const viewportMinX = viewportX;
    const viewportMaxX = viewportX + viewportWidth;
    const viewportMinY = viewportY;
    const viewportMaxY = viewportY + viewportHeight;
    
    // Filter points within viewport
    const visiblePoints = graphData.allPoints.filter(point => 
      point.x >= viewportMinX && point.x <= viewportMaxX &&
      point.y >= viewportMinY && point.y <= viewportMaxY
    );
    
    // Convert to screen coordinates
    return visiblePoints.map(point => ({
      x: point.x,
      y: point.y,
      screenX: ((point.x - viewportMinX) / viewportWidth) * graphData.graphWidth,
      screenY: graphData.graphHeight - ((point.y - viewportMinY) / viewportHeight) * graphData.graphHeight
    }));
  };

  // Pan responder for handling touch gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (evt) => {
      lastPanRef.current = { x: viewportX, y: viewportY };
      isDraggingRef.current = false;
      
      // Show cursor at touch point
      const touchX = evt.nativeEvent.locationX;
      const touchY = evt.nativeEvent.locationY;
      updateCursorPosition(touchX, touchY);
      setCursorVisible(true);
    },
    
    onPanResponderMove: (evt, gestureState) => {
      const dragThreshold = 10;
      
      if (Math.abs(gestureState.dx) > dragThreshold || Math.abs(gestureState.dy) > dragThreshold) {
        // Dragging to pan viewport
        isDraggingRef.current = true;
        
        const sensitivity = 0.02; // Adjust this to make dragging faster/slower
        const newViewportX = lastPanRef.current.x - (gestureState.dx * viewportWidth * sensitivity);
        const newViewportY = lastPanRef.current.y + (gestureState.dy * viewportHeight * sensitivity);
        
        // Constrain viewport within graph bounds
        const constrainedX = Math.max(
          graphData.globalMinX,
          Math.min(newViewportX, graphData.globalMaxX - viewportWidth)
        );
        const constrainedY = Math.max(
          graphData.globalMinY,
          Math.min(newViewportY, graphData.globalMaxY - viewportHeight)
        );
        
        setViewportX(constrainedX);
        setViewportY(constrainedY);
      } else if (!isDraggingRef.current) {
        // Update cursor position if not dragging
        const touchX = evt.nativeEvent.locationX;
        const touchY = evt.nativeEvent.locationY;
        updateCursorPosition(touchX, touchY);
      }
    },
    
    onPanResponderRelease: () => {
      if (!isDraggingRef.current) {
        // Keep cursor visible for a moment if it was just a tap
        setTimeout(() => {
          setCursorVisible(false);
        }, 2000);
      } else {
        setCursorVisible(false);
      }
      isDraggingRef.current = false;
    },
  });

  // Update cursor position and calculate corresponding graph values
  const updateCursorPosition = (touchX, touchY) => {
    if (!graphData) return;
    
    setCursorX(touchX);
    setCursorY(touchY);
    
    // Convert screen coordinates to viewport coordinates
    const viewportMinX = viewportX;
    const viewportMinY = viewportY;
    
    const graphX = viewportMinX + (touchX / graphData.graphWidth) * viewportWidth;
    const graphY = viewportMinY + ((graphData.graphHeight - touchY) / graphData.graphHeight) * viewportHeight;
    
    // Find the actual Y value on the curve for this X
    const actualY = evaluateExpression(grapequation, graphX);
    
    setCursorValue({ 
      x: graphX, 
      y: actualY !== null ? actualY : graphY 
    });
  };

  const handlePlotGraph = () => {
    generateGraphData();
  };

  const handleReset = () => {
    setShowInputs(true);
    setGraphData(null);
    setZoomLevel(1);
    setViewportX(0);
    setViewportY(0);
    setCursorVisible(false);
  };

  const handleZoomIn = () => {
    const newWidth = viewportWidth * 0.7;
    const newHeight = viewportHeight * 0.7;
    
    // Keep viewport centered
    setViewportX(prev => prev + (viewportWidth - newWidth) / 2);
    setViewportY(prev => prev + (viewportHeight - newHeight) / 2);
    setViewportWidth(newWidth);
    setViewportHeight(newHeight);
  };

  const handleZoomOut = () => {
    if (!graphData) return;
    
    const newWidth = Math.min(viewportWidth * 1.4, graphData.globalMaxX - graphData.globalMinX);
    const newHeight = Math.min(viewportHeight * 1.4, graphData.globalMaxY - graphData.globalMinY);
    
    // Keep viewport centered and within bounds
    let newX = viewportX - (newWidth - viewportWidth) / 2;
    let newY = viewportY - (newHeight - viewportHeight) / 2;
    
    newX = Math.max(graphData.globalMinX, Math.min(newX, graphData.globalMaxX - newWidth));
    newY = Math.max(graphData.globalMinY, Math.min(newY, graphData.globalMaxY - newHeight));
    
    setViewportX(newX);
    setViewportY(newY);
    setViewportWidth(newWidth);
    setViewportHeight(newHeight);
  };

  const resetView = () => {
    if (!graphData) return;
    
    const initialViewportWidth = Math.min(15, (graphData.globalMaxX - graphData.globalMinX) / 2);
    const initialViewportHeight = Math.min(15, (graphData.globalMaxY - graphData.globalMinY) / 2);
    
    setViewportX(graphData.globalMinX);
    setViewportY(graphData.globalMinY + (graphData.globalMaxY - graphData.globalMinY) / 2 - initialViewportHeight / 2);
    setViewportWidth(initialViewportWidth);
    setViewportHeight(initialViewportHeight);
  };

  // Create SVG path from visible points
  const createPath = () => {
    const points = getViewportPoints();
    if (!points || points.length === 0) return '';
    
    let path = `M ${points[0].screenX} ${points[0].screenY}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].screenX} ${points[i].screenY}`;
    }
    return path;
  };

  // Generate grid lines for current viewport
  const generateGridLines = () => {
    if (!graphData) return [];
    
    const lines = [];
    const { graphWidth, graphHeight } = graphData;
    
    // Vertical grid lines
    const xStep = viewportWidth / 10;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * graphWidth;
      lines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={graphHeight}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      );
    }
    
    // Horizontal grid lines
    const yStep = viewportHeight / 8;
    for (let i = 0; i <= 8; i++) {
      const y = (i / 8) * graphHeight;
      lines.push(
        <Line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={graphWidth}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      );
    }
    
    return lines;
  };

  // Generate axis labels for current viewport
  const generateLabels = () => {
    if (!graphData) return [];
    
    const labels = [];
    const { graphWidth, graphHeight } = graphData;
    
    // X-axis labels
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * graphWidth;
      const value = viewportX + (i / 10) * viewportWidth;
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
    for (let i = 0; i <= 8; i++) {
      const y = graphHeight - (i / 8) * graphHeight;
      const value = viewportY + (i / 8) * viewportHeight;
      labels.push(
        <SvgText
          key={`y-label-${i}`}
          x={8}
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
          <Text style={styles.title}>Interactive Graph Plotter</Text>
          
          <View style={styles.equationContainer}>
            <Text style={styles.label}>Equation: {grapequation}</Text>
            <Text style={styles.hint}>
              Supports: sin(X), cos(X), tan(X), X², sqrt(X), log(X), etc.
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
            <Text style={styles.plotButtonText}>Plot Interactive Graph</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.graphHeader}>
        <Text style={styles.graphTitle}>Interactive Graph: {grapequation}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>New Graph</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.rangeText}>
          Full Range: {startValue} to {endValue}
        </Text>
        <Text style={styles.viewportText}>
          Viewport: X: {viewportX.toFixed(1)} to {(viewportX + viewportWidth).toFixed(1)} | 
          Y: {viewportY.toFixed(1)} to {(viewportY + viewportHeight).toFixed(1)}
        </Text>
        {cursorVisible && (
          <Text style={styles.cursorText}>
            Cursor - X: {cursorValue.x.toFixed(3)} | Y: {cursorValue.y.toFixed(3)}
          </Text>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={handleZoomIn}>
          <Text style={styles.controlButtonText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleZoomOut}>
          <Text style={styles.controlButtonText}>Zoom Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={resetView}>
          <Text style={styles.controlButtonText}>Reset View</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.graphContainer} {...panResponder.panHandlers}>
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
              strokeWidth="1"
            />
            <Line
              x1={graphData.graphWidth / 2}
              y1={0}
              x2={graphData.graphWidth / 2}
              y2={graphData.graphHeight}
              stroke="#999"
              strokeWidth="1"
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
            
            {/* Cursor */}
            {cursorVisible && (
              <G>
                <Line
                  x1={cursorX}
                  y1={0}
                  x2={cursorX}
                  y2={graphData.graphHeight}
                  stroke="#00ff00"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <Line
                  x1={0}
                  y1={cursorY}
                  x2={graphData.graphWidth}
                  y2={cursorY}
                  stroke="#00ff00"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <Circle
                  cx={cursorX}
                  cy={cursorY}
                  r="4"
                  fill="#00ff00"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </G>
            )}
          </Svg>
        )}
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          • Drag to pan through different sections of the graph
        </Text>
        <Text style={styles.instructionsText}>
          • Tap to show cursor and values at any point
        </Text>
        <Text style={styles.instructionsText}>
          • Use zoom buttons to see more/fewer details
        </Text>
        <Text style={styles.instructionsText}>
          • Viewport shows only 10-15 units at a time for better detail
        </Text>
      </View>
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
    shadowOffset: { width: 0, height: 2 },
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
    fontSize: 16,
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
  infoContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rangeText: {
    fontSize: 12,
    color: '#666',
  },
  viewportText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  cursorText: {
    fontSize: 14,
    color: '#00aa00',
    fontWeight: '600',
    marginTop: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  controlButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  graphContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  svg: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  instructionsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default Graph;