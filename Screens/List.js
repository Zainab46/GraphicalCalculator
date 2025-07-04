export const modes={"simplemodes":[
{id:'1',name:'COMP'},
{id:'2',name:'CMPLX'},
{id:'3',name:'STAT'},
{id:'4',name:'BASE-N'},
{id:'5',name:'EQN'},
{id:'6',name:'MATRIX'},
{id:'7',name:'TABLE'},
{id:'8',name:'VECTOR'}
],
"shiftmode":[
{id:'1',name:'MthIO'},
{id:'2',name:'LineIO'},
{id:'3',name:'Deg'},
{id:'4',name:'Rad'},
{id:'5',name:'Gra'},
{id:'6',name:'Fix'},
{id:'7',name:'Sci'},
{id:'8',name:'Norm'}
],
"stat":[
{id:'1',name:'1-VAR'},
{id:'2',name:'A+BX'},
{id:'3',name:'-+cX²'},
{id:'4',name:'ln X'},
{id:'5',name:'e^X '},
{id:'6',name:'A.B^X'},
{id:'7',name:'A.X^B'},
{id:'8',name:'1/X'}
],
"base_n":[
{id:'1',name:'dec'},

],
"eq":[
{id:'1',name:'anX+bnY=cn',value:'linear'},
{id:'2',name:'anX+bnY+cnZ=dn',value:'quadratic'},
{id:'3',name:'aX²+bX+c=0',value:'cubic'},
{id:'4',name:'aX³+bX²+cX+d=0',value:'quartic'},

],
"matrix":[
{id:'1',name:'MatA'},
{id:'2',name:'MatB'},
{id:'3',name:'MatC'},

],
"table":[
{id:'1',name:'f(X)='},

],
"vector":[
{id:'1',name:'VectA'},
{id:'2',name:'VectB'},
{id:'3',name:'VectC'},
],
"shifteight":[
    {"id":"1", "name":"in ▶ cm"},
    {"id":"2", "name":"cm ▶ in"},
    {"id":"3", "name":"ft ▶ m"},
    {"id":"4", "name":"m ▶ ft"},
    {"id":"5", "name":"yd ▶ m"},
    {"id":"6", "name":"m ▶ yd"},
    {"id":"7", "name":"mile ▶ km"},
    {"id":"8", "name":"km ▶ mile"},
    {"id":"9", "name":"n mile ▶ m"},
    {"id":"10", "name":"m ▶ n mile"},
    {"id":"11", "name":"acre ▶ m²"},
    {"id":"12", "name":"m² ▶ acre"},
    {"id":"13", "name":"gal(US) ▶ L"},
    {"id":"14", "name":"L ▶ gal(US)"},
    {"id":"15", "name":"gal(UK) ▶ L"},
    {"id":"16", "name":"L ▶ gal(UK)"},
    {"id":"17", "name":"pc ▶ km"},
    {"id":"18", "name":"km ▶ pc"},
    {"id":"19", "name":"km/h ▶ m/s"},
    {"id":"20", "name":"m/s ▶ km/h"},
    {"id":"21", "name":"oz ▶ g"},
    {"id":"22", "name":"g ▶ oz"},
    {"id":"23", "name":"lb ▶ kg"},
    {"id":"24", "name":"kg ▶ lb"},
    {"id":"25", "name":"atm ▶ Pa"},
    {"id":"26", "name":"Pa ▶ atm"},
    {"id":"27", "name":"mmHg ▶ Pa"},
    {"id":"28", "name":"Pa ▶ mmHg"},
    {"id":"29", "name":"hp ▶ kW"},
    {"id":"30", "name":"kW ▶ hp"},
    {"id":"31", "name":"kgf/cm² ▶ Pa"},
    {"id":"32", "name":"Pa ▶ kgf/cm²"},
    {"id":"33", "name":"kgf·m ▶ J"},
    {"id":"34", "name":"J ▶ kgf·m"},
    {"id":"35", "name":"lbf/in² ▶ kPa"},
    {"id":"36", "name":"kPa ▶ lbf/in²"},
    {"id":"37", "name":"°F ▶ °C"},
    {"id":"38", "name":"°C ▶ °F"},
    {"id":"39", "name":"J ▶ cal"},
    {"id":"40", "name":"cal ▶ J"}
],
"shiftseven":[
    {"id":"1", "upper":"Proton mass", "lower":"1.67262189821 × 10⁻²⁷ kg", "actual":"mp"},
    {"id":"2", "upper":"Neutron mass", "lower":"1.67492747121 × 10⁻²⁷ kg", "actual":"mn"},
    {"id":"3", "upper":"Electron mass", "lower":"9.10938356 × 10⁻³¹ kg", "actual":"me"},
    {"id":"4", "upper":"Muon mass", "lower":"1.88353159448 × 10⁻²⁸ kg", "actual":"mμ"},
    {"id":"5", "upper":"Bohr radius", "lower":"5.2917721067 × 10⁻¹¹ m", "actual":"a₀"},
    {"id":"6", "upper":"Planck constant", "lower":"6.62607015 × 10⁻³⁴ Js", "actual":"h"},
    {"id":"7", "upper":"Nuclear magneton", "lower":"5.05078369931 × 10⁻²⁷ JT⁻¹", "actual":"μN"},
    {"id":"8", "upper":"Bohr magneton", "lower":"9.27400999457 × 10⁻²⁴ JT⁻¹", "actual":"μB"},
    {"id":"9", "upper":"Planck constant, rationalized", "lower":"1.05457180013 × 10⁻³⁴ Js", "actual":"ħ"},
    {"id":"10", "upper":"Fine-structure constant", "lower":"0.007297352566417", "actual":"α"},
    {"id":"11", "upper":"Classical electron radius", "lower":"2.817940322719 × 10⁻¹⁵ m", "actual":"re"},
    {"id":"12", "upper":"Compton wavelength", "lower":"2.426310236711 × 10⁻¹² m", "actual":"λc"},
    {"id":"13", "upper":"Proton Compton wavelength", "lower":"1.3214098539661 × 10⁻¹⁵ m", "actual":"λcp"},
    {"id":"14", "upper":"Neutron Compton wavelength", "lower":"1.3195909048188 × 10⁻¹⁵ m", "actual":"λcn"},
    {"id":"15", "upper":"Rydberg constant", "lower":"10973731.56850865 m⁻¹", "actual":"R∞"},
    {"id":"16", "upper":"Atomic mass constant", "lower":"1.6605390402 × 10⁻²⁷ kg", "actual":"u"},
    {"id":"17", "upper":"Proton magnetic moment", "lower":"1.410606787397 × 10⁻²⁶ JT⁻¹", "actual":"μp"},
    {"id":"18", "upper":"Electron magnetic moment", "lower":"-9.28476462057 × 10⁻²⁴ JT⁻¹", "actual":"μe"},
    {"id":"19", "upper":"Neutron magnetic moment", "lower":"-9.662365023 × 10⁻²⁷ JT⁻¹", "actual":"μn"},
    {"id":"20", "upper":"Muon magnetic moment", "lower":"-4.490448261 × 10⁻²⁶ JT⁻¹", "actual":"μμ"},
    {"id":"21", "upper":"Faraday constant", "lower":"96485.332895 Cmol⁻¹", "actual":"F"},
    {"id":"22", "upper":"Elementary charge", "lower":"1.602176634 × 10⁻¹⁹ C", "actual":"e"},
    {"id":"23", "upper":"Avogadro constant", "lower":"6.02214076 × 10²³ mol⁻¹", "actual":"NA"},
    {"id":"24", "upper":"Boltzmann constant", "lower":"1.380649 × 10⁻²³ JK⁻¹", "actual":"k"},
    {"id":"25", "upper":"Molar volume of ideal", "lower":"0.02271094713 m³mol⁻¹", "actual":"Vm"},
    {"id":"26", "upper":"Molar gas constant", "lower":"8.3144598484848 Jmol⁻¹K⁻¹", "actual":"R"},
    {"id":"27", "upper":"Speed of light in vacuum", "lower":"299792458.0 ms⁻¹", "actual":"C₀"},
    {"id":"28", "upper":"First radiation constant", "lower":"3.74177179046 × 10⁻¹⁶ Wm²", "actual":"C₁"},
    {"id":"29", "upper":"Second radiation constant", "lower":"0.014387773683 mK", "actual":"C₂"},
    {"id":"30", "upper":"Stefan-Boltzmann constant", "lower":"5.67036713 × 10⁻⁸ Wm⁻²K⁻⁴", "actual":"σ"},
    {"id":"31", "upper":"Electric constant", "lower":"8.854187817 × 10⁻¹² Fm⁻¹", "actual":"ε₀"},
    {"id":"32", "upper":"Magnetic constant", "lower":"1.25663706 × 10⁻⁶ NA⁻²", "actual":"μ₀"},
    {"id":"33", "upper":"Magnetic flux quantum", "lower":"2.06783383113 × 10⁻¹⁵ Wb", "actual":"Φ₀"},
    {"id":"34", "upper":"Standard acceleration of gravity", "lower":"9.80665 ms⁻²", "actual":"g"},
    {"id":"35", "upper":"Conductance quantum", "lower":"7.748091731018 × 10⁻⁵ S", "actual":"G₀"},
    {"id":"36", "upper":"Characteristic impedance of vacuum", "lower":"376.730313461 Ω", "actual":"Z₀"},
    {"id":"37", "upper":"Celsius temperature", "lower":"273.15 K", "actual":"t"},
    {"id":"38", "upper":"Newtonian constant of gravitation", "lower":"6.6740831 × 10⁻¹¹ m³kg⁻¹s⁻²", "actual":"G"},
    {"id":"39", "upper":"Standard atmosphere", "lower":"101325.0 Pa", "actual":"atm"}
  
],
"HyperbolicValues":[
{id:'1',name:'sinh',value:'sinh(□)'},
{id:'2',name:'cosh',value:'cosh(□)'},
{id:'3',name:'tanh',value:'tanh(□)'},
{id:'4',name:'sinh⁻¹',value:'sinh⁻¹(□)'},
{id:'5',name:'cosh⁻¹',value:'cosh⁻¹(□)'},
{id:'6',name:'tanh⁻¹',value:'tanh⁻¹(□)'}

],
"shiftTwo":[
{id:'1',name:'arg',value:'arg()'},
{id:'2',name:'Conjg',value:'Conjg()'},
{id:'3',name:'▶r∠θ',value:'▶r∠θ'},
{id:'4',name:'▶a+bi',value:'▶a+bi'}
]
}