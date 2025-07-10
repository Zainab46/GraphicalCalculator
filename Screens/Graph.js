import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  PanResponder,
} from 'react-native';
import Svg, { Path, Line, Text as SvgText, G, Circle } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Enhanced Graph component with improved zoom and drag functionality
 */
const Graph = ({ route }) => {
  const { grapequation } = route.params;
  const [startValue, setStartValue] = useState('-10');
  const [endValue, setEndValue] = useState('10');
  const [showInputs, setShowInputs] = useState(true);
  const [graphData, setGraphData] = useState(null);
  const [equationType, setEquationType] = useState('function');
  const [processedEquation, setProcessedEquation] = useState('');
  
  // Enhanced viewport state management
  const [viewportX, setViewportX] = useState(0);
  const [viewportY, setViewportY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(20);
  const [viewportHeight, setViewportHeight] = useState(20);
  const [scale, setScale] = useState(1);
  
  // Cursor state
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [cursorValue, setCursorValue] = useState({ x: 0, y: 0 });

  // Enhanced gesture tracking
  const gestureStateRef = useRef({
    isPanning: false,
    isZooming: false,
    initialDistance: 0,
    initialScale: 1,
    initialViewport: { x: 0, y: 0, width: 20, height: 20 },
    lastPan: { x: 0, y: 0 },
    initialCenter: { x: 0, y: 0 },
  });

  // Helper function to calculate distance between two touches
  const getDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper function to get center point between two touches
  const getCenter = (touches) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    return {
      x: (touches[0].locationX + touches[1].locationX) / 2,
      y: (touches[0].locationY + touches[1].locationY) / 2,
    };
  };

  // Preprocess equation to JavaScript syntax
  const preprocessEquation = (equation) => {
    let processed = equation.trim();
    if (processed.includes('f(x)=') || processed.includes('y=')) {
      setEquationType('function');
      processed = processed.replace(/f\(x\)\s*=\s*/, '').replace(/y\s*=\s*/, '');
    } else if (processed.includes('=')) {
      setEquationType('equation');
    } else {
      setEquationType('function');
    }

    processed = processed
      .replace(/X/g, 'x')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/tan⁻¹/g, 'Math.atan')
      .replace(/sin⁻¹/g, 'Math.asin')
      .replace(/cos⁻¹/g, 'Math.acos')
      .replace(/arctan/g, 'Math.atan')
      .replace(/arcsin/g, 'Math.asin')
      .replace(/arccos/g, 'Math.acos')
      .replace(/sinh/g, 'Math.sinh')
      .replace(/cosh/g, 'Math.cosh')
      .replace(/tanh/g, 'Math.tanh')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log10/g, 'Math.log10')
      .replace(/log2/g, 'Math.log2')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/exp/g, 'Math.exp')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/\^/g, '**')
      .replace(/(\d)\(/g, '$1*(')
      .replace(/\)(\d)/g, ')*$1')
      .replace(/(\d)([a-zA-Z])/g, '$1*$2')
      .replace(/\)([a-zA-Z])/g, ')*$1')
      .replace(/([a-zA-Z])\(/g, '$1*(');

    setProcessedEquation(processed);
    return processed;
  };

  // Evaluate expression for a given x
  const evaluateExpression = (equation, x) => {
    try {
      let expr = preprocessEquation(equation);
      expr = expr.replace(/\bx\b/g, `(${x})`);
      const result = Function('x', 'Math', `"use strict"; return (${expr})`)(x, Math);
      return isNaN(result) || !isFinite(result) ? null : result;
    } catch (error) {
      return null;
    }
  };

  // Solve implicit equations numerically
  const solveImplicitEquation = (equation, x) => {
    try {
      let expr = preprocessEquation(equation);
      if (!expr.includes('=')) {
        return evaluateExpression(equation, x);
      }

      const [leftSide, rightSide] = expr.split('=');
      let yMin = -100;
      let yMax = 100;
      const maxIterations = 50;
      const tolerance = 1e-6;
      let iterations = 0;

      while (iterations < maxIterations && Math.abs(yMax - yMin) > tolerance) {
        const yMid = (yMin + yMax) / 2;
        const leftValue = evaluateExpression(leftSide.replace(/\by\b/g, `(${yMid})`), x);
        const rightValue = evaluateExpression(rightSide.replace(/\by\b/g, `(${yMid})`), x);

        if (leftValue === null || rightValue === null) break;

        const diff = leftValue - rightValue;
        if (Math.abs(diff) < tolerance) {
          return yMid;
        }

        if (diff > 0) {
          yMax = yMid;
        } else {
          yMin = yMid;
        }
        iterations++;
      }

      return (yMin + yMax) / 2;
    } catch (error) {
      return null;
    }
  };

  // Generate graph data
  const generateGraphData = () => {
    const start = parseFloat(startValue);
    const end = parseFloat(endValue);

    if (isNaN(start) || isNaN(end)) {
      Alert.alert('Error', 'Please enter valid numeric values for start and end.');
      return;
    }

    if (start >= end) {
      Alert.alert('Error', 'End value must be greater than start value.');
      return;
    }

    const points = [];
    const step = (end - start) / 2000;
    let minY = Infinity;
    let maxY = -Infinity;
    let validPoints = 0;

    for (let x = start; x <= end; x += step) {
      let y = equationType === 'equation' ? solveImplicitEquation(grapequation, x) : evaluateExpression(grapequation, x);
      if (y !== null && isFinite(y)) {
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        points.push({ x, y });
        validPoints++;
      }
    }

    if (validPoints === 0) {
      Alert.alert('Error', 'No valid points found. Check your equation.');
      return;
    }

    const yRange = maxY - minY || 1;
    const yPadding = yRange * 0.1;
    const globalMinY = minY - yPadding;
    const globalMaxY = maxY + yPadding;

    // Initialize viewport to show the full graph
    const initialViewportWidth = end - start;
    const initialViewportHeight = globalMaxY - globalMinY;
    
    setViewportX(start);
    setViewportY(globalMinY);
    setViewportWidth(initialViewportWidth);
    setViewportHeight(initialViewportHeight);
    setScale(1);

    setGraphData({
      allPoints: points,
      globalMinY,
      globalMaxY,
      globalMinX: start,
      globalMaxX: end,
      graphWidth: screenWidth - 40,
      graphHeight: 400,
    });
    setShowInputs(false);
  };

  // Get points in viewport
  const getViewportPoints = () => {
    if (!graphData) return [];

    const viewportMinX = viewportX;
    const viewportMaxX = viewportX + viewportWidth;
    const viewportMinY = viewportY;
    const viewportMaxY = viewportY + viewportHeight;

    const visiblePoints = graphData.allPoints.filter(
      (point) => point.x >= viewportMinX && point.x <= viewportMaxX && point.y >= viewportMinY && point.y <= viewportMaxY
    );

    return visiblePoints.map((point) => ({
      x: point.x,
      y: point.y,
      screenX: ((point.x - viewportMinX) / viewportWidth) * graphData.graphWidth,
      screenY: graphData.graphHeight - ((point.y - viewportMinY) / viewportHeight) * graphData.graphHeight,
    }));
  };

  // Convert screen coordinates to graph coordinates
  const screenToGraph = (screenX, screenY) => {
    if (!graphData) return { x: 0, y: 0 };
    
    const graphX = viewportX + (screenX / graphData.graphWidth) * viewportWidth;
    const graphY = viewportY + ((graphData.graphHeight - screenY) / graphData.graphHeight) * viewportHeight;
    
    return { x: graphX, y: graphY };
  };

  // Enhanced pan and zoom gesture handling
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (evt) => {
      const { touches } = evt.nativeEvent;
      const gestureState = gestureStateRef.current;
      
      // Reset gesture state
      gestureState.isPanning = false;
      gestureState.isZooming = false;
      
      if (touches.length === 1) {
        // Single touch - prepare for panning and show cursor
        gestureState.isPanning = true;
        gestureState.lastPan = { x: viewportX, y: viewportY };
        
        const touchX = touches[0].locationX;
        const touchY = touches[0].locationY;
        updateCursorPosition(touchX, touchY);
        setCursorVisible(true);
        
      } else if (touches.length === 2) {
        // Two touches - prepare for zooming
        gestureState.isZooming = true;
        gestureState.initialDistance = getDistance(touches);
        gestureState.initialScale = scale;
        gestureState.initialViewport = { 
          x: viewportX, 
          y: viewportY, 
          width: viewportWidth, 
          height: viewportHeight 
        };
        gestureState.initialCenter = getCenter(touches);
        setCursorVisible(false);
      }
    },
    
    onPanResponderMove: (evt, gestureState) => {
      const { touches } = evt.nativeEvent;
      const state = gestureStateRef.current;
      
      if (touches.length === 2 && state.isZooming) {
        // Handle zoom
        const currentDistance = getDistance(touches);
        const currentCenter = getCenter(touches);
        
        if (state.initialDistance > 0) {
          const scaleChange = currentDistance / state.initialDistance;
          let newScale = state.initialScale * scaleChange;
          
          // Constrain scale
          newScale = Math.max(0.1, Math.min(newScale, 10));
          
          // Calculate new viewport dimensions
          const newViewportWidth = state.initialViewport.width / newScale;
          const newViewportHeight = state.initialViewport.height / newScale;
          
          // Calculate zoom center in graph coordinates
          const zoomCenterGraph = screenToGraph(state.initialCenter.x, state.initialCenter.y);
          
          // Calculate new viewport position to keep zoom center fixed
          const newViewportX = zoomCenterGraph.x - (zoomCenterGraph.x - state.initialViewport.x) * (newViewportWidth / state.initialViewport.width);
          const newViewportY = zoomCenterGraph.y - (zoomCenterGraph.y - state.initialViewport.y) * (newViewportHeight / state.initialViewport.height);
          
          // Apply constraints to prevent zooming outside graph bounds
          const constrainedX = Math.max(
            graphData.globalMinX,
            Math.min(newViewportX, graphData.globalMaxX - newViewportWidth)
          );
          const constrainedY = Math.max(
            graphData.globalMinY,
            Math.min(newViewportY, graphData.globalMaxY - newViewportHeight)
          );
          
          setScale(newScale);
          setViewportX(constrainedX);
          setViewportY(constrainedY);
          setViewportWidth(newViewportWidth);
          setViewportHeight(newViewportHeight);
        }
        
      } else if (touches.length === 1 && state.isPanning) {
        // Handle pan
        const sensitivity = 1;
        const deltaX = gestureState.dx * sensitivity;
        const deltaY = gestureState.dy * sensitivity;
        
        // Convert screen deltas to graph deltas
        const graphDeltaX = -(deltaX / graphData.graphWidth) * viewportWidth;
        const graphDeltaY = (deltaY / graphData.graphHeight) * viewportHeight;
        
        const newViewportX = state.lastPan.x + graphDeltaX;
        const newViewportY = state.lastPan.y + graphDeltaY;
        
        // Apply constraints
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
        
        // Update cursor position
        const touchX = touches[0].locationX;
        const touchY = touches[0].locationY;
        updateCursorPosition(touchX, touchY);
      }
    },
    
    onPanResponderRelease: () => {
      const state = gestureStateRef.current;
      state.isPanning = false;
      state.isZooming = false;
      
      // Hide cursor after a delay
      setTimeout(() => setCursorVisible(false), 3000);
    },
  });

  // Update cursor position and calculate actual graph value
  const updateCursorPosition = (touchX, touchY) => {
    if (!graphData) return;

    setCursorX(touchX);
    setCursorY(touchY);

    const graphCoords = screenToGraph(touchX, touchY);
    const actualY = equationType === 'equation' 
      ? solveImplicitEquation(grapequation, graphCoords.x) 
      : evaluateExpression(grapequation, graphCoords.x);
    
    setCursorValue({ 
      x: graphCoords.x, 
      y: actualY !== null ? actualY : graphCoords.y 
    });
  };

  // Handle plot button
  const handlePlotGraph = () => {
    generateGraphData();
  };

  // Reset view
  const handleReset = () => {
    setShowInputs(true);
    setGraphData(null);
    setScale(1);
    setViewportX(0);
    setViewportY(0);
    setViewportWidth(20);
    setViewportHeight(20);
    setCursorVisible(false);
    setEquationType('function');
    setProcessedEquation('');
    gestureStateRef.current = {
      isPanning: false,
      isZooming: false,
      initialDistance: 0,
      initialScale: 1,
      initialViewport: { x: 0, y: 0, width: 20, height: 20 },
      lastPan: { x: 0, y: 0 },
      initialCenter: { x: 0, y: 0 },
    };
  };

  // Create SVG path with improved discontinuity handling
  const createPath = () => {
    const points = getViewportPoints();
    if (!points || points.length === 0) return '';

    let pathSegments = [];
    let currentSegment = [];
    const maxJumpThreshold = graphData.graphHeight * 0.3; // 30% of graph height

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      
      if (i === 0) {
        currentSegment.push(point);
      } else {
        const prevPoint = points[i - 1];
        const screenYDiff = Math.abs(point.screenY - prevPoint.screenY);
        
        if (screenYDiff > maxJumpThreshold) {
          // Large jump detected - end current segment and start new one
          if (currentSegment.length > 1) {
            pathSegments.push([...currentSegment]);
          }
          currentSegment = [point];
        } else {
          currentSegment.push(point);
        }
      }
    }
    
    // Add the last segment
    if (currentSegment.length > 1) {
      pathSegments.push(currentSegment);
    }

    // Create path from segments
    return pathSegments.map(segment => {
      let path = `M ${segment[0].screenX} ${segment[0].screenY}`;
      for (let i = 1; i < segment.length; i++) {
        path += ` L ${segment[i].screenX} ${segment[i].screenY}`;
      }
      return path;
    }).join(' ');
  };

  // Generate adaptive grid lines
  const generateGridLines = () => {
    if (!graphData) return [];

    const lines = [];
    const { graphWidth, graphHeight } = graphData;

    // Vertical grid lines
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
          strokeWidth="0.5"
        />
      );
    }

    return lines;
  };

  // Generate adaptive axis labels
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
          {value.toFixed(viewportWidth > 100 ? 0 : viewportWidth > 10 ? 1 : 2)}
        </SvgText>
      );
    }

    // Y-axis labels
    for (let i = 0; i <= 10; i++) {
      const y = graphHeight - (i / 10) * graphHeight;
      const value = viewportY + (i / 10) * viewportHeight;
      labels.push(
        <SvgText
          key={`y-label-${i}`}
          x={8}
          y={y + 3}
          fontSize="10"
          fill="#666"
          textAnchor="start"
        >
          {value.toFixed(viewportHeight > 100 ? 0 : viewportHeight > 10 ? 1 : 2)}
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
              Supports: sin(x), cos(x), tan(x), tan⁻¹(x), sinh(x), cosh(x), log(x), equations like tan⁻¹(20)+2X-1=50
            </Text>
            {processedEquation && (
              <Text style={styles.processedEquation}>Processed: {processedEquation}</Text>
            )}
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
        <Text style={styles.graphTitle}>
          {equationType === 'equation' ? 'Equation' : 'Function'}: {grapequation}
        </Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>New Graph</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.rangeText}>
          Range: {startValue} to {endValue} | Type: {equationType}
        </Text>
        <Text style={styles.viewportText}>
          Viewport: X: {viewportX.toFixed(2)} to {(viewportX + viewportWidth).toFixed(2)} | 
          Y: {viewportY.toFixed(2)} to {(viewportY + viewportHeight).toFixed(2)}
        </Text>
        <Text style={styles.zoomText}>
          Zoom: {scale.toFixed(2)}x
        </Text>
        {cursorVisible && (
          <Text style={styles.cursorText}>
            Cursor - X: {cursorValue.x.toFixed(3)} | Y: {cursorValue.y.toFixed(3)}
          </Text>
        )}
      </View>
      
      <View style={styles.graphContainer} {...panResponder.panHandlers}>
        {graphData && (
          <Svg width={graphData.graphWidth} height={graphData.graphHeight} style={styles.svg}>
            {/* Grid */}
            {generateGridLines()}
            
            {/* Axes */}
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
            
            {/* Function curve */}
            <Path d={createPath()} stroke="#ff0000" strokeWidth="2" fill="none" />
            
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
        <Text style={styles.instructionsTitle}>Controls:</Text>
        <Text style={styles.instructionsText}>• Single finger: Drag to pan, tap to show cursor</Text>
        <Text style={styles.instructionsText}>• Two fingers: Pinch to zoom in/out</Text>
        <Text style={styles.instructionsText}>• Supports: sin(x), cos(x), tan(x), tan⁻¹(x), sinh(x), cosh(x)</Text>
        <Text style={styles.instructionsText}>• Equations: e.g., tan⁻¹(20)+2X-1=50</Text>
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
    marginBottom: 5,
  },
  processedEquation: {
    fontSize: 11,
    color: '#007AFF',
    fontFamily: 'monospace',
    backgroundColor: '#f8f8f8',
    padding: 5,
    borderRadius: 4,
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
    fontSize: 14,
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
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  zoomText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 2,
  },
  cursorText: {
    fontSize: 12,
    color: '#00aa00',
    fontWeight: '600',
    marginTop: 4,
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
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default Graph;