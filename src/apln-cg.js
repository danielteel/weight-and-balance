import {Point,Line,LinearChart,ChartInput,ChartConstant} from 'chart-objects';

export default class ChartProject{
	constructor(){
		const O=true;
		const F=false;
		const T=this;
		const P=(x,y)=>{return new Point(x,y);};
		const L=(val,...points)=>{return new Line(points,val);};
		T._$1=new ChartConstant('zero',0);
		T.$gross_weight=new ChartInput('gross_weight','exit double(input);','39330');
		T.$apln_forward_limit=new LinearChart('apln_forward_limit',O,T.$gross_weight,T._$1,L(0,P(374.895,29956.749),P(374.917,31702.154),P(376.283,35262.76),P(377.499,39280.198),P(378.544,43700.724),P(379.312,47516.619),P(380.613,50378.54),P(382.597,54516.905),P(384.542,58677.505),P(385.115,59952.946),P(385.477,60496.036)));
		T.$apln_aft_limit=new LinearChart('apln_aft_limit',O,T.$gross_weight,T._$1,L(0,P(392.345,29935.588),P(393.059,31098.434),P(394.548,34293.819),P(394.951,41417.474),P(395.122,47055.812),P(395.246,47505.316),P(395.339,52498.715),P(395.525,57550.745),P(395.541,60492.062)));

		T.calcArray=[T._$1,T.$gross_weight,T.$apln_forward_limit,T.$apln_aft_limit,];
	}

	calcInputs=()=>{
		const alerts=[];
		const notices=[];
		for (let obj of this.calcArray){
			if (obj.type==='input') obj.calc(this.calcArray, alerts, notices);
		}
		return [alerts, notices];
	};

	calc=()=>{
		const alerts=[];
		const notices=[];
		for (let obj of this.calcArray){
			obj.calc(this.calcArray, alerts, notices);
		}
		return [alerts, notices];
	};
}