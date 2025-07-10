import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced math evaluator with better accuracy
const MathEvaluator = {
  // Basic math functions with improved precision
  sin: (x, isDeg = false) => {
    const angle = isDeg ? x * Math.PI / 180 : x;
    return Math.sin(angle);
  },
  cos: (x, isDeg = false) => {
    const angle = isDeg ? x * Math.PI / 180 : x;
    return Math.cos(angle);
  },
  tan: (x, isDeg = false) => {
    const angle = isDeg ? x * Math.PI / 180 : x;
    return Math.tan(angle);
  },
  sinh: (x) => Math.sinh(x),
  cosh: (x) => Math.cosh(x),
  tanh: (x) => Math.tanh(x),
  log: (x) => x > 0 ? Math.log(x) : NaN,
  ln: (x) => x > 0 ? Math.log(x) : NaN,
  log10: (x) => x > 0 ? Math.log10(x) : NaN,
  sqrt: (x) => x >= 0 ? Math.sqrt(x) : NaN,
  abs: (x) => Math.abs(x),
  exp: (x) => Math.exp(x),
  pow: (base, exp) => Math.pow(base, exp),
  
  // Parse and evaluate mathematical expressions with better error handling
  evaluate: (expression, variables = {}, isDeg = false) => {
    try {
      // Replace variables first
      let expr = expression;
      Object.keys(variables).forEach(variable => {
        const regex = new RegExp(`\\b${variable}\\b`, 'g');
        expr = expr.replace(regex, variables[variable]);
      });
      
      // Replace mathematical functions with proper handling
      expr = expr.replace(/\bsin\s*\(/g, isDeg ? 'MathEvaluator.sin(' : 'MathEvaluator.sin(');
      expr = expr.replace(/\bcos\s*\(/g, isDeg ? 'MathEvaluator.cos(' : 'MathEvaluator.cos(');
      expr = expr.replace(/\btan\s*\(/g, isDeg ? 'MathEvaluator.tan(' : 'MathEvaluator.tan(');
      expr = expr.replace(/\bsinh\s*\(/g, 'MathEvaluator.sinh(');
      expr = expr.replace(/\bcosh\s*\(/g, 'MathEvaluator.cosh(');
      expr = expr.replace(/\btanh\s*\(/g, 'MathEvaluator.tanh(');
      expr = expr.replace(/\blog\s*\(/g, 'MathEvaluator.log(');
      expr = expr.replace(/\bln\s*\(/g, 'MathEvaluator.ln(');
      expr = expr.replace(/\bsqrt\s*\(/g, 'MathEvaluator.sqrt(');
      expr = expr.replace(/\babs\s*\(/g, 'MathEvaluator.abs(');
      expr = expr.replace(/\bexp\s*\(/g, 'MathEvaluator.exp(');
      
      // Replace constants
      expr = expr.replace(/\bpi\b/g, Math.PI);
      expr = expr.replace(/\bPI\b/g, Math.PI);
      expr = expr.replace(/\be\b/g, Math.E);
      expr = expr.replace(/\bE\b/g, Math.E);
      
      // Handle power operator
      expr = expr.replace(/\^/g, '**');
      
      // Add degree mode parameter to trig functions if needed
      if (isDeg) {
        expr = expr.replace(/(MathEvaluator\.(sin|cos|tan))\(([^)]+)\)/g, '$1($3, true)');
      }
      
      // Create a safe evaluation context
      const safeEval = new Function('MathEvaluator', 'Math', `return ${expr}`);
      const result = safeEval(MathEvaluator, Math);
      
      // Check for invalid results
      if (isNaN(result) || !isFinite(result)) {
        return null;
      }
      
      return result;
    } catch (error) {
      return null;
    }
  }
};

const EquationPlotter = ({ route }) => {
  const { dataofgraphs } = route.params;
  
  const [equations, setEquations] = useState([]);
  const [newEquation, setNewEquation] = useState('');
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [yRange, setYRange] = useState({ min: -10, max: 10 });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [autoScale, setAutoScale] = useState(true);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', 
    '#dda0dd', '#98d8c8', '#f7dc6f', '#ff9ff3', '#54a0ff'
  ];

  // Initialize equations from dataofgraphs.graph array
  useEffect(() => {
    if (dataofgraphs && dataofgraphs.graph && dataofgraphs.graph.length > 0) {
      const initialEquations = dataofgraphs.graph.map((expression, index) => ({
        id: index + 1,
        expression: expression,
        color: colors[index % colors.length],
        visible: true,
        label: `y = ${expression}`
      }));
      setEquations(initialEquations);
    } else {
      // Default equations if no graph data
      setEquations([
        { id: 1, expression: 'x**2', color: '#ff6b6b', visible: true, label: 'y = x²' },
        { id: 2, expression: '2*x + 1', color: '#4ecdc4', visible: true, label: 'y = 2x + 1' },
        { id: 3, expression: 'sin(x)', color: '#45b7d1', visible: true, label: 'y = sin(x)' }
      ]);
    }
  }, [dataofgraphs]);

  const normalizeExpression = (expression) => {
    return expression
      .replace(/\bX\b/g, 'x')
      .replace(/\^/g, '**')
      .replace(/(\d)([a-zA-Z])/g, '$1*$2')
      .replace(/([a-zA-Z])(\d)/g, '$1*$2')
      .replace(/\)\(/g, ')*(')
      .replace(/([a-zA-Z])\(/g, '$1*(');
  };

  const generateChartData = () => {
    const numPoints = 200; // Increased for better accuracy
    const step = (xRange.max - xRange.min) / numPoints;
    const labels = [];
    const datasets = [];
    let allYValues = [];

    // Generate x values
    for (let i = 0; i <= numPoints; i++) {
      const x = xRange.min + i * step;
      labels.push(parseFloat(x.toFixed(3)));
    }

    // Generate datasets for each visible equation
    equations.forEach(eq => {
      if (eq.visible) {
        const data = [];
        let hasValidData = false;
        
        labels.forEach(x => {
          let expression = normalizeExpression(eq.expression);
          const isDegMode = dataofgraphs && dataofgraphs.mode === "DEG";
          
          const y = MathEvaluator.evaluate(expression, { x: x }, isDegMode);
          
          if (y !== null && isFinite(y)) {
            data.push(parseFloat(y.toFixed(6)));
            allYValues.push(y);
            hasValidData = true;
          } else {
            data.push(null);
          }
        });

        if (hasValidData) {
          datasets.push({
            data: data,
            color: () => eq.color,
            strokeWidth: 2,
            withDots: false,
          });
        }
      }
    });

    // Auto-scale Y axis if enabled
    if (autoScale && allYValues.length > 0) {
      const minY = Math.min(...allYValues);
      const maxY = Math.max(...allYValues);
      const padding = (maxY - minY) * 0.1;
      
      setYRange({
        min: Math.max(minY - padding, -1000),
        max: Math.min(maxY + padding, 1000)
      });
    }

    // Create labels for display (fewer labels for cleaner look)
    const displayLabels = labels.filter((_, index) => index % Math.ceil(labels.length / 8) === 0)
                                .map(x => x.toFixed(1));

    setChartData({
      labels: displayLabels,
      datasets: datasets
    });
  };

  useEffect(() => {
    generateChartData();
  }, [equations, xRange, yRange]);

  const addEquation = () => {
    if (!newEquation.trim()) return;
    
    try {
      let testExpression = normalizeExpression(newEquation.trim());
      const testValues = [1, 0, -1, 2, 0.5];
      const isDegMode = dataofgraphs && dataofgraphs.mode === "DEG";
      
      // Test validity
      let hasValidResult = false;
      testValues.forEach(testX => {
        const result = MathEvaluator.evaluate(testExpression, { x: testX }, isDegMode);
        if (result !== null) hasValidResult = true;
      });
      
      if (!hasValidResult) {
        throw new Error('No valid results');
      }
      
      const newId = Math.max(...equations.map(eq => eq.id), 0) + 1;
      const colorIndex = (equations.length) % colors.length;
      
      const newEq = {
        id: newId,
        expression: newEquation.trim(),
        color: colors[colorIndex],
        visible: true,
        label: `y = ${newEquation.trim()}`
      };
      
      setEquations([...equations, newEq]);
      
      if (dataofgraphs && dataofgraphs.graph) {
        dataofgraphs.graph.push(newEquation.trim());
      }
      
      setNewEquation('');
    } catch (error) {
      Alert.alert('Invalid Equation', 'Please enter a valid mathematical expression using x as the variable.\n\nExample: sin(x), cos(x), x**2+3*x+1');
    }
  };

  const removeEquation = (id) => {
    const equationToRemove = equations.find(eq => eq.id === id);
    setEquations(equations.filter(eq => eq.id !== id));
    
    if (dataofgraphs && dataofgraphs.graph && equationToRemove) {
      const index = dataofgraphs.graph.indexOf(equationToRemove.expression);
      if (index > -1) {
        dataofgraphs.graph.splice(index, 1);
      }
    }
  };

  const toggleVisibility = (id) => {
    setEquations(equations.map(eq => 
      eq.id === id ? { ...eq, visible: !eq.visible } : eq
    ));
  };

  const updateEquation = (id, newExpression) => {
    try {
      if (newExpression.trim()) {
        let testExpression = normalizeExpression(newExpression.trim());
        const testValues = [1, 0, -1, 2, 0.5];
        const isDegMode = dataofgraphs && dataofgraphs.mode === "DEG";
        
        let hasValidResult = false;
        testValues.forEach(testX => {
          const result = MathEvaluator.evaluate(testExpression, { x: testX }, isDegMode);
          if (result !== null) hasValidResult = true;
        });
        
        if (!hasValidResult && newExpression.trim() !== '') {
          return; // Don't update if invalid
        }
      }
      
      const oldEquation = equations.find(eq => eq.id === id);
      
      setEquations(equations.map(eq => 
        eq.id === id ? { ...eq, expression: newExpression, label: `y = ${newExpression}` } : eq
      ));
      
      if (dataofgraphs && dataofgraphs.graph && oldEquation) {
        const index = dataofgraphs.graph.indexOf(oldEquation.expression);
        if (index > -1) {
          dataofgraphs.graph[index] = newExpression;
        }
      }
    } catch (error) {
      console.log('Invalid expression update:', error);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    propsForLabels: {
      fontSize: 10,
    },
    propsForVerticalLabels: {
      fontSize: 10,
    },
    propsForHorizontalLabels: {
      fontSize: 10,
    },
    formatYLabel: (yValue) => {
      const num = parseFloat(yValue);
      if (Math.abs(num) >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num.toFixed(1);
    },
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2c3e50' }}>
        Equation Plotter & Comparison
      </Text>
      
      {/* Display current config info */}
      {dataofgraphs && (
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#2c3e50' }}>
            Calculator Mode
          </Text>
          <Text style={{ fontSize: 14, color: '#7f8c8d' }}>
            Mode: {dataofgraphs.mode || 'RAD'} • Equations: {dataofgraphs.graph?.length || 0}
          </Text>
        </View>
      )}

      {/* Range Controls */}
      <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#2c3e50' }}>
          Graph Range
        </Text>
        
        {/* X-Range */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#7f8c8d', marginBottom: 8 }}>X-Axis Range</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Min</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#e1e8ed',
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: '#f8f9fa'
                }}
                value={xRange.min.toString()}
                onChangeText={(text) => {
                  const val = parseFloat(text);
                  if (!isNaN(val)) setXRange(prev => ({ ...prev, min: val }));
                }}
                keyboardType="numeric"
                placeholder="Min X"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Max</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#e1e8ed',
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: '#f8f9fa'
                }}
                value={xRange.max.toString()}
                onChangeText={(text) => {
                  const val = parseFloat(text);
                  if (!isNaN(val)) setXRange(prev => ({ ...prev, max: val }));
                }}
                keyboardType="numeric"
                placeholder="Max X"
              />
            </View>
          </View>
        </View>

        {/* Auto-scale toggle */}
        <TouchableOpacity
          onPress={() => setAutoScale(!autoScale)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            backgroundColor: autoScale ? '#e8f5e8' : '#f8f8f8',
            borderRadius: 8,
            marginBottom: 8
          }}
        >
          <Text style={{ fontSize: 14, color: autoScale ? '#27ae60' : '#7f8c8d' }}>
            {autoScale ? '✓' : '○'} Auto-scale Y-axis
          </Text>
        </TouchableOpacity>

        {/* Y-Range (only when auto-scale is off) */}
        {!autoScale && (
          <View>
            <Text style={{ fontSize: 14, color: '#7f8c8d', marginBottom: 8 }}>Y-Axis Range</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Min</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e1e8ed',
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: '#f8f9fa'
                  }}
                  value={yRange.min.toString()}
                  onChangeText={(text) => {
                    const val = parseFloat(text);
                    if (!isNaN(val)) setYRange(prev => ({ ...prev, min: val }));
                  }}
                  keyboardType="numeric"
                  placeholder="Min Y"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Max</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e1e8ed',
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: '#f8f9fa'
                  }}
                  value={yRange.max.toString()}
                  onChangeText={(text) => {
                    const val = parseFloat(text);
                    if (!isNaN(val)) setYRange(prev => ({ ...prev, max: val }));
                  }}
                  keyboardType="numeric"
                  placeholder="Max Y"
                />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Graph */}
      <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#2c3e50' }}>
          Graph Comparison
        </Text>
        <View style={{ alignItems: 'center' }}>
          {chartData.datasets.length > 0 ? (
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={320}
              chartConfig={chartConfig}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withDots={false}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={true}
              withHorizontalLines={true}
              bezier={false}
            />
          ) : (
            <View style={{ 
              height: 320, 
              width: screenWidth - 64,
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: 16
            }}>
              <Text style={{ color: '#7f8c8d', fontSize: 16 }}>No visible equations</Text>
            </View>
          )}
        </View>
      </View>

      {/* Equations List */}
      <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#2c3e50' }}>
          Equations ({equations.length})
        </Text>
        
        {equations.map(eq => (
          <View key={eq.id} style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 12,
            padding: 12,
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: eq.color
          }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{
                  fontSize: 14,
                  color: '#2c3e50',
                  fontFamily: 'monospace',
                  backgroundColor: 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: '#e1e8ed',
                  paddingBottom: 4
                }}
                value={eq.expression}
                onChangeText={(text) => updateEquation(eq.id, text)}
                placeholder="Enter equation..."
              />
              <Text style={{ fontSize: 12, color: '#7f8c8d', marginTop: 4 }}>
                {eq.label}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => toggleVisibility(eq.id)}
              style={{ 
                padding: 8, 
                marginHorizontal: 4,
                backgroundColor: eq.visible ? '#e8f5e8' : '#f8f8f8',
                borderRadius: 6,
                minWidth: 60,
                alignItems: 'center'
              }}
            >
              <Text style={{ 
                fontSize: 12, 
                color: eq.visible ? '#27ae60' : '#95a5a6',
                fontWeight: '600'
              }}>
                {eq.visible ? 'Show' : 'Hide'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => removeEquation(eq.id)}
              style={{ 
                padding: 8,
                backgroundColor: '#ffebee',
                borderRadius: 6,
                minWidth: 60,
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 12, color: '#e74c3c', fontWeight: '600' }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add New Equation */}
      <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 20, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#2c3e50' }}>
          Add New Equation
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 16, color: '#2c3e50' }}>y =</Text>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#e1e8ed',
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#f8f9fa',
              fontFamily: 'monospace'
            }}
            value={newEquation}
            onChangeText={setNewEquation}
            placeholder="e.g., sin(x), cos(x), x**2, log(x)"
            onSubmitEditing={addEquation}
          />
          <TouchableOpacity
            onPress={addEquation}
            style={{
              backgroundColor: '#3498db',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 60
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ fontSize: 12, color: '#7f8c8d', marginTop: 8 }}>
          Supported functions: sin(x), cos(x), tan(x), sinh(x), cosh(x), tanh(x), log(x), ln(x), sqrt(x), abs(x), exp(x), x**2, 2*x+1
        </Text>
      </View>

      {/* Legend */}
      <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 20, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#2c3e50' }}>
          Legend
        </Text>
        {equations.filter(eq => eq.visible).map(eq => (
          <View key={eq.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ 
              width: 20, 
              height: 3, 
              backgroundColor: eq.color, 
              marginRight: 12,
              borderRadius: 2
            }} />
            <Text style={{ fontSize: 14, color: '#2c3e50', fontFamily: 'monospace' }}>
              {eq.label}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default EquationPlotter;